global.window = {};
require(require('path').resolve((process.env.LUFEL_REPO || 'lufelnet'), 'data/character_info.js'));
const cd = window.characterData;
const out = {};
for (const [k, v] of Object.entries(cd)) out[k] = { codename: v.codename, codename_en: v.codename_en, name_en: v.name_en, element: v.element };
console.log(JSON.stringify(out));
