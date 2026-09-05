#!/usr/bin/env python3
"""
Strip the flat background off a logo and write a transparent PNG.

    python3 tools/prep-logo.py <input> <output.png>

Flood-fills inward from the four edges, clearing every pixel that is close in
colour to the corners — that removes a white/solid card without eating the
white *inside* the artwork (Vinschool's page, NCCU's inner ring), because those
regions are never reached from an edge. Edges are then feathered so the sticker
keyline the page draws around it doesn't look jagged.

The white outline itself is NOT baked in: index.html draws it from this file's
alpha channel, so the same PNG stays reusable elsewhere.
"""
import sys
from collections import deque
from PIL import Image, ImageFilter

TOL = 32          # how far from the corner colour still counts as background
FEATHER = 0.6     # px of alpha blur

def main(src, dst):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()

    corners = [px[0, 0], px[w-1, 0], px[0, h-1], px[w-1, h-1]]
    bg = max(set(corners), key=corners.count)[:3]

    def is_bg(p):
        return (abs(p[0]-bg[0]) + abs(p[1]-bg[1]) + abs(p[2]-bg[2])) <= TOL * 3

    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h-1):
            if is_bg(px[x, y]): q.append((x, y)); seen[y*w+x] = 1
    for y in range(h):
        for x in (0, w-1):
            if is_bg(px[x, y]) and not seen[y*w+x]: q.append((x, y)); seen[y*w+x] = 1

    cleared = 0
    while q:
        x, y = q.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0); cleared += 1
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x+dx, y+dy
            if 0 <= nx < w and 0 <= ny < h and not seen[ny*w+nx] and is_bg(px[nx, ny]):
                seen[ny*w+nx] = 1; q.append((nx, ny))

    r, g, b, a = im.split()
    im.putalpha(a.filter(ImageFilter.GaussianBlur(FEATHER)))
    im = im.crop(im.getbbox() or (0, 0, w, h))     # trim to the artwork
    im.save(dst, "PNG", optimize=True)
    print(f"{src} -> {dst}  bg={bg}  cleared {cleared*100//(w*h)}%  final {im.size[0]}x{im.size[1]}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
