"""Copie les images du portfolio Ultra-Book dans la galerie du site.

Lit https://danaillustration.ultra-book.com/portfolio, telecharge les nouvelles
images dans photo/ultrabook/ et reecrit le bloc entre les marqueurs
<!-- ultrabook:start --> et <!-- ultrabook:end --> de galerie.html et en/galerie.html.
Lance chaque jour par .github/workflows/sync-ultrabook.yml.
"""
import html
import os
import re
import sys
import urllib.request
from html.parser import HTMLParser

BASE = "https://danaillustration.ultra-book.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHOTO_DIR = os.path.join(ROOT, "photo", "ultrabook")
PAGES = {"galerie.html": "", "en/galerie.html": "../"}  # page -> prefixe des chemins
BLOCK = re.compile(r"(<!-- ultrabook:start -->).*?(\n *<!-- ultrabook:end -->)", re.S)


class Portfolio(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "figure" and "data-visuel" in a and a.get("data-grand"):
            self.items.append((a["data-grand"], (a.get("data-titre") or "").strip()))


def parse(page):
    p = Portfolio()
    p.feed(page)
    return p.items


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (site sync)"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def render(items, prefix):
    out = []
    for path, title in items:
        t = html.escape(title or "Dana Illustration")
        src = f"{prefix}photo/ultrabook/{path}"
        out.append(
            f'\n      <button class="plain-item" type="button" data-title="{t}" data-full="{src}">'
            f'\n        <img src="{src}" alt="{t}" loading="lazy">'
            + (f'\n        <span class="plain-caption">{t}</span>' if title else "")
            + "\n      </button>"
        )
    return "".join(out)


def main():
    items = parse(get(BASE + "/portfolio").decode("utf-8"))
    # Page vide ou structure changee : on ne touche a rien plutot que vider la galerie.
    if not items:
        sys.exit("Aucune image trouvee sur Ultra-Book, galerie laissee telle quelle.")

    os.makedirs(PHOTO_DIR, exist_ok=True)
    local = []
    for url, title in items:
        name = os.path.basename(url.split("?")[0])
        dest = os.path.join(PHOTO_DIR, name)
        if not os.path.exists(dest):
            data = get(BASE + url if url.startswith("/") else url)
            with open(dest, "wb") as f:
                f.write(data)
            print("nouvelle image :", name)
        local.append((name, title))

    for page, prefix in PAGES.items():
        path = os.path.join(ROOT, page)
        with open(path, encoding="utf-8") as f:
            s = f.read()
        if not BLOCK.search(s):
            sys.exit(f"Marqueurs ultrabook absents de {page}.")
        s = BLOCK.sub(lambda m: m.group(1) + render(local, prefix) + m.group(2), s, count=1)
        with open(path, "w", encoding="utf-8") as f:
            f.write(s)
    print(f"{len(local)} images Ultra-Book dans la galerie.")


if __name__ == "__main__":
    main()
