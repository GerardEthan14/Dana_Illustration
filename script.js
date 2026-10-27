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
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61594404233779',
      svg: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 21v-7.02h2.36l.35-2.74h-2.71V9.49c0-.79.22-1.33 1.36-1.33h1.45V5.71c-.25-.03-1.11-.11-2.11-.11-2.09 0-3.52 1.27-3.52 3.62v2.02H8.31v2.74h2.37V21h2.82z"/></svg>'
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
  // ---- Bandeau d'annonce en haut du site ----
  // Pour MODIFIER le message : change le texte ci-dessous. Pour le RETIRER :
  // mets BANNER.html à '' (chaîne vide). Change BANNER.id pour le réafficher à
  // ceux qui l'avaient fermé.
  var BANNER = {
    id: 'calendrier-2027',
    html: ''
  };
  function injectBanner() {
    if (!BANNER.html) return;
    if (document.body.classList.contains('page-refuge')) return;      // pas sur le Refuge Club
    if (document.body.classList.contains('page-calendrier')) return;  // pas sur la page annoncée
    try { if (localStorage.getItem('banner-dismissed') === BANNER.id) return; } catch (e) {}
    if (document.querySelector('.site-banner')) return;
    var bar = document.createElement('div');
    bar.className = 'site-banner';
    bar.innerHTML = '<span class="site-banner-text">' + BANNER.html + '</span>' +
      '<button type="button" class="site-banner-close" aria-label="Fermer">×</button>';
    document.body.insertBefore(bar, document.body.firstChild);
    bar.querySelector('.site-banner-close').addEventListener('click', function () {
      bar.remove();
      try { localStorage.setItem('banner-dismissed', BANNER.id); } catch (e) {}
    });
  }

  function onReady() { enhanceFooter(); injectBanner(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();

/* ============================================================
   Boutiques pilotées par Shopify : Le Refuge (boutique.html)
   et Le Coin des Petits Soigneurs (petits-soigneurs.html)
   ------------------------------------------------------------
   - data-collection="enfant" sur [data-shop-catalog] : seulement les produits
     de la collection Shopify « enfant ». Sans cet attribut : tous les produits,
     sauf ceux de la collection enfant, qui ont leur propre coin.
   - Les catégories sont les balises (tags) des produits :
       "Prints"        -> catégorie « Prints »
       "Prints / A5"   -> catégorie « Prints », sous-catégorie « A5 »
       "1 Prints"      -> un numéro en tête fixe l'ordre (il n'est pas affiché)
     Un produit avec plusieurs balises apparaît dans chaque catégorie.
   - Tri : meilleures ventes (classement de Shopify), prix croissant ou décroissant.
   ============================================================ */
function el(tag, className) {
  var n = document.createElement(tag);
  if (className) n.className = className;
  return n;
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

// Lit un éventuel numéro d'ordre en tête d'un nom (« 1 Nouveautés », « 2. Prints »,
// « 3 - Stickers »…) : renvoie l'ordre pour le tri et le libellé SANS le numéro.
function parseOrdered(name) {
  var s = (name || '').trim();
  var m = s.match(/^(\d+)\s*[-.).\]]?\s*(.+)$/);
  if (m) return { order: parseInt(m[1], 10), label: m[2].trim() };
  return { order: 1e9, label: s };
}

// ===== Fiche produit en popup (sur NOTRE site, même panier Shopify) =====
// Info d'expédition affichée dans le popup (modifiable ici, '' pour la retirer).
var PRODUCT_SHIP_NOTE = '';

// Formate un prix Shopify en « 12,00 € ».
function formatPrice(p) {
  var v = p && p.variants && p.variants[0];
  if (!v) return '';
  var amt = (v.price && v.price.amount != null) ? v.price.amount : v.price;
  var n = parseFloat(amt);
  if (isNaN(n)) return '';
  return n.toFixed(2).replace('.', ',') + ' €';
}

// Carte produit cliquable (image + titre + prix) qui ouvre le popup au clic.
function renderProductCard(p, ui) {
  var card = el('button', 'shop-card shop-card-custom');
  card.type = 'button';
  var img = (p.images && p.images[0] && p.images[0].src) || '';
  var title = p.title || '';
  card.innerHTML =
    '<span class="pc-img">' + (img ? '<img src="' + img + '" alt="" loading="lazy">' : '') + '</span>' +
    '<span class="pc-title"></span>' +
    '<span class="pc-price">' + formatPrice(p) + '</span>';
  card.querySelector('.pc-title').textContent = title;
  card.setAttribute('aria-label', title);
  card.addEventListener('click', function () { openProductModal(ui, p.id); });
  return card;
}

// Crée (une seule fois) le popup de fiche produit et le renvoie.
function buildProductOverlay() {
  var overlay = document.querySelector('.product-modal');
  if (overlay) return overlay;
  overlay = el('div', 'product-modal');
  overlay.hidden = true;
  overlay.innerHTML =
    '<div class="product-modal-box">' +
      '<button type="button" class="product-modal-close" aria-label="Fermer">×</button>' +
      '<div class="product-modal-body"></div>' +
      (PRODUCT_SHIP_NOTE ? '<p class="product-modal-note">' + PRODUCT_SHIP_NOTE + '</p>' : '') +
    '</div>';
  document.body.appendChild(overlay);
  function close() { overlay.hidden = true; document.body.style.overflow = ''; }
  overlay.querySelector('.product-modal-close').addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });
  return overlay;
}

// Ouvre le popup pour un produit : on y monte un composant produit Shopify
// détaillé (carrousel d'images + description + ajout au panier), même panier.
function openProductModal(ui, productId) {
  var overlay = buildProductOverlay();
  var body = overlay.querySelector('.product-modal-body');
  body.innerHTML = '';
  ui.createComponent('product', {
    id: numericId(productId),
    node: body,
    moneyFormat: '%E2%82%AC%7B%7Bamount_with_comma_separator%7D%7D',
    options: window.SHOP_OPTIONS.productDetail
  });
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

var SHOP_DOMAIN = 'u17zw5-c9.myshopify.com';
var SHOP_TOKEN = '67936409c1773375c0943c4b698564c4';
var KIDS_COLLECTION = 'enfant';
var HIDDEN_TAGS = ['enfant', 'enfants']; // balises techniques, jamais montrées comme catégorie

// Demande directe à l'API Storefront : le SDK Buy Button ne donne ni les balises
// ni le classement des meilleures ventes.
function storefront(query) {
  return fetch('https://' + SHOP_DOMAIN + '/api/2024-10/graphql.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': SHOP_TOKEN },
    body: JSON.stringify({ query: query })
  }).then(function (r) { return r.json(); }).then(function (res) {
    if (res.errors) throw new Error(res.errors.map(function (e) { return e.message; }).join(' ; '));
    return res.data;
  });
}

// Produits de la boutique, dans l'ordre des meilleures ventes, au format attendu
// par renderProductCard.
function fetchShopProducts(kidsOnly) {
  function isKids(c) {
    var label = parseOrdered(c.title || '').label.toLowerCase();
    return c.handle === KIDS_COLLECTION || c.handle === KIDS_COLLECTION + 's' || label === KIDS_COLLECTION || label === KIDS_COLLECTION + 's';
  }
  function load(withTags) {
    var fields = 'id title ' + (withTags ? 'tags ' : '') +
      'images(first: 1) { edges { node { url } } } priceRange { minVariantPrice { amount } }';
    return storefront('{ collections(first: 100) { edges { node { id handle title } } } }').then(function (d) {
      var kids = d.collections.edges.map(function (e) { return e.node; }).filter(isKids)[0];
      if (kidsOnly) {
        if (!kids) return [];
        return storefront('{ collection(id: "' + kids.id + '") { products(first: 250, sortKey: BEST_SELLING) { edges { node { ' + fields + ' } } } } }')
          .then(function (d2) { return d2.collection.products.edges.map(function (e) { return e.node; }); });
      }
      return storefront('{ products(first: 250, sortKey: BEST_SELLING) { edges { node { ' + fields + ' } } }' +
        (kids ? ' kids: collection(id: "' + kids.id + '") { products(first: 250) { edges { node { id } } } }' : '') + ' }')
        .then(function (d2) {
          var kidIds = kids ? d2.kids.products.edges.map(function (e) { return e.node.id; }) : [];
          return d2.products.edges.map(function (e) { return e.node; })
            .filter(function (p) { return kidIds.indexOf(p.id) === -1; });
        });
    });
  }
  // Shopify ne donne les balises que si la clé d'accès y a droit : sinon on
  // affiche quand même les produits, sans catégories.
  return load(true).catch(function (err) {
    console.warn('Balises Shopify indisponibles, boutique sans catégories :', err);
    return load(false);
  }).then(function (nodes) {
    return nodes.map(function (n, rank) {
      var price = parseFloat(n.priceRange.minVariantPrice.amount);
      return {
        id: n.id, title: n.title, rank: rank, price: price,
        tags: (n.tags || []).filter(function (t) { return HIDDEN_TAGS.indexOf(t.trim().toLowerCase()) === -1; }),
        images: n.images.edges.map(function (e) { return { src: e.node.url }; }),
        variants: [{ price: { amount: price } }]
      };
    });
  });
}

// Balise "1 Prints / A5" -> { cat: "Prints", order: 1, sub: "A5", subOrder }
function parseTag(tag) {
  var parts = tag.split(/\s*\/\s*/);
  var p = parseOrdered(parts[0]);
  var c = parts.length > 1 ? parseOrdered(parts.slice(1).join(' / ')) : { order: 1e9, label: '' };
  return { cat: p.label, order: p.order, sub: c.label, subOrder: c.order };
}

function buildTagShop(root, ui) {
  var kidsOnly = root.getAttribute('data-collection') === KIDS_COLLECTION;
  root.innerHTML = '<p class="shop-loading">Chargement de la boutique…</p>';
  fetchShopProducts(kidsOnly).then(function (products) {
    if (!products.length) {
      root.innerHTML = '<p class="shop-empty">Bientôt de nouvelles créations 🌿</p>';
      return;
    }
    renderTagShop(root, products, ui);
  }).catch(function (err) {
    root.innerHTML = '<p class="shop-empty">Impossible de charger la boutique pour le moment.</p>';
    console.error('Chargement de la boutique Shopify :', err);
  });
}

function renderTagShop(root, products, ui) {
  // catégories et sous-catégories tirées des balises
  var cats = {}, order = [];
  products.forEach(function (p) {
    p.tags.forEach(function (t) {
      var tag = parseTag(t);
      if (!tag.cat) return;
      if (!cats[tag.cat]) { cats[tag.cat] = { label: tag.cat, order: tag.order, subs: {} }; order.push(tag.cat); }
      cats[tag.cat].order = Math.min(cats[tag.cat].order, tag.order);
      if (tag.sub) cats[tag.cat].subs[tag.sub] = Math.min(cats[tag.cat].subs[tag.sub] || 1e9, tag.subOrder);
    });
  });
  function byOrder(list, ord) {
    return list.sort(function (a, b) { return (ord(a) - ord(b)) || a.localeCompare(b); });
  }
  order = byOrder(order, function (k) { return cats[k].order; });

  var state = { cat: '', sub: '', sort: 'best' };
  root.innerHTML = '';
  var bar = el('div', 'shop-toolbar');
  var nav = el('nav', 'shop-cats');
  nav.setAttribute('aria-label', 'Catégories de la boutique');
  [''].concat(order).forEach(function (key) {
    var catEl = el('div', 'shop-cat' + (key === '' ? ' is-active' : ''));
    catEl.dataset.cat = key;
    var btn = el('button', 'shop-cat-btn');
    btn.type = 'button';
    btn.textContent = key || 'Tout';
    catEl.appendChild(btn);
    var subs = key ? byOrder(Object.keys(cats[key].subs), function (k) { return cats[key].subs[k]; }) : [];
    if (subs.length) {
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      var ul = el('ul', 'shop-subcats');
      ul.setAttribute('role', 'menu');
      [''].concat(subs).forEach(function (sub) {
        var li = el('li');
        var b = el('button', 'shop-subcat-btn' + (sub === '' ? ' is-active' : ''));
        b.type = 'button';
        b.dataset.sub = sub;
        b.setAttribute('role', 'menuitem');
        b.textContent = sub || 'Tout';
        li.appendChild(b);
        ul.appendChild(li);
      });
      catEl.appendChild(ul);
    }
    nav.appendChild(catEl);
  });
  if (order.length) bar.appendChild(nav);
  var sortBar = el('label', 'shop-sort');
  sortBar.innerHTML = '<span>Trier par</span><select>' +
    '<option value="best">Meilleures ventes</option>' +
    '<option value="asc">Prix croissant</option>' +
    '<option value="desc">Prix décroissant</option></select>';
  bar.appendChild(sortBar);
  var grid = el('div', 'shop-collection');
  root.appendChild(bar);
  root.appendChild(grid);

  function render() {
    var list = products.filter(function (p) {
      return !state.cat || p.tags.some(function (t) {
        var tag = parseTag(t);
        return tag.cat === state.cat && (!state.sub || tag.sub === state.sub);
      });
    });
    list.sort(function (a, b) {
      return state.sort === 'asc' ? (a.price - b.price) || (a.rank - b.rank)
        : state.sort === 'desc' ? (b.price - a.price) || (a.rank - b.rank)
        : a.rank - b.rank;
    });
    grid.innerHTML = '';
    if (!list.length) { grid.innerHTML = '<p class="shop-empty">Bientôt de nouvelles créations 🌿</p>'; return; }
    list.forEach(function (p) { grid.appendChild(renderProductCard(p, ui)); });
  }

  function closeMenus() {
    nav.querySelectorAll('.shop-cat').forEach(function (c) {
      c.classList.remove('is-open');
      var b = c.querySelector('.shop-cat-btn[aria-haspopup]');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  nav.querySelectorAll('.shop-cat').forEach(function (catEl) {
    var hasSubs = !!catEl.querySelector('.shop-subcats');
    catEl.querySelector('.shop-cat-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = catEl.classList.contains('is-open');
      nav.querySelectorAll('.shop-cat').forEach(function (c) { c.classList.toggle('is-active', c === catEl); });
      closeMenus();
      // le menu déroulant ne s'ouvre que s'il était fermé
      if (hasSubs && !wasOpen) {
        catEl.classList.add('is-open');
        catEl.querySelector('.shop-cat-btn').setAttribute('aria-expanded', 'true');
      }
      if (state.cat !== catEl.dataset.cat) {
        state.cat = catEl.dataset.cat;
        state.sub = '';
        catEl.querySelectorAll('.shop-subcat-btn').forEach(function (b) { b.classList.toggle('is-active', b.dataset.sub === ''); });
        render();
      }
    });
    catEl.querySelectorAll('.shop-subcat-btn').forEach(function (sb) {
      sb.addEventListener('click', function (e) {
        e.stopPropagation();
        state.sub = sb.dataset.sub;
        catEl.querySelectorAll('.shop-subcat-btn').forEach(function (b) { b.classList.toggle('is-active', b === sb); });
        closeMenus(); // la liste se referme après le choix
        render();
      });
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.shop-cat')) closeMenus();
  });
  sortBar.querySelector('select').addEventListener('change', function () {
    state.sort = this.value;
    render();
  });
  render();
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

  // Référence du panier Shopify, pour l'ouvrir depuis l'icône du header.
  var cartComponent = null;

  // Ouvre le tiroir panier : API officielle, puis replis.
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
    "styles": {
      // l'étiquette tamponnée, comme sur une caisse de transport
      "title": {
        "display": "inline-block",
        "color": "#FBF7EC",
        "background-color": "#D8560E",
        "border": "2px dashed rgba(251, 247, 236, 0.7)",
        "padding": "4px 14px",
        "border-radius": "4px",
        "transform": "rotate(-3deg)",
        "text-transform": "uppercase",
        "letter-spacing": "0.08em",
        "font-size": "15px",
        "font-weight": "600"
      },
      "button": brandBtn
    },
    "text": {
      "title": "Caisse de transport",
      "total": "Sous-total",
      "button": "Commander",
      "empty": "Votre panier est vide.",
      "notice": "Frais de livraison et codes de réduction calculés au paiement."
    }
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

  // Fiche produit détaillée affichée dans le popup (sur notre site), stylée pour
  // coller au site : fond blanc, police Avenir, bouton « pilule », description
  // sous le titre, liste déroulante arrondie, sans choix de quantité.
  var detailFont = "'Avenir', 'Avenir Next', 'Nunito Sans', sans-serif";
  var detailBtn = {
    "width": "100%",
    "color": "#3A4520",
    "background-color": "#E8D098",
    "border": "1.5px solid #4A5928",
    "border-radius": "999px",
    "font-family": detailFont,
    "text-align": "center",
    ":hover": { "background-color": "#4A5928", "color": "#FDF8F3", "border-color": "#4A5928" },
    ":focus": { "background-color": "#4A5928", "color": "#FDF8F3", "border-color": "#4A5928" }
  };
  var productDetailOptions = {
    "product": {
      "googleFonts": ["Nunito Sans"],
      "contents": {
        "img": false, "imgWithCarousel": true,
        "title": true, "variantTitle": false,
        "price": true, "options": true,
        "quantity": false, "description": true,
        "button": true, "buttonWithQuantity": false
      },
      "width": "100%",
      "styles": {
        "product": {
          "display": "flex", "flex-direction": "column", "align-items": "stretch",
          "text-align": "left", "font-family": detailFont,
          "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" }
        },
        "imgWrapper": { "order": "0", "max-width": "260px", "margin": "0 auto 16px auto" },
        "img": { "max-height": "300px" },
        "title": { "order": "1", "font-family": detailFont, "font-size": "24px", "font-weight": "700", "color": "#3A4520", "text-align": "left", "margin-bottom": "8px" },
        "description": { "order": "2", "font-family": detailFont, "color": "#2D1B0E", "line-height": "1.6", "text-align": "left", "margin-bottom": "16px" },
        "prices": { "order": "3", "text-align": "left", "margin-bottom": "12px" },
        "price": { "font-family": detailFont, "color": "#3A4520", "font-size": "18px" },
        "compareAt": { "font-family": detailFont, "color": "#6B5D4A" },
        "options": { "order": "4", "margin-bottom": "14px" },
        "select": { "width": "100%", "border-radius": "999px", "border": "1.5px solid #4A5928", "color": "#3A4520", "font-family": detailFont, "padding": "12px 18px", "background-color": "#FFFFFF" },
        "buttonWrapper": { "order": "5", "width": "100%" },
        "button": detailBtn
      },
      "text": { "button": "Ajouter au panier" }
    },
    "cart": brandCart,
    "toggle": brandToggle
  };

  // Exposé pour la recherche et le popup fiche produit.
  window.SHOP_OPTIONS = { product: productOptions, productDetail: productDetailOptions };

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
        return parseOrdered(c.title || '').label.trim().toLowerCase() === wanted;
      })[0];
      if (!col) { featuredHost.innerHTML = empty; return; }
      return client.collection.fetchWithProducts(col.id, { productsFirst: 12 }).then(function (c2) {
        var products = (c2 && c2.products) || [];
        if (!products.length) { featuredHost.innerHTML = empty; return; }
        featuredHost.innerHTML = '';
        products.forEach(function (p) {
          featuredHost.appendChild(renderProductCard(p, ui));
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
        var cartPromise = ui.createComponent('cart', {
          options: { cart: brandCart, toggle: brandToggle }
        });
        if (cartPromise && typeof cartPromise.then === 'function') {
          cartPromise.then(function (c) { cartComponent = c; updateCartCount(c); });
        } else if (cartPromise) {
          cartComponent = cartPromise; updateCartCount(cartPromise);
        }
      } catch (e) { console.error('Init panier Shopify :', e); }

      // Icône panier du header
      document.querySelectorAll('.cart-btn').forEach(function (b) {
        b.addEventListener('click', openCart);
      });

      if (boutiqueRoot) {
        buildTagShop(boutiqueRoot, ui);
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

// ===== Galerie d'art : salles + popup d'un tableau =====
(function () {
  // La hauteur des cadres est fixee en CSS (--h) : la galerie garde donc
  // toujours la meme hauteur, tandis que la largeur de chaque cadre suit
  // le format naturel de l'illustration (aucun recadrage).

  function init() {
    var museum = document.querySelector('.museum');
    if (!museum) return;

    var stage = museum.querySelector('.museum-rooms');
    var arts = Array.prototype.slice.call(museum.querySelectorAll('.artwork'));
    var next = museum.querySelector('.museum-next');
    var page = 0;
    var lastPerPage = 0;

    function perPage() {
      return window.matchMedia('(max-width: 720px)').matches ? 4 : 6;
    }

    function render(animate) {
      var n = perPage();
      var pages = Math.ceil(arts.length / n);
      if (page > pages - 1) page = pages - 1;

      arts.forEach(function (art, i) {
        art.hidden = Math.floor(i / n) !== page;
      });

      if (next) {   // le texte est dessiné sur le panneau : on adapte l'infobulle
        var last = (page === pages - 1);
        var libelle = last ? 'Revenir à la première salle' : 'Salle suivante';
        next.setAttribute('aria-label', libelle);
        next.setAttribute('title', libelle);
      }
      if (animate) {   // relance l'animation d'avancée
        stage.classList.remove('is-turning');
        void stage.offsetWidth;
        stage.classList.add('is-turning');
      }
    }

    if (next) {
      next.addEventListener('click', function () {
        page = (page + 1) % Math.ceil(arts.length / perPage());
        render(true);
      });
    }

    // on recalcule seulement si l'on change de format (téléphone <-> ordinateur)
    window.addEventListener('resize', function () {
      if (perPage() !== lastPerPage) { lastPerPage = perPage(); page = 0; render(false); }
    });

    lastPerPage = perPage();
    render(false);

    // --- popup ---
    var modal = document.querySelector('.artwork-modal');
    if (!modal) return;
    var img = modal.querySelector('.artwork-modal-img');
    var title = modal.querySelector('.artwork-modal-text h3');
    var desc = modal.querySelector('.artwork-modal-text p');
    var opener = null;

    function open(btn) {
      opener = btn;
      img.src = btn.getAttribute('data-full');
      img.alt = btn.getAttribute('data-title') || '';
      title.textContent = btn.getAttribute('data-title') || '';
      // le texte ne s'affiche que si Dana en a mis un sur ce tableau
      var d = btn.getAttribute('data-desc') || '';
      desc.textContent = d;
      desc.hidden = !d;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      modal.querySelector('.artwork-modal-close').focus();
    }

    function close() {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    }

    arts.forEach(function (btn) {
      btn.addEventListener('click', function () { open(btn); });
    });
    modal.querySelector('.artwork-modal-close').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ===== Galerie simple (page d'essai) : même popup que le musée =====
(function () {
  function init() {
    var items = document.querySelectorAll('.plain-item');
    var modal = document.querySelector('.artwork-modal');
    if (!items.length || !modal) return;

    var img = modal.querySelector('.artwork-modal-img');
    var title = modal.querySelector('.artwork-modal-text h3');
    var desc = modal.querySelector('.artwork-modal-text p');
    var closeBtn = modal.querySelector('.artwork-modal-close');
    var opener = null;

    function open(btn) {
      opener = btn;
      img.src = btn.getAttribute('data-full');
      img.alt = btn.getAttribute('data-title') || '';
      title.textContent = btn.getAttribute('data-title') || '';
      var d = btn.getAttribute('data-desc') || '';
      desc.textContent = d;
      desc.hidden = !d;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    }

    Array.prototype.forEach.call(items, function (btn) {
      btn.addEventListener('click', function () { open(btn); });
    });
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ===== Calendrier : carrousel des mois (un au centre, les autres autour) =====
(function () {
  function init() {
    var box = document.querySelector('.months');
    if (!box) return;

    var track = box.querySelector('.months-track');
    var slides = Array.prototype.slice.call(box.querySelectorAll('.month-slide'));
    var dots = Array.prototype.slice.call(box.querySelectorAll('.months-dot'));
    var prev = box.querySelector('.months-prev');
    var next = box.querySelector('.months-next');
    if (!track || !slides.length) return;

    var index = 0;

    function render() {
      track.style.setProperty('--index', index);
      slides.forEach(function (s, i) {
        var active = i === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-current', active ? 'true' : 'false');
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    }

    function go(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      render();
    }

    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { go(parseInt(d.getAttribute('data-go'), 10) || 0); });
    });

    slides.forEach(function (s, i) {
      s.addEventListener('click', function () {
        // un mois de côté : on l'amène au centre ; le mois central : on l'ouvre en grand
        if (i !== index) { go(i); return; }
        var img = s.querySelector('img');
        if (img) window.open(img.getAttribute('src'), '_blank', 'noopener');
      });
    });

    // flèches du clavier
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(index - 1); }
      else if (e.key === 'ArrowRight') { go(index + 1); }
    });

    // glissement du doigt
    var x0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); }
      x0 = null;
    }, { passive: true });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
