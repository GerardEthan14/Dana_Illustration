import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from compteur_club import count_members, update_page


def order(oid, customer, handles, cancelled=None):
    return {"id": oid, "cancelledAt": cancelled, "customer": {"id": customer} if customer else None,
            "lineItems": {"nodes": [{"product": {"handle": h}} for h in handles]}}


orders = [
    order("o1", "c1", ["refuge-club"]),
    order("o2", "c1", ["refuge-club"]),                 # meme personne : comptee une fois
    order("o3", "c2", ["refuge-club-enfant", "print"]),
    order("o4", "c3", ["print-cygne"]),                 # pas une formule du club
    order("o5", "c4", ["refuge-club"], "2026-11-02"),  # commande annulee
    order("o6", None, ["refuge-club"]),                 # sans compte client : comptee par commande
]
assert count_members(orders) == 3, count_members(orders)

assert update_page('<p class="eyebrow">Déjà 22 membres</p>', 25, "fr") == '<p class="eyebrow">Déjà 25 membres</p>'
assert update_page('<p>Already 22 members</p>', 1, "en") == '<p>Already 1 member</p>'
assert update_page('<p>Déjà 1 membre</p>', 2, "fr") == '<p>Déjà 2 membres</p>'
print("Tests du compteur : OK")
