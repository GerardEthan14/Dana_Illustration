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

// ===== Catalogue boutique =====
// Mapping temporaire catégorie -> sous-catégories -> produits.
// (En attendant de pouvoir utiliser de vraies collections Shopify : le jour venu,
//  il suffira de remplacer ce tableau par les données renvoyées par l'API Storefront,
//  la mise en page ne change pas.)
//
// Pour ajouter un produit : ajoute une entrée { shopifyId: 'ID', sub: 'id-sous-cat' }
// dans la catégorie voulue. "sub" vide ('') = pas de sous-catégorie / visible partout.
var SHOP_CATALOG = [
  {
    id: 'stickers', label: 'Stickers',
    subcategories: [],
    products: []
  },
  {
    id: 'prints', label: 'Prints',
    subcategories: [],
    products: [
      { shopifyId: '15486773494100', sub: '' }, // héron
      { shopifyId: '15486778245460', sub: '' }, // messager sagittaire
      { shopifyId: '15486775296340', sub: '' }, // canard
      { shopifyId: '15486746689876', sub: '' }, // cygne
    ]
  },
  {
    id: 'affiche', label: 'Affiche',
    // Exemple de sous-catégories (tailles). À adapter par catégorie.
    subcategories: [
      { id: 'a6', label: 'A6' },
      { id: 'a5', label: 'A5' },
      { id: 'a4', label: 'A4' },
      { id: 'a3', label: 'A3' },
      { id: 'a2', label: 'A2' },
      { id: 'a1', label: 'A1' },
    ],
    products: []
  },
  {
    id: 'autres', label: 'Autres',
    subcategories: [],
    products: []
  }
];

// Construit la navigation par catégories + les grilles de produits dans `root`.
// Renvoie la liste des points de montage Shopify [{ id, node }] à initialiser.
function buildBoutique(root, catalog) {
  var mounts = [];
  // Catégorie active par défaut : la première qui contient des produits.
  var withProducts = catalog.filter(function (c) { return c.products && c.products.length; });
  var defaultCat = (withProducts[0] || catalog[0]).id;

  var nav = document.createElement('nav');
  nav.className = 'shop-cats';
  nav.setAttribute('aria-label', 'Catégories de la boutique');

  var panels = document.createElement('div');
  panels.className = 'shop-panels';

  catalog.forEach(function (cat) {
    var isActive = cat.id === defaultCat;

    // --- Pastille de catégorie (+ liste déroulante de sous-catégories) ---
    var catEl = document.createElement('div');
    catEl.className = 'shop-cat' + (isActive ? ' is-active' : '');
    catEl.dataset.cat = cat.id;

    var catBtn = document.createElement('button');
    catBtn.type = 'button';
    catBtn.className = 'shop-cat-btn';
    catBtn.textContent = cat.label;
    catBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    catEl.appendChild(catBtn);

    if (cat.subcategories && cat.subcategories.length) {
      var sublist = document.createElement('ul');
      sublist.className = 'shop-subcats';
      sublist.setAttribute('role', 'menu');
      sublist.appendChild(makeSubcat('', 'Tout', true));
      cat.subcategories.forEach(function (s) {
        sublist.appendChild(makeSubcat(s.id, s.label, false));
      });
      catEl.appendChild(sublist);
    }
    nav.appendChild(catEl);

    // --- Panneau de produits de la catégorie ---
    var panel = document.createElement('div');
    panel.className = 'shop-panel';
    panel.dataset.cat = cat.id;
    if (!isActive) panel.hidden = true;

    if (cat.products && cat.products.length) {
      var grid = document.createElement('div');
      grid.className = 'shop-grid';
      cat.products.forEach(function (p, j) {
        var nodeId = 'shop-' + cat.id + '-' + j;
        var card = document.createElement('article');
        card.className = 'shop-card shop-card-shopify';
        card.dataset.sub = p.sub || '';
        var mount = document.createElement('div');
        mount.id = nodeId;
        card.appendChild(mount);
        grid.appendChild(card);
        mounts.push({ id: p.shopifyId, node: nodeId });
      });
      panel.appendChild(grid);
    } else {
      var empty = document.createElement('p');
      empty.className = 'shop-empty';
      empty.textContent = 'Bientôt disponible 🌿';
      panel.appendChild(empty);
    }
    panels.appendChild(panel);
  });

  root.appendChild(nav);
  root.appendChild(panels);
  wireBoutique(root);
  return mounts;
}

function makeSubcat(subId, label, active) {
  var li = document.createElement('li');
  var b = document.createElement('button');
  b.type = 'button';
  b.className = 'shop-subcat-btn' + (active ? ' is-active' : '');
  b.dataset.sub = subId;
  b.setAttribute('role', 'menuitem');
  b.textContent = label;
  li.appendChild(b);
  return li;
}

function wireBoutique(root) {
  function activateCat(catId) {
    root.querySelectorAll('.shop-cat').forEach(function (c) {
      var on = c.dataset.cat === catId;
      c.classList.toggle('is-active', on);
      c.querySelector('.shop-cat-btn').setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    root.querySelectorAll('.shop-panel').forEach(function (p) {
      p.hidden = p.dataset.cat !== catId;
    });
  }

  function filterSub(catEl, subId) {
    catEl.querySelectorAll('.shop-subcat-btn').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.sub === subId);
    });
    var panel = root.querySelector('.shop-panel[data-cat="' + catEl.dataset.cat + '"]');
    if (!panel) return;
    panel.querySelectorAll('.shop-card').forEach(function (card) {
      card.hidden = subId !== '' && card.dataset.sub !== subId;
    });
  }

  root.querySelectorAll('.shop-cat').forEach(function (catEl) {
    catEl.querySelector('.shop-cat-btn').addEventListener('click', function () {
      activateCat(catEl.dataset.cat);
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
  var btnStyle = {
    "color": "#74550d",
    ":hover": { "color": "#74550d", "background-color": "#d4bb73" },
    "background-color": "#ecd080",
    ":focus": { "background-color": "#d4bb73" },
    "border-radius": "40px"
  };

  var options = {
    "product": {
      "iframe": false,
      "styles": {
        "product": { "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" } },
        "button": btnStyle
      },
      "text": { "button": "Ajouter au panier" }
    },
    "modalProduct": {
      "contents": { "img": false, "imgWithCarousel": true, "button": false, "buttonWithQuantity": true },
      "styles": {
        "product": { "@media (min-width: 601px)": { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" } },
        "button": btnStyle
      },
      "text": { "button": "Ajouter au panier" }
    },
    "cart": {
      "styles": { "button": btnStyle },
      "text": { "total": "Sous-total", "button": "Commander" }
    },
    "toggle": {
      "styles": {
        "toggle": {
          "background-color": "#ecd080",
          ":hover": { "background-color": "#d4bb73" },
          ":focus": { "background-color": "#d4bb73" }
        },
        "count": { "color": "#74550d", ":hover": { "color": "#74550d" } },
        "iconPath": { "fill": "#74550d" }
      }
    }
  };

  // Produits mis en avant dans le carrousel "Dernières nouveautés" (page d'accueil).
  var featured = [
    { id: '15486773494100', node: 'product-component-1780409746470' }, // héron
    { id: '15486778245460', node: 'product-component-1780409833988' }, // messager sagittaire
    { id: '15486775296340', node: 'product-component-1780409800784' }, // canard
    { id: '15486746689876', node: 'product-component-1780408570955' }, // cygne
  ];

  // Détermine les produits à afficher : boutique complète (data-shop-catalog)
  // ou carrousel d'accueil (noeuds fixes dans le HTML).
  var mounts = [];
  var boutiqueRoot = document.querySelector('[data-shop-catalog]');
  if (boutiqueRoot) {
    mounts = buildBoutique(boutiqueRoot, SHOP_CATALOG);
  } else {
    featured.forEach(function (p) {
      if (document.getElementById(p.node)) mounts.push(p);
    });
  }

  // Rien à afficher sur cette page.
  if (!mounts.length) return;

  function init() {
    var client = ShopifyBuy.buildClient({
      domain: 'u17zw5-c9.myshopify.com',
      storefrontAccessToken: '67936409c1773375c0943c4b698564c4',
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      mounts.forEach(function (p) {
        var node = document.getElementById(p.node);
        if (!node) return;
        ui.createComponent('product', {
          id: p.id,
          node: node,
          moneyFormat: '%E2%82%AC%7B%7Bamount_with_comma_separator%7D%7D',
          options: options
        });
      });
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
