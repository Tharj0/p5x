"""Genera il sito statico per GitHub Pages nella cartella docs/.

    python tools/build_site.py

Contenuto di docs/ (rigenerata da zero a ogni esecuzione, tranne CNAME):
  index.html              tracker (versione pubblica: senza infografiche Najox, sincronizzazione GitHub)
  img/char|persona|wweapon immagini usate dal tracker (mai le infografiche app/img/*--*.webp)
  guide/                  lettore delle guide di knowledge/ (una pagina per guida + indice con filtri)
  manifest.webmanifest, icons/, sw.js   installazione su telefono e funzionamento offline
Alla fine controlla che non siano finiti nel sito file o testi Najox e che non ci siano token.
"""
import hashlib, html, json, os, re, shutil, sys

import markdown
from markdown.extensions.toc import slugify_unicode

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, 'docs')
SITE = os.path.join(ROOT, 'site')
KNOW = os.path.join(ROOT, 'knowledge')
sys.path.insert(0, os.path.join(ROOT, 'app'))
import build  # noqa: E402  (app/build.py)

KEEP = {'CNAME'}
EXTRA_DOCS = [  # altri documenti di knowledge/ pubblicati come guide (roster_tracker.md è un documento tecnico: escluso)
    ('indice_guide_lufel.md', 'indice', 'Indice completo', 'tabella di tutti i personaggi'),
    ('release_schedule_lufel.md', 'uscite', 'Release Schedule', 'ordine e date di uscita'),
    ('wonder_persona_armi_lufel.md', 'wonder', 'Wonder: Persona e armi', 'Persona e Wonder weapon consigliate'),
]
EL_KEY = lambda e: 'WindIce' if e.startswith('Wind/Ice') else e.split(' ')[0]
MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
esc = lambda s: html.escape(str(s if s is not None else ''), quote=True)
brk = lambda s: re.sub(r'([\u00b7-])', r'\1<wbr>', esc(s))   # nomi lunghi: a capo dopo «·» o «-»


def fmt_date(iso):
    y, m, d = iso.split('-'); return '%d %s %s' % (int(d), MESI[int(m) - 1], y)


def head_tags(prefix, title, desc):
    return ('<meta name="description" content="%s">\n<link rel="manifest" href="%smanifest.webmanifest">\n<meta name="theme-color" content="#d6001c">\n'
            '<link rel="icon" type="image/png" sizes="32x32" href="%sicons/icon-32.png">\n<link rel="apple-touch-icon" href="%sicons/apple-touch-icon.png">\n'
            '<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="P5X">' % (esc(desc), prefix, prefix, prefix))


# ---------- Markdown -> HTML (HTML grezzo disattivato: il testo viene sempre mostrato come testo) ----------
URL_RE = re.compile(r'(?<![<(\[`"=/])\bhttps?://[^\s<>()\[\]`"|]+')


def autolink(text):
    parts = re.split(r'(`[^`\n]*`)', text)
    for i in range(0, len(parts), 2):
        def rep(m):
            u = m.group(0); core = u.rstrip('.,;:·'); return '<' + core + '>' + u[len(core):]
        parts[i] = URL_RE.sub(rep, parts[i])
    return ''.join(parts)


def render_md(text):
    md = markdown.Markdown(extensions=['tables', 'sane_lists', 'toc'], extension_configs={'toc': {
        'slugify': slugify_unicode, 'toc_depth': '2-3', 'permalink': '#', 'permalink_class': 'hl', 'permalink_title': 'Link a questa sezione'}})
    md.preprocessors.deregister('html_block')
    md.inlinePatterns.deregister('html')
    out = md.convert(autolink(text))
    out = out.replace('<table>', '<div class="tw"><table>').replace('</table>', '</table></div>')
    out = re.sub(r'<a href="(https?://[^"]+)">', r'<a href="\1" target="_blank" rel="noopener">', out)
    return out, md.toc_tokens


def toc_html(tokens):
    if not tokens: return ''
    h2 = [t for t in tokens if t['level'] == 2] or tokens
    n3 = sum(len(t.get('children') or []) for t in h2)
    def li(t, deep):
        sub = ''
        if deep and t.get('children'):
            sub = '<ul>' + ''.join('<li><a href="#%s">%s</a></li>' % (esc(c['id']), c['name']) for c in t['children']) + '</ul>'
        return '<li><a href="#%s">%s</a>%s</li>' % (esc(t['id']), t['name'], sub)
    return '<aside class="toc"><details open><summary>Sezioni</summary><nav><ul>' + ''.join(li(t, n3 <= 30) for t in h2) + '</ul></nav></details></aside>'


def page(title, body, desc, wide=False, top_extra=''):
    return ('<!DOCTYPE html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<title>%s</title>\n%s\n<link rel="stylesheet" href="guide.css">\n</head>\n<body>\n'
            '<header class="gtop"><a class="brand" href="index.html">📖 Guide P5X</a><a href="../index.html">← Tracker</a><a href="index.html">Tutte le guide</a><span class="sp"></span>%s</header>\n'
            '%s\n<button class="totop" type="button" aria-label="Torna su">↑</button>\n'
            '<footer class="gfoot">Guide in italiano basate sui dati di lufel.net (letti il 14–16 novembre 2026). Nomi di skill, Awareness, armi, set e stat in inglese come su lufel.net. Immagini da lufel.net (asset di gioco © ATLUS/SEGA/Perfect World Games). Sito non affiliato a lufel.net né a SEGA/ATLUS/Perfect World.</footer>\n'
            '<script src="guide.js"></script>\n<script>if (\'serviceWorker\' in navigator && (location.protocol === \'https:\' || location.hostname === \'localhost\' || location.hostname === \'127.0.0.1\')) navigator.serviceWorker.register(\'../sw.js\').catch(function () {});</script>\n'
            '</body>\n</html>\n') % (esc(title), head_tags('../', title, desc), top_extra, body)


def build_guides(chars):
    gdir = os.path.join(DOCS, 'guide'); os.makedirs(gdir)
    for f in ('guide.css', 'guide.js'): shutil.copy(os.path.join(SITE, f), gdir)
    # nome del file in knowledge/ -> pagina del sito (per i riferimenti `claude/<file>.md` nei testi)
    pages = {}
    for c in chars: pages[os.path.basename(c['doc'])] = (c['slug'] + '.html', 'guida ' + c['codename'])
    for fn, slug, label, _ in EXTRA_DOCS: pages[fn] = (slug + '.html', label)

    def links(h):
        def rep(m):
            p = pages.get(m.group(1))
            return '<a href="%s">%s</a>' % (p[0], esc(p[1])) if p else m.group(0)
        return re.sub(r'<code>(?:claude|knowledge)/([\w.-]+\.md)</code>', rep, h)

    def split_h1(h):
        m = re.match(r'\s*<h1[^>]*>(.*?)</h1>\s*', h, re.S)
        return (m.group(1), h[m.end():]) if m else ('', h)

    order = sorted(chars, key=lambda c: c['codename'].lower())
    for i, c in enumerate(order):
        src = os.path.join(KNOW, os.path.basename(c['doc']))
        body, tokens = render_md(open(src, encoding='utf-8').read())
        h1, body = split_h1(links(body))
        out_of_glb = c['rel']['d'] > TODAY
        meta = ('<span class="badge el" style="--el:var(--el-%s)">%s</span><span class="badge">%s</span><span class="badge">%s</span><span class="badge">%s</span>'
                % (EL_KEY(c['element']), esc(c['element']), esc(c['position']), '★' * int(c['rarity']), esc(c['type'])) +
                '<span class="badge%s">%s · %s%s</span>' % (' nr' if out_of_glb else '', esc(c['rel']['v']), '≈ ' if c['rel'].get('st') in ('upcoming', 'future') else '', fmt_date(c['rel']['d'])))
        hero = ('<div class="ghero"><img src="../img/char/%s.webp" alt="" width="116" height="194"><div><h1>%s</h1><div class="src">%s · %s</div><div class="meta">%s</div></div></div>'
                % (c['slug'], brk(c['codename']) + ' <span style="color:var(--muted);font-weight:400;font-size:.7em">' + esc(c['name']) + '</span>', 'Persona: ' + esc(c['persona']), esc(c.get('reswk') or ''), meta))
        prv, nxt = order[i - 1], order[(i + 1) % len(order)]
        pn = '<nav class="pn"><a href="%s.html">← %s</a><a href="%s.html">%s →</a></nav>' % (prv['slug'], esc(prv['codename']), nxt['slug'], esc(nxt['codename']))
        top = '<a class="pri" href="../index.html#c=%s">Apri nel tracker</a><a href="%s" target="_blank" rel="noopener">lufel ↗</a>' % (c['slug'], esc(c['lufel_url']))
        doc = '<div class="gwrap">%s<main class="doc">%s%s%s</main></div>' % (toc_html(tokens), hero, body, pn)
        title = '%s — guida (lufel, in italiano) · P5X' % c['codename']
        open(os.path.join(gdir, c['slug'] + '.html'), 'w', encoding='utf-8', newline='\n').write(page(title, doc, 'Guida di %s per Persona 5X: build, skill, Awareness, armi e team (dati lufel.net, in italiano).' % c['codename'], top_extra=top))
    for fn, slug, label, sub in EXTRA_DOCS:
        body, tokens = render_md(open(os.path.join(KNOW, fn), encoding='utf-8').read())
        h1, body = split_h1(links(body))
        doc = '<div class="gwrap">%s<main class="doc"><h1>%s</h1>%s</main></div>' % (toc_html(tokens), h1, body)
        open(os.path.join(gdir, slug + '.html'), 'w', encoding='utf-8', newline='\n').write(page(label + ' · Guide P5X', doc, label + ' — Persona 5X (dati lufel.net, in italiano).'))
    # indice
    els = sorted({c['element'] for c in chars})
    poss = sorted({c['position'] for c in chars})
    cards = []
    for c in order:
        q = ' '.join([c['codename'], c['name'], c['persona'], c['element'], c['position'], c['type'], c.get('tags') or '', c['slug']])
        cards.append('<a class="gcard" href="%s.html" data-el="%s" data-pos="%s" data-rar="%s" data-reld="%s" data-name="%s" data-q="%s"><img src="../img/char/%s.webp" alt="" loading="lazy"><span class="gi"><b>%s</b><span class="nm">%s</span><span class="meta"><span class="badge el" style="--el:var(--el-%s)">%s</span><span class="badge">%s</span><span class="badge">%s</span><span class="badge relb">%s</span></span></span></a>'
                     % (c['slug'], esc(c['element']), esc(c['position']), c['rarity'], c['rel']['d'], esc(c['codename'].lower()), esc(q), c['slug'], brk(c['codename']), esc(c['name']), EL_KEY(c['element']), esc(c['element']), esc(c['position']), '★' * int(c['rarity']), esc(c['rel']['v'].split('(')[0])))
    chip = lambda f, vals, lab: '<div class="chips" data-f="%s">%s</div>' % (f, ''.join('<button type="button" class="chip" data-v="%s">%s</button>' % (esc(v), lab(v)) for v in vals))
    body = ('<div class="gwrap wide"><main>'
            '<div class="ihead"><h1>Guide P5X</h1><p>%d personaggi di Persona 5X: The Phantom X — tutto il contenuto delle pagine di lufel.net in italiano: setup consigliato, skill, Awareness, stat, armi, Mindscape, team.</p></div>'
            '<div class="ilinks">%s</div>'
            '<div class="ibar"><input type="search" id="iq" placeholder="Cerca per nome, codename, Persona, elemento, ruolo, tag…" aria-label="Cerca tra le guide">'
            '<select id="isort" aria-label="Ordina"><option value="name">Ordina: nome</option><option value="new">Ordina: uscita (più recenti)</option><option value="old">Ordina: uscita (dal lancio)</option></select>'
            '<button type="button" class="chip" id="ireset">Azzera filtri</button></div>'
            '<div class="ibar">%s</div><div class="ibar">%s%s%s</div>'
            '<div class="icount" id="icount"></div><div class="ggrid" id="ggrid">%s</div><p class="empty" id="iempty" hidden>Nessuna guida con questi filtri.</p>'
            '</main></div>') % (
        len(chars),
        ''.join('<a href="%s.html">%s<small>%s</small></a>' % (s, esc(l), esc(sub)) for _, s, l, sub in EXTRA_DOCS),
        chip('el', els, lambda v: '<i style="--el:var(--el-%s)"></i>%s' % (EL_KEY(v), esc(v))),
        chip('pos', poss, esc), chip('rar', ['5', '4'], lambda v: v + '★'), chip('rel', ['out', 'soon'], lambda v: 'Già usciti' if v == 'out' else 'In arrivo'),
        ''.join(cards))
    open(os.path.join(gdir, 'index.html'), 'w', encoding='utf-8', newline='\n').write(page('Guide P5X — tutti i personaggi (lufel, in italiano)', body, 'Guide in italiano di tutti i personaggi di Persona 5X: The Phantom X, dai dati di lufel.net.'))
    return len(order) + len(EXTRA_DOCS) + 1


def main():
    # 1. pulizia (docs/ contiene solo file generati)
    if os.path.isdir(DOCS):
        for n in os.listdir(DOCS):
            if n in KEEP: continue
            p = os.path.join(DOCS, n)
            shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    os.makedirs(DOCS, exist_ok=True)
    # 2. tracker (versione pubblica)
    app_html, chars = build.build_html(public=True, head=head_tags('', 'Roster P5X', 'Tracker personale del roster di Persona 5X: The Phantom X, con le guide lufel in italiano.'))
    open(os.path.join(DOCS, 'index.html'), 'w', encoding='utf-8', newline='\n').write(app_html)
    # 3. immagini (solo card, Persona e Wonder weapon)
    for sub in ('char', 'persona', 'wweapon'):
        shutil.copytree(os.path.join(ROOT, 'app', 'img', sub), os.path.join(DOCS, 'img', sub), ignore=shutil.ignore_patterns('*--*'))
    # 4. guide
    n_guides = build_guides(chars)
    # 5. file statici
    shutil.copy(os.path.join(SITE, 'manifest.webmanifest'), DOCS)
    shutil.copytree(os.path.join(SITE, 'icons'), os.path.join(DOCS, 'icons'))
    open(os.path.join(DOCS, '.nojekyll'), 'w').close()
    open(os.path.join(DOCS, '404.html'), 'w', encoding='utf-8', newline='\n').write(
        '<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Pagina non trovata · P5X</title>'
        '<style>body{margin:0;background:#0a0a0a;color:#f4f4f4;font:16px/1.6 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;text-align:center;border-top:6px solid #d6001c}h1{font:italic 900 30px "Arial Black",Impact,sans-serif;text-transform:uppercase;background:#d6001c;color:#fff;display:inline-block;padding:4px 24px;transform:rotate(-2deg)}a{color:#ff2e45}</style></head>'
        '<body><main><h1>Pagina non trovata</h1><p><a href="/p5x/">Vai al tracker</a> · <a href="/p5x/guide/">Vai alle guide</a></p></main></body></html>\n')
    # 6. service worker: elenco dei file da tenere offline + versione = impronta dei contenuti
    files = []
    for dp, dn, fn in os.walk(DOCS):
        for f in fn:
            rel = os.path.relpath(os.path.join(dp, f), DOCS).replace(os.sep, '/')
            if rel in ('sw.js', '404.html', '.nojekyll', 'CNAME'): continue
            files.append(rel)
    files.sort()
    h = hashlib.sha256()
    for rel in files: h.update(rel.encode()); h.update(open(os.path.join(DOCS, rel), 'rb').read())
    version = h.hexdigest()[:12]
    core = ['./', 'guide/'] + files
    sw = open(os.path.join(SITE, 'sw.js'), encoding='utf-8').read().replace('__VERSION__', version).replace('__CORE__', json.dumps(core, ensure_ascii=False))
    open(os.path.join(DOCS, 'sw.js'), 'w', encoding='utf-8', newline='\n').write(sw)
    # 7. controlli
    problems = []
    tok = re.compile(r'github_pat_[A-Za-z0-9_]{20,}|\bgh[pousr]_[A-Za-z0-9]{30,}')
    for dp, dn, fn in os.walk(DOCS):
        for f in fn:
            p = os.path.join(dp, f); rel = os.path.relpath(p, DOCS)
            if '--' in f: problems.append('file Najox nel sito: ' + rel)
            if f.endswith(('.html', '.js', '.css', '.webmanifest', '.json')):
                t = open(p, encoding='utf-8').read()
                if 'najox' in t.lower(): problems.append('testo Najox in ' + rel)
                if tok.search(t): problems.append('possibile token in ' + rel)
    for ref in set(re.findall(r'img/(?:char|persona|wweapon)/[^"\\ )]+', app_html)):
        if not os.path.exists(os.path.join(DOCS, ref)): problems.append('immagine mancante: ' + ref)
    if problems:
        print('PROBLEMI:\n  ' + '\n  '.join(problems)); sys.exit(1)
    size = sum(os.path.getsize(os.path.join(DOCS, f)) for f in files)
    print('docs/ pronto: tracker + %d pagine guida, %d file (%.1f MB), versione %s' % (n_guides, len(files), size / 1048576, version))


import datetime  # noqa: E402
TODAY = datetime.date.today().isoformat()

if __name__ == '__main__':
    main()
