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
    },
    {
      id: 'baako',
      code: 'b55451316e6ff9b0208533d398acc198ac504b5fab632867c17a5a0ad12e088e',
      img: 'photo/refuge-lion.png',
      zone: { x: 29, y: 28, rx: 5, ry: 4.5 },
      size: 9,
      name: 'Baako',
      species: "Lion d'Afrique",
      story: "Baako a grandi dans un cirque, où il n'avait jamais foulé d'herbe. À son arrivée, il a passé une journée entière " +
        "à renifler chaque brin. Aujourd'hui, c'est le plus grand dormeur du refuge : on le trouve souvent allongé au soleil, " +
        "la crinière ébouriffée, à surveiller ses voisins d'un œil.",
      facts: [
        "Le lion est le seul grand félin à vivre en groupe, appelé une troupe.",
        "Son rugissement peut s'entendre jusqu'à 8 kilomètres.",
        "Ce sont surtout les lionnes qui chassent, souvent en équipe.",
        "Un lion peut se reposer jusqu'à 20 heures par jour.",
        "L'espèce est classée vulnérable : il reste beaucoup moins de lions qu'il y a un siècle."
      ]
    },
    {
      id: 'sirocco',
      code: '97bd058fad3f90c660242050e7444cbe921209fb0cd2d42f248b35a3a97b708a',
      img: 'photo/refuge-aigle.png',
      zone: { x: 15, y: 88, rx: 5, ry: 3 },
      size: 5,
      name: 'Sirocco',
      species: 'Aigle royal',
      story: "Sirocco a été retrouvé au pied d'une ligne électrique, une aile blessée. Après de longs mois de soins, " +
        "il vole de nouveau, mais pas assez bien pour vivre seul dans la nature. Il a choisi le plus haut perchoir du refuge, " +
        "d'où il garde un œil sur tout le monde.",
      facts: [
        "Ses ailes déployées peuvent dépasser 2 mètres d'envergure.",
        "En piqué, il peut dépasser les 200 km/h.",
        "Sa vue est bien plus perçante que la nôtre : il repère un lièvre à plus d'un kilomètre.",
        "Un couple d'aigles reste souvent ensemble toute sa vie et réutilise le même nid d'année en année."
      ]
    },
    {
      id: 'zazou',
      code: 'fa1ce09fc8ffcfb202739ba854a5646085e220050cdc28b5fb49680770a244af',
      img: 'photo/refuge-zebre.png',
      zone: { x: 62, y: 38, rx: 13, ry: 6 },
      size: 8,
      name: 'Zazou',
      species: 'Zèbre des plaines',
      story: "Zazou est né au refuge, au printemps. Curieux de tout, il suit les soigneurs pas à pas pendant leur tournée " +
        "et galope autour du lac dès qu'il entend la brouette du repas. Sa maman dit qu'il a les plus jolies rayures du troupeau.",
      facts: [
        "Chaque zèbre a des rayures uniques, comme une empreinte digitale.",
        "Sous son pelage, sa peau est noire.",
        "Les scientifiques pensent que ses rayures l'aident à éloigner les mouches piqueuses.",
        "Il vit en famille : un étalon, plusieurs juments et leurs petits.",
        "Il peut courir jusqu'à environ 60 km/h pour échapper aux prédateurs."
      ]
    },
    {
      id: 'bruno',
      code: '33017bb47ec3066e2d6bc4ef225cd0e15d82db9b3c92c56249214660098c5836',
      img: 'photo/refuge-ours.png',
      zone: { x: 91, y: 67, rx: 3, ry: 4 },
      size: 8,
      name: 'Bruno',
      species: 'Ours brun',
      story: "Bruno a été recueilli encore ourson, trop jeune pour se débrouiller seul. C'est un gourmand : " +
        "il connaît par cœur l'heure des fruits et cache parfois des pommes sous les feuilles pour plus tard. " +
        "En hiver, il fait de longues siestes dans sa tanière.",
      facts: [
        "Son odorat est l'un des meilleurs de tout le monde animal.",
        "Il se dresse parfois sur ses pattes arrière pour mieux voir et mieux sentir.",
        "En hiver, il peut passer des mois dans sa tanière sans manger ni boire.",
        "Les oursons naissent en plein hiver et ne pèsent que quelques centaines de grammes.",
        "Il mange de tout : baies, racines, insectes, poissons…"
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
