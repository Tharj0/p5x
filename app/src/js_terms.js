// ---------- termini con descrizione (hover / tocco) ----------
const TERM_CACHE = {};
const ALNUM = /[A-Za-zÀ-ÿ0-9]/;
function termInfo(c){
  if (TERM_CACHE[c.slug]) return TERM_CACHE[c.slug];
  const list = (c.terms || []).slice().sort((a, b) => b[0].length - a[0].length); const map = {}; list.forEach(t => { map[t[0]] = t; });
  const re = list.length ? new RegExp('(\\[)?(' + list.map(t => t[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(\\])?', 'g') : null;
  const items = [];
  c.ref.skills.forEach((it, i) => items.push({ key: 'sk:' + i, tab: 'sk', title: it.t || 'Skill', body: it.b, n: 4 }));
  c.ref.awareness.forEach((it, i) => items.push({ key: 'aw:' + i, tab: 'aw', title: 'Awareness ' + it.t, body: it.b, n: 0 }));
  c.ref.weapons.forEach((w, i) => items.push({ key: 'wp:' + i, tab: 'wp', title: 'Arma ' + w.t.split(' · ')[0], body: w.e.join('\n'), n: 7 }));
  c.ref.attr.forEach((it, i) => items.push({ key: 'at:' + i, tab: 'ms', title: 'Attribute Mindscape', body: it.b, n: 0 }));
  c.ref.core.forEach((it, i) => items.push({ key: 'co:' + i, tab: 'ms', title: 'Mindscape Core' + (it.t ? ' — ' + it.t : ''), body: it.b, n: 0 }));
  return (TERM_CACHE[c.slug] = { list: list, map: map, re: re, items: items });
}
// testo → HTML con valori evidenziati (hl) e termini sottolineati; self = chiave dell'elemento che si sta leggendo
function rich(c, txt, n, idx, compact, self){
  const T = termInfo(c); txt = String(txt == null ? '' : txt); if (!T.re) return hl(txt, n, idx, compact);
  let out = '', last = 0, m; T.re.lastIndex = 0;
  while ((m = T.re.exec(txt))) {
    const s = m.index, e = s + m[0].length; const t = T.map[m[2]]; if (!t) continue;
    const okB = !!m[1] || s === 0 || !ALNUM.test(txt[s - 1]); const okA = !!m[3] || e >= txt.length || !ALNUM.test(txt[e]);
    if (!okB || !okA || (t[1] === 'n' && t[2] === self)) continue;
    out += hl(txt.slice(last, s), n, idx, compact) + '<span class="term" tabindex="0" role="button" data-term="' + esc(m[2]) + '">' + esc(m[0]) + '</span>'; last = e;
  }
  return out + hl(txt.slice(last), n, idx, compact);
}
function splitSent(txt){
  const out = []; String(txt).split('\n').forEach(line => { let st = 0;
    for (let i = 0; i < line.length - 2; i++) { const ch = line[i]; if ((ch === '.' || ch === '!' || ch === '?') && line[i + 1] === ' ' && /[A-ZÀ-Ý\[(«“"]/.test(line[i + 2])) { out.push(line.slice(st, i + 1)); st = i + 2; } }
    if (st < line.length) out.push(line.slice(st)); });
  return out.map(s => s.trim()).filter(Boolean);
}
function maskLonger(T, name, s){ T.list.forEach(t => { if (t[0] !== name && t[0].length > name.length && t[0].indexOf(name) >= 0) s = s.split(t[0]).join(new Array(t[0].length + 1).join('\u0001')); }); return s; }
function termAt(T, name, s){   // posizione della prima occorrenza "vera" del termine nella frase, -1 se assente
  const m = maskLonger(T, name, s); let i = m.indexOf(name);
  while (i >= 0) { const b = i === 0 ? '' : m[i - 1], a = i + name.length >= m.length ? '' : m[i + name.length]; if ((b === '' || b === '[' || !ALNUM.test(b)) && (a === '' || a === ']' || !ALNUM.test(a))) return i; i = m.indexOf(name, i + 1); }
  return -1;
}
function isDef(name, s, i){ const rest = s.slice(i + name.length).replace(/^\]/, ''); return /^\s*(\([^)]*\))?\s*:/.test(rest); }
function termPassages(c, name){
  const T = termInfo(c); const out = []; const seen = {};
  T.items.forEach(it => { splitSent(it.body).forEach(sen => { let i = termAt(T, name, sen); if (i < 0) return;
    let text = sen; if (sen.indexOf(' · ') >= 0 && sen.length > 200) { const segs = sen.split(' · ').filter(g => termAt(T, name, g) >= 0); if (segs.length) { text = segs.join(' · '); i = termAt(T, name, text); } }
    if (seen[text]) return; seen[text] = true; out.push({ it: it, text: text, def: isDef(name, text, i) }); }); });
  return out.filter(p => p.def).concat(out.filter(p => !p.def));
}
function tipText(c, it, text){ return rich(c, text, it.n, it.n === 4 ? ui.lvcol : -1, it.n === 4, null); }
let tipFor = null, tipPinned = false, tipTimer = 0, tipStack = [], tipName = null;
function termTipHTML(c, name){
  const T = termInfo(c); const t = T.map[name]; if (!t) return '';
  const back = tipStack.length ? '<button type="button" class="tt-back" data-tipback="1">‹ ' + esc(tipStack[tipStack.length - 1]) + '</button>' : '';
  let h = '<div class="tt-h"><span>' + back + '<b>' + esc(name) + '</b></span><button type="button" class="tt-x" data-tipclose="1" aria-label="Chiudi la descrizione">✕</button></div>';
  if (t[1] === 'n') { const it = T.items.filter(x => x.key === t[2])[0]; if (!it) return '';
    h += '<button type="button" class="tt-src" data-tab="' + it.tab + '">' + esc(it.title) + ' ›</button><div class="tt-b">' + tipText(c, it, it.body) + '</div>'; }
  else { const pas = termPassages(c, name); if (!pas.length) return ''; const defs = pas.filter(p => p.def);
    h += '<div class="tt-k">' + (defs.length ? 'Stato / meccanica di ' + esc(c.codename) : 'Stato / meccanica di ' + esc(c.codename) + ' · lufel non ne dà una definizione separata: ecco dove ne parla') + '</div>';
    pas.slice(0, 8).forEach(p => { h += '<button type="button" class="tt-src" data-tab="' + p.it.tab + '">' + esc(p.it.title) + (p.def ? ' · definizione' : '') + ' ›</button><div class="tt-b">' + tipText(c, p.it, p.text) + '</div>'; });
    if (pas.length > 8) h += '<div class="tt-k">… e altri ' + (pas.length - 8) + ' punti: usa la ricerca nella scheda per vederli tutti.</div>';
    if (!defs.length) { const rel = []; pas.forEach(p => { T.list.forEach(o => { if (o[1] !== 's' || o[0] === name || rel.indexOf(o[0]) >= 0 || termAt(T, o[0], p.text) < 0) return; if (termPassages(c, o[0]).some(q => q.def)) rel.push(o[0]); }); });
      if (rel.length) h += '<div class="tt-k">Termini collegati con definizione:</div>' + rel.slice(0, 3).map(o => { const d = termPassages(c, o).filter(q => q.def)[0]; return '<div class="tt-b"><span class="term" tabindex="0" role="button" data-term="' + esc(o) + '">' + esc(o) + '</span> — ' + tipText(c, d.it, d.text) + '</div>'; }).join(''); } }
  return h + '<div class="tt-f">Testo di lufel.net (scheda di ' + esc(c.codename) + ') · i termini sottolineati qui dentro si possono aprire</div>';
}
function placeTip(el){
  const tip = document.getElementById('tip'); tip.style.maxHeight = ''; tip.style.left = ''; tip.style.top = '';
  if (window.matchMedia('(max-width: 900px)').matches || !el || !document.body.contains(el)) return;   // su telefono è un pannello in basso (CSS)
  const r = el.getBoundingClientRect(); const W = window.innerWidth, H = window.innerHeight; const tw = tip.offsetWidth, th = tip.offsetHeight;
  const below = H - r.bottom - 14, above = r.top - 14; let top;
  if (th <= below || below >= above) { top = r.bottom + 6; tip.style.maxHeight = Math.max(140, below) + 'px'; } else { tip.style.maxHeight = above + 'px'; top = r.top - 6 - Math.min(th, above); }
  tip.style.left = Math.max(8, Math.min(r.left, W - tw - 8)) + 'px'; tip.style.top = Math.max(8, top) + 'px';
}
function renderTip(name){ const c = BY[ui.open]; const tip = document.getElementById('tip'); const html = c ? termTipHTML(c, name) : ''; if (!html) return false; tipName = name; tip.innerHTML = html; tip.scrollTop = 0; tip.classList.add('open'); tip.classList.toggle('pinned', tipPinned); placeTip(tipFor); return true; }
function showTip(el, pin){ if (!ui.open) return; clearTimeout(tipTimer); if (tipFor && tipFor !== el) tipFor.removeAttribute('aria-describedby'); tipFor = el; tipPinned = !!pin; tipStack = []; if (renderTip(el.dataset.term)) el.setAttribute('aria-describedby', 'tip'); else hideTip(); }
function hideTip(){ clearTimeout(tipTimer); if (tipFor) tipFor.removeAttribute('aria-describedby'); tipFor = null; tipPinned = false; tipStack = []; tipName = null; const tip = document.getElementById('tip'); if (tip) tip.classList.remove('open', 'pinned'); }

