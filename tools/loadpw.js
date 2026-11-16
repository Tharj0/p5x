global.window = {}; const fs = require('fs'), path = require('path');
const pdir = path.join((process.env.LUFEL_REPO || 'lufelnet'), 'data/persona');
for (const f of fs.readdirSync(pdir)) { if (!f.endsWith('.js')) continue; try { eval(fs.readFileSync(path.join(pdir, f), 'utf8')); } catch (e) { console.error('ERRP', f, e.message); } }
eval(fs.readFileSync(path.join((process.env.LUFEL_REPO || 'lufelnet'), 'data/kr/wonder/weapons.js'), 'utf8'));
const pf = window.personaFiles || {}; const keys = {};
Object.values(pf).forEach(p => Object.keys(p).forEach(k => keys[k] = (keys[k] || 0) + 1));
const wk = {}; Object.values(window.matchWeapons).forEach(w => Object.keys(w).forEach(k => wk[k] = (wk[k] || 0) + 1));
console.log(JSON.stringify({ personas: Object.keys(pf).length, keys, weapons: Object.keys(window.matchWeapons).length, wk, otherWindow: Object.keys(window) }));
fs.writeFileSync('data/cache/personaFiles.json', JSON.stringify(pf)); fs.writeFileSync('data/cache/matchWeapons.json', JSON.stringify(window.matchWeapons));
