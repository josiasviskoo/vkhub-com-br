from PIL import Image, ImageChops
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[2]
base = Image.open(root / 'AD 01.png').convert('RGB')
generated = Image.open(sys.argv[1]).convert('RGB').resize(base.size, Image.Resampling.LANCZOS)
mask = Image.new('L', base.size, 0)
for y in range(290):
    mask.paste(255 if y < 270 else round(255 * (289-y)/19), (0,y,1080,y+1))
result = Image.composite(generated, base, mask)
dest = root / 'criativos-headlines' / f'AD-{int(sys.argv[2]):02}.png'
result.save(dest)
assert result.size == (1080,1080)
assert ImageChops.difference(result.crop((0,290,1080,1080)), base.crop((0,290,1080,1080))).getbbox() is None
print(dest)
