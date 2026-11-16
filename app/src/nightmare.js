/* P5X — Nightmare's Gateway (boss di gilda della settimana).
 * Legge i dati che lufel.net pubblica nel suo repository (data/external/guildboss/<regione>.json, aggiornati più volte
 * al giorno), converte gli orari della regione in ora locale e traduce in italiano modalità e regole.
 * Nessun testo di lufel viene copiato nel sito: modalità e regole sono tradotte qui, il resto (nomi, livelli,
 * debolezze, orari) è letto al momento dal file di lufel. Funziona nel tracker e nella pagina guida.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api; else root.P5XNightmare = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const SRC = 'https://raw.githubusercontent.com/absolroot/lufelnet/main/data/external/guildboss/';
  const TZ = { en: 9, kr: 9, jp: 9, cn: 8, tw: 8, sea: 8 };   // fuso degli orari nei file di lufel (come fa la loro home)
  const CACHE_KEY = 'p5x_nightmare_cache_v1';
  const norm = s => String(s || '').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  // ---------- modalità ----------
  const MODES = {
    'Multidimensional Dreamscape': { it: 'A ogni turno gli attacchi del boss diventano più forti e aumenta anche il ritmo con cui guadagni punti.' },
    'Devourer of Dreams': { it: 'Dopo aver subito una certa quantità di danni il boss entra nello stato Weakened (indebolito): attaccalo mentre è indebolito per ottenere punti extra.' },
    'Nexus of Dreams': { it: 'Più Assassin e Sweeper hai nel party, più cresce il moltiplicatore dei punti.', note: 'In pratica funziona come Multidimensional Dreamscape, ma richiede 2 Assassin, 2 Sweeper o una combinazione dei due, e non c’è il requisito di sustain.', roles: ['Assassin', 'Sweeper'], min: 2 }
  };

  // ---------- regole (affix): nome breve come su lufel + testo italiano ----------
  const CRIT = 'Gli alleati non possono infliggere colpi critici, ma il danno finale di skill e Resonance aumenta di Crit Rate × (Crit Mult − 100%) (nel calcolo il Crit Rate vale al massimo 100%).';
  const RULES = {
    "Allies are unable to deal critical hits, but deal increased final damage from skills and Resonances. This increase is equal to critical hit rate x (critical damage - 100%). (Max critical hit rate in this calculation is 100%).": { n: 'Critical Stability', it: CRIT, crit: true },
    "When allies deal damage with skills or Resonances, standard critical damage calculations are not carried out (regardless of whether or not a critical hit occurs), but deal increased final damage from skills and Resonances. This increase is equal to critical hit rate x (critical damage - 100%). (Max critical hit rate in this calculation is 100%).": { n: 'Critical Stability', it: 'Con skill e Resonance non si applica il normale calcolo dei critici (che il colpo sia critico o no): il danno finale aumenta invece di Crit Rate × (Crit Mult − 100%) (nel calcolo il Crit Rate vale al massimo 100%).', crit: true },
    "At the end of each turn, foes gain 1 Berserk stack. Berserk: Increase damage by a set amount. Stacks up to 3 times.": { n: 'Berserk', it: 'A fine turno i nemici ottengono 1 stack di Berserk. Berserk: il loro danno aumenta di un valore fisso, fino a 3 stack.' },
    "If the party contains Guardians or Medics, all foes' final damage dealt is decreased by 60% and final damage taken is increased by 20%. If not, all foes' final damage dealt is increased by 60%.": { n: 'Guardians & Medics', it: 'Se nel party c’è almeno un Guardian o un Medic, il danno finale inflitto da tutti i nemici cala del 60% e quello che subiscono aumenta del 20%. Altrimenti il danno finale inflitto dai nemici aumenta del 60%.', key: true, roles: ['Guardian', 'Medic'], min: 1 },
    "Whenever an ally deals damage, that ally's damage is increased by 4%. Lasts for 3 turns. Stacks up to 10 times.": { n: 'Continuous Attack', it: 'Ogni volta che un alleato infligge danno, il suo danno aumenta del 4% per 3 turni (fino a 10 stack).' },
    "All allies' final damage is increased based on their ailment accuracy. Final damage is increased by a maximum of 15% at 150% ailment accuracy.": { n: 'Ailment Accuracy +', it: 'Il danno finale di ogni alleato aumenta in base alla sua Ailment Accuracy: fino a +15% con il 150% di Ailment Accuracy.' },
    "Foes' damage taken is increased by 10% for each elemental ailment they have, up to 40%.": { n: 'Elemental Ailment', it: 'Il danno subito dai nemici aumenta del 10% per ogni alterazione elementale che hanno addosso, fino al 40%.' },
    "Foes' damage taken is increased by 3% for each debuff they have, up to 45%.": { n: 'Debuff Stacking', it: 'Il danno subito dai nemici aumenta del 3% per ogni debuff che hanno addosso, fino al 45%.' },
    "Foes' damage taken is increased by 6% for each debuff they are inflicted with, up to 30%.": { n: 'Debuff Domain', it: 'Il danno subito dai nemici aumenta del 6% per ogni debuff che hanno addosso, fino al 30%.' },
    "When any ally receives healing, their final damage is increased by 8%. Lasts for 2 turns. Stacks up to 4 times.": { n: 'Healing', it: 'Quando un alleato riceve una cura, il suo danno finale aumenta dell’8% per 2 turni (fino a 4 stack).' },
    "After all allies gain a shield, their final Resonance damage is increased by 8%. Lasts for 3 turns. Stacks up to 8 times.": { n: 'Scudo → Resonance', it: 'Quando tutti gli alleati ottengono uno scudo, il loro danno finale di Resonance aumenta dell’8% per 3 turni (fino a 8 stack).' },
    "When allies are on an extra action, critical rate is increased by 20%, and critical damage is increased by 20%.": { n: 'Azione extra', it: 'Durante le azioni extra degli alleati, Crit Rate +20% e Crit Mult +20%.' },
    "Shielded allies deal 20% increased damage.": { n: 'Shield +', it: 'Gli alleati con uno scudo infliggono il 20% di danno in più.' },
    "Party's Resonance critical damage is increased by 25% and Attack by 25%.": { n: 'Resonance ++', it: 'Il danno critico della Resonance del party aumenta del 25% e l’Attack del 25%.' },
    "After the boss takes an action, all allies are inflicted with Intimidation. When Intimidation is removed, all foes are inflicted with Intimidation. Intimidation: Defense decreases by 10%, up to 50%.": { n: 'Intimidation', it: 'Dopo ogni azione del boss tutti gli alleati subiscono Intimidation; quando l’Intimidation viene rimossa, la subiscono tutti i nemici. Intimidation: Defense −10% per stack, fino a −50%.' },
    "When the party has 2 or more Sweeper or Assassin allies, all allies' final damage is increased by 20%.": { n: 'Nexus of Dreams', it: 'Se nel party ci sono almeno 2 alleati Sweeper o Assassin, il danno finale di tutti gli alleati aumenta del 20%.', roles: ['Sweeper', 'Assassin'], min: 2 },
    "When an ally's current HP percentage is low, increase damage. When HP is at 40%, increase damage up to a maximum of 50%.": { n: 'HP bassi', it: 'Più sono bassi gli HP attuali di un alleato, più aumenta il suo danno: con il 40% di HP l’aumento arriva al massimo, +50%.' },
    "Allies' Theurgy damage is increased by 30%. After using a Theurgy, user's damage is increased by 30% more for 3 turns.": { n: 'Theurgy +', it: 'Il danno Theurgy degli alleati aumenta del 30%. Dopo aver usato una Theurgy, il danno di chi l’ha usata aumenta di un altro 30% per 3 turni.' },
    "Allies' Theurgy damage is increased by 30%. After using a Theurgy, user's final damage is increased by 30% more for 3 turns.": { n: 'Theurgy +', it: 'Il danno Theurgy degli alleati aumenta del 30%. Dopo aver usato una Theurgy, il danno finale di chi l’ha usata aumenta di un altro 30% per 3 turni.' },
    "When a foe is knocked down, increase final damage by 80%.": { n: 'Down', it: 'Quando un nemico va a terra (Down), il danno finale aumenta dell’80%.' },
    "When the party activates a Technical, Attack is increased by 25% and critical damage by 25%.": { n: 'Technical +', it: 'Quando il party attiva un Technical, Attack +25% e danno critico +25%.' },
    "Foes inflicted with Burn take 20% increased damage.": { n: 'Burn +', it: 'I nemici in stato Burn subiscono il 20% di danno in più.' }
  };
  const ELEMENTS = { Physical: 'Physical', Gun: 'Gun', Fire: 'Fire', Ice: 'Ice', Electric: 'Electric', Wind: 'Wind', Psy: 'Psychokinesis', Psychokinesis: 'Psychokinesis', Nuclear: 'Nuclear', Bless: 'Bless', Curse: 'Curse', Almighty: 'Almighty' };
  const ROLES = ['Sweeper', 'Assassin', 'Strategist', 'Saboteur', 'Guardian', 'Medic', 'Elucidator', 'Virtuoso'];
  const KEYED = {}; Object.keys(RULES).forEach(k => { KEYED[norm(k)] = RULES[k]; });

  function rule(detail) {
    const d = norm(detail); if (KEYED[d]) return Object.assign({ en: d }, KEYED[d]);
    let m = d.match(/^Party's (\w+) damage is increased by (\d+)%\.$/);
    if (m && ELEMENTS[m[1]]) return { n: m[1] + ' +', it: 'Il danno ' + m[1] + ' del party aumenta del ' + m[2] + '%.', el: ELEMENTS[m[1]], en: d };
    if (m) return { n: m[1] + ' +', it: 'Il danno ' + m[1] + ' del party aumenta del ' + m[2] + '%.', en: d };
    m = d.match(/^(\w+) allies' damage is increased by (\d+)%\.$/);
    if (m && ROLES.indexOf(m[1]) >= 0) return { n: m[1] + ' +', it: 'Il danno degli alleati ' + m[1] + ' aumenta del ' + m[2] + '%.', roles: [m[1]], min: 1, bonus: true, en: d };
    return { n: 'Regola', it: null, en: d };   // nuova: si mostra il testo originale finché non viene tradotta
  }
  function toDate(ts, region) {
    const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(ts || '').trim());
    return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4] - (TZ[region] ?? 9), +m[5], +(m[6] || 0))) : null;
  }
  const ADAPT = [['Weak', 'Debole a'], ['Resistant', 'Resiste a'], ['Nullify', 'Annulla'], ['Absorb', 'Assorbe'], ['Reflect', 'Riflette']];
  function view(data, region) {
    if (!data || !Array.isArray(data.boss)) return null;
    const mode = (data.mode && data.mode.name) || '';
    return {
      region: region, mode: mode, modeEn: norm(data.mode && data.mode.detail), modeIt: MODES[mode] || null,
      start: toDate(data.startTime, region), end: toDate(data.endTime, region),
      bosses: data.boss.map(b => { const e = b.enemy || {}, a = e.adapt || {};
        return { name: e.name || '?', slug: slug(e.name), level: e.level || '', adapt: ADAPT.map(x => [x[0], x[1], (a[x[0]] || []).map(el => ELEMENTS[el] || el)]).filter(x => x[2].length), rules: (b.affixs || []).map(x => rule(x.detail)) }; })
    };
  }
  async function fetchData(region, f) {
    const r = await (f || fetch)(SRC + region + '.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json(); if (!j || !j.data) throw new Error('dati non validi');
    return j.data;
  }
  function readCache(storage) { try { return JSON.parse(storage.getItem(CACHE_KEY) || 'null'); } catch (e) { return null; } }
  function writeCache(storage, region, data) { try { storage.setItem(CACHE_KEY, JSON.stringify({ at: new Date().toISOString(), region: region, data: data })); } catch (e) { /* */ } }

  // ---------- presentazione ----------
  const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  const GG = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  function when(d) { if (!d) return '—'; return GG[d.getDay()] + ' ' + d.getDate() + ' ' + MESI[d.getMonth()] + ' alle ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function left(d, now) {
    if (!d) return ''; let ms = d - (now || Date.now()); if (ms <= 0) return 'terminato';
    const g = Math.floor(ms / 864e5); ms -= g * 864e5; const h = Math.floor(ms / 36e5); ms -= h * 36e5; const mi = Math.floor(ms / 6e4);
    return 'termina tra ' + (g ? g + ' g ' : '') + (g || h ? h + ' h ' : '') + (g ? '' : mi + ' min');
  }
  /* opts: { mine: [{slug, codename, element, position, img}] | null, charAttr: slug -> attributi HTML del link al personaggio,
             bossImg: slug -> url | null, compact: bool, guideHref: url, status: testo sulla provenienza dei dati } */
  function render(v, opts) {
    opts = opts || {};
    if (!v) return '<div class="ng-empty">Dati del Nightmare’s Gateway non disponibili al momento.</div>';
    const now = Date.now(), ended = v.end && v.end <= now;
    const elc = el => '<span class="ng-el" style="--el:var(--el-' + esc(String(el).split(' ')[0]) + ')">' + esc(el) + '</span>';
    let h = '<div class="ng-head"><span class="ng-tag">Nightmare’s Gateway</span><b class="ng-mode">' + esc(v.mode || 'modalità sconosciuta') + '</b>' +
      '<span class="ng-time' + (ended ? ' ended' : '') + '" data-ngend="' + (v.end ? v.end.getTime() : '') + '">' + esc(ended ? 'terminato ' + when(v.end) : left(v.end, now)) + '</span>' +
      (v.end && !ended ? '<span class="ng-dates">fino a ' + esc(when(v.end)) + ' (ora del tuo dispositivo)</span>' : '') + '</div>';
    h += '<div class="ng-mdesc">' + (v.modeIt ? esc(v.modeIt.it) + (v.modeIt.note ? '<span class="ng-note">' + esc(v.modeIt.note) + '</span>' : '') : esc(v.modeEn) + ' <i>(testo originale)</i>') + '</div>';
    const mine = typeof opts.mine === 'function' ? opts.mine() : (opts.mine || null);
    const hasEl = (c, el) => String(c.element || '').split('/').map(x => ELEMENTS[x.trim()] || x.trim()).indexOf(el) >= 0;
    h += '<div class="ng-bosses">' + v.bosses.map(b => {
      const img = opts.bossImg && opts.bossImg(b.slug);
      const weak = (b.adapt.find(a => a[0] === 'Weak') || [0, 0, []])[2];
      let s = '<div class="ng-boss"><div class="ng-bh">' + (img ? '<img class="ng-bi" src="' + esc(img) + '" alt="">' : '<span class="ng-bi ng-ph" aria-hidden="true">' + esc(b.name.replace(/[^A-Za-z ]/g, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()) + '</span>') +
        '<div><div class="ng-bn">' + esc(b.name) + (b.level ? ' <span class="ng-lv">Lv ' + esc(b.level) + '</span>' : '') + '</div>' +
        b.adapt.map(a => '<div class="ng-ad ' + a[0].toLowerCase() + '"><span>' + a[1] + '</span>' + a[2].map(elc).join('') + '</div>').join('') + '</div></div>';
      s += '<div class="ng-rules">' + b.rules.map(r => '<details class="ng-r' + (r.key ? ' key' : '') + '"' + (r.key && !opts.compact ? ' open' : '') + '><summary>' + (r.key ? '<span class="ng-k">condizione chiave</span>' : '') + esc(r.n) + '</summary><div>' + (r.it ? esc(r.it) : esc(r.en) + ' <i>(testo originale, regola nuova non ancora tradotta)</i>') + '</div></details>').join('') + '</div>';
      if (mine) {
        const pick = f => mine.filter(f);
        const rows = [];
        if (weak.length) rows.push(['Debolezza ' + weak.join(' / '), pick(c => weak.some(el => hasEl(c, el)))]);
        b.rules.filter(r => r.el && weak.indexOf(r.el) < 0).forEach(r => rows.push([r.n, pick(c => hasEl(c, r.el))]));
        b.rules.filter(r => r.roles).forEach(r => { const l = pick(c => r.roles.indexOf(c.position) >= 0); rows.push([r.n + (r.min > 1 ? ' (ne servono ' + r.min + ')' : '') + (r.key ? ' — condizione chiave' : ''), l, r.key || (r.min && l.length < r.min)]); });
        if (v.modeIt && v.modeIt.roles && !b.rules.some(r => r.n === 'Nexus of Dreams')) rows.push([v.mode + ' (ne servono ' + v.modeIt.min + ')', pick(c => v.modeIt.roles.indexOf(c.position) >= 0), true]);
        s += '<div class="ng-mine"><div class="ng-mt">I tuoi personaggi utili</div>' + (mine.length ? rows.map(r => '<div class="ng-mr' + (r[2] && !r[1].length ? ' miss' : '') + '"><span class="ng-ml">' + esc(r[0]) + '</span>' + (r[1].length ? r[1].map(c => '<span class="ng-c"' + (opts.charAttr ? ' ' + opts.charAttr(c.slug) : '') + '>' + esc(c.codename) + '</span>').join('') : '<span class="ng-none">nessuno tra i tuoi</span>') + '</div>').join('') : '<div class="ng-none">Segna i personaggi che possiedi per vedere chi ti serve.</div>') + '</div>';
      }
      return s + '</div>';
    }).join('') + '</div>';
    h += '<div class="ng-foot">Dati: lufel.net (server Global) · ' + esc(opts.status || '') + (opts.guideHref ? ' · <a href="' + esc(opts.guideHref) + '">tutte le modalità e le regole ›</a>' : '') + '</div>';
    return h;
  }
  function catalogue() {   // pagina guida: tutte le modalità e regole note
    const seen = {}; const list = [];
    const names = {};
    Object.keys(RULES).forEach(k => { const r = RULES[k]; const key = r.n + '|' + r.it; if (seen[key]) return; seen[key] = 1; names[r.n] = (names[r.n] || 0) + 1; list.push(names[r.n] > 1 ? Object.assign({}, r, { n: r.n + ' (variante)' }) : r); });
    list.push({ n: '<Elemento> +', it: 'Il danno di quell’elemento del party aumenta del 20% (es. Bless +, Fire +, Psy +).' });
    list.push({ n: '<Posizione> +', it: 'Il danno degli alleati di quella posizione aumenta del 20% (es. Sweeper +, Assassin +).' });
    list.push({ n: 'Resonance + / Highlight +', it: 'Il danno Resonance o Highlight del party aumenta del 50%.' });
    return { modes: MODES, rules: list.sort((a, b) => (b.key ? 1 : 0) - (a.key ? 1 : 0) || a.n.localeCompare(b.n)) };
  }
  /* avvio: mostra subito i dati salvati, poi quelli aggiornati; aggiorna il conto alla rovescia ogni minuto */
  function mount(el, opts) {
    const region = (opts && opts.region) || 'en', storage = (opts && opts.storage) || null;
    let last = null;
    const draw = (data, status) => { last = [data, status]; el.innerHTML = render(view(data, region), Object.assign({}, opts, { status: status })); if (opts && opts.after) opts.after(el); };
    const cached = storage ? readCache(storage) : null;
    if (cached && cached.region === region) draw(cached.data, 'salvati ' + when(new Date(cached.at)));
    else if (opts && opts.snapshot) draw(opts.snapshot, 'copia del sito, in aggiornamento…');
    else el.innerHTML = '<div class="ng-empty">Carico il Nightmare’s Gateway da lufel…</div>';
    const refresh = () => fetchData(region, opts && opts.fetch).then(d => { if (storage) writeCache(storage, region, d); draw(d, 'aggiornati ' + when(new Date())); })
      .catch(() => { const c = storage ? readCache(storage) : null; if (c && c.region === region) draw(c.data, 'offline: dati salvati ' + when(new Date(c.at))); else if (opts && opts.snapshot) draw(opts.snapshot, 'offline: copia del sito'); else el.innerHTML = '<div class="ng-empty">Non riesco a leggere i dati da lufel (sei offline?). Riprova più tardi.</div>'; });
    refresh();
    setInterval(() => { el.querySelectorAll('[data-ngend]').forEach(t => { const e = +t.dataset.ngend; if (e) t.textContent = e <= Date.now() ? 'terminato' : left(new Date(e)); }); }, 60000);
    return { refresh: refresh, redraw: () => { if (last) draw(last[0], last[1]); } };
  }
  return { SRC, TZ, MODES, RULES, rule, toDate, view, render, catalogue, mount, fetchData, when, left };
});
