"""Genera le icone del sito (site/icons/) con Pillow. Basta eseguirlo una volta: le PNG sono nel repository.
    python tools/make_icons.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'site', 'icons')
BG, RED, WHITE = (10, 10, 10), (214, 0, 28), (255, 255, 255)


def font(size):
    for f in ('C:/Windows/Fonts/arialbd.ttf', 'C:/Windows/Fonts/segoeuib.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/Library/Fonts/Arial Bold.ttf'):
        if os.path.exists(f): return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def draw_icon(size, maskable=False):
    s = 4 * size   # disegno in grande e riduco: bordi più puliti
    im = Image.new('RGB', (s, s), BG); d = ImageDraw.Draw(im)
    pad = int(s * (0.16 if maskable else 0.06))
    # «biglietto» rosso inclinato, sfondo scuro
    w = s - 2 * pad
    d.polygon([(pad + w * 0.06, pad + w * 0.18), (pad + w * 0.96, pad + w * 0.04), (pad + w * 0.94, pad + w * 0.84), (pad + w * 0.02, pad + w * 0.96)], fill=RED)
    f = font(int(w * 0.36)); txt = 'P5X'
    bb = d.textbbox((0, 0), txt, font=f); tw, th = bb[2] - bb[0], bb[3] - bb[1]
    d.text((s / 2 - tw / 2 - bb[0], s / 2 - th / 2 - bb[1]), txt, font=f, fill=WHITE, stroke_width=max(2, s // 160), stroke_fill=BG)
    return im.resize((size, size), Image.LANCZOS)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name, size, mask in (('icon-32.png', 32, False), ('icon-192.png', 192, False), ('icon-512.png', 512, False), ('icon-maskable-512.png', 512, True), ('apple-touch-icon.png', 180, True)):
        draw_icon(size, mask).save(os.path.join(OUT, name), optimize=True)
        print(name)
