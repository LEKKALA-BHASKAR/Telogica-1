#!/usr/bin/env python3
"""Resize + WebP-compress the bundled product PNGs and the hero image.

Product cards render small, so max 720px is plenty (2x retina). WebP keeps the
alpha channel from the background-stripped PNGs at a fraction of the size.
"""
import json, os, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROD = os.path.join(ROOT, "public", "products")
DATA = os.path.join(ROOT, "src", "data", "products.json")

def resize(im, maxpx):
    w, h = im.size
    if max(w, h) <= maxpx:
        return im
    s = maxpx / max(w, h)
    return im.resize((round(w * s), round(h * s)), Image.LANCZOS)

# products -> webp with alpha
saved = 0
for png in glob.glob(os.path.join(PROD, "*.png")):
    im = Image.open(png).convert("RGBA")
    im = resize(im, 720)
    webp = png[:-4] + ".webp"
    im.save(webp, "WEBP", quality=82, method=6)
    os.remove(png)
    saved += 1
print(f"products: {saved} -> webp")

# rewrite data paths .png -> .webp
products = json.load(open(DATA))
for p in products:
    p["images"] = [i.replace("/products/", "/products/").replace(".png", ".webp")
                   if i.startswith("/products/") else i for i in p.get("images", [])]
json.dump(products, open(DATA, "w"), indent=2)
print("data: image paths -> .webp")

# hero -> webp (no alpha needed; full-bleed)
hero_png = os.path.join(ROOT, "public", "hero-pcb.png")
if os.path.exists(hero_png):
    im = Image.open(hero_png).convert("RGB")
    im = resize(im, 2000)
    im.save(os.path.join(ROOT, "public", "hero-pcb.webp"), "WEBP", quality=80, method=6)
    os.remove(hero_png)
    print("hero -> webp")
