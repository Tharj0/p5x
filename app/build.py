"""Genera l'app tracker a partire da app/template.html.

    python app/build.py          -> app/index.html  (versione locale, con le infografiche Najox)

La versione pubblica per GitHub Pages (senza Najox) si genera con  python tools/build_site.py,
che usa build_html(public=True) di questo file.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_URL = 'https://tharj0.github.io/p5x/'


def js(o):
    return json.dumps(o, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def load_chars():
    chars = json.load(open(os.path.join(ROOT, 'data/characters_lufel.json'), encoding='utf-8'))
    # stat base per Awareness (dal testo "Stats" delle guide lufel)
    for c in chars:
        st = c['ref'].get('stats') or ''; base = {}
        for lv in ('LV80', 'LV100'):
            m = re.search(r'- ' + lv + r' \(HP / ATK / DEF\): (.+)', st)
            if m:
                rows = re.findall(r'A(\d) (\d+) / (\d+) / (\d+)', m.group(1))
                if len(rows) == 7 and [r[0] for r in rows] == list('0123456'): base[lv.lower()] = [[int(r[1]), int(r[2]), int(r[3])] for r in rows]
        m = re.search(r'- Base \(LV1\): (.+)', st)
        if m: base['lv1'] = m.group(1).strip()
        m = re.search(r'- Hidden Ability LV7: (.+)', st)
        if m: base['hidden'] = m.group(1).strip()
        c['base'] = base
    assert all('rel' in c for c in chars)
    # termini con descrizione al passaggio del mouse (nomi di skill/passive/Awareness e stati citati nei testi)
    cwd = os.getcwd(); os.chdir(ROOT)
    try:
        sys.path.insert(0, os.path.join(ROOT, 'data')); argv = sys.argv; sys.argv = sys.argv[:1]
        import build_terms
        sys.argv = argv
        for c in chars: c['terms'] = build_terms.terms_for(c['slug'])
    finally:
        os.chdir(cwd)
    return chars


def build_html(public=False, head=''):
    """public=True: versione per GitHub Pages, senza dati e sezioni delle infografiche Najox."""
    chars = load_chars()
    rev = json.load(open(os.path.join(ROOT, 'data/revelations_lufel.json'), encoding='utf-8'))
    won = json.load(open(os.path.join(ROOT, 'data/wonder_lufel.json'), encoding='utf-8'))
    pers = json.load(open(os.path.join(ROOT, 'data/persona_lufel.json'), encoding='utf-8'))
    t = open(os.path.join(ROOT, 'app/template.html'), encoding='utf-8').read()
    sync_js = open(os.path.join(ROOT, 'app/src/ghsync.js'), encoding='utf-8').read()
    assert '</script' not in sync_js.lower()
    ng_js = open(os.path.join(ROOT, 'app/src/nightmare.js'), encoding='utf-8').read()
    assert '</script' not in ng_js.lower()
    # immagini opzionali aggiunte dall'utente con tools/import_images.py
    aw_dir = os.path.join(ROOT, 'app/img/awareness'); boss_dir = os.path.join(ROOT, 'app/img/boss')
    aw_img = all(os.path.exists(os.path.join(aw_dir, 'a%d.webp' % i)) for i in range(7))
    boss_imgs = sorted(f[:-5] for f in os.listdir(boss_dir) if f.endswith('.webp')) if os.path.isdir(boss_dir) else []
    # marcatori Najox: <!--NAJOX-->html<!--/NAJOX-->  e  /*NAJOX*/codice locale/*NAJOX-ELSE*/codice pubblico/*/NAJOX*/
    js_najox = re.compile(r'/\*NAJOX\*/(.*?)/\*NAJOX-ELSE\*/(.*?)/\*/NAJOX\*/', re.S)
    if public:
        for c in chars: c['infographics'] = []
        t = re.sub(r'<!--NAJOX-->.*?<!--/NAJOX-->', '', t, flags=re.S)
        t = js_najox.sub(lambda m: m.group(2), t)
        site = {'public': True, 'guideBase': 'guide/', 'sw': True, 'awImg': aw_img, 'bossImgs': boss_imgs}
    else:
        t = t.replace('<!--NAJOX-->', '').replace('<!--/NAJOX-->', '')
        t = js_najox.sub(lambda m: m.group(1), t)
        site = {'public': False, 'guideBase': SITE_URL + 'guide/', 'sw': False, 'awImg': aw_img, 'bossImgs': boss_imgs}
    html = (t.replace('__CHARS__', js(chars)).replace('__REV__', js(rev)).replace('__WONDER__', js(won)).replace('__PERSONAS__', js(pers))
             .replace('/*__GHSYNC__*/', sync_js).replace('/*__NIGHTMARE__*/', ng_js).replace('__SITE__', js(site)).replace('<!--__HEAD__-->', head))
    for ph in ('__CHARS__', '__REV__', '__WONDER__', '__PERSONAS__', '__GHSYNC__', '__NIGHTMARE__', '__SITE__', '__HEAD__'):
        assert ph not in html, ph
    if public:
        assert 'najox' not in html.lower(), 'riferimenti Najox rimasti nella versione pubblica'
    return html, chars


if __name__ == '__main__':
    html, chars = build_html(public=False)
    open(os.path.join(ROOT, 'app/index.html'), 'w', encoding='utf-8', newline='\n').write(html)
    print('terms:', sum(len(c['terms']) for c in chars), '| index.html', len(html.encode()) // 1024, 'KB', '| base lv80:', sum(1 for c in chars if c['base'].get('lv80')), 'lv100:', sum(1 for c in chars if c['base'].get('lv100')))
