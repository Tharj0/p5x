/* Guide P5X — filtri dell'indice, sommario delle sezioni, torna su */
(function () {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));

  // ---------- pagina di una guida ----------
  const toc = $('.toc details');
  if (toc && window.matchMedia('(max-width: 900px)').matches) toc.removeAttribute('open');
  const links = $$('.toc a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    const byId = new Map(links.map(a => [decodeURIComponent(a.getAttribute('href').slice(1)), a]));
    let cur = null;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { const a = byId.get(e.target.id); if (a && a !== cur) { if (cur) cur.classList.remove('on'); a.classList.add('on'); cur = a; } } });
    }, { rootMargin: '-70px 0px -70% 0px' });
    byId.forEach((a, id) => { const h = document.getElementById(id); if (h) io.observe(h); });
    links.forEach(a => a.addEventListener('click', () => { if (toc && window.matchMedia('(max-width: 900px)').matches) toc.removeAttribute('open'); }));
  }
  const top = $('.totop');
  if (top) {
    window.addEventListener('scroll', () => top.classList.toggle('show', window.scrollY > 700), { passive: true });
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---------- indice delle guide ----------
  const grid = $('#ggrid');
  if (!grid) return;
  const cards = $$('#ggrid .gcard');
  const today = (() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })();
  cards.forEach(c => { if (c.dataset.reld > today) { c.dataset.rel = 'soon'; const b = c.querySelector('.relb'); if (b) { b.classList.add('nr'); b.textContent = 'In arrivo'; } } else c.dataset.rel = 'out'; });
  const f = { q: '', el: new Set(), pos: new Set(), rar: new Set(), rel: 'all', sort: 'name' };
  const KEY = 'p5x_guide_filters';
  try { const s = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (s) { f.q = s.q || ''; f.el = new Set(s.el || []); f.pos = new Set(s.pos || []); f.rar = new Set(s.rar || []); f.rel = s.rel || 'all'; f.sort = s.sort || 'name'; } } catch (e) { /* */ }
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function apply() {
    const q = norm(f.q).trim().split(/\s+/).filter(Boolean);
    let n = 0;
    cards.forEach(c => {
      const d = c.dataset, hay = norm(d.q);
      const ok = (!f.el.size || f.el.has(d.el)) && (!f.pos.size || f.pos.has(d.pos)) && (!f.rar.size || f.rar.has(d.rar)) && (f.rel === 'all' || f.rel === d.rel) && q.every(w => hay.includes(w));
      c.hidden = !ok; if (ok) n++;
    });
    const sorted = cards.slice().sort((a, b) => f.sort === 'new' ? (b.dataset.reld.localeCompare(a.dataset.reld) || a.dataset.name.localeCompare(b.dataset.name)) : f.sort === 'old' ? (a.dataset.reld.localeCompare(b.dataset.reld) || a.dataset.name.localeCompare(b.dataset.name)) : a.dataset.name.localeCompare(b.dataset.name));
    sorted.forEach(c => grid.appendChild(c));
    $('#icount').textContent = n === cards.length ? n + ' guide' : n + ' di ' + cards.length + ' guide';
    $('#iempty').hidden = n > 0;
    $$('.chips [data-v]').forEach(ch => { const g = ch.parentElement.dataset.f; ch.classList.toggle('on', g === 'rel' ? f.rel === ch.dataset.v : f[g].has(ch.dataset.v)); });
    try { sessionStorage.setItem(KEY, JSON.stringify({ q: f.q, el: [...f.el], pos: [...f.pos], rar: [...f.rar], rel: f.rel, sort: f.sort })); } catch (e) { /* */ }
  }
  const qi = $('#iq'); qi.value = f.q; qi.addEventListener('input', () => { f.q = qi.value; apply(); });
  const so = $('#isort'); so.value = f.sort; so.addEventListener('change', () => { f.sort = so.value; apply(); });
  $$('.chips[data-f]').forEach(box => box.addEventListener('click', ev => {
    const ch = ev.target.closest('[data-v]'); if (!ch) return; const g = box.dataset.f, v = ch.dataset.v;
    if (g === 'rel') f.rel = f.rel === v ? 'all' : v; else (f[g].has(v) ? f[g].delete(v) : f[g].add(v));
    apply();
  }));
  $('#ireset').addEventListener('click', () => { f.q = ''; qi.value = ''; f.el.clear(); f.pos.clear(); f.rar.clear(); f.rel = 'all'; apply(); qi.focus(); });
  apply();
})();
