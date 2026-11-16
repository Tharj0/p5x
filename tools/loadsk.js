const fs = require('fs'); const path = require('path');
global.window = {};
const s2k = JSON.parse(fs.readFileSync('data/slug_to_kr.json', 'utf8'));
const out = {};
for (const [slug, kr] of Object.entries(s2k)) {
  const d = path.join((process.env.LUFEL_REPO || 'lufelnet'), 'data/characters', kr); const o = {};
  for (const f of ['skill.js', 'ritual.js', 'weapon.js']) { try { eval(fs.readFileSync(path.join(d, f), 'utf8')); } catch (e) { o['err_' + f] = String(e).slice(0, 100); } }
  o.skill_en = (window.enCharacterSkillsData || {})[kr] || null; o.skill_kr = (window.characterSkillsData || {})[kr] || null;
  o.ritual_en = (window.enCharacterRitualData || {})[kr] || null; o.ritual_kr = (window.ritualData || {})[kr] || null;
  o.weapon_en = (window.enCharacterWeaponData || {})[kr] || null;
  out[slug] = o;
}
fs.writeFileSync('data/cache/lufel_skills_src.json', JSON.stringify(out));
const v = out.violet; console.log(JSON.stringify(v.skill_en, null, 1).slice(0, 3500)); console.log(JSON.stringify(v.ritual_en, null, 1).slice(0, 1800));
console.log('missing en skill:', Object.keys(out).filter(s => !out[s].skill_en), 'missing en ritual:', Object.keys(out).filter(s => !out[s].ritual_en));
