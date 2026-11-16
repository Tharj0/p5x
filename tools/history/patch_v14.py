import re
p = 'template.html'; t = open(p, encoding='utf-8').read()
R = lambda f: open('src/' + f, encoding='utf-8').read()
def rep(old, new, count=1):
    global t
    assert t.count(old) == count, (t.count(old), old[:90])
    t = t.replace(old, new)
def cut(start, end, new, keep_end=True):
    global t
    i = t.index(start); j = t.index(end, i)
    assert t.count(start) == 1, start[:60]
    t = t[:i] + new + (t[j:] if keep_end else t[j + len(end):])

# ---------- CSS ----------
cut('/* drawer */', '.sec{background:var(--bg2)', R('css_drawer.css'))
rep('  .drawer .dbody{padding:12px}\n', '')
rep('footer{margin-top:30px;', R('css_extra.css') + 'footer{margin-top:30px;')
rep('.drawer{position:fixed;top:0;right:0;height:100%;width:min(1140px,100%);background:var(--bg);border-left:1px solid var(--line);box-shadow:var(--shadow);transform:translateX(100%);transition:transform .2s ease;z-index:50;display:flex;flex-direction:column;outline:none;visibility:hidden}\n.drawer.open{transform:translateX(0);visibility:visible}',
    '.drawer{position:fixed;top:0;right:0;height:100%;width:min(1140px,100%);background:var(--bg);border-left:1px solid var(--line);box-shadow:var(--shadow);transform:translateX(100%);transition:transform .2s ease,visibility 0s linear .2s;z-index:50;display:flex;flex-direction:column;outline:none;visibility:hidden}\n.drawer.open{transform:translateX(0);visibility:visible;transition:transform .2s ease,visibility 0s}')

# ---------- markup ----------
rep('+ immagini dei personaggi, team consigliati e Persona/Wonder weapon consigliate per Wonder (lufel) + infografiche di Najox P5X per 44 personaggi.',
    '+ ordine di uscita dal Release Schedule, immagini, team consigliati e Persona/Wonder weapon consigliate per Wonder (lufel) + infografiche di Najox P5X per 44 personaggi.')
rep('<div class="summary" id="summary"></div>', '<div class="summary" id="summary"></div>\n    <div class="relstrip" id="relStrip"></div>')
rep('        <option value="position">Ordina: posizione</option>',
    '        <option value="position">Ordina: posizione</option>\n        <option value="rel_desc">Ordina: uscita (più recenti prima)</option>\n        <option value="rel_asc">Ordina: uscita (dal lancio)</option>')
rep('      <label class="toggle chip" id="hideNR"><input type="checkbox" id="hideNRcb"> Nascondi non rilasciati su Global</label>',
    '      <div class="chips" id="relFilter" title="Dal Release Schedule di lufel.net (server GLB/JP)"><span class="chip on" data-rel="all">Uscita: tutti</span><span class="chip" data-rel="out">Già usciti</span><span class="chip" data-rel="current">Banner attuale</span><span class="chip" data-rel="soon">In arrivo</span></div>')
rep('Immagini di personaggi, Persona e Wonder weapon da lufel.net',
    'Ordine e date di uscita dal Release Schedule di lufel.net (server GLB/JP) letto il 16 novembre 2026: le date con ≈ sono stime di lufel, non confermate. Immagini di personaggi, Persona e Wonder weapon da lufel.net')
cut('<aside class="drawer" id="drawer" aria-hidden="true">', '</aside>', '''<aside class="drawer" id="drawer" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Scheda personaggio" tabindex="-1">
  <div class="dtop">
    <button type="button" class="btn small" id="dPrev" aria-label="Personaggio precedente">◀</button>
    <select id="dJump" aria-label="Vai a un altro personaggio"></select>
    <button type="button" class="btn small" id="dNext" aria-label="Personaggio successivo">▶</button>
    <button type="button" class="btn small" id="dBack" style="display:none"></button>
    <span class="dsearch"><input type="search" id="dSearch" placeholder="Cerca in questa scheda… (es. Burn, Crit Rate)" aria-label="Cerca nel testo della scheda"><span id="dHits" role="status" aria-live="polite"></span></span>
    <button type="button" class="btn small" id="dSearchBtn" aria-label="Cerca nella scheda">🔍</button>
    <button type="button" class="btn small" id="dMode" title="Passa da «a schede» a «tutto in una pagina»"></button>
    <button type="button" class="btn small" id="dClose" aria-label="Chiudi la scheda">✕</button>
  </div>
  <div class="dmain">
    <div class="dside">
      <div class="hero" id="dHero"></div>
      <div class="dtabs" id="dTabs" role="tablist" aria-label="Sezioni della scheda"></div>
      <div class="keys">Tastiera: <kbd>←</kbd> <kbd>→</kbd> cambia personaggio · <kbd>1</kbd>–<kbd>0</kbd> sezione · <kbd>/</kbd> cerca · <kbd>Esc</kbd> chiudi</div>
    </div>
    <div class="dbody" id="dBody"></div>
  </div>
''')

# ---------- JS: state / storage ----------
rep("const ui = { pf: 'all', view: 'roster',", "const ui = { rel: 'all', tab: 'ov', dmode: 'tabs', lvcol: 0, dq: '', hist: [], pf: 'all', view: 'roster',")
rep("Object.assign(ui, { own: j.ui.own || 'all', sort: j.ui.sort || 'code', hideNR: !!j.ui.hideNR })",
    "Object.assign(ui, { own: j.ui.own || 'all', sort: j.ui.sort || 'code', rel: j.ui.rel || (j.ui.hideNR ? 'out' : 'all'), dmode: j.ui.dmode === 'all' ? 'all' : 'tabs', lvcol: typeof j.ui.lvcol === 'number' ? j.ui.lvcol : 0 })")
rep("ui: { own: ui.own, sort: ui.sort, hideNR: ui.hideNR }", "ui: { own: ui.own, sort: ui.sort, rel: ui.rel, dmode: ui.dmode, lvcol: ui.lvcol }")
rep("const EL_KEY = e => e.startsWith('Wind/Ice') ? 'WindIce' : (e.split(' ')[0]);", "const EL_KEY = e => e.startsWith('Wind/Ice') ? 'WindIce' : (e.split(' ')[0]);\n" + R('js_release.js'))

# ---------- JS: home ----------
rep("    if (ui.hideNR && !c.released) return false;", "    if (ui.rel === 'out' && !isOut(c)) return false;\n    if (ui.rel === 'current' && relState(c) !== 'current') return false;\n    if (ui.rel === 'soon' && isOut(c)) return false;")
rep("    position: (a, b) => a.position.localeCompare(b.position) || a.codename.localeCompare(b.codename)\n",
    "    position: (a, b) => a.position.localeCompare(b.position) || a.codename.localeCompare(b.codename),\n    rel_desc: (a, b) => b.rel.o - a.rel.o,\n    rel_asc: (a, b) => a.rel.o - b.rel.o\n")
rep("(c.released ? '' : '<span class=\"badge nr\">Non rilasciato</span>')", "relBadge(c)")
rep("""  g.innerHTML = arr.length ? arr.map(cardHTML).join('') : '<div class="empty">Nessun personaggio corrisponde ai filtri.</div>';""",
    """  if (!arr.length) { g.innerHTML = '<div class="empty">Nessun personaggio corrisponde ai filtri.</div>'; return; }
  if (ui.sort === 'rel_desc' || ui.sort === 'rel_asc') { let last = null, h = ''; arr.forEach(c => { if (c.rel.g !== last) { last = c.rel.g; h += relHead(c, arr.filter(x => x.rel.g === c.rel.g).length); } h += cardHTML(c); }); g.innerHTML = h; }
  else g.innerHTML = arr.map(cardHTML).join('');""")
rep("  document.getElementById('hideNRcb').checked = ui.hideNR; document.getElementById('hideNR').classList.toggle('on', ui.hideNR);",
    "  document.querySelectorAll('#relFilter .chip').forEach(ch => ch.classList.toggle('on', ch.dataset.rel === ui.rel));")
rep("    '<div class=\"stat\"><b>' + core + '</b>Mindscape Core attivi</div>';\n}", "    '<div class=\"stat\"><b>' + core + '</b>Mindscape Core attivi</div>';\n  renderRelStrip();\n}")
rep("  if (ui.open) { const d = document.getElementById('drawer'); if (d.contains(document.activeElement) && document.activeElement !== document.body) deferredRender = true; else renderDetail(ui.open, true); }",
    "  if (ui.open) { const d = document.getElementById('drawer'); const a = document.activeElement; if (a && d.contains(a) && a.matches('input, select, textarea')) deferredRender = true; else renderDetail(ui.open, true); }")
rep("(c.released ? '' : ' (non rilasciato)')", "(isOut(c) ? '' : ' (in arrivo ' + (relEst(c) ? '≈ ' : '') + fmtDate(c.rel.d) + ')')")

# ---------- JS: wonder weapon effect highlight ----------
rep("""<div class="rb">' + esc(W.effect) + '</div></details></div></div>';""", """<div class="rb">' + hl(W.effect, 7, ow.owned ? (ow.ref | 0) : -1, false) + '</div></details></div></div>';""")
rep("""<details' + (ctx === 'tab' ? '' : ' open') + '><summary>Effetto (lufel, valori R0 → R6)</summary>""", """<details' + (ctx === 'tab' ? '' : ' open') + '><summary>Effetto (lufel, valori R0 → R6' + (ow.owned ? ' · evidenziato il tuo R' + (ow.ref | 0) : '') + ')</summary>""")

# ---------- JS: detail + handlers ----------
cut('function renderDetail(slug, keepScroll){', 'function readField(elm){', R('js_detail.js'))
cut('function onDetailChange(ev){', '// ---------- wonder ----------', R('js_handlers.js'))

# ---------- JS: events ----------
rep("document.getElementById('hideNRcb').addEventListener('change', ev => { ui.hideNR = ev.target.checked; renderFilters(); renderGrid(); lsSave(); });\n", '')
cut("document.addEventListener('keydown', ev => { if (ev.key === 'Escape') {", "const dBody = document.getElementById('dBody');", '')
cut("dBody.addEventListener('toggle', ev => {", "dBody.addEventListener('click', ev => { const img = ev.target.closest('.infog img');", '')
cut("dBody.addEventListener('focusout', () => {", "const wv = document.getElementById('view-wonder');", R('js_events.js'))
rep("const g = ev.target.closest('[data-goto]'); if (g && BY[g.dataset.goto]) { openDetail(g.dataset.goto); return; }\n  const b = ev.target.closest('.ref button'); if (!b) return; const w = wonder();",
    "const g = ev.target.closest('[data-goto]'); if (g && BY[g.dataset.goto]) { openDetail(g.dataset.goto); return; }\n  const b = ev.target.closest('.ref button'); if (!b) return; const w = wonder();")
open(p, 'w', encoding='utf-8').write(t)
left = [k for k in ('hideNR', 'c.released', 'data-jump', 'dTitle', 'dSub', "getElementById('dImg')", 'sec-rev', 'dnav') if k in t]
print('ok', len(t), 'leftovers:', left)
