function afterEdit(slug, full){ scheduleSave(slug); refreshCard(slug); renderSummary(); if (full) renderDetail(slug, true); else { refreshHero(); refreshCheck(); } }
function autoOwn(e){ if (!e.owned) { e.owned = true; document.querySelectorAll('#dBody [data-set="owned"]').forEach(b => { const on = b.dataset.val === '1'; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); } }
function onDetailChange(ev){
  const slug = ui.open; if (!slug) return; const e = entry(slug); const t = ev.target;
  if (t.dataset.persown) { const w = wonder(); w.pers = w.pers || {}; w.pers[t.dataset.persown] = t.checked; document.querySelectorAll('#dBody input[data-persown="' + CSS.escape(t.dataset.persown) + '"]').forEach(x => x.checked = t.checked); scheduleSave('__wonder'); return; }
  if (t.dataset.wwown) { const w = wonder(); const n = t.dataset.wwown; w.weapons[n] = w.weapons[n] || { owned: false, ref: 0 }; w.weapons[n].owned = t.checked; scheduleSave('__wonder'); renderDetail(slug, true); return; }
  if (t.dataset.wpn && t.dataset.wfield) { e.weapons[t.dataset.wpn] = e.weapons[t.dataset.wpn] || { owned: false, ref: 0 }; e.weapons[t.dataset.wpn].owned = t.checked; if (t.checked) e.owned = true; afterEdit(slug, true); return; }
  if (t.dataset.main && t.value === '__other__') { const cur = getPath(e, t.dataset.path) || ''; // prompt() non disponibile nel frame: usa il dialog interno
    askText('Stat principale ' + t.dataset.main, 'Scrivi la stat principale (es. "Defense %")', cur, val => { setPath(e, t.dataset.path, val); scheduleSave(slug); renderDetail(slug, true); });
    return; }
  const r = readField(t); if (!r) return;
  setPath(e, r.path, r.v);
  if (r.path === 'level' && r.v != null) { if (r.v > 100) setPath(e, 'level', 100); if (r.v < 1) setPath(e, 'level', 1); }
  if (r.path === 'level' || r.path.indexOf('skills') === 0) autoOwn(e);
  if (r.path.indexOf('rev.') === 0) { const sf = document.getElementById('spaceFx'), mf = document.getElementById('smssFx'); if (sf) sf.innerHTML = spaceEffects(BY[slug], e); if (mf) mf.innerHTML = smssEffects(e); }
  afterEdit(slug, ev.type === 'change' && (r.path === 'equipped' || r.path.indexOf('skills') === 0));
}
function onDetailClick(ev){
  const slug = ui.open; if (!slug) return; const c = BY[slug]; const e = entry(slug);
  const img = ev.target.closest('.infog img'); if (img) return;
  const tb = ev.target.closest('[data-tab]'); if (tb) { setTab(tb.dataset.tab, true); return; }
  const g = ev.target.closest('[data-goto]'); if (g) { gotoChar(g.dataset.goto); return; }
  const lc = ev.target.closest('[data-lvcol]'); if (lc) { ui.lvcol = parseInt(lc.dataset.lvcol, 10); lsSave(); renderDetail(slug, true); return; }
  const sg = ev.target.closest('[data-set]'); if (sg) { const path = sg.dataset.set; const v = sg.dataset.type === 'bool' ? sg.dataset.val === '1' : parseInt(sg.dataset.val, 10);
    setPath(e, path, v); if (path !== 'owned') e.owned = true; afterEdit(slug, true); return; }
  const fl = ev.target.closest('[data-fillpath]'); if (fl) { setPath(e, fl.dataset.fillpath, fl.dataset.fillval); e.owned = true; afterEdit(slug, true); toast('Inserito: ' + fl.dataset.fillval); return; }
  const fr = ev.target.closest('[data-fillrev]'); if (fr) { const r = e.rev; let n = 0;
    if (!r.space && c.rev_space[0] && REV.universe_sets[c.rev_space[0]]) { r.space = c.rev_space[0]; n++; }
    ['sun', 'moon', 'star', 'sky'].forEach(k => { if (!r[k] && c.rev_smss[0] && REV.smss_sets[c.rev_smss[0]]) { r[k] = c.rev_smss[0]; n++; } });
    if (n) { e.owned = true; afterEdit(slug, true); toast(n + (n === 1 ? ' campo compilato' : ' campi compilati') + ' con il primo set consigliato da lufel'); } else toast('Nessun campo set vuoto da compilare'); return; }
  const b = ev.target.closest('.ref button'); if (!b || !b.parentElement.dataset.wpn) return;
  const name = b.parentElement.dataset.wpn; e.weapons[name] = e.weapons[name] || { owned: false, ref: 0 }; e.weapons[name].ref = parseInt(b.dataset.ref, 10); e.weapons[name].owned = true; e.owned = true;
  afterEdit(slug, true);
}

