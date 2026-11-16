"""Dati delle 159 Persona di Wonder per la scheda «Persona» del tracker.

    node tools/loadpersona.js        # estrae i dati grezzi dal repo pubblico di lufel -> data/cache/persona_all.json
    python tools/build_personas.py   # -> data/persona_lufel.json

Contiene solo dati di gioco strutturati (nomi, elemento, posizione, rarità, grado, tier, nomi delle skill,
priorità, chi insegna quali skill, come si ottiene). Le descrizioni degli effetti e i commenti di lufel NON
vengono copiati: ogni Persona ha il link alla sua pagina su lufel.net. Per le 39 Persona consigliate per Wonder
restano i testi in italiano già presenti in data/wonder_lufel.json.
"""
import csv, io, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'data', 'cache', 'persona_all.json')
OUT = os.path.join(ROOT, 'data', 'persona_lufel.json')

EL = {'물리': 'Physical', '총격': 'Gun', '화염': 'Fire', '빙결': 'Ice', '전격': 'Electric', '질풍': 'Wind', '염동': 'Psychokinesis',
      '핵열': 'Nuclear', '축복': 'Bless', '주원': 'Curse', '만능': 'Almighty'}
POS = {'지배': 'Sweeper', '반항': 'Assassin', '우월': 'Strategist', '굴복': 'Saboteur', '방위': 'Guardian', '구원': 'Medic'}
EMBLEM = {'white': 'white', 'blue': 'blue', 'purple': 'purple', 'purlple': 'purple', 'rainbow': 'rainbow'}


def ascii_name(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def main():
    d = json.load(open(SRC, encoding='utf-8'))
    P, S = d['personas'], d['skills']
    won = json.load(open(os.path.join(ROOT, 'data', 'wonder_lufel.json'), encoding='utf-8'))['personas']
    kr2en = {k: p['name_en'] for k, p in P.items()}

    def skill_en(kr):
        kr = (kr or '').strip()
        if not kr: return ''
        if kr in S and S[kr].get('name_en'): return S[kr]['name_en']
        m = re.match(r'^(.*\S)\s+(I{1,3}|IV|V|VI)$', kr)   # varianti numerate: «X III» -> nome inglese di «X I» con il numero giusto
        if m:
            for k, v in S.items():
                mm = re.match(r'^(.*\S)\s+(I{1,3}|IV|V|VI)$', k)
                if mm and mm.group(1) == m.group(1) and v.get('name_en'):
                    return re.sub(r'\s+(I{1,3}|IV|V|VI)$', '', v['name_en']) + ' ' + m.group(2)
        return kr   # nessun nome inglese su lufel: resta il nome coreano

    # tabella «come si ottiene» e skill insegnate (CSV di lufel)
    rows = {r['korean']: r for r in csv.DictReader(io.StringIO(d['csv'])) if r.get('korean') in P}

    def tokens(v):
        parts = [x.strip() for x in (v or '').split('+') if x.strip()]
        out, i = [], 0
        while i < len(parts):
            t, nxt = parts[i], parts[i + 1] if i + 1 < len(parts) else ''
            tl = t.lower()
            if tl in EMBLEM and nxt.isdigit(): out.append({'t': 'emblem', 'c': EMBLEM[tl], 'n': int(nxt)}); i += 2; continue
            if tl in ('merope', 'gacha') and nxt.isdigit(): out.append({'t': tl, 'n': int(nxt)}); i += 2; continue
            if tl == 'event': out.append({'t': 'event'})
            elif tl == 'payment': out.append({'t': 'payment'})
            elif t in P: out.append({'t': 'persona', 'en': kr2en[t]})
            else: out.append({'t': 'text', 's': t})
            i += 1
        return out

    order = {k: i for i, k in enumerate(d['order'])}
    nonorder = {k: i for i, k in enumerate(d['nonorder'])}
    teach = {}   # skill -> Persona che la insegnano
    out = []
    for k, p in P.items():
        en = p['name_en']; r = rows.get(k, {})
        gives = [skill_en(r.get(c)) for c in ('skill1', 'skill2', 'skill3', 'skill4') if (r.get(c) or '').strip()]
        for g in gives: teach.setdefault(g, []).append(en)
        img = 'img/persona/%s.webp' % ascii_name(en)
        listed = k in order or k in nonorder
        pp = p.get('passive_priority')
        e = {
            'k': k, 'en': en, 'jp': p.get('name_jp') or '', 'slug': ascii_name(en),
            'el': EL.get(p.get('element'), p.get('element') or ''), 'pos': POS.get(p.get('position'), p.get('position') or ''),
            'star': int(p.get('star') or 0), 'grade': int(p.get('grade') or 0), 'tier': p.get('tier') or None,
            'best': bool(p.get('best_persona')), 'event': bool(p.get('event')), 'rainbow': bool(p.get('wild_emblem_rainbow')),
            'main': k in order, 'ord': order[k] if k in order else (1000 + nonorder[k] if k in nonorder else 2000),
            'listed': listed, 'url': 'https://lufel.net/en/persona/%s/' % ascii_name(en) if listed else 'https://lufel.net/en/persona/',
            'img': img if os.path.exists(os.path.join(ROOT, 'app', img)) else None,
            'uq': ((p.get('uniqueSkill') or {}).get('name_en') or '').strip(),
            'hl': ((p.get('highlight') or {}).get('name_en') or '').strip(),
            'inn': [[(s.get('name_en') or s.get('name') or '').strip(), (s.get('cost') or '').replace('체력', 'HP').strip(), str(s.get('learn_level') or '')] for s in (p.get('innate_skill') or [])],
            'pas': [(s.get('name_en') or s.get('name') or '').strip() for s in (p.get('passive_skill') or [])],
            'pp': pp if isinstance(pp, int) else None,
            'rec': [[skill_en(x.get('name')), int(x.get('priority') or 0)] for x in (p.get('recommendSkill') or []) if (x.get('name') or '').strip()],
            'fus': [kr2en.get(x, x) for x in (p.get('combination') or [])],
            'acq': [tokens(r.get(c)) for c in ('combination1', 'combination2', 'combination3') if (r.get(c) or '').strip()],
            'gives': gives, 'added': p.get('added') or '',
            'wonder': en in won,
        }
        out.append(e)
    out.sort(key=lambda e: (e['ord'], e['en']))
    data = {'read': '2026-11-16', 'source': 'github.com/absolroot/lufelnet (data/persona, data/kr/wonder)', 'list': out, 'teach': teach}
    json.dump(data, open(OUT, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, separators=(',', ':'))
    print('Persona: %d (principali %d, altre %d, non in elenco %d) | con icona %d | skill insegnate %d | %d KB' % (
        len(out), sum(e['main'] for e in out), sum(e['listed'] and not e['main'] for e in out), sum(not e['listed'] for e in out),
        sum(1 for e in out if e['img']), len(teach), os.path.getsize(OUT) // 1024))


if __name__ == '__main__':
    main()
