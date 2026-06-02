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

// ===== Shopify Buy Button =====
(function () {
  var products = [
    { id: '15486773494100', node: 'product-component-1780409746470' }, // héron
    { id: '15486778245460', node: 'product-component-1780409833988' }, // messager sagittaire
    { id: '15486775296340', node: 'product-component-1780409800784' }, // canard
    { id: '15486746689876', node: 'product-component-1780408570955' }, // cygne
  ];

  // skip on pages with no product containers
  if (!products.some(p => document.getElementById(p.node))) return;

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

  function init() {
    var client = ShopifyBuy.buildClient({
      domain: 'u17zw5-c9.myshopify.com',
      storefrontAccessToken: '67936409c1773375c0943c4b698564c4',
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      products.forEach(function (p) {
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
