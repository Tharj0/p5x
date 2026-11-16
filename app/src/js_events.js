const drawerEl = document.getElementById('drawer');
drawerEl.addEventListener('focusout', () => { if (!deferredRender) return; setTimeout(() => { const a = document.activeElement; if (ui.open && !(a && drawerEl.contains(a) && a.matches('input, select, textarea'))) { deferredRender = false; renderDetail(ui.open, true); } }, 60); });
document.getElementById('dPrev').addEventListener('click', () => navStep(-1));
document.getElementById('dNext').addEventListener('click', () => navStep(1));
document.getElementById('dBack').addEventListener('click', goBack);
document.getElementById('dJump').addEventListener('change', ev => { if (BY[ev.target.value]) openDetail(ev.target.value); });
document.getElementById('dMode').addEventListener('click', () => { ui.dmode = ui.dmode === 'all' ? 'tabs' : 'all'; lsSave(); if (!ui.open) return; renderDetail(ui.open, false); if (ui.dmode === 'all') setTab(ui.tab, true); toast(ui.dmode === 'all' ? 'Vista: tutto in una pagina' : 'Vista: a schede'); });
document.getElementById('dSearchBtn').addEventListener('click', () => { const top = document.querySelector('.dtop'); const on = top.classList.toggle('showsearch'); if (on) document.getElementById('dSearch').focus(); });
let dqTimer = 0;
function runSearch(){ if (!ui.open) return; searchJump = true; renderDetail(ui.open, true); searchJump = false; }
document.getElementById('dSearch').addEventListener('input', ev => { ui.dq = ev.target.value; clearTimeout(dqTimer); dqTimer = setTimeout(runSearch, 200); });
document.getElementById('dSearch').addEventListener('keydown', ev => { if (ev.key === 'Enter') { clearTimeout(dqTimer); runSearch(); } });
document.getElementById('dHero').addEventListener('click', ev => {
  if (!ui.open) return; const slug = ui.open;
  if (ev.target.closest('#hOwn')) { const e = entry(slug); e.owned = !e.owned; afterEdit(slug, true); return; }
  const ch = ev.target.closest('[data-tab]'); if (ch) setTab(ch.dataset.tab, true);
});
let tsx = 0, tsy = 0;
document.getElementById('dHero').addEventListener('touchstart', ev => { const t = ev.changedTouches[0]; tsx = t.clientX; tsy = t.clientY; }, { passive: true });
document.getElementById('dHero').addEventListener('touchend', ev => { if (ev.target.closest('.hchips')) return; const t = ev.changedTouches[0]; const dx = t.clientX - tsx, dy = t.clientY - tsy; if (Math.abs(dx) > 70 && Math.abs(dy) < 40) navStep(dx < 0 ? 1 : -1); }, { passive: true });
const dTabsEl = document.getElementById('dTabs');
dTabsEl.addEventListener('click', ev => { const b = ev.target.closest('.dtab'); if (b) setTab(b.dataset.dtab, true); });
dTabsEl.addEventListener('keydown', ev => {
  const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }; if (!(ev.key in keys) && ev.key !== 'Home' && ev.key !== 'End') return;
  const btns = Array.from(dTabsEl.querySelectorAll('.dtab')); const i = btns.indexOf(document.activeElement); if (i < 0) return;
  const n = ev.key === 'Home' ? 0 : ev.key === 'End' ? btns.length - 1 : (i + keys[ev.key] + btns.length) % btns.length;
  ev.preventDefault(); ev.stopPropagation(); setTab(btns[n].dataset.dtab, true); btns[n].focus();
});
let spyRaf = 0;
dBody.addEventListener('scroll', () => { if (ui.dmode !== 'all' || spyRaf) return; spyRaf = requestAnimationFrame(() => { spyRaf = 0; const top = dBody.scrollTop + 60; let cur = null; dBody.querySelectorAll('.pane').forEach(p => { if (p.offsetTop <= top) cur = p.dataset.pane; });
  if (cur && cur !== ui.tab) { ui.tab = cur; markTab(cur); if (cur === 'ig') { const g = dBody.querySelector('#pane-ig .infog-grid'); if (g && !g.childElementCount) g.innerHTML = infogHTML(BY[ui.open]); } } }); }, { passive: true });
document.addEventListener('keydown', ev => {
  const lb = document.getElementById('lightbox'), dlg = document.getElementById('dialog');
  if (ev.key === 'Escape') { if (lb.classList.contains('open')) { lb.classList.remove('open'); return; } if (dlg.classList.contains('open')) { dlg.classList.remove('open'); return; } if (ui.open) { if (ui.dq) { ui.dq = ''; document.getElementById('dSearch').value = ''; renderDetail(ui.open, true); } else closeDetail(); } return; }
  if (!ui.open || ev.ctrlKey || ev.metaKey || ev.altKey || lb.classList.contains('open') || dlg.classList.contains('open')) return;
  const t = ev.target; if (t && t.matches && t.matches('input, select, textarea, [contenteditable]')) return;
  if (ev.key === 'ArrowLeft') { navStep(-1); ev.preventDefault(); }
  else if (ev.key === 'ArrowRight') { navStep(1); ev.preventDefault(); }
  else if (ev.key === '/') { document.querySelector('.dtop').classList.add('showsearch'); document.getElementById('dSearch').focus(); ev.preventDefault(); }
  else if (/^[0-9]$/.test(ev.key)) { const tabs = tabsFor(BY[ui.open]); const i = ev.key === '0' ? 9 : parseInt(ev.key, 10) - 1; if (tabs[i]) setTab(tabs[i][0], true); }
});
document.getElementById('relFilter').addEventListener('click', ev => { const ch = ev.target.closest('.chip'); if (!ch) return; ui.rel = ch.dataset.rel; renderFilters(); renderGrid(); lsSave(); });
document.getElementById('relStrip').addEventListener('click', ev => { const g = ev.target.closest('[data-goto]'); if (g && BY[g.dataset.goto]) openDetail(g.dataset.goto); });
document.getElementById('relStrip').addEventListener('keydown', ev => { if (ev.key !== 'Enter' && ev.key !== ' ') return; const g = ev.target.closest('[data-goto]'); if (g && BY[g.dataset.goto]) { ev.preventDefault(); openDetail(g.dataset.goto); } });
