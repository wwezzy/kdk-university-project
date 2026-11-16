"""Dependency-free checks: run python3 tests/check_links.py from any directory."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids, self.links, self.errors = set(), [], []
        self.forms = 0
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            if attrs['id'] in self.ids:
                self.errors.append('duplicate id: ' + attrs['id'])
            self.ids.add(attrs['id'])
        if tag == 'form':
            self.forms += 1
            if 'novalidate' not in attrs:
                self.errors.append('form without novalidate')
        if tag in ('input', 'textarea', 'select'):
            if any(key in attrs for key in ('required', 'pattern', 'minlength', 'maxlength', 'min', 'max')):
                self.errors.append('native constraint attribute: ' + str(attrs.get('id')))
            if attrs.get('type') == 'email':
                self.errors.append('native email validation: ' + str(attrs.get('id')))
        if tag in ('a', 'link') and attrs.get('href'):
            self.links.append(attrs['href'])
        if attrs.get('src'):
            self.links.append(attrs['src'])
        if tag == 'img' and 'alt' not in attrs:
            self.errors.append('image without alt')

pages = {path: Page(path) for path in ROOT.glob('*.html')}
errors = []
count = 0
for path, page in pages.items():
    errors.extend(f'{path.name}: {error}' for error in page.errors)
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or link.startswith('//'):
            continue
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        count += 1
        if not target.is_file():
            errors.append(f'{path.name}: missing {link}')
        elif url.fragment and target in pages and url.fragment not in pages[target].ids:
            errors.append(f'{path.name}: missing anchor {link}')
assert not errors, '\n'.join(errors)
print(f'PASS {len(pages)} HTML pages, {count} local file/anchor references, unique IDs, alt attributes, JS-only form validation.')
