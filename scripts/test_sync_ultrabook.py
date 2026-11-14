import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from sync_ultrabook import BLOCK, parse, render

page = '''<figure data-visuel data-grand="/books/x/source/a.jpg" data-titre="Le cygne">
<figure data-visuel data-grand="/books/x/source/b.png" data-titre="">
<figure class="autre">'''
items = parse(page)
assert items == [("/books/x/source/a.jpg", "Le cygne"), ("/books/x/source/b.png", "")], items

out = render([("a.jpg", "L'ours & co"), ("b.png", "")], "../")
assert 'src="../photo/ultrabook/a.jpg"' in out
assert "L&#x27;ours &amp; co" in out
assert out.count("plain-caption") == 1  # pas de legende vide

s = "x\n  <!-- ultrabook:start -->OLD\n  <!-- ultrabook:end -->\ny"
s = BLOCK.sub(lambda m: m.group(1) + "NEW" + m.group(2), s)
assert s == "x\n  <!-- ultrabook:start -->NEW\n  <!-- ultrabook:end -->\ny", s
print("ok")
