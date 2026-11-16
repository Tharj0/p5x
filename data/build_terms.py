# Estrae per ogni personaggio i "termini" (nomi di skill/passive/Awareness e stati con nome) citati nei testi lufel
import json, re, sys
from collections import Counter, defaultdict
chars = json.load(open('data/characters_lufel.json', encoding='utf-8'))
def items(c):
    out = []
    for i, it in enumerate(c['ref']['skills']): out.append(('sk', i, it['t'], it['b']))
    for i, it in enumerate(c['ref']['awareness']): out.append(('aw', i, it['t'], it['b']))
    for i, w in enumerate(c['ref']['weapons']): out.append(('wp', i, w['t'], '\n'.join(w['e'])))
    for i, it in enumerate(c['ref']['attr']): out.append(('at', i, it['t'], it['b']))
    for i, it in enumerate(c['ref']['core']): out.append(('co', i, it['t'], it['b']))
    return out
TOK = r"(?:[A-Z][A-Za-z’'\-]*[A-Za-z]|[A-Z])"
CONN = r"(?:of|the|and|to|in|for|from|with|no|on|at|a|&)"
PH = re.compile(r"(?<![A-Za-zÀ-ÿ0-9’'\-\[])(" + TOK + r"(?:(?:\s+" + CONN + r")*\s+(?:" + TOK + r"))*)(?![A-Za-zÀ-ÿ0-9\]])")
BR = re.compile(r'\[([^\[\]\n]{2,60})\]')
NAME_TOK = set()
for c in chars:
    for s in (c['name'], c['codename'], c['persona']):
        for t in re.split(r"[\s·&]+", s): 
            if len(t) > 1: NAME_TOK.add(t)
NAME_TOK |= {'Wonder', 'WONDER', 'Ren', 'Riko', 'Mitsuru', 'Narumi', 'Ichigo', 'Aigis', 'Akechi', 'Kasumi', 'Futaba', 'Haru', 'Ann', 'Ryuji', 'Yusuke', 'Morgana', 'Makoto', 'Yukari', 'Akihiko', 'Fuuka', 'Junpei', 'Kotone', 'Minato', 'Arsène', 'Arsene'}
def mid_sentence(text, pos):
    j = pos - 1
    while j >= 0 and text[j] in ' \t': j -= 1
    if j < 0: return False
    return text[j] not in '.:\n·;!?(«"“—'
def title_name(kind, t):
    if kind == 'sk' or kind == 'aw':
        if ' — ' in t: return t.split(' — ', 1)[1].strip()
        if t.strip() == 'Assist Skill': return 'Assist Skill'
    return None
per = {}; df = Counter()
for c in chars:
    its = items(c); cand = Counter(); mid = Counter(); inItems = defaultdict(set); brack = Counter()
    for k, i, t, body in its:
        for m in BR.finditer(body): brack[m.group(1).strip()] += 1; inItems[m.group(1).strip()].add((k, i))
        for m in PH.finditer(body):
            ph = m.group(1)
            # togli token iniziali che sono nomi propri del personaggio / inizio frase italiano
            cand[ph] += 1; inItems[ph].add((k, i))
            if mid_sentence(body, m.start(1)): mid[ph] += 1
    titles = {}
    for k, i, t, body in its:
        n = title_name(k, t)
        if n: titles[n] = (k, i)
    per[c['slug']] = dict(cand=cand, mid=mid, inItems=inItems, brack=brack, titles=titles, its=its)
    for ph in set(cand) | set(brack): df[ph] += 1
json.dump({'df': df.most_common(400)}, open('data/cache/terms_df.json', 'w'), ensure_ascii=False)
STOP = {'Skill', 'Normal', 'Weak', 'Effect', 'Total Damage', 'Extra Action', 'Action', 'SP Recovery', 'Final Damage Amplification', 'Resonance Damage Amplification',
        'All-Out Attack Damage', 'Sleep', 'Elucidator Phantom Thieves', 'Technical Fire', 'Fire Technical', 'Ice Technical', 'Sweeper Fire', 'Ichi', 'Naruru', 'Follow-up',
        'Transfer Effect Amplification', 'Summer', 'Starlight', 'Pitch', 'Thief Tactics', 'Highlight', 'HIGHLIGHT', 'Theurgy'}
def pick(slug):
    P = per[slug]; out = {}
    for n, loc in P['titles'].items(): out[n] = {'k': 'name', 'at': loc}
    for t, n in P['brack'].items():
        if t in out or t in STOP or df[t] > 3: continue
        if n >= 2: out[t] = {'k': 'state', 'br': True}
    for ph, n in P['cand'].items():
        if ph in out or ph in STOP: continue
        toks = re.split(r"\s+", ph)
        if any(t in NAME_TOK for t in toks): continue
        if len(ph) < 4 or df[ph] > 2 or n < 2 or P['mid'][ph] < 1: continue
        if ph.isupper() and len(ph) <= 5: continue
        out[ph] = {'k': 'state'}
    return out
if __name__ == '__main__' and len(sys.argv) > 1 and sys.argv[1] == 'review':
    print('generic multiword (df>=3):', ', '.join(f'{k}({v})' for k, v in df.most_common(600) if v >= 3 and ' ' in k)[:2500])
    tot = 0
    for c in chars:
        o = pick(c['slug']); tot += len(o)
        st = [t for t, v in o.items() if v['k'] == 'state']
        print(c['slug'], '|', len(o) - len(st), 'names |', '; '.join(st))
    print('total terms', tot)

def terms_for(slug):
    o = pick(slug); res = []
    for name, v in o.items():
        if v['k'] == 'name': res.append([name, 'n', v['at'][0] + ':' + str(v['at'][1])])
        else: res.append([name, 's'])
    return res
