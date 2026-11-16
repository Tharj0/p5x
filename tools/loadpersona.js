// Estrae i dati delle Persona dal repo pubblico di lufel (cartella ./lufelnet o LUFEL_REPO) senza eseguirne il codice
// con accesso al sistema: ogni file viene valutato in un contesto vm isolato che vede solo `window`.
//   node tools/loadpersona.js   ->  data/cache/persona_all.json
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const REPO = process.env.LUFEL_REPO || 'lufelnet';
const ctx = vm.createContext({ window: {} });
function load(f) { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: path.basename(f), timeout: 3000 }); }
const pdir = path.join(REPO, 'data/persona');
load(path.join(pdir, 'order.js')); load(path.join(pdir, 'nonorder.js'));
for (const d of [pdir, path.join(pdir, 'nonorder')]) for (const f of fs.readdirSync(d)) { if (f.endsWith('.js') && !['index.js', 'order.js', 'nonorder.js'].includes(f)) load(path.join(d, f)); }
load(path.join(REPO, 'data/kr/wonder/skills.js'));
const w = ctx.window;
const out = { order: w.personaOrder || [], nonorder: w.personaNonOrder || [], personas: w.personaFiles || {}, skills: w.personaSkillList || {}, csv: fs.readFileSync(path.join(REPO, 'data/kr/wonder/persona_skill_from.csv'), 'utf8') };
fs.writeFileSync('data/cache/persona_all.json', JSON.stringify(out));
console.log('persona', Object.keys(out.personas).length, '| ordinate', out.order.length, '| altre', out.nonorder.length, '| skill', Object.keys(out.skills).length);
