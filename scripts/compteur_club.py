"""Met a jour « Deja X membres » sur la page du Refuge Club.

Une appli privee Shopify ne peut pas lire les abonnements crees par l'appli
d'abonnement : on compte donc les personnes differentes qui ont une commande
non annulee d'une formule du club dans les derniers jours (un prelevement par mois).
Le jeton Admin (droit read_orders) vient du secret GitHub SHOPIFY_ADMIN_TOKEN.
"""
import datetime
import json
import os
import re
import sys
import urllib.request

SHOP = "u17zw5-c9.myshopify.com"
API = "2026-10"
CLUB_HANDLES = {"refuge-club", "refuge-club-enfant"}
WINDOW_DAYS = 32  # un mois de prelevement, plus un jour de marge
PAGES = {"mail-club.html": "fr", "en/mail-club.html": "en"}

QUERY = """query($after: String, $q: String) {
  orders(first: 100, after: $after, query: $q) {
    pageInfo { hasNextPage endCursor }
    nodes { id cancelledAt customer { id } lineItems(first: 20) { nodes { product { handle } } } }
  }
}"""


def fetch_orders(token, since):
    after, orders = None, []
    while True:
        body = json.dumps({"query": QUERY, "variables": {"after": after, "q": "created_at:>=" + since}}).encode()
        req = urllib.request.Request(
            "https://%s/admin/api/%s/graphql.json" % (SHOP, API), data=body,
            headers={"Content-Type": "application/json", "X-Shopify-Access-Token": token})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.load(r)
        if data.get("errors"):
            raise RuntimeError(data["errors"])
        page = data["data"]["orders"]
        orders += page["nodes"]
        if not page["pageInfo"]["hasNextPage"]:
            return orders
        after = page["pageInfo"]["endCursor"]


def count_members(orders):
    """Personnes differentes ayant une commande non annulee d'une formule du club."""
    members = set()
    for o in orders:
        if o.get("cancelledAt"):
            continue
        handles = {(li.get("product") or {}).get("handle") for li in o["lineItems"]["nodes"]}
        if handles & CLUB_HANDLES:
            members.add((o.get("customer") or {}).get("id") or o["id"])
    return len(members)


def label(n, lang):
    if lang == "fr":
        return "Déjà %d membre%s" % (n, "s" if n > 1 else "")
    return "Already %d member%s" % (n, "s" if n > 1 else "")


def update_page(html, n, lang):
    pattern = r"Déjà \d+ membres?" if lang == "fr" else r"Already \d+ members?"
    return re.sub(pattern, label(n, lang), html, count=1)


def main():
    token = os.environ.get("SHOPIFY_ADMIN_TOKEN")
    if not token:
        sys.exit("Secret SHOPIFY_ADMIN_TOKEN absent.")
    since = (datetime.date.today() - datetime.timedelta(days=WINDOW_DAYS)).isoformat()
    n = count_members(fetch_orders(token, since))
    print("Membres actifs :", n)
    if n < 1:  # plutot que d'afficher « 0 membre » sur un souci passager
        print("Aucun membre compte : page laissee telle quelle.")
        return
    for path, lang in PAGES.items():
        with open(path, encoding="utf-8") as f:
            html = f.read()
        with open(path, "w", encoding="utf-8") as f:
            f.write(update_page(html, n, lang))


if __name__ == "__main__":
    main()
