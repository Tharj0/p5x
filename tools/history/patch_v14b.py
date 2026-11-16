p = 'template.html'; t = open(p, encoding='utf-8').read()
def rep(old, new, count=1):
    global t
    assert t.count(old) == count, (t.count(old), old[:90])
    t = t.replace(old, new)
def cut(start, end, new):
    global t
    assert t.count(start) == 1, (t.count(start), start[:60])
    i = t.index(start); j = t.index(end, i); t = t[:i] + new + t[j:]

# 1) home: sezioni per stato/anno + riga di uscita sulla scheda
cut('function relHead(c, n){', 'function renderRelStrip(){', '''function relSection(c){ const s = relState(c); if (s === 'next' || s === 'future') return ['soon', 'In arrivo', 'date stimate da lufel (≈), non confermate']; if (s === 'current') return ['cur', 'Banner attuale', '']; const y = c.rel.d.slice(0, 4); return ['y' + y, 'Usciti nel ' + y, '']; }
function relLine(c){ const d = daysTo(c.rel.d); return esc(c.rel.v) + ' · ' + (relEst(c) ? '≈ ' : '') + fmtDate(c.rel.d) + (d > 0 ? ' · ' + inDays(d) : '') + (c.rel.note ? ' · ' + esc(c.rel.note) : ''); }
''')
rep("""  if (ui.sort === 'rel_desc' || ui.sort === 'rel_asc') { let last = null, h = ''; arr.forEach(c => { if (c.rel.g !== last) { last = c.rel.g; h += relHead(c, arr.filter(x => x.rel.g === c.rel.g).length); } h += cardHTML(c); }); g.innerHTML = h; }""",
    """  if (ui.sort === 'rel_desc' || ui.sort === 'rel_asc') { let last = null, h = ''; arr.forEach(c => { const sec = relSection(c); if (sec[0] !== last) { last = sec[0]; const n = arr.filter(x => relSection(x)[0] === sec[0]).length; h += '<div class="ghead"><b>' + sec[1] + '</b><span>' + n + (n === 1 ? ' personaggio' : ' personaggi') + '</span>' + (sec[2] ? '<span>' + sec[2] + '</span>' : '') + '</div>'; } h += cardHTML(c); }); g.innerHTML = h; }""")
rep("""<div class="name">' + esc(c.name) + ' · ' + esc(c.persona) + '</div></div><div class="stars">' + stars(c.rarity) + '</div></div>' +""",
    """<div class="name">' + esc(c.name) + ' · ' + esc(c.persona) + '</div>' + (ui.sort.indexOf('rel') === 0 ? '<div class="relline">' + relLine(c) + '</div>' : '') + '</div><div class="stars">' + stars(c.rarity) + '</div></div>' +""")

# 2) skill: livello dentro la scheda di ogni skill
cut('function paneSkills(c, e){', 'function paneAwareness(c, e){', r'''function paneSkills(c, e){
  const labs = lvLabels(c); const col = ui.lvcol;
  const names = { s1: 'Skill 1 — ' + (c.skills.s1 || ''), s2: 'Skill 2 — ' + (c.skills.s2 || ''), s3: 'Skill 3 — ' + (c.skills.s3 || ''), ult: c.skills.ult || c.ult_label };
  const keys = ['s1', 's2', 's3'].concat(c.has_hl ? ['ult'] : []);
  const sel = (k, lab) => { const cur = e.skills[k]; return '<select class="lvsel" data-path="skills.' + k + '" data-type="int" data-fk="sk:' + k + '" aria-label="' + esc(lab) + '"><option value="">Lv —</option>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => '<option value="' + i + '"' + (i === cur ? ' selected' : '') + '>Lv ' + i + '</option>').join('') + '</select>'; };
  const keyOf = t => /^Skill 1/.test(t) ? 's1' : /^Skill 2/.test(t) ? 's2' : /^Skill 3/.test(t) ? 's3' : null;
  const used = {};
  const cards = c.ref.skills.map(it => { let k = keyOf(it.t); if (!k && c.has_hl && !used.ult && /^(HIGHLIGHT|Highlight|Theurgy)/.test(it.t)) k = 'ult'; if (k && (used[k] || keys.indexOf(k) < 0)) k = null; if (k) used[k] = true;
    const pas = /^(Passiva|Stat Buff|Assist)/.test(it.t);
    return '<div class="skc' + (pas ? ' pas' : '') + '"><h4><span>' + esc(it.t || 'Nota') + '</span>' + (k ? '<label class="mylv">il mio livello ' + sel(k, 'Il mio livello — ' + it.t) + '</label>' : '') + '</h4><div class="tx">' + hl(it.b, 4, col, true) + '</div></div>'; }).join('');
  const rest = keys.filter(k => !used[k]);
  return '<div class="sec"><h3>Skill <span class="hint">effetti da lufel, in italiano · priorità: ' + esc(c.skill_prio || '—') + '</span></h3><div class="lvbar"><span class="lb">Mostra i valori a:</span>' +
    labs.map((l, i) => '<button type="button" class="chip' + (col === i ? ' on' : '') + '" data-lvcol="' + i + '" data-fk="lv:' + i + '" aria-pressed="' + (col === i) + '">' + l + '</button>').join('') +
    '<button type="button" class="chip' + (col < 0 ? ' on' : '') + '" data-lvcol="-1" data-fk="lv:-1" aria-pressed="' + (col < 0) + '">Tutti i valori</button></div>' +
    (col < 0 ? '<div class="note" style="margin-top:0">Ordine dei valori: ' + labs.join(' / ') + '.</div>' : '') +
    (c.has_hl ? '' : '<div class="note" style="margin-top:0">Elucidator: nessun Highlight (lufel).</div>') +
    (rest.length ? '<div class="skc"><h4><span>I miei livelli</span></h4><div class="frow">' + rest.map(k => fld(esc(names[k]), sel(k, names[k]))).join('') + '</div></div>' : '') + cards + '</div>';
}

''')
rep("afterEdit(slug, ev.type === 'change' && (r.path === 'equipped' || r.path.indexOf('skills') === 0));", "afterEdit(slug, ev.type === 'change' && r.path === 'equipped');")

# 3) CSS
rep('.skc h4{margin:0 0 5px;font-size:14.5px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;color:var(--txt)}',
    '.skc h4{margin:0 0 5px;font-size:14.5px;display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap;color:var(--txt)}\n.mylv{font-size:12px;color:var(--muted);font-weight:400;display:flex;align-items:center;gap:6px}\n.lvsel{background:var(--bg2);border:1px solid var(--line2);border-radius:8px;padding:6px 8px;color:var(--txt);font-size:13px;min-height:34px}\n.relline{font-size:12px;color:var(--gold);margin-top:3px}')
rep('  .lvbar{top:-12px}', '  .lvbar{top:-12px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}\n  .lvbar::-webkit-scrollbar{display:none}\n  .lvbar .lb{display:none}\n  .lvbar .chip{flex:none}')
open(p, 'w', encoding='utf-8').write(t); print('ok', len(t), 'relHead left:', 'relHead' in t)
