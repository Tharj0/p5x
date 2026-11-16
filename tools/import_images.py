"""Importa nel progetto le immagini che hai estratto (per esempio salvandole dal browser), ritagliate e ridimensionate.

    python tools/import_images.py persona   <cartella>   # file con il nome della Persona: «Siegfried.webp», «jack-frost.png», «지크프리트.webp»…
    python tools/import_images.py awareness <cartella>   # file a0 … a6 (qualsiasi estensione) -> stella dell'Awareness per livello
    python tools/import_images.py boss      <cartella>   # file con il nome del boss: «Nidhoggr.png», «Baal Zebul.webp»…

Poi rigenera:  python tools/build_personas.py  (solo dopo le Persona)  ·  python app/build.py  ·  python tools/build_site.py
Le immagini finiscono in app/img/persona, app/img/awareness, app/img/boss (formato webp). Se una stella A0–A6 manca,
l'app continua a usare la stella disegnata; se un boss non ha immagine resta il riquadro con le iniziali.
"""
import json, os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXT = ('.webp', '.png', '.jpg', '.jpeg', '.gif')
slug = lambda s: re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def load(path):
    im = Image.open(path); im = im.convert('RGBA') if im.mode != 'RGBA' else im
    bb = im.getbbox()
    return im.crop(bb) if bb else im


def save_height(im, dst, H):
    W = max(1, round(im.width * H / im.height)); im.resize((W, H), Image.LANCZOS).save(dst, 'WEBP', quality=84, method=5)


def save_square(im, dst, S):
    k = S / max(im.width, im.height); im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    out = Image.new('RGBA', (S, S), (0, 0, 0, 0)); out.paste(im, ((S - im.width) // 2, (S - im.height) // 2), im); out.save(dst, 'WEBP', quality=88, method=5)


def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except Exception: pass
    if len(sys.argv) != 3 or sys.argv[1] not in ('persona', 'awareness', 'boss'):
        print(__doc__); sys.exit(1)
    kind, folder = sys.argv[1], sys.argv[2]
    files = [f for f in sorted(os.listdir(folder)) if f.lower().endswith(EXT)]
    out_dir = os.path.join(ROOT, 'app', 'img', kind); os.makedirs(out_dir, exist_ok=True)
    done, skipped = [], []
    if kind == 'persona':
        pl = json.load(open(os.path.join(ROOT, 'data', 'persona_lufel.json'), encoding='utf-8'))['list']
        idx = {}
        for p in pl: idx[slug(p['en'])] = p; idx[p['k']] = p
        for f in files:
            base = os.path.splitext(f)[0]; p = idx.get(slug(base)) or idx.get(base.strip())
            if not p: skipped.append(f); continue
            save_height(load(os.path.join(folder, f)), os.path.join(out_dir, p['slug'] + '.webp'), 168); done.append(p['en'])
    elif kind == 'awareness':
        for f in files:
            m = re.search(r'a\s*([0-6])', os.path.splitext(f)[0].lower())
            if not m: skipped.append(f); continue
            save_square(load(os.path.join(folder, f)), os.path.join(out_dir, 'a%s.webp' % m.group(1)), 96); done.append('A' + m.group(1))
        missing = [i for i in range(7) if not os.path.exists(os.path.join(out_dir, 'a%d.webp' % i))]
        if missing: print('Attenzione: mancano ancora', ', '.join('A%d' % i for i in missing), '- finché non ci sono tutte e 7 l’app usa la stella disegnata.')
    else:
        for f in files:
            save_square(load(os.path.join(folder, f)), os.path.join(out_dir, slug(os.path.splitext(f)[0]) + '.webp'), 160); done.append(slug(os.path.splitext(f)[0]))
    print('Importate (%d): %s' % (len(done), ', '.join(done) or '—'))
    if skipped: print('Non riconosciute (%d): %s' % (len(skipped), ', '.join(skipped)))


if __name__ == '__main__':
    main()
