"""Génère la version anglaise du site (dossier en/) à partir des pages françaises.

À relancer après chaque modification d'une page française :
    python3 traduction/generer_en.py
Un texte français sans traduction dans traduction/en.py arrête le script et est listé :
il suffit de l'ajouter à EN (ou à KEEP s'il est identique en anglais), puis de relancer.
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from en import EN, KEEP, TECH_ATTRS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://danaillustration.be/'
# Le Sanctuaire (jeu) reste en français : les pages anglaises y mènent quand même.
PAGES = ['index', 'boutique', 'petits-soigneurs', 'mail-club', 'galerie', 'apropos', 'ateliers', 'calendrier',
         'cgv', 'confidentialite', 'mentions-legales', 'musee', 'retours']
# Blocs jamais traduits : code, styles, dessins, commentaires.
RAW = re.compile(r'(?s)(<script\b.*?</script>|<style\b.*?</style>|<svg\b.*?</svg>|<!--.*?-->)')
ATTR = re.compile(r'\b(alt|aria-label|title|placeholder|content|data-[\w-]+)="([^"]*)"')
PATH_ATTR = re.compile(r'\b(href|src|srcset|data-full)="([^"]*)"')
missing = set()


def tr(text):
    if not re.search(r'[A-Za-zÀ-ÿ]', text) or text in KEEP:
        return text
    if text in EN:
        return EN[text]
    missing.add(text)
    return text


def translate_chunk(s):
    def attr(m):
        k, v = m.groups()
        if k in TECH_ATTRS or (k == 'content' and not re.search(r'[a-zé] [a-zé]', v)):
            return m.group(0)
        return '%s="%s"' % (k, tr(v))
    s = ATTR.sub(attr, s)

    def text(m):
        t = m.group(1)
        core = t.strip()
        if not core:
            return m.group(0)
        i = t.index(core)
        return '>' + t[:i] + tr(core) + t[i + len(core):] + '<'
    return re.sub(r'>([^<>]*)<', text, s)


def fix_path(v):
    """Chemins relatifs depuis en/ : les pages traduites restent en anglais, le reste remonte d'un dossier."""
    if re.match(r'^(https?:|mailto:|tel:|#|/|data:|\.\./)', v) or not v:
        return v
    page = re.match(r'^([\w-]+)\.html', v)
    if page and page.group(1) in PAGES:
        return v
    return '../' + v


def switcher(page, lang):
    fr_href = ('../' if lang == 'en' else '') + page + '.html'
    en_href = ('' if lang == 'en' else 'en/') + page + '.html'
    fr = '<span class="lang-active">FR</span>' if lang == 'fr' else '<a href="%s" hreflang="fr" lang="fr">FR</a>' % fr_href
    en = '<span class="lang-active">EN</span>' if lang == 'en' else '<a href="%s" hreflang="en" lang="en">EN</a>' % en_href
    return '<div class="lang-switcher" aria-label="Langue / Language">%s%s</div>' % (fr, en)


def add_lang_links(s, page, lang, fr_url, en_url):
    s = re.sub(r'\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">', '', s)
    alt = ('\n  <link rel="alternate" hreflang="fr" href="%s">\n  <link rel="alternate" hreflang="en" href="%s">'
           '\n  <link rel="alternate" hreflang="x-default" href="%s">') % (fr_url, en_url, fr_url)
    s = re.sub(r'(<link rel="canonical" href="[^"]*">)', lambda m: m.group(1) + alt, s, count=1)
    s = re.sub(r'<div class="lang-switcher".*?</div>\s*', '', s)
    s = s.replace('<div class="nav-actions">', '<div class="nav-actions">\n        ' + switcher(page, lang), 1)
    return s


def build(page):
    path = os.path.join(ROOT, page + '.html')
    fr = open(path, encoding='utf-8').read()
    canon = re.search(r'<link rel="canonical" href="([^"]*)">', fr)
    fr_url = canon.group(1) if canon else SITE + page + '.html'
    en_url = SITE + 'en/' + ('' if page == 'index' else page + '.html')

    # la page française reçoit le sélecteur de langue et les liens hreflang
    fr = add_lang_links(fr, page, 'fr', fr_url, en_url)

    parts = RAW.split(fr)
    en = ''.join(p if RAW.fullmatch(p) else translate_chunk(p) for p in parts)
    en = en.replace('<html lang="fr">', '<html lang="en">', 1).replace('content="fr_BE"', 'content="en_GB"')
    en = re.sub(r'(<link rel="canonical" href=")[^"]*', lambda m: m.group(1) + en_url, en, count=1)
    en = re.sub(r'(<meta property="og:url" content=")[^"]*', lambda m: m.group(1) + en_url, en, count=1)
    en = re.sub(r'(name="_subject" value="[^"]*)"', r'\1 (EN)"', en)
    en = add_lang_links(en, page, 'en', fr_url, en_url)

    def path_attr(m):
        k, v = m.groups()
        if k == 'srcset':
            return '%s="%s"' % (k, ', '.join(fix_path(x.strip()) for x in v.split(',')))
        return '%s="%s"' % (k, fix_path(v))
    en = PATH_ATTR.sub(path_attr, en)
    return fr, en


def main():
    out = {page: build(page) for page in PAGES}
    if missing:
        print('Textes sans traduction (à ajouter dans traduction/en.py) :')
        for t in sorted(missing):
            print('  ' + t)
        sys.exit(1)
    os.makedirs(os.path.join(ROOT, 'en'), exist_ok=True)
    for page, (fr, en) in out.items():
        open(os.path.join(ROOT, page + '.html'), 'w', encoding='utf-8').write(fr)
        open(os.path.join(ROOT, 'en', page + '.html'), 'w', encoding='utf-8').write(en)
    print('%d pages anglaises générées dans en/' % len(out))


if __name__ == '__main__':
    main()
