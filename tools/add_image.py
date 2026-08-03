#!/usr/bin/env python3
"""Add and optimise one image for the static portfolio."""
from pathlib import Path
from PIL import Image, ImageOps
import argparse, json, re

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / 'assets/js/site-data.js'
VALID = {'people','landscape','street','wildlife','events'}

def slugify(name):
    return re.sub(r'[^a-z0-9]+', '-', Path(name).stem.lower()).strip('-')

def load_data():
    text = DATA_FILE.read_text(encoding='utf-8').strip()
    prefix = 'window.SITE_DATA = '
    if not text.startswith(prefix) or not text.endswith(';'):
        raise RuntimeError('Unexpected site-data.js format.')
    return json.loads(text[len(prefix):-1])

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('image', type=Path)
    parser.add_argument('category', choices=sorted(VALID))
    parser.add_argument('--alt', required=True, help='Accessible description of the image')
    parser.add_argument('--full', action='store_true', help='Display the image as a full-width gallery row')
    args = parser.parse_args()
    if not args.image.is_file():
        parser.error('Image file not found.')

    data = load_data()
    im = ImageOps.exif_transpose(Image.open(args.image)).convert('RGB')
    w,h = im.size
    orientation = 'landscape' if w/h >= 1.15 else ('portrait' if h/w >= 1.15 else 'square')
    base = slugify(args.image.name)
    out_dir = ROOT/'assets/images'/args.category
    out_dir.mkdir(parents=True, exist_ok=True)
    paths = {}
    for width,label,quality in [(640,'640',78),(1100,'1100',82),(1800,'1800',84)]:
        target_w = min(width,w)
        target_h = round(h * target_w / w)
        resized = im if target_w == w else im.resize((target_w,target_h), Image.Resampling.LANCZOS)
        output = out_dir/f'{base}-{label}.webp'
        if output.exists():
            raise SystemExit(f'Output already exists: {output.name}')
        resized.save(output,'WEBP',quality=quality,method=6)
        paths[label] = f'assets/images/{args.category}/{output.name}'
    entry = {
        'source': args.image.name,
        'alt': args.alt,
        'layout': 'full' if args.full else 'auto',
        'orientation': orientation,
        'width': w,
        'height': h,
        'src640': paths['640'],
        'src1100': paths['1100'],
        'src1800': paths['1800'],
    }
    data['categories'][args.category]['images'].append(entry)
    DATA_FILE.write_text('window.SITE_DATA = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    print(f'Added {args.image.name} to {args.category}.')

if __name__ == '__main__':
    main()
