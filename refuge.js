// ===== Le Refuge : carte où les animaux débloqués se promènent =====
// Pour ajouter l'animal du mois : une entrée dans ANIMALS.
//  - code : empreinte SHA-256 du code en majuscules sans espaces
//    (terminal : echo -n ZURI2026 | sha256sum)
//  - zone : ellipse de son enclos, en % de la carte (centre x/y, rayons rx/ry)
//  - size : largeur de l'animal, en % de la carte
// shortcut: site statique, les animaux débloqués sont gardés dans le navigateur
// (localStorage) et un visiteur curieux peut tricher ; un vrai serveur ne vaut
// la peine que si les codes doivent rester secrets.
(function () {
  var ANIMALS = [
    {
      id: 'zuri',
      code: '5e31c9c0a84d12cd6cb25fe6f251f0c53fe7a5c67559e0c4eb60c8c54807bd0e',
      img: 'photo/refuge-elephant.png',
      zone: { x: 30, y: 56, rx: 8, ry: 3.5 },
      size: 9,
      name: 'Zuri',
      species: "Éléphant d'Afrique",
      story: "Zuri (« la belle » en swahili) est arrivée au refuge toute petite, après avoir perdu son troupeau. " +
        "Les soigneurs l'ont nourrie au biberon pendant des mois. Aujourd'hui, elle passe ses journées au bord du lac " +
        "à s'asperger d'eau, et elle accueille chaque nouveau pensionnaire d'un grand coup de trompe.",
      facts: [
        "C'est le plus grand animal terrestre : un mâle adulte peut peser jusqu'à 6 tonnes.",
        "Sa trompe compte des dizaines de milliers de muscles : elle sert à boire, sentir, saluer et attraper.",
        "Ses grandes oreilles l'aident à se rafraîchir quand il fait chaud.",
        "Les éléphants se parlent avec des sons très graves, que nos oreilles n'entendent pas, sur plusieurs kilomètres.",
        "Une maman éléphant porte son petit pendant environ 22 mois."
      ]
    }
  ];

  var STORE = 'refuge-animaux';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function loadIds() {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) { return []; }
  }
  function saveIds(ids) {
    try { localStorage.setItem(STORE, JSON.stringify(ids)); } catch (e) { /* navigation privée : l'animal reste jusqu'au rechargement */ }
  }

  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

  // point au hasard dans l'ellipse de l'enclos
  function randomSpot(z) {
    var a = Math.random() * 2 * Math.PI, r = Math.sqrt(Math.random());
    return { x: z.x + Math.cos(a) * r * z.rx, y: z.y + Math.sin(a) * r * z.ry };
  }

  function init() {
    var map = document.querySelector('.refuge-map');
    if (!map) return;
    var layer = map.querySelector('.refuge-animals');
    var form = document.querySelector('.refuge-code');
    var input = form.querySelector('input');
    var msg = form.querySelector('.refuge-code-msg');
    var ids = loadIds();

    // --- fiche ---
    var modal = document.querySelector('.refuge-fiche');
    var opener = null;
    function openFiche(a, btn) {
      opener = btn;
      var img = modal.querySelector('.artwork-modal-img');
      img.src = a.img;
      img.alt = a.species;
      modal.querySelector('.refuge-fiche-species').textContent = a.species;
      modal.querySelector('#refuge-fiche-name').textContent = a.name;
      modal.querySelector('.refuge-fiche-story').textContent = a.story;
      var list = modal.querySelector('.refuge-fiche-facts');
      list.innerHTML = '';
      a.facts.forEach(function (f) {
        var li = document.createElement('li');
        li.textContent = f;
        list.appendChild(li);
      });
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      modal.querySelector('.artwork-modal-close').focus();
    }
    function closeFiche() {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    }
    modal.querySelector('.artwork-modal-close').addEventListener('click', closeFiche);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeFiche(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeFiche();
    });

    // --- animaux sur la carte ---
    function place(a, isNew) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'refuge-animal' + (isNew ? ' is-new' : '');
      btn.style.width = a.size + '%';
      btn.setAttribute('aria-label', 'Voir la fiche de ' + a.name);
      btn.innerHTML = '<img src="' + a.img + '" alt=""><span class="refuge-animal-name">' + a.name + '</span>';
      var spot = randomSpot(a.zone);
      btn.style.left = spot.x + '%';
      btn.style.top = spot.y + '%';
      btn.addEventListener('click', function () { openFiche(a, btn); });
      layer.appendChild(btn);
      map.classList.add('has-animals');
      if (!calm) wander(a, btn, spot);
      return btn;
    }

    function wander(a, btn, from) {
      setTimeout(function () {
        var to = randomSpot(a.zone);
        var dist = Math.hypot(to.x - from.x, to.y - from.y);
        btn.style.transitionDuration = (dist * 0.9).toFixed(1) + 's';
        btn.classList.toggle('faces-left', to.x < from.x);
        btn.style.left = to.x + '%';
        btn.style.top = to.y + '%';
        wander(a, btn, to);
      }, 2500 + Math.random() * 4000);
    }

    ANIMALS.forEach(function (a) { if (ids.indexOf(a.id) !== -1) place(a, false); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = input.value.toUpperCase().replace(/\s+/g, '');
      if (!code) return;
      sha256(code).then(function (hash) {
        var a = ANIMALS.filter(function (x) { return x.code === hash; })[0];
        if (!a) {
          msg.textContent = "Ce code ne correspond à aucun animal. Vérifiez-le dans votre courrier du mois.";
          return;
        }
        if (ids.indexOf(a.id) !== -1) {
          msg.textContent = a.name + ' est déjà dans votre refuge.';
          return;
        }
        ids.push(a.id);
        saveIds(ids);
        input.value = '';
        msg.textContent = 'Bienvenue à ' + a.name + ' ! Cliquez sur ' + a.name + ' pour découvrir son histoire.';
        place(a, true);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
