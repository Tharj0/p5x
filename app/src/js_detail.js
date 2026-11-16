// ---------- scheda personaggio (v2) ----------
const TABS = [['ov', 'Panoramica'], ['sk', 'Skill'], ['aw', 'Awareness'], ['ms', 'Mindscape'], ['wp', 'Armi'], ['rv', 'Revelation'], ['tm', 'Team e Wonder'], ['st', 'Stat e note'], ['gd', 'Guida lufel'], ['ig', 'Infografiche']];
function tabsFor(c){ return TABS.filter(t => t[0] !== 'ig' || (c.infographics && c.infographics.length)); }
const VAL_RE = /(^|[^\w.,\/])([+\-−]?\d+(?:[.,]\d+)?%?(?:\/[+\-−]?\d+(?:[.,]\d+)?%?)+)(?![\w\/])/g;
// Evidenzia, nei gruppi di n valori separati da "/", quello in posizione idx (compact: mostra solo quello)
function hl(txt, n, idx, compact){
  return esc(txt).replace(VAL_RE, (m, pre, grp) => { const parts = grp.split('/'); if (parts.length !== n || idx < 0 || idx >= n) return m;
    return pre + '<span class="vg' + (compact ? ' vc' : '') + '" title="' + grp + '">' + parts.map((p, i) => i === idx ? '<b class="von">' + p + '</b>' : '<span class="voff">' + p + '</span>').join('<span class="voff">/</span>') + '</span>'; }).replace(/\n/g, '<br>');
}
function seg(path, opts, cur, type, fill){
  return '<div class="seg" role="group">' + opts.map(o => '<button type="button" data-set="' + path + '" data-val="' + o[0] + '" data-type="' + type + '" data-fk="' + path + ':' + o[0] + '" class="' + (o[0] === cur ? 'on' : (fill && o[0] < cur ? 'in' : '')) + '" aria-pressed="' + (o[0] === cur) + '">' + esc(o[1]) + '</button>').join('') + '</div>';
}
function refItems(items){ return (items || []).map(it => '<div class="rb">' + (it.t ? '<b>' + esc(it.t) + '</b> ' : '') + esc(it.b).replace(/\n/g, '<br>') + '</div>').join(''); }
function kvRow(k, v, tab){ return v ? '<div class="k">' + (tab ? '<button type="button" class="klnk" data-tab="' + tab + '">' + k + ' ›</button>' : k) + '</div><div>' + v + '</div>' : ''; }
function splitOpts(s){ return String(s || '').split(/\s*\/\s*|\s*,\s*/).map(x => x.trim()).filter(x => x && !/^"?-"?$/.test(x) && !/non indicat/i.test(x)); }
function normStat(s){ return String(s || '').toLowerCase().replace(/%/g, '').replace(/\s+/g, ' ').trim(); }
function lvLabels(c){ const m = c.rarity === 5 ? '13' : '12'; return ['LV10', 'LV10 + Minds 5', 'LV' + m, 'LV' + m + ' + Minds 5']; }

// Confronto tra i dati inseriti e i consigli lufel (solo confronti esatti: nomi dei set, stat principali, arma)
function checklist(c, e){
  const out = []; const add = (s, t, d, tab) => out.push({ s: s, t: t, d: d, tab: tab });
  const a = e.awareness | 0;
  if (e.level) add('info', 'Livello ' + e.level, c.core ? 'LV100 sbloccabile con il Mindscape Core (lufel).' : 'Cap LV80: nessun Mindscape Core su lufel.', 'ov'); else add('todo', 'Livello non inserito', '', 'ov');
  add('info', 'Awareness A' + a + ' — ' + c.awareness['a' + a], a < 6 ? 'Prossima: A' + (a + 1) + ' — ' + c.awareness['a' + (a + 1)] : 'Awareness al massimo.', 'aw');
  const keys = ['s1', 's2', 's3'].concat(c.has_hl ? ['ult'] : []); const labs = { s1: 'S1', s2: 'S2', s3: 'S3', ult: c.ult_label === 'Theurgy' ? 'Theurgy' : 'HL' };
  add(keys.some(k => e.skills[k] == null) ? 'todo' : 'info', 'Skill: ' + keys.map(k => labs[k] + ' ' + (e.skills[k] == null ? '—' : 'Lv ' + e.skills[k])).join(' · '), 'Priorità lufel: ' + (c.skill_prio || '—'), 'sk');
  const w5 = c.weapons.find(w => w.rarity === '5★'); const w5txt = w5 ? 'Arma esclusiva 5★: ' + w5.name + '.' : '';
  if (e.equipped === '__other__') add('warn', 'Arma: ' + (e.equipped_other || 'altra arma (non esclusiva)'), w5txt, 'wp');
  else if (e.equipped) { const w = c.weapons.find(x => x.name === e.equipped); const r = (e.weapons[e.equipped] || {}).ref | 0;
    if (w && w.rarity === '5★') add('ok', 'Arma: 5★ ' + w.name + ' R' + r, 'È l\u2019arma esclusiva 5★.', 'wp'); else add('warn', 'Arma: ' + (w ? w.rarity + ' ' : '') + e.equipped + ' R' + r, w5txt, 'wp'); }
  else add('todo', 'Arma equipaggiata non segnata', w5txt, 'wp');
  const r = e.rev;
  if (!r.space) add('todo', 'Revelation Space non inserita', 'lufel: ' + c.rev_space.join(' / '), 'rv');
  else if (c.rev_space.indexOf(r.space) >= 0) add('ok', 'Space: ' + r.space, 'Coincide con lufel (' + c.rev_space.join(' / ') + ').', 'rv');
  else add('warn', 'Space: ' + r.space, 'lufel consiglia: ' + c.rev_space.join(' / ') + '.', 'rv');
  const filled = [r.sun, r.moon, r.star, r.sky].filter(Boolean);
  if (!filled.length) add('todo', 'Set Sun/Moon/Star/Sky non inseriti', 'lufel: ' + c.rev_smss.join(' / '), 'rv');
  else { const cnt = {}; filled.forEach(s => cnt[s] = (cnt[s] || 0) + 1); const desc = Object.keys(cnt).map(s => s + ' ×' + cnt[s]).join(', ') + (filled.length < 4 ? ' (' + filled.length + '/4 inserite)' : '');
    const best = Math.max.apply(null, [0].concat(c.rev_smss.map(s => cnt[s] || 0))); const allRec = filled.every(s => c.rev_smss.indexOf(s) >= 0);
    if (best === 4) add('ok', 'Set: ' + desc, '4 carte di un set consigliato da lufel: 4-Set attivo.', 'rv');
    else if (allRec) add('info', 'Set: ' + desc, 'Solo set consigliati da lufel (' + c.rev_smss.join(' / ') + '), ma il 4-Set richiede 4 carte dello stesso set.', 'rv');
    else add('warn', 'Set: ' + desc, 'lufel consiglia: ' + c.rev_smss.join(' / ') + '.', 'rv'); }
  [['moon', 'Moon'], ['star', 'Star'], ['sky', 'Sky']].forEach(p => { const rec = splitOpts(c.main[p[1]]); const mine = r.main[p[0]];
    if (!rec.length) { if (mine) add('info', 'Main ' + p[1] + ': ' + mine, 'lufel non indica una stat principale per ' + p[1] + '.', 'rv'); return; }
    if (!mine) add('todo', 'Main ' + p[1] + ' non inserita', 'lufel: ' + rec.join(' / '), 'rv');
    else if (rec.some(x => normStat(x) === normStat(mine))) add('ok', 'Main ' + p[1] + ': ' + mine, 'Coincide con lufel (' + rec.join(' / ') + ').', 'rv');
    else add('warn', 'Main ' + p[1] + ': ' + mine, 'lufel consiglia: ' + rec.join(' / ') + '.', 'rv'); });
  const ms = c.mindscape || {};
  add('info', 'Mindscape (Minds) ' + (e.minds | 0) + '/5', 'lufel LV5: RS1 ' + (ms.rs1 || '—') + ' · RS2 ' + (ms.rs2 || '—') + ' · SE1 ' + (ms.se1 || '—') + ' · SE2 ' + (ms.se2 || '—'), 'ms');
  if (c.core) add(e.core ? 'ok' : 'todo', e.core ? 'Mindscape Core attivo' : 'Mindscape Core non attivo', 'lufel ha un Mindscape Core per questo personaggio.', 'ms');
  return out;
}
function checkHTML(c, e){
  if (!e.owned) return '<div class="note">Non hai segnato <b>' + esc(c.codename) + '</b> come posseduto. Quando lo segni, qui compare il confronto tra la tua build e quella consigliata da lufel.</div>';
  const items = checklist(c, e); const ic = { ok: '✅', warn: '⚠️', todo: '⬜', info: 'ℹ️' }; const sr = { ok: 'come lufel', warn: 'diverso da lufel', todo: 'da inserire', info: 'informazione' }; const n = s => items.filter(i => i.s === s).length;
  return '<div class="cksum"><span class="badge ok">✅ ' + n('ok') + ' come lufel</span><span class="badge nr">⚠️ ' + n('warn') + ' diversi</span><span class="badge">⬜ ' + n('todo') + ' da inserire</span></div>' +
    items.map(i => '<button type="button" class="ck" data-tab="' + i.tab + '"><span class="i" aria-hidden="true">' + ic[i.s] + '</span><span><span class="sr">' + sr[i.s] + ': </span><b>' + esc(i.t) + '</b>' + (i.d ? '<br>' + esc(i.d) : '') + '</span></button>').join('');
}

function paneOverview(c, e){
  const a = e.awareness | 0; const t = c.team || { friends: [], parties: [], weapons: [], personas: [] }; const ms = c.mindscape || {}; const main = c.main;
  let h = '<div class="ovgrid">';
  h += '<div class="sec" id="ovMy"><h3>Il mio ' + esc(c.codename) + ' <span class="hint">si salva da solo</span></h3><div class="frow">' +
    fld('Posseduto', seg('owned', [[0, 'No'], [1, 'Sì']], e.owned ? 1 : 0, 'bool')) +
    fld('Livello', '<input type="number" inputmode="numeric" min="1" max="100" data-path="level" data-type="int" value="' + (e.level || '') + '" placeholder="1–' + (c.core ? 100 : 80) + '">', c.core ? 'fino a LV100 con il Mindscape Core (lufel)' : 'cap LV80 (nessun Mindscape Core su lufel)') + '</div>' +
    '<div style="margin-top:10px">' + fld('Awareness', seg('awareness', [0, 1, 2, 3, 4, 5, 6].map(i => [i, 'A' + i]), a, 'int', true), '<b>A' + a + '</b> — ' + esc(c.awareness['a' + a])) + '</div>' +
    '<div class="frow" style="margin-top:10px">' + fld('Mindscape (Minds)', seg('minds', [0, 1, 2, 3, 4, 5].map(i => [i, String(i)]), e.minds | 0, 'int', true)) +
    (c.core ? fld('Mindscape Core', seg('core', [[0, 'Non attivo'], [1, 'Attivo']], e.core ? 1 : 0, 'bool')) : '') + '</div></div>';
  h += '<div class="sec"><h3>La mia build e lufel <span class="hint">tocca una riga per aprirla</span></h3><div id="ovCheck">' + checkHTML(c, e) + '</div></div></div>';
  h += '<div class="sec"><h3>Build consigliata da lufel <span class="hint"><a href="' + c.lufel_url + '" target="_blank" rel="noopener">pagina lufel ↗</a></span></h3><div class="kv2">' +
    kvRow('Space (Universe)', esc(c.rev_space.map(s => '★ ' + s).join(' / ')), 'rv') +
    kvRow('Sun / Moon / Star / Sky', esc(c.rev_smss.map(s => '★ ' + s).join(' / ')), 'rv') +
    kvRow('Stat principali', 'Sun ' + esc(main.Sun) + ' · Moon ' + esc(main.Moon) + ' · Star ' + esc(main.Star) + ' · Sky ' + esc(main.Sky), 'rv') +
    kvRow('Sub Options', esc(c.sub)) + kvRow('Recommended Stats', esc(c.rec_stats), 'st') + (c.battle_entry && String(c.rec_stats).indexOf('Battle Entry') < 0 ? kvRow('Battle Entry +', esc(c.battle_entry)) : '') +
    kvRow('Priorità skill', esc(c.skill_prio), 'sk') +
    kvRow('Mindscape LV5', 'RS1 ' + esc(ms.rs1 || '—') + ' · RS2 ' + esc(ms.rs2 || '—') + (ms.rs2glb ? ' (GLB: ' + esc(ms.rs2glb) + ')' : '') + ' · SE1 ' + esc(ms.se1 || '—') + ' · SE2 ' + esc(ms.se2 || '—'), 'ms') +
    kvRow('Attribute Mindscape', 'Synergy: ' + esc(c.syn || 'nessuna consigliata') + ' · Combat Skill: ' + esc(c.combat || 'nessuna consigliata'), 'ms') +
    kvRow('Armi esclusive', esc(c.weapons.map(w => w.rarity + ' ' + w.name).join(' · ')), 'wp') +
    kvRow('Skill Rotation', esc(c.rotation), 'gd') + kvRow('Note lufel', esc(c.notes)) +
    kvRow('Profilo', esc(c.persona) + ' · ' + stars(c.rarity) + ' ' + esc(c.type) + ' · ' + esc(c.element) + ' · ' + esc(c.position)) +
    kvRow('Tag', esc(c.tags)) + kvRow('Resistenze', esc(c.reswk)) +
    kvRow('Uscita (GLB/JP)', esc(relText(c)) + (relEst(c) ? ' — data stimata da lufel, non confermata' : '')) + '</div></div>';
  if (t.friends.length || t.weapons.length || t.personas.length) {
    h += '<div class="sec"><h3>Team e Wonder in breve <span class="hint"><button type="button" class="klnk" data-tab="tm">apri tutto ›</button></span></h3>';
    if (t.friends.length) h += '<div class="party" style="border-top:0;padding-top:0">' + t.friends.map(f => f.slug ? partyMember(f.slug, null, false) : '').join('') + '</div>';
    if (t.weapons.length) h += '<div class="effect"><b>Wonder weapon:</b> ' + t.weapons.map(w => (w.star ? '★ ' : '') + esc(w.name)).join(' · ') + '</div>';
    if (t.personas.length) h += '<div class="effect"><b>Persona di Wonder:</b> ' + t.personas.map(g => esc(g.label) + ' — ' + g.list.map(p => (p.star ? '★ ' : '') + esc(p.name)).join(', ')).join(' · ') + '</div>';
    h += '</div>';
  }
  return h;
}

function paneSkills(c, e){
  const labs = lvLabels(c); const col = ui.lvcol;
  const keys = [['s1', 'Skill 1 — ' + (c.skills.s1 || '')], ['s2', 'Skill 2 — ' + (c.skills.s2 || '')], ['s3', 'Skill 3 — ' + (c.skills.s3 || '')]].concat(c.has_hl ? [['ult', c.skills.ult || c.ult_label]] : []);
  const sel = k => { const cur = e.skills[k[0]]; return fld(esc(k[1]), '<select data-path="skills.' + k[0] + '" data-type="int" data-fk="sk:' + k[0] + '"><option value="">—</option>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => '<option value="' + i + '"' + (i === cur ? ' selected' : '') + '>Lv ' + i + '</option>').join('') + '</select>'); };
  const keyOf = t => /^Skill 1/.test(t) ? 's1' : /^Skill 2/.test(t) ? 's2' : /^Skill 3/.test(t) ? 's3' : null;
  let ultSeen = false;
  const cards = c.ref.skills.map(it => { let k = keyOf(it.t); if (!k && c.has_hl && !ultSeen && /^(HIGHLIGHT|Highlight|Theurgy)/.test(it.t)) { k = 'ult'; ultSeen = true; }
    const pas = /^(Passiva|Stat Buff|Assist)/.test(it.t); const my = k && e.owned && e.skills[k] != null ? ' <span class="badge ok">il mio: Lv ' + e.skills[k] + '</span>' : '';
    return '<div class="skc' + (pas ? ' pas' : '') + '"><h4>' + esc(it.t || 'Nota') + my + '</h4><div class="tx">' + hl(it.b, 4, col, true) + '</div></div>'; }).join('');
  return '<div class="sec"><h3>I miei livelli skill <span class="hint">priorità lufel: ' + esc(c.skill_prio || '—') + '</span></h3><div class="frow">' + keys.map(sel).join('') + '</div>' + (c.has_hl ? '' : '<div class="note">Elucidator: nessun Highlight (lufel).</div>') + '</div>' +
    '<div class="sec"><h3>Effetti delle skill <span class="hint">lufel, in italiano</span></h3><div class="lvbar"><span>Mostra i valori a:</span>' +
    labs.map((l, i) => '<button type="button" class="chip' + (col === i ? ' on' : '') + '" data-lvcol="' + i + '" data-fk="lv:' + i + '" aria-pressed="' + (col === i) + '">' + l + '</button>').join('') +
    '<button type="button" class="chip' + (col < 0 ? ' on' : '') + '" data-lvcol="-1" data-fk="lv:-1" aria-pressed="' + (col < 0) + '">Tutti i valori</button></div>' +
    (col < 0 ? '<div class="note" style="margin-top:0">Ordine dei valori: ' + labs.join(' / ') + '.</div>' : '') + cards + '</div>';
}

function paneAwareness(c, e){
  const a = e.awareness | 0; const own = !!e.owned;
  let h = '<div class="sec"><h3>Awareness <span class="hint">tocca A0–A6 per impostare la tua</span></h3>' + seg('awareness', [0, 1, 2, 3, 4, 5, 6].map(i => [i, 'A' + i]), a, 'int', true) +
    c.ref.awareness.map((it, i) => '<div class="awrow ' + (own ? (i <= a ? 'on' : 'off') : '') + '"><button type="button" class="lv" data-set="awareness" data-val="' + i + '" data-type="int" data-fk="awrow:' + i + '" title="Imposta la mia Awareness ad A' + i + '" aria-label="Imposta la mia Awareness ad A' + i + '">A' + i + '</button><div><b>' + esc(c.awareness['a' + i]) + '</b>' + (own && i <= a ? ' <span class="badge ok">attiva</span>' : '') + '<div class="tx">' + esc(it.b).replace(/\n/g, '<br>') + '</div></div></div>').join('') + '</div>';
  if (c.base && c.base.lv80) {
    const has100 = !!c.base.lv100;
    h += '<div class="sec"><h3>Stat base per Awareness <span class="hint">lufel · solo il personaggio, senza arma e Revelation</span></h3><table class="bst"><thead><tr><th></th><th>HP</th><th>ATK</th><th>DEF</th>' + (has100 ? '<th>HP</th><th>ATK</th><th>DEF</th>' : '') + '</tr><tr><th></th><th colspan="3">LV80</th>' + (has100 ? '<th colspan="3">LV100</th>' : '') + '</tr></thead><tbody>' +
      c.base.lv80.map((r, i) => '<tr class="' + (own && i === a ? 'on' : '') + '"><td>A' + i + '</td><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td>' + (has100 ? '<td>' + c.base.lv100[i][0] + '</td><td>' + c.base.lv100[i][1] + '</td><td>' + c.base.lv100[i][2] + '</td>' : '') + '</tr>').join('') + '</tbody></table>' +
      (c.base.lv1 ? '<div class="effect"><b>Base LV1:</b> ' + esc(c.base.lv1) + (c.base.hidden ? ' · <b>Hidden Ability LV7:</b> ' + esc(c.base.hidden) : '') + '</div>' : '') + '</div>';
  }
  return h;
}

function fillBtn(path, val){ return val ? '<button type="button" class="fillbtn" data-fillpath="' + path + '" data-fillval="' + esc(val) + '" title="Inserisci questo valore nel campo">usa «' + esc(val) + '»</button>' : ''; }
function paneMindscape(c, e){
  const ms = c.mindscape || {};
  let h = '<div class="sec"><h3>Mindscape (Minds) <span class="hint">livello sbloccato e scelte fatte</span></h3>' + fld('Livello Mindscape', seg('minds', [0, 1, 2, 3, 4, 5].map(i => [i, i === 0 ? 'Nessuno' : String(i)]), e.minds | 0, 'int', true)) +
    '<div class="frow" style="margin-top:10px">' +
    fld('Rank Strengthening 1 scelto', '<input list="rsopts" data-path="msel.rs1" value="' + esc(e.msel.rs1) + '" placeholder="es. ' + esc(ms.rs1 || 'Attack 20%') + '">', 'lufel LV5: <b>' + esc(ms.rs1 || '—') + '</b><br>' + fillBtn('msel.rs1', ms.rs1)) +
    fld('Rank Strengthening 2 scelto', '<input list="rsopts" data-path="msel.rs2" value="' + esc(e.msel.rs2) + '" placeholder="es. ' + esc(ms.rs2 || 'Crit Rate 12%') + '">', 'lufel LV5: <b>' + esc(ms.rs2 || '—') + '</b>' + (ms.rs2glb ? ' (GLB: <b>' + esc(ms.rs2glb) + '</b>)' : '') + '<br>' + fillBtn('msel.rs2', ms.rs2) + fillBtn('msel.rs2', ms.rs2glb)) +
    fld('Skill Enforce 1 scelto', '<input data-path="msel.se1" value="' + esc(e.msel.se1) + '" placeholder="es. ' + esc(ms.se1 || 'Skill1 / Skill2') + '">', 'lufel LV5: <b>' + esc(ms.se1 || '—') + '</b><br>' + fillBtn('msel.se1', ms.se1)) +
    fld('Skill Enforce 2 scelto', '<input data-path="msel.se2" value="' + esc(e.msel.se2) + '" placeholder="es. ' + esc(ms.se2 || 'Skill3 / HIGHLIGHT') + '">', 'lufel LV5: <b>' + esc(ms.se2 || '—') + '</b><br>' + fillBtn('msel.se2', ms.se2)) + '</div></div>';
  h += '<div class="sec"><h3>Attribute Mindscape <span class="hint">Synergy e Combat Skill</span></h3><div class="frow">' +
    fld('Synergy sbloccata', '<input data-path="syn" value="' + esc(e.syn) + '" placeholder="' + esc(c.syn ? 'es. ' + c.syn : 'nome o vuoto') + '">', (c.syn ? 'lufel consiglia: <b>' + esc(c.syn) + '</b><br>' + fillBtn('syn', c.syn) : 'lufel: nessuna consigliata')) +
    fld('Combat Skill sbloccata', '<input data-path="combat" value="' + esc(e.combat) + '" placeholder="' + esc(c.combat ? 'es. ' + c.combat : 'nome o vuoto') + '">', (c.combat ? 'lufel consiglia: <b>' + esc(c.combat) + '</b><br>' + fillBtn('combat', c.combat) : 'lufel: nessuna consigliata')) + '</div>' + refItems(c.ref.attr) + '</div>';
  if (c.core) h += '<div class="sec"><h3>Mindscape Core <span class="hint">presente su lufel (KR V4.7)</span></h3>' + seg('core', [[0, 'Non attivato'], [1, 'Attivato']], e.core ? 1 : 0, 'bool') + refItems(c.ref.core) + '</div>';
  return h;
}

function paneWeapons(c, e){
  let h = '<div class="sec"><h3>Armi esclusive <span class="hint">R0–R6 = refinement (duplicati) · i valori del tuo refinement sono evidenziati</span></h3>';
  c.weapons.forEach(w => { const we = e.weapons[w.name] || { owned: false, ref: 0 }; const R = c.ref.weapons.find(x => x.t.indexOf(w.name) >= 0); const idx = we.owned ? (we.ref | 0) : -1;
    h += '<div class="wcard' + (e.equipped === w.name ? ' eq' : '') + '"><div class="wh"><b>' + esc(w.rarity) + ' ' + esc(w.name) + (e.equipped === w.name ? ' <span class="badge gold">equipaggiata</span>' : '') + '</b><small>HP ' + w.hp + ' · ATK ' + w.atk + ' · DEF ' + w.def + (w.passive ? ' · passiva ' + esc(w.passive) : '') + '</small></div>' +
      '<div class="ctl"><label class="toggle"><input type="checkbox" data-wpn="' + esc(w.name) + '" data-wfield="owned"' + (we.owned ? ' checked' : '') + '> posseduta</label>' +
      '<label class="toggle"><input type="radio" name="equipped" data-path="equipped" data-fk="eq:' + esc(w.name) + '" value="' + esc(w.name) + '"' + (e.equipped === w.name ? ' checked' : '') + '> equipaggiata</label>' +
      '<div class="ref" data-wpn="' + esc(w.name) + '" role="group" aria-label="Refinement">' + [0, 1, 2, 3, 4, 5, 6].map(r => '<button type="button" data-ref="' + r + '" data-fk="wr:' + esc(w.name) + ':' + r + '" class="' + (we.owned && r === (we.ref | 0) ? 'on' : '') + '" title="Refinement R' + r + '">R' + r + '</button>').join('') + '</div></div>' +
      (R ? '<div class="tx">' + (idx >= 0 ? 'Valori evidenziati: <b class="von">R' + idx + '</b> (il tuo refinement).' : 'Valori da R0 a R6 (segnala come posseduta per evidenziare il tuo refinement).') + '<ul>' + R.e.map(x => '<li>' + hl(x, 7, idx, false) + '</li>').join('') + '</ul></div>' : '') + '</div>'; });
  h += '<div class="wcard' + (e.equipped === '__other__' ? ' eq' : '') + '"><div class="wh"><b>Altra arma</b><small>non esclusiva (es. arma 4★ generica, evento)</small></div><div class="ctl"><input type="text" data-path="equipped_other" value="' + esc(e.equipped_other) + '" placeholder="nome arma + refinement" aria-label="Nome dell\u2019altra arma">' +
    '<label class="toggle"><input type="radio" name="equipped" data-path="equipped" data-fk="eq:__other__" value="__other__"' + (e.equipped === '__other__' ? ' checked' : '') + '> equipaggiata</label></div></div></div>';
  return h;
}

function paneRevelation(c, e){
  const main = c.main; const first = [c.rev_space[0], c.rev_smss[0]].filter(Boolean);
  return '<div class="sec"><h3>Revelation in uso <span class="hint">★ = consigliato da lufel</span></h3>' +
    '<div class="note"><b>lufel:</b> Space ' + esc(c.rev_space.join(' / ')) + ' · Sun/Moon/Star/Sky ' + esc(c.rev_smss.join(' / ')) + ' · Main: Sun ' + esc(main.Sun) + ' · Moon ' + esc(main.Moon) + ' · Star ' + esc(main.Star) + ' · Sky ' + esc(main.Sky) + (c.sub ? ' · Sub: ' + esc(c.sub) : '') + (c.rec_stats ? ' · Target: ' + esc(c.rec_stats) : '') + '</div>' +
    (first.length ? '<div><button type="button" class="fillbtn" data-fillrev="1" title="Riempie solo i campi set ancora vuoti">compila i set vuoti con il primo consigliato (' + esc(first.join(' + ')) + ')</button></div>' : '') +
    '<div class="frow" style="margin-top:10px">' +
    fld('Space (Universe) — set', '<select data-path="rev.space">' + setSelect(SPACE_SETS, e.rev.space, c.rev_space, 'space') + '</select>') +
    fld('Space — stat principale', '<select data-path="rev.main.space" data-main="space">' + mainSelect('Space', e.rev.main.space) + '</select>') +
    '</div><div id="spaceFx">' + spaceEffects(c, e) + '</div>' +
    '<div class="frow" style="margin-top:10px">' +
    fld('Sun — set', '<select data-path="rev.sun">' + setSelect(SMSS_SETS, e.rev.sun, c.rev_smss) + '</select>', 'Main stat Sun: HP (fisso)') +
    fld('Moon — set', '<select data-path="rev.moon">' + setSelect(SMSS_SETS, e.rev.moon, c.rev_smss) + '</select>') +
    fld('Moon — stat principale', '<select data-path="rev.main.moon" data-main="moon">' + mainSelect('Moon', e.rev.main.moon) + '</select>', 'lufel: <b>' + esc(main.Moon) + '</b>') +
    fld('Star — set', '<select data-path="rev.star">' + setSelect(SMSS_SETS, e.rev.star, c.rev_smss) + '</select>') +
    fld('Star — stat principale', '<select data-path="rev.main.star" data-main="star">' + mainSelect('Star', e.rev.main.star) + '</select>', 'lufel: <b>' + esc(main.Star) + '</b>') +
    fld('Sky — set', '<select data-path="rev.sky">' + setSelect(SMSS_SETS, e.rev.sky, c.rev_smss) + '</select>') +
    fld('Sky — stat principale', '<select data-path="rev.main.sky" data-main="sky">' + mainSelect('Sky', e.rev.main.sky) + '</select>', 'lufel: <b>' + esc(main.Sky) + '</b>') +
    '</div><div id="smssFx">' + smssEffects(e) + '</div></div>' +
    '<div class="sec"><h3>Dettaglio dei set consigliati <span class="hint">lufel</span></h3><div class="tx">' + esc(c.rev_line) + '</div><div class="effect"><b>Sub Options:</b> ' + esc(c.sub || '—') + '</div></div>';
}

function paneStats(c, e){
  return '<div class="sec"><h3>Stat finali in gioco <span class="hint">dalla schermata del personaggio · opzionale</span></h3>' +
    (c.rec_stats ? '<div class="note"><b>lufel — Recommended Stats:</b> ' + esc(c.rec_stats) + (c.battle_entry && String(c.rec_stats).indexOf('Battle Entry') < 0 ? ' · Battle Entry +: ' + esc(c.battle_entry) : '') + '</div>' : '') +
    '<div class="frow" style="margin-top:10px">' + STAT_FIELDS.map(f => fld(f[1], f[0] === 'rating' ? '<input data-path="stats.rating" value="' + esc(e.stats.rating || '') + '" placeholder="es. S">' : '<input type="number" inputmode="decimal" step="any" data-path="stats.' + f[0] + '" data-type="num" value="' + (e.stats[f[0]] != null ? e.stats[f[0]] : '') + '">')).join('') + '</div></div>' +
    '<div class="sec"><h3>Note</h3><div class="f"><textarea data-path="notes" placeholder="Set in farming, obiettivi, team in cui lo usi…" aria-label="Note">' + esc(e.notes) + '</textarea></div></div>';
}

function paneGuide(c){
  const blk = (title, txt) => txt ? '<div class="sec"><h3>' + title + '</h3><div class="tx pre">' + esc(txt) + '</div></div>' : '';
  const aw = c.awareness;
  return '<div class="sec"><h3>Rotazione e priorità <span class="hint">lufel</span></h3><div class="kv2">' + kvRow('Skill Rotation', esc(c.rotation)) + kvRow('Note', esc(c.notes)) + kvRow('Priorità skill', esc(c.skill_prio)) + kvRow('Passive', esc(c.passives.join(' · '))) + kvRow('Awareness', [0, 1, 2, 3, 4, 5, 6].map(i => 'A' + i + ' ' + esc(aw['a' + i])).join(' · ')) + '</div></div>' +
    blk('Character Review <span class="hint">lufel</span>', c.ref.review) + blk('Recommended Combination <span class="hint">lufel</span>', c.ref.combo) + blk('Recommended Parties <span class="hint">lufel</span>', c.ref.parties) + blk('Stats <span class="hint">lufel</span>', c.ref.stats) +
    '<div class="sec"><h3>Setup completo <span class="hint">lufel</span></h3><div class="kv2">' + kvRow('Revelation', esc(c.rev_line)) + kvRow('Sub Options', esc(c.sub)) + kvRow('Recommended Stats', esc(c.rec_stats)) + kvRow('Battle Entry +', esc(c.battle_entry)) + kvRow('Guida nel progetto', esc(c.doc)) + kvRow('Pagina lufel', '<a href="' + c.lufel_url + '" target="_blank" rel="noopener">' + esc(c.lufel_url) + '</a>') + '</div></div>';
}

function infogHTML(c){ return c.infographics.map(i => '<figure><img src="' + esc(i.file) + '" loading="lazy" alt="' + esc(c.codename + ' — ' + i.label + ' (Najox P5X)') + '" data-cap="' + esc(c.codename + ' · ' + i.label + ' · Najox P5X') + '"><figcaption><span>' + esc(i.label) + '</span><a href="' + esc(i.file) + '" target="_blank" rel="noopener">apri in una scheda ↗</a></figcaption></figure>').join(''); }
function paneInfog(c){
  const now = ui.dmode === 'all' || ui.tab === 'ig';
  return '<div class="sec infog"><h3>Infografiche Najox P5X <span class="hint">materiale aggiuntivo, non riferimento principale · autore: <a href="https://x.com/NajoxP5X" target="_blank" rel="noopener">x.com/NajoxP5X</a></span></h3><div class="hint2">' + c.infographics.length + ' immagin' + (c.infographics.length === 1 ? 'e' : 'i') + ': ' + esc(c.infographics.map(i => i.label).join(', ')) + '. Tocca un\u2019immagine per ingrandirla.</div><div class="infog-grid">' + (now ? infogHTML(c) : '') + '</div></div>';
}

function renderHero(c, e){
  const owned = !!e.owned; const hero = document.getElementById('dHero'); hero.className = 'hero' + (owned ? '' : ' no'); hero.style.setProperty('--el', elColor(c));
  const eq = e.equipped && e.equipped !== '__other__' ? c.weapons.find(w => w.name === e.equipped) : null;
  const chip = (tab, txt, tip) => '<button type="button" class="hchip" data-tab="' + tab + '" title="' + esc(tip) + '">' + esc(txt) + '</button>';
  const chips = ['<button type="button" class="hchip own' + (owned ? ' on' : '') + '" id="hOwn" aria-pressed="' + owned + '" title="Segna come posseduto / non posseduto">' + (owned ? '✓ Posseduto' : '+ Segna posseduto') + '</button>'];
  if (owned) chips.push(chip('ov', 'Lv ' + (e.level || '?'), 'Livello'), chip('aw', 'A' + (e.awareness | 0), 'Awareness'), chip('ms', 'Minds ' + (e.minds | 0) + (c.core ? (e.core ? ' · Core ✓' : ' · Core —') : ''), 'Mindscape'),
    chip('wp', eq ? eq.rarity + ' R' + ((e.weapons[eq.name] || {}).ref | 0) : (e.equipped === '__other__' ? 'Altra arma' : 'Arma —'), 'Arma equipaggiata'), chip('rv', e.rev.space || 'Revelation —', 'Revelation Space in uso'));
  else chips.push(chip('ov', relState(c) === 'out' ? c.rel.v.split('(')[0] : REL_NAME[relState(c)], relText(c)));
  hero.innerHTML = '<img class="dimg" src="' + c.img + '" alt="">' + '<div class="hi"><h2>' + esc(c.codename) + ' <span class="nm">' + esc(c.name) + '</span></h2><div class="sub">' + esc(c.persona) + ' · ' + stars(c.rarity) + ' ' + esc(c.type) + '<br><span class="badge el" style="--el:' + elColor(c) + '">' + esc(c.element) + '</span> ' + esc(c.position) + '<br>' + esc(relText(c)) + '<br><a href="' + c.lufel_url + '" target="_blank" rel="noopener">pagina lufel ↗</a></div><div class="hchips">' + chips.join('') + '</div></div>';
}
function renderTabs(c){
  document.getElementById('dTabs').innerHTML = tabsFor(c).map((t, i) => '<button type="button" class="dtab" role="tab" id="tab-' + t[0] + '" data-dtab="' + t[0] + '" aria-selected="' + (t[0] === ui.tab) + '" aria-controls="pane-' + t[0] + '" tabindex="' + (t[0] === ui.tab ? 0 : -1) + '"><span>' + t[1] + '</span><span class="r"><span class="cnt" hidden></span><span class="kb" aria-hidden="true">' + ((i + 1) % 10) + '</span></span></button>').join('');
}
function renderTop(c){
  const j = document.getElementById('dJump'); const by = (a, b) => a.codename.localeCompare(b.codename);
  const own = CHARS.filter(x => isOwned(x.slug)).sort(by), not = CHARS.filter(x => !isOwned(x.slug)).sort(by);
  const opt = x => '<option value="' + x.slug + '"' + (x.slug === c.slug ? ' selected' : '') + '>' + esc(x.codename) + ' — ' + esc(x.name) + '</option>';
  j.innerHTML = (own.length ? '<optgroup label="Posseduti (' + own.length + ')">' + own.map(opt).join('') + '</optgroup>' : '') + (not.length ? '<optgroup label="Non posseduti (' + not.length + ')">' + not.map(opt).join('') + '</optgroup>' : '');
  const b = document.getElementById('dBack'); const last = ui.hist[ui.hist.length - 1]; b.style.display = last ? '' : 'none'; if (last) { b.textContent = '↩ ' + BY[last].codename; b.title = 'Torna a ' + BY[last].codename; }
  const m = document.getElementById('dMode'); m.innerHTML = ui.dmode === 'all' ? '▤ <span class="lbl">Tutto in una pagina</span>' : '▦ <span class="lbl">A schede</span>'; m.setAttribute('aria-pressed', ui.dmode === 'all');
  const l = navList(); const i = l.indexOf(c.slug); document.getElementById('dPrev').title = 'Precedente: ' + BY[l[(i - 1 + l.length) % l.length]].codename + ' (←)'; document.getElementById('dNext').title = 'Successivo: ' + BY[l[(i + 1) % l.length]].codename + ' (→)';
}
function markTab(id){ document.querySelectorAll('#dTabs .dtab').forEach(b => { const on = b.dataset.dtab === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; if (on && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center' }); }); }
function setTab(id, scroll){
  const c = BY[ui.open]; if (!c || !tabsFor(c).some(t => t[0] === id)) return; ui.tab = id; markTab(id);
  const body = document.getElementById('dBody'); const pane = document.getElementById('pane-' + id); if (!pane) return;
  if (id === 'ig') { const g = pane.querySelector('.infog-grid'); if (g && !g.childElementCount) g.innerHTML = infogHTML(c); }
  if (ui.dmode === 'all') { if (scroll !== false) body.scrollTop = Math.max(0, pane.offsetTop - 6); return; }
  body.querySelectorAll('.pane').forEach(p => p.classList.toggle('on', p === pane));
  if (scroll !== false) { body.scrollTop = 0; const m = ui.dq.trim().length >= 2 ? pane.querySelector('mark') : null; if (m) m.scrollIntoView({ block: 'center' }); }
}
function setHits(txt, bad){ document.getElementById('dHits').textContent = txt; document.getElementById('dSearch').classList.toggle('nohit', !!bad); }
let searchJump = false;
function markSearch(){
  const q = ui.dq.trim().toLowerCase(); const body = document.getElementById('dBody'); let total = 0; const counts = {};
  body.querySelectorAll('.pane').forEach(p => { let n = 0;
    const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null); const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(nd => { const par = nd.parentElement; if (!par || par.closest('select,option,textarea,script,style,datalist,.ph,.sr')) return; const t = nd.nodeValue, low = t.toLowerCase(); let i = low.indexOf(q); if (i < 0 || low.length !== t.length) return;
      const frag = document.createDocumentFragment(); let last = 0;
      while (i >= 0) { if (i > last) frag.appendChild(document.createTextNode(t.slice(last, i))); const m = document.createElement('mark'); m.textContent = t.slice(i, i + q.length); frag.appendChild(m); n++; last = i + q.length; i = low.indexOf(q, last); }
      if (last < t.length) frag.appendChild(document.createTextNode(t.slice(last))); par.replaceChild(frag, nd); });
    p.querySelectorAll('.vg.vc').forEach(v => { if (v.querySelector('mark')) v.classList.remove('vc'); });
    counts[p.dataset.pane] = n; total += n; });
  document.querySelectorAll('#dTabs .dtab').forEach(b => { const n = counts[b.dataset.dtab] || 0; const cn = b.querySelector('.cnt'); cn.hidden = !n; cn.textContent = n; });
  setHits(total ? total + (total === 1 ? ' risultato' : ' risultati') : 'nessun risultato', !total);
  if (!total || !searchJump) return;
  if (ui.dmode !== 'all' && !counts[ui.tab]) { const first = tabsFor(BY[ui.open]).find(t => counts[t[0]]); if (first) setTab(first[0]); }
  else { const scope = ui.dmode === 'all' ? body : document.getElementById('pane-' + ui.tab); const m = scope && scope.querySelector('mark'); if (m) m.scrollIntoView({ block: 'center' }); }
}
const PANES = { ov: paneOverview, sk: paneSkills, aw: paneAwareness, ms: paneMindscape, wp: paneWeapons, rv: paneRevelation, tm: teamSection, st: paneStats, gd: paneGuide, ig: paneInfog };
function renderDetail(slug, keepScroll){
  const c = BY[slug]; const e = entry(slug); ui.open = slug;
  const drawer = document.getElementById('drawer'); const body = document.getElementById('dBody'); const st = keepScroll ? body.scrollTop : 0;
  const ae = document.activeElement; const fk = ae && body.contains(ae) ? ae.getAttribute('data-fk') : null;
  const tabs = tabsFor(c); if (!tabs.some(t => t[0] === ui.tab)) ui.tab = 'ov';
  drawer.classList.toggle('all', ui.dmode === 'all');
  renderHero(c, e); renderTabs(c); renderTop(c);
  body.innerHTML = tabs.map(t => '<section class="pane' + (t[0] === ui.tab ? ' on' : '') + '" id="pane-' + t[0] + '" data-pane="' + t[0] + '" role="tabpanel" aria-labelledby="tab-' + t[0] + '"><h3 class="ph">' + t[1] + '</h3>' + PANES[t[0]](c, e) + '</section>').join('') +
    '<datalist id="rsopts">' + RS_OPTS.map(o => '<option value="' + esc(o) + '">').join('') + '</datalist>';
  body.scrollTop = st;
  if (ui.dq.trim().length >= 2) markSearch(); else { setHits('', false); }
  if (fk) { const el = body.querySelector('[data-fk="' + fk.replace(/["\\]/g, '\\$&') + '"]'); if (el) el.focus({ preventScroll: true }); }
}
function refreshHero(){ if (ui.open) renderHero(BY[ui.open], entry(ui.open)); }
function refreshCheck(){ const el = document.getElementById('ovCheck'); if (el && ui.open) el.innerHTML = checkHTML(BY[ui.open], entry(ui.open)); }
let lastFocus = null;
function openDetail(slug, opts){
  const d = document.getElementById('drawer'); const wasOpen = d.classList.contains('open');
  if (!wasOpen) { ui.hist = []; ui.dq = ''; document.getElementById('dSearch').value = ''; document.querySelector('.dtop').classList.remove('showsearch'); lastFocus = document.activeElement; }
  renderDetail(slug, false);
  d.classList.add('open'); document.getElementById('overlay').classList.add('open'); d.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  if (!wasOpen) d.focus({ preventScroll: true });
}
function closeDetail(){
  ui.open = null; ui.hist = []; const d = document.getElementById('drawer'); d.classList.remove('open'); document.getElementById('overlay').classList.remove('open'); d.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus && document.body.contains(lastFocus)) { try { lastFocus.focus({ preventScroll: true }); } catch (err) {} } lastFocus = null;
}
function gotoChar(slug){ if (!BY[slug] || slug === ui.open) return; if (ui.open) { ui.hist.push(ui.open); if (ui.hist.length > 30) ui.hist.shift(); } openDetail(slug); }
function goBack(){ const s = ui.hist.pop(); if (s) openDetail(s); }
function navList(){ const arr = filteredChars().map(c => c.slug); return arr.indexOf(ui.open) >= 0 ? arr : CHARS.slice().sort((a, b) => a.codename.localeCompare(b.codename)).map(c => c.slug); }
function navStep(d){ if (!ui.open) return; const l = navList(); const i = l.indexOf(ui.open); openDetail(l[(i + d + l.length) % l.length]); }

