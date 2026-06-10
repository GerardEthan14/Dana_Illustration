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
  // Réseaux sociaux de Dana.
  var SOCIALS = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/dana.illustration',
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2"/></svg>'
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@dana_illustration',
      svg: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 3c.32 2.04 1.46 3.26 3.5 3.5v2.62c-1.18.12-2.2-.27-3.4-1.01v6.27a5.49 5.49 0 1 1-5.49-5.49c.26 0 .51.02.76.06v2.7a2.8 2.8 0 1 0 1.96 2.67V3h2.71z"/></svg>'
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/share/18yYLM9iJB/',
      svg: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 21v-7.02h2.36l.35-2.74h-2.71V9.49c0-.79.22-1.33 1.36-1.33h1.45V5.71c-.25-.03-1.11-.11-2.11-.11-2.09 0-3.52 1.27-3.52 3.62v2.02H8.31v2.74h2.37V21h2.82z"/></svg>'
    },
    {
      name: 'Pinterest',
      href: 'https://pin.it/4JD7ZXP4x',
      svg: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a9 9 0 0 0-3.28 17.38c-.08-.74-.15-1.88.03-2.69l1.08-4.58s-.27-.55-.27-1.37c0-1.28.74-2.24 1.67-2.24.79 0 1.17.59 1.17 1.3 0 .79-.5 1.98-.77 3.08-.22.93.47 1.68 1.38 1.68 1.66 0 2.94-1.75 2.94-4.28 0-2.24-1.61-3.8-3.9-3.8a4.05 4.05 0 0 0-4.22 4.06c0 .8.31 1.67.69 2.14.08.09.09.17.06.27l-.25 1.02c-.04.16-.13.2-.3.12-1.12-.52-1.82-2.16-1.82-3.48 0-2.83 2.06-5.43 5.94-5.43 3.12 0 5.54 2.22 5.54 5.19 0 3.1-1.95 5.59-4.66 5.59-.91 0-1.76-.47-2.06-1.03l-.56 2.13c-.2.78-.75 1.76-1.12 2.36A9 9 0 1 0 12 3z"/></svg>'
    }
  ];

  // Liens vers les pages légales (ajoutés au pied de page de chaque page).
  var LEGAL = [
    { name: 'Mentions légales', href: 'mentions-legales.html' },
    { name: 'CGV', href: 'cgv.html' },
    { name: 'Confidentialité', href: 'confidentialite.html' },
    { name: 'Retours & remboursements', href: 'retours.html' }
  ];

  function enhanceFooter() {
    document.querySelectorAll('.site-footer').forEach(function (footer) {
      // Barre réseaux sociaux
      var inner = footer.querySelector('.footer-inner');
      if (inner && SOCIALS.length && !inner.querySelector('.footer-social')) {
        var nav = document.createElement('nav');
        nav.className = 'footer-social';
        nav.setAttribute('aria-label', 'Réseaux sociaux');
        nav.innerHTML = SOCIALS.map(function (s) {
          return '<a href="' + s.href + '" target="_blank" rel="noopener" aria-label="' + s.name + '">' + s.svg + '</a>';
        }).join('');
        inner.appendChild(nav);
      }
      // Liens légaux (sous la ligne principale du pied de page)
      if (!footer.querySelector('.footer-legal')) {
        var legal = document.createElement('nav');
        legal.className = 'footer-legal';
        legal.setAttribute('aria-label', 'Informations légales');
        legal.innerHTML = LEGAL.map(function (l) {
          return '<a href="' + l.href + '">' + l.name + '</a>';
        }).join('');
        (footer.querySelector('.footer-inner') || footer).appendChild(legal);
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

  // Met à jour le compteur du panier (si un élément .cart-count existe).
  function updateCartCount(cartComp) {
    try {
      var items = (cartComp && cartComp.model && cartComp.model.lineItems) || [];
      var n = items.reduce(function (s, li) { return s + (li.quantity || 0); }, 0);
      document.querySelectorAll('.cart-count').forEach(function (c) { c.textContent = n; });
    } catch (e) { /* noop */ }
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

  var boutiqueRoot = document.querySelector('[data-shop-catalog]');
  var featuredHost = document.querySelector('.shop-cards[data-featured]');

  // Remplit le carrousel d'accueil avec les produits de la collection Shopify
  // dont le nom est indiqué par data-featured (ex. « Nouveautés »). Dana gère
  // ainsi le contenu directement depuis Shopify, le carrousel reste identique.
  function buildFeatured(client, ui) {
    if (!featuredHost) return;
    var wanted = (featuredHost.getAttribute('data-featured') || '').trim().toLowerCase();
    var empty = '<p class="shop-empty">Bientôt de nouvelles créations 🌿</p>';
    client.collection.fetchAll(250).then(function (cols) {
      var col = (cols || []).filter(function (c) {
        return (c.title || '').trim().toLowerCase() === wanted;
      })[0];
      if (!col) { featuredHost.innerHTML = empty; return; }
      return client.collection.fetchWithProducts(col.id, { productsFirst: 12 }).then(function (c2) {
        var products = (c2 && c2.products) || [];
        if (!products.length) { featuredHost.innerHTML = empty; return; }
        featuredHost.innerHTML = '';
        products.forEach(function (p) {
          var card = el('article', 'shop-card shop-card-shopify');
          var mount = el('div');
          card.appendChild(mount);
          featuredHost.appendChild(card);
          ui.createComponent('product', {
            id: numericId(p.id),
            node: mount,
            moneyFormat: '%E2%82%AC%7B%7Bamount_with_comma_separator%7D%7D',
            options: productOptions
          });
        });
      });
    }).catch(function (err) {
      featuredHost.innerHTML = '<p class="shop-empty">Impossible de charger les nouveautés.</p>';
      console.error('Nouveautés Shopify :', err);
    });
  }

  // Shopify est initialisé sur toutes les pages pour que la recherche et le
  // panier de l'en-tête (présents partout) fonctionnent.
  function init() {
    var client = ShopifyBuy.buildClient({
      domain: 'u17zw5-c9.myshopify.com',
      storefrontAccessToken: '67936409c1773375c0943c4b698564c4',
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      // Crée le panier Shopify (avec son bouton/toggle natif) sur TOUTES les
      // pages : c'est le panier du site, qui ouvre le tiroir et persiste.
      try {
        ui.createComponent('cart', {
          options: { cart: brandCart, toggle: brandToggle }
        });
      } catch (e) { console.error('Init panier Shopify :', e); }

      if (boutiqueRoot) {
        buildBoutique(boutiqueRoot, client, ui);
      }
      buildFeatured(client, ui);
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
