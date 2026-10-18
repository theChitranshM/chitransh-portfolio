# contact sheet: python3 scripts/montage.py shots mobile out.png [cols] [width]
import sys, glob
from PIL import Image
d, prefix, out = sys.argv[1], sys.argv[2], sys.argv[3]
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 4
w = int(sys.argv[5]) if len(sys.argv) > 5 else 300
files = sorted(glob.glob(f"{d}/{prefix}-*.png"))
ims = [Image.open(f).convert("RGB") for f in files]
h = int(ims[0].height * w / ims[0].width)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w + (cols - 1) * 6, rows * h + (rows - 1) * 6), "white")
for i, im in enumerate(ims):
    sheet.paste(im.resize((w, h), Image.LANCZOS), ((i % cols) * (w + 6), (i // cols) * (h + 6)))
sheet.save(out)
print(out, sheet.size)
