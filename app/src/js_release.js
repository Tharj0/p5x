
// ---------- release schedule (lufel.net/en/schedule, server GLB/JP) ----------
const TODAY = (() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })();
const REL_DATES = Array.from(new Set(CHARS.map(c => c.rel.d))).sort();
const CUR_DATE = REL_DATES.filter(d => d <= TODAY).pop() || null;
const NEXT_DATE = REL_DATES.find(d => d > TODAY) || null;
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const REL_NAME = { out: 'Uscito', current: 'Banner attuale', next: 'Prossima uscita', future: 'In arrivo' };
function fmtDate(iso){ const p = iso.split('-').map(Number); return p[2] + ' ' + MESI[p[1] - 1] + ' ' + p[0]; }
function daysTo(iso){ return Math.round((new Date(iso + 'T00:00:00') - new Date(TODAY + 'T00:00:00')) / 86400000); }
function isOut(c){ return c.rel.d <= TODAY; }
function relState(c){ if (c.rel.d > TODAY) return c.rel.d === NEXT_DATE ? 'next' : 'future'; return c.rel.d === CUR_DATE && daysTo(c.rel.d) > -60 ? 'current' : 'out'; }
function relEst(c){ return c.rel.st === 'upcoming' || c.rel.st === 'future'; }   // data stimata da lufel al momento della lettura
function inDays(n){ return n > 0 ? 'tra ' + n + (n === 1 ? ' giorno' : ' giorni') : ''; }
function relText(c){ const n = daysTo(c.rel.d); return REL_NAME[relState(c)] + ' · ' + c.rel.v + ' · ' + (relEst(c) ? '≈ ' : '') + fmtDate(c.rel.d) + (n > 0 ? ' (' + inDays(n) + ')' : ''); }
function relBadge(c){
  const s = relState(c); const tip = relText(c) + (relEst(c) ? ' — data stimata da lufel, non confermata' : '');
  if (s === 'out') return '<span class="badge" title="' + esc(tip) + '">' + esc(c.rel.v.split('(')[0]) + '</span>';
  if (s === 'current') return '<span class="badge ok" title="' + esc(tip) + '">Banner attuale</span>';
  return '<span class="badge nr" title="' + esc(tip) + '">' + (relEst(c) ? '≈ ' : '') + fmtDate(c.rel.d) + '</span>';
}
function relHead(c, n){
  const s = relState(c); const d = daysTo(c.rel.d);
  return '<div class="ghead"><b>' + esc(c.rel.v) + '</b><span>' + (relEst(c) ? '≈ ' : '') + fmtDate(c.rel.d) + (d > 0 ? ' · ' + inDays(d) : '') + '</span><span class="badge ' + (s === 'current' ? 'ok' : (s === 'out' ? '' : 'nr')) + '">' + REL_NAME[s] + '</span>' + (c.rel.note ? '<span>' + esc(c.rel.note) + '</span>' : '') + '<span>' + n + (n === 1 ? ' personaggio' : ' personaggi') + '</span></div>';
}
function renderRelStrip(){
  const el = document.getElementById('relStrip'); if (!el) return;
  const cur = CHARS.filter(c => relState(c) === 'current').sort((a, b) => a.rel.o - b.rel.o), nxt = CHARS.filter(c => relState(c) === 'next').sort((a, b) => a.rel.o - b.rel.o);
  const grp = (lab, arr) => arr.length ? '<div class="grp"><span><b>' + lab + '</b> · ' + esc(arr[0].rel.v) + ' · ' + (relEst(arr[0]) ? '≈ ' : '') + fmtDate(arr[0].rel.d) + (daysTo(arr[0].rel.d) > 0 ? ' · ' + inDays(daysTo(arr[0].rel.d)) : '') + '</span>' + arr.map(c => '<span class="lnk' + (isOwned(c.slug) ? ' own' : '') + '" data-goto="' + c.slug + '" role="button" tabindex="0">' + esc(c.codename) + '</span>').join('') + '</div>' : '';
  el.innerHTML = grp('Banner attuale', cur) + grp('Prossima uscita', nxt);
}
