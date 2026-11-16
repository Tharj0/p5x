import json, re, os, sys
from PIL import Image
sys.path.insert(0, 'data'); from wonder_it_src import PERSONA_IT, WEAPON_IT, GROUP_COMMENT_IT, CATEGORY_IT, SPECIAL_LINEUP_IT
REPO = os.environ.get('LUFEL_REPO', 'lufelnet')  # clone di github.com/absolroot/lufelnet (vedi tools/README.md)
rp = json.load(open('data/cache/recommendParty.json')); pf = json.load(open('data/cache/personaFiles.json')); mw = json.load(open('data/cache/matchWeapons.json'))
s2k = json.load(open('data/slug_to_kr.json')); k2s = {v: k for k, v in s2k.items()}
chars = json.load(open('data/characters_lufel.json')); BY = {c['slug']: c for c in chars}
EL = {'물리':'Physical','총격':'Gun','화염':'Fire','빙결':'Ice','전격':'Electric','질풍':'Wind','염동':'Psychokinesis','핵열':'Nuclear','축복':'Bless','주원':'Curse','만능':'Almighty','버프':'Buff','디버프':'Debuff'}
def ascii_name(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
os.makedirs('app/img/char', exist_ok=True); os.makedirs('app/img/persona', exist_ok=True); os.makedirs('app/img/wweapon', exist_ok=True)
def fit_webp(src, dst, H=168):
    # icone di Persona e Wonder weapon: ritaglio dei bordi trasparenti, altezza 168 px, proporzioni originali
    im = Image.open(src); im = im.convert('RGBA') if im.mode != 'RGBA' else im
    bb = im.getbbox()
    if bb: im = im.crop(bb)
    W = max(1, round(im.width * H / im.height)); im = im.resize((W, H), Image.LANCZOS); im.save(dst, 'WEBP', quality=82, method=4)
    return os.path.getsize(dst)
def save_webp(src, dst, size, crop_square=False):
    im = Image.open(src)
    if im.mode not in ('RGBA', 'RGB'): im = im.convert('RGBA')
    if crop_square:
        w, h = im.size; s = min(w, h); im = im.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
    im = im.resize(size, Image.LANCZOS)
    im.save(dst, 'WEBP', quality=80, method=6)
    return os.path.getsize(dst)
tot = 0
# 1) character cards
for slug, kr in s2k.items():
    tot += save_webp(f'{REPO}/assets/img/character-cards/{kr}.webp', f'app/img/char/{slug}.webp', (240, 402))
    BY[slug]['img'] = f'img/char/{slug}.webp'
print('cards MB', round(tot / 1048576, 2))
# 2) personas used + weapons
def code_of(kr):
    if kr == '원더': return 'WONDER'
    return BY[k2s[kr]]['codename'] if kr in k2s else kr
PERS = {}
def persona_entry(kr):
    d = pf[kr]; en = d['name_en']
    if en in PERS: return en
    img = f'{REPO}/assets/img/persona/{kr}.webp'; out = None
    if os.path.exists(img):
        out = f'img/persona/{ascii_name(en)}.webp'; fit_webp(img, 'app/' + out)
    ps = (d.get('passive_skill') or [{}])[-1]; u = d.get('uniqueSkill') or {}
    it = PERSONA_IT[en]
    PERS[en] = {'img': out, 'element': EL.get(d['element'], d['element']), 'tier': d.get('tier'), 'role': it['role'], 'talent_name': ps.get('name_en'), 'talent': it['talent'], 'unique_name': u.get('name_en'), 'unique': it['unique'], 'used_by': []}
    return en
WEAP = {}
for kr, w in mw.items():
    en = w['name_en']; img = f'{REPO}/assets/img/wonder-weapon/{kr}.webp'; out = None
    if os.path.exists(img):
        out = f'img/wweapon/{ascii_name(en)}.webp'; fit_webp(img, 'app/' + out)
    rel = w.get('release') or ''
    WEAP[en] = {'img': out, 'element': EL.get(w['element'], w['element']), 'source': w.get('where_to_get') or '—', 'release': (BY[k2s[rel]]['codename'] if rel in k2s else rel) or '—', 'order': int(w['order']) if w.get('order') else 0, 'effect': WEAPON_IT[en], 'used_by': []}
WEAP_KR = {kr: w['name_en'] for kr, w in mw.items()}
# 3) lineup italian from guides
codes = sorted({c['codename'] for c in chars} | {'WONDER'}, key=len, reverse=True)
alt = '|'.join(re.escape(c) for c in codes)
def lineup_parts(slug):
    doc = {'fuka': 'fuuka', 'navi': 'navi-oracle'}.get(slug, slug)   # nomi dei documenti del progetto
    t = open(f'knowledge/{doc}_lufel.md', encoding='utf-8').read()
    m = re.search(r"^- \*\*Lineup[^*]*\*\* — (.+)$", t, re.M)
    parts = {}
    if m:
        pieces = re.split(r"(?:^| · )(" + alt + r"): ", m.group(1))
        for i in range(1, len(pieces) - 1, 2): parts.setdefault(pieces[i], []).append(pieces[i + 1].strip())
    return parts
missing = []
for slug, kr in s2k.items():
    v = rp.get(kr, {}); team = {'friends': [], 'parties': [], 'weapons': [], 'personas': []}
    parts = lineup_parts(slug); used = {}
    for f in v.get('friends', []) or []:
        if not f.get('name'): continue
        code = code_of(f['name']); idx = used.get(code, 0); used[code] = idx + 1
        lst = parts.get(code, []); it = lst[idx] if idx < len(lst) else None
        if not it: it = SPECIAL_LINEUP_IT.get((slug, f.get('comment_en')))
        if not it: missing.append((slug, code, f.get('comment_en'))); it = f.get('comment_en')
        team['friends'].append({'slug': k2s.get(f['name']), 'code': code, 'it': it, 'A': f.get('A')})
    for p in v.get('party', []) or []:
        mem = [m for m in p.get('members', []) if m]
        if not mem: continue
        team['parties'].append([k2s.get(m) or ('wonder' if m == '원더' else m) for m in mem])
    for w in v.get('weapon', []) or []:
        w2 = w.rstrip('!').strip()
        if not w2: continue
        en = WEAP_KR[w2]; team['weapons'].append({'name': en, 'star': w.endswith('!')}); WEAP[en]['used_by'].append(slug)
    for g in v.get('persona', []) or []:
        lst = [p for p in g.get('list', []) if p.rstrip('!').strip()]
        if not lst: continue
        typ = g.get('type') or 'PERSONA'; lab, desc = CATEGORY_IT.get(typ, (typ, ''))
        ce = g.get('comment_en') or ''
        items = []
        for p in lst:
            en = persona_entry(p.rstrip('!').strip()); items.append({'name': en, 'star': p.endswith('!')})
            if slug not in PERS[en]['used_by']: PERS[en]['used_by'].append(slug)
        team['personas'].append({'type': typ, 'label': lab, 'desc': desc, 'note': GROUP_COMMENT_IT.get(ce.strip(), ce) if ce else '', 'list': items})
    BY[slug]['team'] = team
# wonder's own picks
wv = rp.get('원더', {})
wonder_self = [{'name': WEAP_KR[w.rstrip('!').strip()], 'star': w.endswith('!')} for w in wv.get('weapon', []) if w.strip()]
json.dump(chars, open('data/characters_lufel.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({'personas': PERS, 'weapons': WEAP, 'wonder_self': wonder_self}, open('data/wonder_lufel.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('missing lineup it:', missing)
print('personas', len(PERS), 'weapons', len(WEAP), 'wonder_self', wonder_self)
print('chars without team data:', [s for s in s2k if not any(BY[s]['team'][k] for k in ('friends', 'parties', 'weapons', 'personas'))])
print('no weapons:', [BY[s]['codename'] for s in s2k if not BY[s]['team']['weapons']])
