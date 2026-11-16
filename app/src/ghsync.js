/* P5X Tracker — sincronizzazione dei dati con un repository GitHub privato (API REST «Contents»).
 *
 * Nessun server intermedio: il browser legge e scrive due file JSON (roster.json e wonder.json)
 * nel repository dati usando un token personale fine-grained che resta solo in questo browser.
 *
 * Conflitti: merge a tre vie campo per campo tra
 *   base   = ultima versione remota già incorporata in questo dispositivo,
 *   locale = dati attuali di questo dispositivo,
 *   remota = versione appena letta da GitHub.
 * Campi diversi modificati su dispositivi diversi si sommano; se lo stesso campo è stato cambiato
 * in modo diverso su entrambi vince la modifica più recente (updatedAt della voce) e il valore
 * scartato viene segnalato (onConflicts). Le scritture usano lo «sha» del file come lock ottimistico:
 * se un altro dispositivo ha scritto nel frattempo GitHub risponde 409 e il ciclo si ripete.
 *
 * Lo stesso file funziona nel browser (window.P5XSync) e in Node (require) per i test.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api; else root.P5XSync = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SEP = '\u0001';
  const KINDS = ['roster', 'wonder'];
  const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const clone = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

  // serializzazione con chiavi ordinate: due oggetti uguali danno sempre la stessa stringa
  function stable(v) {
    if (v === undefined) return 'undefined';
    if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
    if (isObj(v)) return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
    return JSON.stringify(v);
  }
  const same = (a, b) => stable(a) === stable(b);

  // { a: { b: 1 } } <-> { "a\u0001b": 1 }   (gli oggetti vuoti spariscono: li ricrea la normalizzazione dell'app)
  function flatten(o, pre, out) {
    out = out || {};
    Object.keys(o || {}).forEach(k => {
      const v = o[k], p = pre ? pre + SEP + k : k;
      if (isObj(v)) flatten(v, p, out); else if (v !== undefined) out[p] = v;
    });
    return out;
  }
  function unflatten(map) {
    const out = {};
    Object.keys(map).forEach(p => {
      const v = map[p]; if (v === undefined) return;
      const ks = p.split(SEP); let o = out;
      for (let i = 0; i < ks.length - 1; i++) { if (!isObj(o[ks[i]])) o[ks[i]] = {}; o = o[ks[i]]; }
      o[ks[ks.length - 1]] = clone(v);
    });
    return out;
  }
  const noTs = m => { const o = Object.assign({}, m); delete o.updatedAt; return o; };

  /** Merge a tre vie di un singolo oggetto (voce del roster o dati Wonder).
   *  prefer: 'time' (vince la voce con updatedAt più recente) | 'local' | 'remote' */
  function mergeObj(b, l, r, prefer) {
    const fb = noTs(flatten(b)), fl = noTs(flatten(l)), fr = noTs(flatten(r));
    const tl = (l && l.updatedAt) || '', tr = (r && r.updatedAt) || '';
    const keepLocal = prefer === 'local' || (prefer !== 'remote' && tl > tr);
    const out = {}, conflicts = [];
    new Set(Object.keys(fb).concat(Object.keys(fl), Object.keys(fr))).forEach(k => {
      const bv = fb[k], lv = fl[k], rv = fr[k]; let v;
      if (same(lv, bv)) v = rv;
      else if (same(rv, bv) || same(lv, rv)) v = lv;
      else { v = keepLocal ? lv : rv; conflicts.push({ path: k.split(SEP), local: clone(lv), remote: clone(rv), kept: keepLocal ? 'local' : 'remote' }); }
      if (v !== undefined) out[k] = v;
    });
    if (same(out, fr)) return { value: clone(r), conflicts };
    if (same(out, fl)) return { value: clone(l), conflicts };
    const res = unflatten(out); const ts = tl > tr ? tl : tr; if (ts) res.updatedAt = ts;
    return { value: res, conflicts };
  }

  /** Merge a tre vie di un documento { id: oggetto }.
   *  blank(id) = oggetto vuoto di riferimento quando la base non ha quella voce (primo collegamento). */
  function mergeDoc(b, l, r, prefer, blank) {
    b = b || {}; l = l || {}; r = r || {};
    const out = {}, conflicts = [];
    new Set(Object.keys(b).concat(Object.keys(l), Object.keys(r))).forEach(id => {
      const bv = b[id], lv = l[id], rv = r[id];
      if (same(lv, bv)) { if (rv !== undefined) out[id] = clone(rv); return; }
      if (same(rv, bv) || same(lv, rv)) { if (lv !== undefined) out[id] = clone(lv); return; }
      if (lv === undefined || rv === undefined) {
        // cancellata da una parte e modificata dall'altra: si tiene la versione modificata (nessun dato perso)
        out[id] = clone(lv === undefined ? rv : lv);
        conflicts.push({ id, path: [], deleted: true, kept: lv === undefined ? 'remote' : 'local' });
        return;
      }
      const m = mergeObj(bv !== undefined ? bv : (blank ? blank(id) : {}), lv, rv, prefer);
      out[id] = m.value;
      m.conflicts.forEach(c => conflicts.push(Object.assign({ id }, c)));
    });
    return { value: out, conflicts };
  }
  function countDiff(a, b) {
    a = a || {}; b = b || {}; let n = 0;
    new Set(Object.keys(a).concat(Object.keys(b))).forEach(id => { if (!same(a[id], b[id])) n++; });
    return n;
  }

  // ---------- base64 UTF-8 ----------
  function b64enc(str) {
    const bytes = new TextEncoder().encode(str); let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function b64dec(b64) {
    const bin = atob(String(b64).replace(/\s+/g, '')); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  // ---------- formato dei file nel repository ----------
  function fileText(kind, doc) {
    if (kind === 'wonder') {
      const w = doc.main || null;
      return JSON.stringify({ _schema: 1, app: 'p5x-tracker', kind: 'wonder', updatedAt: (w && w.updatedAt) || null, wonder: w }, null, 1) + '\n';
    }
    const ids = Object.keys(doc).sort(); const roster = {}; let ts = '';
    ids.forEach(id => { roster[id] = doc[id]; const t = (doc[id] && doc[id].updatedAt) || ''; if (t > ts) ts = t; });
    return JSON.stringify({ _schema: 1, app: 'p5x-tracker', kind: 'roster', updatedAt: ts || null, roster }, null, 1) + '\n';
  }
  function fileDoc(kind, data) {
    if (!isObj(data)) return {};
    if (kind === 'wonder') return isObj(data.wonder) ? { main: data.wonder } : {};
    return isObj(data.roster) ? data.roster : {};
  }

  // ---------- client GitHub ----------
  class SyncError extends Error {
    constructor(code, message, status) { super(message); this.code = code; this.status = status || 0; }
  }
  const API = 'https://api.github.com';

  function createClient(cfg) {
    const f = cfg.fetch || ((u, o) => fetch(u, o));
    const parts = String(cfg.repo || '').trim().split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) throw new SyncError('config', 'Repository dati non valido: scrivilo come proprietario/nome (es. Tharj0/p5x-dati)');
    const base = API + '/repos/' + encodeURIComponent(parts[0]) + '/' + encodeURIComponent(parts[1]);
    const dir = String(cfg.dir || '').replace(/^\/+|\/+$/g, '');
    const pathOf = kind => (dir ? dir + '/' : '') + kind + '.json';
    const enc = p => p.split('/').map(encodeURIComponent).join('/');

    async function req(method, p, body, extra) {
      const headers = Object.assign({ Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + cfg.token, 'X-GitHub-Api-Version': '2022-11-28' }, extra || {});
      if (body) headers['Content-Type'] = 'application/json';
      try { return await f(base + p, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' }); }
      catch (e) { throw new SyncError('network', 'Connessione a GitHub non disponibile'); }
    }
    async function fail(res) {
      let msg = ''; try { msg = (await res.json()).message || ''; } catch (e) { /* corpo non JSON */ }
      const s = res.status, h = n => (res.headers && res.headers.get(n)) || '';
      if (s === 401) return new SyncError('auth', 'token non valido o scaduto', s);
      if ((s === 403 || s === 429) && (h('x-ratelimit-remaining') === '0' || h('retry-after'))) return new SyncError('ratelimit', 'limite di richieste GitHub raggiunto, riprovo più tardi', s);
      if (s === 403) return new SyncError('forbidden', 'il token non ha il permesso necessario (serve Contents: Read and write su ' + cfg.repo + ')', s);
      if (s === 404) return new SyncError('notfound', 'repository ' + cfg.repo + ' non trovato o non accessibile con questo token', s);
      if (s >= 500) return new SyncError('server', 'GitHub non risponde (errore ' + s + '), riprovo più tardi', s);
      return new SyncError('http', 'errore GitHub ' + s + (msg ? ' (' + msg + ')' : ''), s);
    }
    async function repoInfo() {
      const r = await req('GET', '');
      if (!r.ok) throw await fail(r);
      return r.json();
    }
    async function getFile(kind, etag) {
      const res = await req('GET', '/contents/' + enc(pathOf(kind)), null, etag ? { 'If-None-Match': etag } : null);
      if (res.status === 304) return { notModified: true };
      if (res.status === 404) { await repoInfo(); return { missing: true }; }   // file assente in un repository accessibile
      if (!res.ok) throw await fail(res);
      const j = await res.json();
      let b64 = j.content;
      if (!b64 && j.size > 0) {   // oltre 1 MB l'API Contents non include il contenuto: si legge il blob
        const rb = await req('GET', '/git/blobs/' + j.sha);
        if (!rb.ok) throw await fail(rb);
        b64 = (await rb.json()).content;
      }
      const text = b64 ? b64dec(b64) : '';
      let data;
      try { data = text.trim() ? JSON.parse(text) : {}; }
      catch (e) { throw new SyncError('badfile', 'il file ' + pathOf(kind) + ' nel repository non è un JSON valido'); }
      return { sha: j.sha, data, etag: (res.headers && res.headers.get('etag')) || null };
    }
    async function putFile(kind, text, sha, message) {
      const body = { message, content: b64enc(text) }; if (sha) body.sha = sha;
      const res = await req('PUT', '/contents/' + enc(pathOf(kind)), body);
      if (res.status === 409) return { conflict: true };
      if (res.status === 422) {
        let msg = ''; try { msg = (await res.clone().json()).message || ''; } catch (e) { /* */ }
        if (/sha/i.test(msg)) return { conflict: true };
        throw new SyncError('http', 'GitHub ha rifiutato il file (' + (msg || 'errore 422') + ')', 422);
      }
      if (!res.ok) throw await fail(res);
      const j = await res.json();
      return { sha: j.content && j.content.sha, commit: j.commit && j.commit.sha };
    }
    /** Verifica del token: accesso al repository, lettura dei file e (senza scrivere nulla) permesso di scrittura. */
    async function check() {
      const out = { repo: null, private: null, files: {}, write: null };
      const info = await repoInfo(); out.repo = info.full_name; out.private = !!info.private;
      for (const k of KINDS) { const g = await getFile(k, null); out.files[k] = g.missing ? null : g.sha; }
      const probe = KINDS.find(k => out.files[k]);
      if (probe) {
        // PUT con uno sha volutamente sbagliato: GitHub controlla i permessi prima dello sha, quindi
        // 409/422 = scrittura consentita, 403 = token di sola lettura. Il file non viene mai modificato.
        const r = await req('PUT', '/contents/' + enc(pathOf(probe)), { message: 'verifica permessi', content: b64enc('{}'), sha: '0000000000000000000000000000000000000000' });
        out.write = r.status === 409 || r.status === 422 ? true : r.status === 403 ? false : null;
        if (r.status === 401) throw await fail(r);
      }
      return out;
    }
    return { getFile, putFile, check, repoInfo, pathOf };
  }

  // ---------- motore di sincronizzazione ----------
  /* o = {
   *   getConfig() -> { repo, token, dir?, device? }      configurazione corrente (token salvato nel browser)
   *   getLocal(kind) -> doc                             dati locali { id: oggetto } (solo voci modificate almeno una volta)
   *   setLocal(kind, doc)                               applica il risultato del merge ai dati locali
   *   normalize(kind, doc) -> doc                       completa i campi mancanti (stesse regole dell'app)
   *   blank(kind, id) -> oggetto                        voce vuota di riferimento
   *   loadState() / saveState(st)                       persistenza della base (insieme ai dati locali)
   *   onStatus(status) · onConflicts(kind, list) · isOffline() · fetch
   * } */
  function createEngine(o) {
    let st = normState(o.loadState ? o.loadState() : null);
    let running = null, again = false, timer = null, firstAt = 0, phase = 'idle';
    const cfgOf = () => o.getConfig() || {};
    const repoKey = c => String(c.repo || '').toLowerCase() + '|' + String(c.dir || '');

    function normState(s) {
      s = isObj(s) ? s : {};
      return { repoKey: s.repoKey || '', base: isObj(s.base) ? s.base : {}, etag: isObj(s.etag) ? s.etag : {}, lastSync: s.lastSync || null, lastError: s.lastError || null };
    }
    const save = () => { if (o.saveState) o.saveState(st); };
    function pending() {
      let n = 0;
      KINDS.forEach(k => { const b = st.base[k]; n += countDiff(o.getLocal(k), b ? b.doc : {}); });
      return n;
    }
    function status() {
      const c = cfgOf();
      return { phase: !c.token ? 'nocfg' : phase, pending: pending(), lastSync: st.lastSync, error: st.lastError, connected: !!st.base.roster };
    }
    const emit = () => { if (o.onStatus) o.onStatus(status()); };
    const setPhase = p => { phase = p; emit(); };

    async function syncKind(client, kind, cfg) {
      for (let attempt = 0; attempt < 5; attempt++) {
        const base = st.base[kind]; const baseDoc = base ? base.doc : {};
        const snap = clone(o.getLocal(kind));
        const dirty = !same(snap, baseDoc);
        const res = await client.getFile(kind, (!dirty && base && st.etag[kind]) || null);
        if (res.notModified) return;
        let remoteDoc, remoteSha;
        if (res.missing) { remoteDoc = {}; remoteSha = null; st.etag[kind] = null; }
        else { remoteDoc = o.normalize(kind, fileDoc(kind, res.data)); remoteSha = res.sha; st.etag[kind] = res.etag || null; }
        const m = mergeDoc(baseDoc, snap, remoteDoc, 'time', id => o.blank(kind, id));
        // modifiche fatte su questo dispositivo mentre la richiesta era in corso: hanno la precedenza
        const now = o.getLocal(kind); let next = m.value;
        if (!same(now, snap)) { next = mergeDoc(snap, now, m.value, 'local', id => o.blank(kind, id)).value; again = true; }
        if (!same(next, now)) o.setLocal(kind, clone(next));
        if (m.conflicts.length && o.onConflicts) o.onConflicts(kind, m.conflicts);
        // i dati locali ora includono la versione remota: diventa la nuova base
        st.base[kind] = { sha: remoteSha, doc: remoteDoc }; save();
        if (same(m.value, remoteDoc)) return;
        const put = await client.putFile(kind, fileText(kind, m.value), remoteSha, kind + ': aggiornamento da ' + (cfg.device || 'browser'));
        if (put.conflict) { st.etag[kind] = null; continue; }   // un altro dispositivo ha scritto nel frattempo: si riparte
        st.base[kind] = { sha: put.sha, doc: clone(m.value) }; st.etag[kind] = null; save();
        return;
      }
      throw new SyncError('busy', 'troppe scritture contemporanee da altri dispositivi, riprovo tra poco');
    }

    async function sync(reason) {
      const cfg = cfgOf();
      if (!cfg.token) { phase = 'idle'; emit(); return false; }
      if (o.isOffline && o.isOffline()) { setPhase('offline'); return false; }
      if (running) { again = true; return running; }
      clearTimeout(timer); timer = null; firstAt = 0;
      running = (async () => {
        let ok = true;
        do {
          again = false;
          try {
            const c = cfgOf();
            if (!c.token) break;
            if (st.repoKey !== repoKey(c)) { st = normState({ repoKey: repoKey(c) }); save(); }
            setPhase('busy');
            const client = createClient(Object.assign({}, c, { fetch: o.fetch }));
            for (const kind of KINDS) await syncKind(client, kind, c);
            st.lastSync = new Date().toISOString(); st.lastError = null; save();
            phase = 'ok';
          } catch (e) {
            ok = false;
            st.lastError = { code: e.code || 'error', msg: e.message || String(e), at: new Date().toISOString() }; save();
            phase = e.code === 'network' ? 'offline' : 'error';
            break;
          }
        } while (again);
        return ok;
      })();
      try { return await running; } finally { running = null; emit(); }
    }

    /** Da chiamare dopo ogni modifica locale: sincronizza dopo `ms` di pausa (al massimo ogni 20 s di modifiche continue). */
    function schedule(ms) {
      const now = Date.now(); if (!firstAt) firstAt = now;
      const wait = Math.max(0, Math.min(ms == null ? 3000 : ms, firstAt + 20000 - now));
      clearTimeout(timer); timer = setTimeout(() => { timer = null; firstAt = 0; sync('edit'); }, wait);
      emit();
    }
    function reload() { st = normState(o.loadState ? o.loadState() : null); emit(); }
    function check() { return createClient(Object.assign({}, cfgOf(), { fetch: o.fetch })).check(); }
    return { sync, schedule, status, pending, check, reload, emit, get running() { return !!running; } };
  }

  return { KINDS, stable, same, flatten, unflatten, mergeObj, mergeDoc, countDiff, b64enc, b64dec, fileText, fileDoc, createClient, createEngine, SyncError };
});
