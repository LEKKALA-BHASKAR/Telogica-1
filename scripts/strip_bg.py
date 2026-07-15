#!/usr/bin/env python3
"""Remove the white studio background from product photos -> transparent PNG.

Uses border-connected flood fill so interior whites (labels, screens) are kept.
Outputs to public/products/<id>-<n>.png and rewrites src/data/products.json
to point at the local transparent images.
"""
import io, json, os, sys, urllib.request
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "products")
DATA = os.path.join(ROOT, "src", "data", "products.json")
os.makedirs(OUT_DIR, exist_ok=True)

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def strip(img: Image.Image) -> Image.Image:
    img = img.convert("RGB")
    arr = np.asarray(img).astype(np.int16)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    mx = arr.max(axis=2); mn = arr.min(axis=2)
    # "whiteish" = bright and low saturation (near white / very light gray)
    whiteish = (mn >= 232) & ((mx - mn) <= 18)

    # keep only white regions connected to the image border (the backdrop)
    lbl, n = ndimage.label(whiteish)
    border = set(lbl[0, :]) | set(lbl[-1, :]) | set(lbl[:, 0]) | set(lbl[:, -1])
    border.discard(0)
    bg = np.isin(lbl, list(border)) if border else np.zeros_like(whiteish)

    obj = ~bg
    # pull the cut in by 1px to kill the white halo fringe
    obj_eroded = ndimage.binary_erosion(obj, iterations=1, border_value=1)
    alpha = np.where(obj_eroded, 255, 0).astype(np.uint8)

    out = Image.fromarray(np.dstack([np.asarray(img), alpha]).astype(np.uint8), "RGBA")
    # soften the alpha edge a touch for clean anti-aliasing
    a = out.getchannel("A").filter(ImageFilter.GaussianBlur(0.6))
    out.putalpha(a)
    return out

def main():
    products = json.load(open(DATA))
    total = 0
    for p in products:
        new_imgs = []
        for i, url in enumerate(p.get("images", [])):
            if not url:
                continue
            local_rel = f"/products/{p['id']}-{i}.png"
            local_abs = os.path.join(OUT_DIR, f"{p['id']}-{i}.png")
            try:
                im = Image.open(io.BytesIO(fetch(url)))
                strip(im).save(local_abs, "PNG", optimize=True)
                new_imgs.append(local_rel)
                total += 1
                print(f"  ok  {p['name'][:38]:38} [{i}] -> {local_rel}")
            except Exception as e:
                print(f"  ERR {p['name'][:38]:38} [{i}] {e}", file=sys.stderr)
                new_imgs.append(url)  # fall back to remote
        p["images"] = new_imgs
    json.dump(products, open(DATA, "w"), indent=2)
    print(f"\nDone. {total} images processed across {len(products)} products.")

if __name__ == "__main__":
    main()
