// ===== Shop carousel arrows (looping) =====
document.querySelectorAll('.shop-carousel').forEach(c => {
  const track = c.querySelector('.shop-cards');
  if (!track) return;
  const step = () => {
    const card = track.querySelector('.shop-card');
    if (!card) return track.clientWidth;
    const cs = getComputedStyle(track);
    const gap = parseFloat(cs.columnGap || cs.gap || 0);
    return card.offsetWidth + gap;
  };
  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  const atStart = () => track.scrollLeft <= 4;
  c.querySelector('.shop-arrow-prev')?.addEventListener('click', () => {
    if (atStart()) track.scrollTo({left: track.scrollWidth, behavior: 'smooth'});
    else track.scrollBy({left: -step(), behavior: 'smooth'});
  });
  c.querySelector('.shop-arrow-next')?.addEventListener('click', () => {
    if (atEnd()) track.scrollTo({left: 0, behavior: 'smooth'});
    else track.scrollBy({left: step(), behavior: 'smooth'});
  });
});

// ===== Pied de page : vrais logos de paiement + réseaux sociaux =====
// Injecté en JS (le pied de page est répété sur chaque page) ; les pastilles
// texte présentes dans le HTML servent de repli si le JS ne s'exécute pas.
(function () {
  // Réseaux sociaux. Ajoute/complète les liens ici quand tu as les autres URL.
  var SOCIALS = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/dana_illustration',
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2"/></svg>'
    }
  ];

  // Logos de paiement (SVG inline, rendus reconnaissables et homogènes).
  var tile = function (inner, bg) {
    return '<svg viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="40" height="24" rx="4" fill="' + (bg || '#ffffff') + '"/>' + inner + '</svg>';
  };
  var PAYMENTS = [
    { name: 'Apple Pay', svg: tile(
      '<path transform="translate(7.5 5.2) scale(0.5)" fill="#000" d="M9.6 3.2c.5-.6.8-1.4.7-2.2-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.4-.7 2.2.8.06 1.6-.4 2.1-1.1zm.7 1.2c-1.2-.07-2.2.66-2.7.66-.6 0-1.4-.63-2.3-.62-1.2.02-2.3.69-2.9 1.74-1.2 2.1-.3 5.2.9 6.9.6.83 1.3 1.76 2.2 1.73.9-.04 1.2-.57 2.3-.57s1.4.57 2.3.55c1-.02 1.6-.85 2.2-1.68.7-.96.98-1.9.99-1.95-.02-.01-1.9-.73-1.92-2.9-.02-1.81 1.48-2.68 1.55-2.72-.85-1.25-2.17-1.39-2.64-1.42z"/>' +
      '<text x="23" y="16" font-family="Helvetica,Arial,sans-serif" font-size="9" font-weight="600" fill="#000">Pay</text>'
    ) },
    { name: 'Bancontact', svg: tile(
      '<text x="20" y="15.5" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="7" font-weight="700" fill="#005498">Bancontact</text>'
    ) },
    { name: 'Google Pay', svg: tile(
      '<text x="11" y="16" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="11" font-weight="700" fill="#4285F4">G</text>' +
      '<text x="26" y="16" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="9" font-weight="600" fill="#5F6368">Pay</text>'
    ) },
    { name: 'Mastercard', svg: tile(
      '<circle cx="16" cy="12" r="6.2" fill="#EB001B"/>' +
      '<circle cx="24" cy="12" r="6.2" fill="#F79E1B" fill-opacity="0.92"/>'
    ) },
    { name: 'Maestro', svg: tile(
      '<circle cx="16" cy="12" r="6.2" fill="#0099DF"/>' +
      '<circle cx="24" cy="12" r="6.2" fill="#ED0006" fill-opacity="0.9"/>'
    ) },
    { name: 'Klarna', svg: tile(
      '<text x="20" y="16" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="8.5" font-weight="700" fill="#17120F">Klarna</text>',
      '#FFB3C7'
    ) },
    { name: 'UnionPay', svg: tile(
      '<rect x="6" y="6" width="9" height="12" rx="2" fill="#E21836"/>' +
      '<rect x="15.5" y="6" width="9" height="12" rx="2" fill="#00447C"/>' +
      '<rect x="25" y="6" width="9" height="12" rx="2" fill="#007B84"/>'
    ) },
    { name: 'Visa', svg: tile(
      '<text x="20" y="16" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="10" font-weight="700" font-style="italic" fill="#1A1F71">VISA</text>'
    ) }
  ];

  function enhanceFooter() {
    document.querySelectorAll('.site-footer').forEach(function (footer) {
      // Logos de paiement
      var pay = footer.querySelector('.footer-payments');
      if (pay) {
        pay.innerHTML = PAYMENTS.map(function (p) {
          return '<li class="pay" aria-label="' + p.name + '">' + p.svg + '</li>';
        }).join('');
      }
      // Barre réseaux sociaux (insérée avant les moyens de paiement)
      var inner = footer.querySelector('.footer-inner');
      if (inner && SOCIALS.length && !inner.querySelector('.footer-social')) {
        var nav = document.createElement('nav');
        nav.className = 'footer-social';
        nav.setAttribute('aria-label', 'Réseaux sociaux');
        nav.innerHTML = SOCIALS.map(function (s) {
          return '<a href="' + s.href + '" target="_blank" rel="noopener" aria-label="' + s.name + '">' + s.svg + '</a>';
        }).join('');
        if (pay) inner.insertBefore(nav, pay);
        else inner.appendChild(nav);
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceFooter);
  } else {
    enhanceFooter();
  }
})();

/* ============================================================
   Boutique pilotée par les collections Shopify
   ------------------------------------------------------------
   - Un onglet est créé automatiquement pour chaque collection.
   - Convention de nommage pour les sous-catégories :
       "Prints"        -> onglet "Prints" (sans sous-menu)
       "Prints / A5"   -> onglet "Prints", entrée "A5" dans le menu déroulant
       "Prints / A4"   -> se range sous le même onglet "Prints"
   - Les produits sont affichés par le composant "collection" de Shopify :
     ajoute un produit à une collection sur Shopify, il apparaît tout seul.
   ============================================================ */
function el(tag, className) {
  var n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

function subBtn(sub, label, active) {
  var li = el('li');
  var b = el('button', 'shop-subcat-btn' + (active ? ' is-active' : ''));
  b.type = 'button';
  b.dataset.sub = sub;
  b.setAttribute('role', 'menuitem');
  b.textContent = label;
  li.appendChild(b);
  return li;
}

// Le composant "collection" de Shopify attend un id numérique, alors que
// collection.fetchAll() renvoie un GID (parfois encodé en base64). On extrait
// l'id numérique pour les deux formats.
function numericId(id) {
  var s = String(id == null ? '' : id);
  if (s.indexOf('gid://') === -1) {
    try {
      var dec = atob(s);
      if (dec.indexOf('gid://') !== -1) s = dec;
    } catch (e) { /* pas du base64 : on garde tel quel */ }
  }
  var m = s.match(/(\d+)\D*$/);
  return m ? m[1] : s;
}

// Regroupe les collections en catégories (parent) + sous-catégories (enfant)
// d'après la convention "Parent / Enfant".
function groupCollections(collections) {
  var order = [];
  var map = {};
  collections.forEach(function (col) {
    var title = (col.title || '').trim();
    if (!title) return;
    var parts = title.split(/\s*\/\s*/);
    var parent = parts[0].trim();
    var child = parts.length >= 2 ? parts.slice(1).join(' / ').trim() : '';
    if (!map[parent]) {
      map[parent] = { label: parent, items: [] };
      order.push(parent);
    }
    map[parent].items.push({ id: col.id, sub: child });
  });
  return order.map(function (k) { return map[k]; });
}

function buildBoutique(root, client, ui) {
  root.innerHTML = '<p class="shop-loading">Chargement de la boutique…</p>';
  client.collection.fetchAll(250).then(function (collections) {
    // On exclut la collection "Frontpage" générée automatiquement par Shopify.
    collections = (collections || []).filter(function (c) {
      return c.handle !== 'frontpage' && (c.title || '').trim().toLowerCase() !== 'home page';
    });
    if (!collections.length) {
      root.innerHTML = '<p class="shop-empty">La boutique sera bientôt disponible 🌿</p>';
      return;
    }
    renderBoutique(root, groupCollections(collections), ui);
  }).catch(function (err) {
    root.innerHTML = '<p class="shop-empty">Impossible de charger la boutique pour le moment.</p>';
    console.error('Erreur de chargement des collections Shopify :', err);
  });
}

function renderBoutique(root, groups, ui) {
  root.innerHTML = '';
  var nav = el('nav', 'shop-cats');
  nav.setAttribute('aria-label', 'Catégories de la boutique');
  var panels = el('div', 'shop-panels');

  groups.forEach(function (group, gi) {
    var active = gi === 0;
    var catId = 'cat-' + gi;

    // --- Pastille de catégorie (+ liste déroulante éventuelle) ---
    var catEl = el('div', 'shop-cat' + (active ? ' is-active' : ''));
    catEl.dataset.cat = catId;

    var btn = el('button', 'shop-cat-btn');
    btn.type = 'button';
    btn.textContent = group.label;
    btn.setAttribute('aria-expanded', active ? 'true' : 'false');
    catEl.appendChild(btn);

    var hasSubs = group.items.some(function (it) { return it.sub; });
    if (hasSubs) {
      var ul = el('ul', 'shop-subcats');
      ul.setAttribute('role', 'menu');
      ul.appendChild(subBtn('', 'Tout', true));
      group.items.forEach(function (it) {
        if (it.sub) ul.appendChild(subBtn(it.sub, it.sub, false));
      });
      catEl.appendChild(ul);
    }
    nav.appendChild(catEl);

    // --- Panneau : un composant "collection" Shopify par (sous-)collection ---
    var panel = el('div', 'shop-panel');
    panel.dataset.cat = catId;
    panel.hidden = !active;
    group.items.forEach(function (it) {
      var holder = el('div', 'shop-collection');
      holder.dataset.sub = it.sub || '';
      holder.dataset.collectionId = numericId(it.id);
      panel.appendChild(holder);
    });
    panels.appendChild(panel);
  });

  root.appendChild(nav);
  root.appendChild(panels);
  wireBoutique(root, ui);
  mountPanel(root.querySelector('.shop-panel:not([hidden])'), ui);
}

// Crée (à la demande) les composants collection d'un panneau.
function mountPanel(panel, ui) {
  if (!panel) return;
  panel.querySelectorAll('.shop-collection').forEach(function (holder) {
    if (holder.dataset.mounted) return;
    holder.dataset.mounted = '1';
    ui.createComponent('collection', {
      id: holder.dataset.collectionId,
      node: holder,
      moneyFormat: '%E2%82%AC%7B%7Bamount_with_comma_separator%7D%7D',
      options: window.SHOP_OPTIONS.collection
    });
  });
}

function wireBoutique(root, ui) {
  function activate(catId) {
    root.querySelectorAll('.shop-cat').forEach(function (c) {
      var on = c.dataset.cat === catId;
      c.classList.toggle('is-active', on);
      c.querySelector('.shop-cat-btn').setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    root.querySelectorAll('.shop-panel').forEach(function (p) {
      var on = p.dataset.cat === catId;
      p.hidden = !on;
      if (on) mountPanel(p, ui);
    });
  }

  function filterSub(catEl, sub) {
    catEl.querySelectorAll('.shop-subcat-btn').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.sub === sub);
    });
    var panel = root.querySelector('.shop-panel[data-cat="' + catEl.dataset.cat + '"]');
    if (!panel) return;
    panel.querySelectorAll('.shop-collection').forEach(function (h) {
      h.hidden = sub !== '' && h.dataset.sub !== sub;
    });
  }

  root.querySelectorAll('.shop-cat').forEach(function (catEl) {
    catEl.querySelector('.shop-cat-btn').addEventListener('click', function () {
      activate(catEl.dataset.cat);
    });
    catEl.querySelectorAll('.shop-subcat-btn').forEach(function (sb) {
      sb.addEventListener('click', function (e) {
        e.stopPropagation();
        filterSub(catEl, sb.dataset.sub);
      });
    });
  });
}

// ===== Shopify Buy Button =====
(function () {
  var brandBtn = {
    "color": "#74550d",
    ":hover": { "color": "#74550d", "background-color": "#d4bb73" },
    "background-color": "#ecd080",
    ":focus": { "background-color": "#d4bb73" },
    "border-radius": "40px"
  };

  // Boîte d'image uniforme (ratio constant) — rendu par Shopify dans l'iframe.
  // object-fit: contain => l'image entière tient dans la boîte sans être déformée.
  var imgUniform = {
    "img": {
      "height": "calc(100% - 15px)",
      "position": "absolute",
      "left": "0",
      "right": "0",
      "top": "0",
      "width": "100%",
      "object-fit": "contain"
    },
    "imgWrapper": { "padding-top": "calc(75% + 15px)", "position": "relative", "height": "0" }
  };

  // Référence du composant panier Shopify (capturée à la création), pour
  // pouvoir ouvrir le tiroir via l'API officielle.
  var cartComponent = null;

  // Met à jour le compteur du panier à partir du panier Shopify (si présent).
  function updateCartCount(cartComp) {
    try {
      var comp = cartComp || cartComponent;
      var items = (comp && comp.model && comp.model.lineItems) || [];
      var n = items.reduce(function (s, li) { return s + (li.quantity || 0); }, 0);
      document.querySelectorAll('.cart-count').forEach(function (c) { c.textContent = n; });
    } catch (e) { /* noop */ }
  }

  // Ouvre le tiroir panier. Méthode officielle (cartComponent.open()) en
  // priorité ; repli sur un vrai clic du bouton toggle natif si accessible.
  function openCart() {
    try { if (cartComponent && typeof cartComponent.open === 'function') { cartComponent.open(); return; } } catch (e) {}
    try {
      var frames = document.querySelectorAll('iframe');
      for (var i = 0; i < frames.length; i++) {
        var doc = frames[i].contentDocument;
        var btn = doc && doc.querySelector('.shopify-buy__cart-toggle');
        if (btn) { btn.click(); return; }
      }
    } catch (e) {}
  }

  // Bouton panier flottant, injecté sur CHAQUE page (toujours visible, sous
  // notre contrôle total). Affiche le compteur et ouvre le tiroir Shopify.
  function createFloatingCart() {
    if (document.querySelector('.floating-cart')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'floating-cart';
    b.setAttribute('aria-label', 'Panier');
    b.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
      '<span class="cart-count">0</span>';
    b.addEventListener('click', openCart);
    document.body.appendChild(b);
  }

  // Crée (une seule fois) la fenêtre de recherche et la renvoie.
  function buildSearchOverlay() {
    var overlay = document.querySelector('.search-overlay');
    if (overlay) return overlay;
    overlay = el('div', 'search-overlay');
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="search-box">' +
        '<div class="search-form">' +
          '<input type="search" class="search-input" placeholder="Rechercher un produit…" aria-label="Rechercher un produit">' +
          '<button type="button" class="search-close" aria-label="Fermer la recherche">×</button>' +
        '</div>' +
        '<p class="search-status"></p>' +
        '<div class="search-results"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  // Branche la loupe de l'en-tête sur une vraie recherche produits Shopify.
  function setupSearch(client, ui) {
    var btns = document.querySelectorAll('.search-btn');
    if (!btns.length) return;
    var overlay = buildSearchOverlay();
    var input = overlay.querySelector('.search-input');
    var results = overlay.querySelector('.search-results');
    var status = overlay.querySelector('.search-status');

    function open() { overlay.hidden = false; document.body.style.overflow = 'hidden'; input.focus(); }
    function close() { overlay.hidden = true; document.body.style.overflow = ''; }

    btns.forEach(function (b) { b.addEventListener('click', open); });
    overlay.querySelector('.search-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });

    var timer, reqId = 0;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var term = input.value.trim();
      if (term.length < 2) { results.innerHTML = ''; status.textContent = ''; return; }
      timer = setTimeout(function () { runSearch(term); }, 300);
    });

    function runSearch(term) {
      var myId = ++reqId;
      status.textContent = 'Recherche…';
      results.innerHTML = '';
      client.product.fetchQuery({ first: 30, query: term }).then(function (products) {
        if (myId !== reqId) return; // une recherche plus récente a pris le relais
        if (!products || !products.length) { status.textContent = 'Aucun produit trouvé.'; return; }
        status.textContent = '';
        products.forEach(function (p) {
          var card = el('article', 'shop-card shop-card-shopify');
          var mount = el('div');
          card.appendChild(mount);
          results.appendChild(card);
          ui.createComponent('product', {
            id: numericId(p.id),
            node: mount,
            moneyFormat: '%E2%82%AC%7B%7Bamount_with_comma_separator%7D%7D',
            options: window.SHOP_OPTIONS.product
          });
        });
      }).catch(function (err) {
        if (myId !== reqId) return;
        status.textContent = 'Erreur lors de la recherche.';
        console.error('Recherche Shopify :', err);
      });
    }
  }

  var brandCart = {
    "events": {
      "afterRender": updateCartCount,
      "updateItemQuantity": updateCartCount
    },
    "styles": { "button": brandBtn },
    "text": { "total": "Sous-total", "button": "Commander" }
  };
  var brandToggle = {
    "styles": {
      "toggle": {
        "background-color": "#ecd080",
        ":hover": { "background-color": "#d4bb73" },
        ":focus": { "background-color": "#d4bb73" }
      },
      "count": { "color": "#74550d", ":hover": { "color": "#74550d" } },
      "iconPath": { "fill": "#74550d" }
    }
  };
  var brandModal = {
    "contents": { "img": false, "imgWithCarousel": true, "button": false, "buttonWithQuantity": true },
    "styles": {
      "product": { "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" } },
      "button": brandBtn
    },
    "text": { "button": "Ajouter au panier" }
  };

  // Options du carrousel d'accueil : une carte produit qui remplit sa case.
  var productOptions = {
    "product": {
      "styles": {
        "product": Object.assign(
          { "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" } },
          imgUniform
        ),
        "button": brandBtn
      },
      "text": { "button": "Ajouter au panier" }
    },
    "modalProduct": brandModal,
    "cart": brandCart,
    "toggle": brandToggle
  };

  // Options de la grille boutique : 4 produits par ligne, images uniformes.
  var collectionOptions = {
    "product": {
      "styles": {
        "product": Object.assign(
          {
            "@media (min-width: 601px)": {
              "max-width": "calc(25% - 20px)",
              "width": "calc(25% - 20px)",
              "margin-left": "20px",
              "margin-bottom": "50px"
            }
          },
          imgUniform
        ),
        "button": brandBtn
      },
      "text": { "button": "Ajouter au panier" }
    },
    "productSet": {
      "styles": { "products": { "@media (min-width: 601px)": { "margin-left": "-20px" } } }
    },
    "modalProduct": brandModal,
    "cart": brandCart,
    "toggle": brandToggle
  };

  // Exposé pour mountPanel() (boutique).
  window.SHOP_OPTIONS = { product: productOptions, collection: collectionOptions };

  // Produits mis en avant dans le carrousel "Dernières nouveautés" (accueil).
  var featured = [
    { id: '15486773494100', node: 'product-component-1780409746470' }, // héron
    { id: '15486778245460', node: 'product-component-1780409833988' }, // messager sagittaire
    { id: '15486775296340', node: 'product-component-1780409800784' }, // canard
    { id: '15486746689876', node: 'product-component-1780408570955' }, // cygne
  ];

  var boutiqueRoot = document.querySelector('[data-shop-catalog]');
  var featuredNodes = featured.filter(function (p) { return document.getElementById(p.node); });

  // Shopify est initialisé sur toutes les pages pour que la recherche et le
  // panier de l'en-tête (présents partout) fonctionnent.
  function init() {
    var client = ShopifyBuy.buildClient({
      domain: 'u17zw5-c9.myshopify.com',
      storefrontAccessToken: '67936409c1773375c0943c4b698564c4',
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      // Crée le panier Shopify sur TOUTES les pages (persistance + compteur) et
      // capture le composant pour l'ouvrir via l'API officielle.
      try {
        var cartPromise = ui.createComponent('cart', {
          options: { cart: brandCart, toggle: brandToggle }
        });
        if (cartPromise && typeof cartPromise.then === 'function') {
          cartPromise.then(function (c) { cartComponent = c; updateCartCount(c); });
        } else if (cartPromise) {
          cartComponent = cartPromise; updateCartCount(cartPromise);
        }
      } catch (e) { console.error('Init panier Shopify :', e); }

      // Notre bouton panier flottant, présent et fonctionnel sur chaque page.
      createFloatingCart();

      if (boutiqueRoot) {
        buildBoutique(boutiqueRoot, client, ui);
      }
      featuredNodes.forEach(function (p) {
        ui.createComponent('product', {
          id: p.id,
          node: document.getElementById(p.node),
          moneyFormat: '%E2%82%AC%7B%7Bamount_with_comma_separator%7D%7D',
          options: productOptions
        });
      });
      setupSearch(client, ui);
    });
  }

  if (window.ShopifyBuy && window.ShopifyBuy.UI) {
    init();
  } else {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    s.onload = init;
    document.head.appendChild(s);
  }
})();
