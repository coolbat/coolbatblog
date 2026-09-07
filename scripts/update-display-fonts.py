"""Refresh the locally hosted Noto Serif SC subset used by fixed site copy.
Requires Python 3 and uv; fonttools/brotli run in an isolated uv tool environment.
Run from the repository root: python3 scripts/update-display-fonts.py
"""
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import re
import subprocess

root = Path(__file__).resolve().parents[1]
sources = [*root.glob('src/components/**/*.astro'), *root.glob('src/layouts/**/*.astro'), *root.glob('src/pages/**/*.astro'), *root.glob('src/pages/**/*.md'), root / 'src/data/home.ts', root / 'src/utils/og-templates/site.tsx']
characters = set(chr(code) for code in range(32, 127))
for source in sources:
    characters.update(c for c in source.read_text() if '\u3000' <= c <= '\u9fff')
characters.add('·')
query = urlencode({'family': 'Noto Serif SC:wght@400;500;600', 'text': ''.join(sorted(characters)), 'display': 'swap'})
request = Request('https://fonts.googleapis.com/css2?' + query, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1'})
css = urlopen(request, timeout=45).read().decode()
urls = list(dict.fromkeys(re.findall(r'url\(([^)]+)\)', css)))
if len(urls) != 3:
    raise RuntimeError(f'Expected 3 font weights, got {len(urls)}')
staging = root / 'output/fonts'
staging.mkdir(parents=True, exist_ok=True)
(staging / 'source.css').write_text(css)
for i, url in enumerate(urls):
    data = urlopen(url, timeout=45).read()
    if data[:4] != b'\x00\x01\x00\x00':
        raise RuntimeError('Expected a TrueType font for the share-image renderer')
    target = root / 'public/fonts' / f'noto-serif-sc-display-{i}.woff2'
    source = root / 'public/fonts/noto-serif-sc-display-0.ttf' if i == 0 else staging / f'weight-{i}.ttf'
    source.write_bytes(data)
    subprocess.run(['uvx', '--from', 'fonttools', '--with', 'brotli', 'fonttools', 'ttLib.woff2', 'compress', str(source), '-o', str(target)], check=True)
    print(target.relative_to(root), target.stat().st_size, 'bytes')
