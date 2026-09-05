# -*- coding: utf-8 -*-
"""Crop a logo out of an uploaded image down to the artwork itself.

Both school crests arrived as PNGs (named .jpg) that already carry their own
alpha, so the job is only to trim the empty space around the mark - flattening
them first is what turned the counters of VINSCHOOL's O's black. If a file has
no alpha, fall back to trimming against the paper colour in the corners.
"""
import sys
from PIL import Image

def run(src, dst, pad=14):
    im = Image.open(src)
    if im.mode != 'RGBA':
        im = im.convert('RGB')
        bg = im.getpixel((2, 2))
        mask = Image.new('L', im.size, 0)
        px, mp = im.load(), mask.load()
        for y in range(im.size[1]):
            for x in range(im.size[0]):
                p = px[x, y]
                if max(abs(p[i]-bg[i]) for i in range(3)) > 28: mp[x, y] = 255
        box = mask.getbbox()
        im = im.convert('RGBA')
    else:
        box = im.split()[3].getbbox()          # the artwork's own alpha
    if not box:
        raise SystemExit('%s: nothing to crop' % src)
    x0, y0, x1, y1 = box
    w, h = im.size
    box = (max(0, x0-pad), max(0, y0-pad), min(w, x1+pad), min(h, y1+pad))
    out = im.crop(box)
    out.save(dst)
    print('%s -> %s  %dx%d  (crop %s of %dx%d)' % (src, dst, out.size[0], out.size[1], box, w, h))

if __name__ == '__main__':
    run(sys.argv[1], sys.argv[2], *(int(a) for a in sys.argv[3:]))
