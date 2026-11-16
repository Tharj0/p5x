// Test del modulo di sincronizzazione (app/src/ghsync.js).
//   node tools/test_ghsync.js            -> test con un finto GitHub in memoria (due «dispositivi»)
//   GH_TEST_TOKEN=... GH_TEST_REPO=proprietario/repo node tools/test_ghsync.js --live
//                                        -> stessi scenari sul repository vero, nella cartella _test/
'use strict';
const assert = require('assert');
const path = require('path');
const S = require(path.join(__dirname, '..', 'app', 'src', 'ghsync.js'));

let passed = 0;
function ok(name, fn) { return Promise.resolve().then(fn).then(() => { passed++; console.log('  ok  ' + name); }); }

// ---------- finto GitHub (API Contents minima) ----------
function fakeGitHub() {
  const files = {}; let n = 0; const log = [];
  const sha = () => (++n).toString(16).padStart(40, '0');
  const resp = (status, body, headers) => ({ status, ok: status >= 200 && status < 300, headers: { get: k => (headers || {})[k.toLowerCase()] || null }, json: async () => body, clone() { return this; } });
  async function fetch(url, opt) {
    const u = new URL(url); const m = u.pathname.match(/^\/repos\/([^/]+)\/([^/]+)(\/contents\/(.+))?$/);
    log.push(opt.method + ' ' + u.pathname);
    if (!/^Bearer good/.test(opt.headers.Authorization)) return resp(401, { message: 'Bad credentials' });
    if (!m) return resp(404, { message: 'Not Found' });
    if (!m[3]) return resp(200, { full_name: m[1] + '/' + m[2], private: true });
    const p = decodeURIComponent(m[4]);
    if (opt.method === 'GET') {
      const f = files[p]; if (!f) return resp(404, { message: 'Not Found' });
      const etag = '"e' + f.sha + '"';
      if (opt.headers['If-None-Match'] === etag) return resp(304, null, { etag });
      return resp(200, { sha: f.sha, size: f.content.length, content: f.content, encoding: 'base64' }, { etag });
    }
    if (opt.method === 'PUT') {
      const b = JSON.parse(opt.body); const f = files[p];
      if (f && b.sha !== f.sha) return resp(409, { message: p + ' does not match ' + b.sha });
      if (!f && b.sha) return resp(422, { message: 'sha does not exist' });
      if (f && !b.sha) return resp(422, { message: 'Invalid request. "sha" wasn\'t supplied.' });
      files[p] = { sha: sha(), content: b.content };
      return resp(200, { content: { sha: files[p].sha }, commit: { sha: sha() } });
    }
    return resp(405, {});
  }
  return { fetch, files, log, read: p => JSON.parse(S.b64dec(files[p].content)) };
}

// ---------- «dispositivo»: stato dell'app ridotto all'essenziale ----------
function blankEntry() { return { owned: false, level: null, notes: '', skills: { s1: null, s2: null }, weapons: { A: { owned: false, ref: 0 } }, updatedAt: '' }; }
function norm(e) { const b = blankEntry(); const o = Object.assign({}, b, e); o.skills = Object.assign({}, b.skills, e.skills); o.weapons = Object.assign({}, b.weapons, e.weapons); return o; }
let clock = Date.parse('2026-11-16T10:00:00Z');
const tick = () => new Date(clock += 1000).toISOString();

function device(name, net, cfg) {
  const d = { name, roster: {}, wonder: null, stored: null, conflicts: [], offline: false };
  d.engine = S.createEngine({
    getConfig: () => Object.assign({ repo: 'me/dati', token: 'good-token', device: name }, cfg || {}),
    getLocal: k => k === 'wonder' ? (d.wonder && d.wonder.updatedAt ? { main: d.wonder } : {}) : Object.fromEntries(Object.entries(d.roster).filter(([, e]) => e.updatedAt)),
    setLocal: (k, doc) => { if (k === 'wonder') d.wonder = doc.main || null; else d.roster = doc; },
    normalize: (k, doc) => k === 'wonder' ? doc : Object.fromEntries(Object.entries(doc).map(([id, e]) => [id, norm(e)])),
    blank: (k, id) => k === 'wonder' ? {} : blankEntry(),
    loadState: () => d.stored, saveState: st => { d.stored = JSON.parse(JSON.stringify(st)); },
    onConflicts: (k, list) => d.conflicts.push(...list),
    isOffline: () => d.offline,
    fetch: (u, o) => d.offline ? Promise.reject(new TypeError('Failed to fetch')) : net.fetch(u, o),
  });
  d.edit = (id, fn) => { const e = d.roster[id] || (d.roster[id] = blankEntry()); fn(e); e.updatedAt = tick(); };
  return d;
}

async function mockSuite() {
  console.log('Merge (unità)');
  await ok('campi diversi si sommano', () => {
    const b = { x: { a: 1, b: 1, updatedAt: 't1' } };
    const r = S.mergeDoc(b, { x: { a: 2, b: 1, updatedAt: 't2' } }, { x: { a: 1, b: 3, updatedAt: 't3' } }, 'time');
    assert.deepStrictEqual(r.value.x, { a: 2, b: 3, updatedAt: 't3' }); assert.strictEqual(r.conflicts.length, 0);
  });
  await ok('stesso campo: vince il più recente e il conflitto è segnalato', () => {
    const b = { x: { a: 1, updatedAt: 't1' } };
    const r = S.mergeDoc(b, { x: { a: 2, updatedAt: 't5' } }, { x: { a: 3, updatedAt: 't3' } }, 'time');
    assert.strictEqual(r.value.x.a, 2); assert.strictEqual(r.conflicts.length, 1);
    assert.deepStrictEqual([r.conflicts[0].id, r.conflicts[0].path, r.conflicts[0].kept, r.conflicts[0].remote], ['x', ['a'], 'local', 3]);
  });
  await ok('cancellata da una parte, modificata dall\'altra: resta la versione modificata', () => {
    const b = { x: { a: 1, updatedAt: 't1' } };
    const r = S.mergeDoc(b, {}, { x: { a: 9, updatedAt: 't2' } }, 'time');
    assert.strictEqual(r.value.x.a, 9); assert.strictEqual(r.conflicts[0].deleted, true);
  });
  await ok('cancellazione senza modifiche altrove: la voce sparisce', () => {
    const b = { x: { a: 1 } }; assert.deepStrictEqual(S.mergeDoc(b, {}, { x: { a: 1 } }, 'time').value, {});
  });
  await ok('primo collegamento: i valori vuoti non creano conflitti', () => {
    const blank = () => ({ a: null, notes: '' });
    const r = S.mergeDoc({}, { x: { a: 5, notes: '', updatedAt: 't9' } }, { x: { a: null, notes: 'ciao', updatedAt: 't1' } }, 'time', blank);
    assert.deepStrictEqual([r.value.x.a, r.value.x.notes, r.conflicts.length], [5, 'ciao', 0]);
  });
  await ok('chiavi con punti e caratteri speciali', () => {
    const b = { x: { weapons: { 'Arma v2.0 «x»': { ref: 1 } } } };
    const r = S.mergeDoc(b, { x: { weapons: { 'Arma v2.0 «x»': { ref: 2 } } } }, b, 'time');
    assert.strictEqual(r.value.x.weapons['Arma v2.0 «x»'].ref, 2);
  });
  await ok('base64 UTF-8 (accenti, emoji)', () => { const s = 'Però è già ★ 😀 «ok»'; assert.strictEqual(S.b64dec(S.b64enc(s)), s); });

  console.log('Motore (finto GitHub, due dispositivi)');
  const net = fakeGitHub(); const pc = device('PC', net), tel = device('Telefono', net);
  await ok('dispositivo vuoto, repository vuoto: nessuna scrittura', async () => {
    assert.strictEqual(await pc.engine.sync(), true); assert.strictEqual(Object.keys(net.files).length, 0);
  });
  await ok('modifica sul PC -> compare sul telefono', async () => {
    pc.edit('cherish', e => { e.owned = true; e.level = 80; });
    assert.strictEqual(pc.engine.pending(), 1);
    await pc.engine.sync(); assert.strictEqual(pc.engine.pending(), 0);
    assert.strictEqual(net.read('roster.json').roster.cherish.level, 80);
    await tel.engine.sync(); assert.strictEqual(tel.roster.cherish.level, 80); assert.strictEqual(tel.roster.cherish.owned, true);
  });
  await ok('nessuna modifica: richiesta condizionale (304), nessuna scrittura', async () => {
    const before = net.log.length; await tel.engine.sync();
    const calls = net.log.slice(before); assert.ok(calls.every(c => c.startsWith('GET')), calls.join());
  });
  await ok('campi diversi su dispositivi diversi (offline) si sommano', async () => {
    pc.offline = tel.offline = true;
    pc.edit('cherish', e => { e.level = 90; });
    tel.edit('cherish', e => { e.notes = 'dal telefono'; });
    assert.strictEqual(await pc.engine.sync(), false); assert.strictEqual(pc.engine.status().phase, 'offline');
    pc.offline = tel.offline = false;
    await tel.engine.sync(); await pc.engine.sync(); await tel.engine.sync();
    for (const d of [pc, tel]) { assert.strictEqual(d.roster.cherish.level, 90, d.name); assert.strictEqual(d.roster.cherish.notes, 'dal telefono', d.name); }
    assert.strictEqual(pc.conflicts.length + tel.conflicts.length, 0);
  });
  await ok('stesso campo su entrambi: vince la modifica più recente, l\'altra va nei conflitti', async () => {
    pc.edit('cherish', e => { e.level = 70; });     // prima
    tel.edit('cherish', e => { e.level = 75; });    // dopo (più recente)
    await pc.engine.sync(); await tel.engine.sync(); await pc.engine.sync();
    assert.strictEqual(pc.roster.cherish.level, 75); assert.strictEqual(tel.roster.cherish.level, 75);
    assert.strictEqual(tel.conflicts.length, 1); assert.deepStrictEqual([tel.conflicts[0].kept, tel.conflicts[0].remote], ['local', 70]);
  });
  await ok('scrittura concorrente (409): si riscarica, si unisce e si riprova', async () => {
    pc.edit('fox', e => { e.owned = true; }); tel.edit('joker', e => { e.owned = true; });
    // il telefono legge, poi il PC scrive prima che il telefono faccia il PUT
    const orig = net.fetch; let once = false;
    tel.engine; const tfetch = async (u, o) => { if (o.method === 'PUT' && !once) { once = true; await pc.engine.sync(); } return orig(u, o); };
    const tel2 = device('Telefono', { fetch: tfetch }); tel2.roster = tel.roster; tel2.stored = tel.stored; tel2.engine.reload();
    await tel2.engine.sync(); await pc.engine.sync();
    assert.ok(net.log.some(x => x.startsWith('PUT')));
    for (const d of [pc, tel2]) { assert.ok(d.roster.fox && d.roster.fox.owned, d.name + ' fox'); assert.ok(d.roster.joker && d.roster.joker.owned, d.name + ' joker'); }
    tel.roster = tel2.roster; tel.stored = tel2.stored; tel.engine.reload();
  });
  await ok('Wonder sincronizzato come file separato', async () => {
    pc.wonder = { level: 70, pers: { Norn: true }, updatedAt: tick() };
    await pc.engine.sync(); await tel.engine.sync();
    assert.strictEqual(tel.wonder.level, 70); assert.strictEqual(net.read('wonder.json').wonder.pers.Norn, true);
  });
  await ok('azzeramento: i file remoti si svuotano anche sull\'altro dispositivo', async () => {
    pc.roster = {}; pc.wonder = null; await pc.engine.sync(); await tel.engine.sync();
    assert.deepStrictEqual(net.read('roster.json').roster, {}); assert.strictEqual(net.read('wonder.json').wonder, null);
    assert.deepStrictEqual(tel.roster, {}); assert.strictEqual(tel.wonder, null);
  });
  await ok('token errato: errore «auth» e dati locali intatti', async () => {
    const bad = device('X', net, { token: 'wrong' }); bad.edit('fox', e => { e.level = 1; });
    assert.strictEqual(await bad.engine.sync(), false); const s = bad.engine.status();
    assert.deepStrictEqual([s.phase, s.error.code, s.pending], ['error', 'auth', 1]);
  });
  await ok('verifica del token (lettura + prova di scrittura che non scrive)', async () => {
    const before = JSON.stringify(net.files); const c = await pc.engine.check();
    assert.deepStrictEqual([c.repo, c.private, c.write], ['me/dati', true, true]); assert.strictEqual(JSON.stringify(net.files), before);
  });
}

// ---------- test sul repository vero (cartella _test/) ----------
async function liveSuite() {
  const token = process.env.GH_TEST_TOKEN, repo = process.env.GH_TEST_REPO;
  if (!token || !repo) throw new Error('servono GH_TEST_TOKEN e GH_TEST_REPO');
  console.log('GitHub vero: ' + repo + ' (cartella _test/)');
  const live = { fetch: (u, o) => fetch(u, o) };
  const cfg = { repo, token, dir: '_test' };
  const pc = device('PC (test)', live, cfg), tel = device('Telefono (test)', live, cfg);
  await ok('verifica token', async () => { const c = await pc.engine.check(); assert.strictEqual(c.repo.toLowerCase(), repo.toLowerCase()); console.log('      ', JSON.stringify(c)); });
  await ok('PC scrive, telefono legge', async () => {
    pc.edit('cherish', e => { e.owned = true; e.level = 80; e.notes = 'prova àèìòù «★»'; });
    assert.strictEqual(await pc.engine.sync(), true, JSON.stringify(pc.engine.status()));
    assert.strictEqual(await tel.engine.sync(), true, JSON.stringify(tel.engine.status()));
    assert.strictEqual(tel.roster.cherish.notes, 'prova àèìòù «★»');
  });
  await ok('lettura subito dopo la scrittura (niente cache)', async () => {
    tel.edit('cherish', e => { e.level = 81; }); await tel.engine.sync(); await pc.engine.sync();
    assert.strictEqual(pc.roster.cherish.level, 81);
  });
  await ok('conflitto reale: stesso campo, vince il più recente', async () => {
    pc.edit('cherish', e => { e.level = 60; }); tel.edit('cherish', e => { e.level = 65; e.notes = 'tel'; });
    await pc.engine.sync(); await tel.engine.sync(); await pc.engine.sync();
    assert.deepStrictEqual([pc.roster.cherish.level, tel.roster.cherish.level, pc.roster.cherish.notes], [65, 65, 'tel']);
    assert.strictEqual(tel.conflicts.length, 1);
  });
  await ok('409 reale: PUT con sha vecchio viene rifiutato e ripetuto', async () => {
    const c = S.createClient(Object.assign({ fetch: live.fetch }, cfg));
    const g = await c.getFile('roster'); const old = g.sha;
    await c.putFile('roster', JSON.stringify(g.data), old, 'test: scrittura 1');
    const p = await c.putFile('roster', JSON.stringify(g.data), old, 'test: scrittura con sha vecchio');
    assert.strictEqual(p.conflict, true);
    pc.edit('fox', e => { e.owned = true; }); assert.strictEqual(await pc.engine.sync(), true);
  });
}

(async () => {
  try {
    if (process.argv.includes('--live')) await liveSuite(); else await mockSuite();
    console.log('\n' + passed + ' test superati');
  } catch (e) { console.error('\nFALLITO:', e && e.stack || e); process.exit(1); }
})();
