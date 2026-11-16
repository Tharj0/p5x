global.window = {};
const fs = require('fs'), path = require('path');
const base = path.join((process.env.LUFEL_REPO || 'lufelnet'), 'data/characters');
const keys = {}, partyKeys = {}, friendKeys = {}, personaKeys = {};
for (const d of fs.readdirSync(base)) {
  const f = path.join(base, d, 'party.js'); if (!fs.existsSync(f)) continue;
  try { eval(fs.readFileSync(f, 'utf8')); } catch (e) { console.error('ERR', d, e.message); continue; }
}
const rp = window.recommendParty;
for (const [k, v] of Object.entries(rp)) {
  Object.keys(v).forEach(x => keys[x] = (keys[x] || 0) + 1);
  (v.party || []).forEach(p => Object.keys(p).forEach(x => partyKeys[x] = (partyKeys[x] || 0) + 1));
  (v.friends || []).forEach(p => Object.keys(p).forEach(x => friendKeys[x] = (friendKeys[x] || 0) + 1));
  (v.persona || []).forEach(p => Object.keys(p).forEach(x => personaKeys[x] = (personaKeys[x] || 0) + 1));
}
console.log(JSON.stringify({ n: Object.keys(rp).length, keys, partyKeys, friendKeys, personaKeys }));
fs.writeFileSync('data/cache/recommendParty.json', JSON.stringify(rp));
