const tipEl = document.getElementById('tip');
drawerEl.addEventListener('mouseover', ev => { const t = ev.target.closest && ev.target.closest('#dBody .term'); if (!t || tipPinned) return; clearTimeout(tipTimer); tipTimer = setTimeout(() => showTip(t, false), 110); });
drawerEl.addEventListener('mouseout', ev => { const t = ev.target.closest && ev.target.closest('#dBody .term'); if (!t || tipPinned) return; clearTimeout(tipTimer); tipTimer = setTimeout(() => { if (!tipPinned && !tipEl.matches(':hover')) hideTip(); }, 260); });
tipEl.addEventListener('mouseleave', () => { if (!tipPinned) { clearTimeout(tipTimer); tipTimer = setTimeout(() => { if (!tipPinned && !(tipFor && tipFor.matches(':hover'))) hideTip(); }, 200); } });
dBody.addEventListener('focusin', ev => { const t = ev.target.closest('.term'); if (t && !tipPinned && t.matches(':focus-visible')) showTip(t, false); });
dBody.addEventListener('focusout', ev => { const t = ev.target.closest('.term'); if (t && !tipPinned) setTimeout(() => { if (!tipPinned && !tipEl.contains(document.activeElement)) hideTip(); }, 80); });
dBody.addEventListener('click', ev => { const t = ev.target.closest('.term'); if (!t) return; if (tipPinned && tipFor === t) hideTip(); else showTip(t, true); });
dBody.addEventListener('keydown', ev => { const t = ev.target.closest('.term'); if (!t || (ev.key !== 'Enter' && ev.key !== ' ')) return; ev.preventDefault(); if (tipPinned && tipFor === t) hideTip(); else showTip(t, true); });
dBody.addEventListener('scroll', () => { if (tipFor && !tipPinned) hideTip(); else if (tipFor) placeTip(tipFor); }, { passive: true });
tipEl.addEventListener('click', ev => {
  if (ev.target.closest('[data-tipclose]')) { const el = tipFor; hideTip(); if (el && el.focus) el.focus({ preventScroll: true }); return; }
  if (ev.target.closest('[data-tipback]')) { const prev = tipStack.pop(); if (prev) renderTip(prev); return; }
  const tm = ev.target.closest('.term'); if (tm) { tipPinned = true; if (tipName) tipStack.push(tipName); if (!renderTip(tm.dataset.term)) tipStack.pop(); return; }
  const tb = ev.target.closest('[data-tab]'); if (tb) { const tab = tb.dataset.tab; hideTip(); setTab(tab, true); }
});
tipEl.addEventListener('keydown', ev => { const tm = ev.target.closest('.term'); if (tm && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); tm.click(); } });
document.addEventListener('click', ev => { if (!tipFor || !tipPinned) return; if (ev.target.closest('#tip') || ev.target.closest('.term')) return; hideTip(); }, true);
window.addEventListener('resize', () => { if (tipFor) placeTip(tipFor); });
