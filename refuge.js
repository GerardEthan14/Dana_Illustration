// ===== Le Refuge : carte où les animaux débloqués se promènent =====
// Pour ajouter l'animal du mois : une entrée dans ANIMALS.
//  - code : empreinte SHA-256 du code en majuscules sans espaces
//    (terminal : echo -n ZURI2026 | sha256sum)
//  - zone : ellipse de son enclos, en % de la carte (centre x/y, rayons rx/ry)
//  - size : largeur de l'animal, en % de la carte
//  - secrets : deux anecdotes débloquées après 3 et 7 jours de friandises
// shortcut: site statique, la progression est gardée dans le navigateur
// (localStorage, + code de sauvegarde) et un visiteur curieux peut tricher ;
// un vrai serveur ne vaut la peine que si les codes doivent rester secrets.
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
      ],
      secrets: [
        "Zuri a une meilleure amie : une petite tortue qui vit près du lac. Elle fait toujours très attention où elle pose les pattes quand elle est là.",
        "Quand il pleut, Zuri lève sa trompe vers le ciel pour attraper les gouttes. Les soigneurs jurent qu'elle sourit."
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
      ],
      secrets: [
        "Baako a peur des papillons. Quand l'un d'eux se pose sur son nez, il fait semblant de dormir.",
        "Chaque soir, Baako rugit une seule fois, juste avant la nuit, comme pour souhaiter bonne nuit à tout le refuge."
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
      ],
      secrets: [
        "Sirocco collectionne les plumes tombées des autres oiseaux et les range soigneusement dans son nid.",
        "Le jour de son premier vol après sa blessure, tous les soigneurs ont applaudi. Depuis, il fait un petit tour au-dessus d'eux chaque matin."
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
      ],
      secrets: [
        "Zazou adore se rouler dans la poussière : c'est sa façon à lui de prendre un bain.",
        "Zazou reconnaît la voix de chaque soigneur et répond à son nom par un petit hennissement."
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
      ],
      secrets: [
        "Bruno a un tronc préféré pour se gratter le dos. Quand il s'y frotte, on dirait qu'il danse.",
        "Avant de s'endormir pour l'hiver, Bruno fait le tour de son enclos, comme pour dire au revoir à tout le monde."
      ]
    }
  ];

  // Badges, cousus sur l'écharpe. reward : réduction offerte dans la boutique
  // (le code doit exister dans Shopify > Réductions).
  // shortcut: les codes de réduction sont lisibles dans ce fichier ; les limiter
  // dans Shopify (une utilisation par client, date de fin) suffit tant qu'il n'y a pas de serveur.
  var BADGES = [
    { id: 'premier', icon: '🐾', color: '#D8560E', name: 'Premier pensionnaire', desc: 'Accueillir un premier animal', test: function (s) { return s.animals.length >= 1; } },
    { id: 'friandise', icon: '🍎', color: '#C0392B', name: 'Première friandise', desc: 'Gâter un animal', test: function (s) { return totalCare(s) >= 1; } },
    { id: 'famille', icon: '🏡', color: '#B6BD77', name: 'Petite famille', desc: 'Accueillir 3 animaux', test: function (s) { return s.animals.length >= 3; } },
    { id: 'curieux', icon: '📖', color: '#5B7FA6', name: 'Curieux', desc: 'Lire la fiche de 3 animaux', test: function (s) { return s.seen.length >= 3; } },
    { id: 'secret', icon: '🔑', color: '#F2B544', name: 'Gardien de secrets', desc: 'Découvrir le secret d\'un animal', test: function (s) { return maxAffection(s) >= SECRET_AT[0]; } },
    { id: 'arche', icon: '🌍', color: '#657007', name: 'Grand refuge', desc: 'Accueillir 5 animaux', reward: { percent: 5, code: 'REFUGE-ARCHE5' }, test: function (s) { return s.animals.length >= 5; } },
    { id: 'glaneur', icon: '🧺', color: '#8B5A2B', name: 'Glaneur', desc: 'Ramasser 25 trésors', test: function (s) { return s.found >= 25; } },
    { id: 'fidele', icon: '📅', color: '#C9787A', name: 'Soigneur fidèle', desc: 'Venir gâter vos animaux 7 jours différents', reward: { percent: 5, code: 'REFUGE-FIDELE5' }, test: function (s) { return s.careDays >= 7; } },
    { id: 'ami', icon: '💛', color: '#E07B39', name: 'Ami pour la vie', desc: 'Remplir le cœur d\'un animal', test: function (s) { return maxAffection(s) >= SECRET_AT[1]; } },
    { id: 'niveau5', icon: '⭐', color: '#283C23', name: 'Refuge étoilé', desc: 'Atteindre le niveau 5', reward: { percent: 10, code: 'REFUGE-ETOILE10' }, test: function (s) { return levelOf(s.xp) >= 5; } }
  ];

  var STORE = 'refuge-etat';
  var OLD_STORE = 'refuge-animaux'; // première version : simple liste d'animaux
  var PREFS = 'refuge-son';
  var XP = { animal: 15, care: 5, pickup: 2 };
  var SECRET_AT = [3, 7]; // jours de friandises pour débloquer chaque secret
  var PICKUPS_PER_DAY = 3;
  var MAX_ZOOM = 4;
  var TREASURES = [
    { icon: '🪶', name: 'une plume' }, { icon: '🌼', name: 'une fleur' },
    { icon: '🍎', name: 'une pomme' }, { icon: '🦋', name: 'un papillon' },
    { icon: '🌰', name: 'une noisette' }, { icon: '🐚', name: 'un coquillage' }
  ];
  var CONFETTI = ['#D8560E', '#B6BD77', '#657007', '#F4D9C4', '#F2B544'];
  // petites mélodies synthétisées : [fréquence, départ (s), durée (s), forme, glissando vers]
  var SOUNDS = {
    pop: [[520, 0, 0.09, 'sine', 980]],
    coin: [[988, 0, 0.07, 'square'], [1319, 0.07, 0.22, 'square']],
    heart: [[660, 0, 0.1, 'triangle'], [880, 0.1, 0.18, 'triangle']],
    knock: [[150, 0, 0.14, 'triangle', 70]],
    open: [[523, 0, 0.1, 'triangle'], [659, 0.09, 0.1, 'triangle'], [784, 0.18, 0.1, 'triangle'], [1047, 0.27, 0.35, 'triangle']],
    fanfare: [[523, 0, 0.12, 'square'], [659, 0.12, 0.12, 'square'], [784, 0.24, 0.12, 'square'], [1047, 0.36, 0.2, 'square'], [784, 0.56, 0.1, 'square'], [1047, 0.66, 0.45, 'square']],
    badge: [[784, 0, 0.08, 'sine'], [988, 0.07, 0.08, 'sine'], [1175, 0.14, 0.08, 'sine'], [1568, 0.21, 0.4, 'sine']],
    wrong: [[220, 0, 0.2, 'sawtooth', 150]]
  };
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function today() { return new Date().toLocaleDateString('sv'); } // AAAA-MM-JJ, heure locale
  function byId(id) { return ANIMALS.filter(function (a) { return a.id === id; })[0]; }
  function totalCare(s) { return Object.keys(s.care).reduce(function (t, k) { return t + s.care[k].n; }, 0); }
  function maxAffection(s) { return Object.keys(s.care).reduce(function (m, k) { return Math.max(m, s.care[k].n); }, 0); }
  // niveau 2 à 10 XP, 3 à 40, 4 à 90, 5 à 160...
  function levelOf(xp) { return Math.floor(Math.sqrt(xp / 10)) + 1; }
  function xpFor(level) { return 10 * (level - 1) * (level - 1); }

  // Remet n'importe quelle donnée lue (navigateur ou code de sauvegarde) dans une forme sûre.
  function normalize(raw) {
    var r = raw && typeof raw === 'object' ? raw : {};
    function num(v) { return typeof v === 'number' && isFinite(v) && v > 0 ? Math.floor(v) : 0; }
    function day(v) { return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ''; }
    function known(list) {
      return (Array.isArray(list) ? list : []).filter(function (id, i, l) { return byId(id) && l.indexOf(id) === i; });
    }
    var care = {};
    Object.keys(r.care && typeof r.care === 'object' ? r.care : {}).forEach(function (id) {
      if (byId(id)) care[id] = { n: num(r.care[id].n), last: day(r.care[id].last) };
    });
    return {
      animals: known(r.animals), seen: known(r.seen), care: care,
      careDays: num(r.careDays), lastCareDay: day(r.lastCareDay),
      xp: num(r.xp), found: num(r.found),
      pickDay: day(r.pickDay), picked: num(r.picked),
      badges: (Array.isArray(r.badges) ? r.badges : []).filter(function (b) {
        return BADGES.some(function (x) { return x.id === b; });
      })
    };
  }

  function load() {
    try {
      var saved = localStorage.getItem(STORE);
      if (saved) return normalize(JSON.parse(saved));
      var old = JSON.parse(localStorage.getItem(OLD_STORE)) || [];
      return normalize({ animals: old, xp: old.length * XP.animal });
    } catch (e) { return normalize({}); }
  }
  function save(s) {
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) { /* navigation privée : le refuge dure jusqu'au rechargement */ }
  }
  function exportCode(s) { return btoa(JSON.stringify(s)); }
  function importCode(code) { return normalize(JSON.parse(atob(code.trim()))); }

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

  // ---- sons ----
  var prefs = (function () {
    try { return JSON.parse(localStorage.getItem(PREFS)) || {}; } catch (e) { return {}; }
  })();
  if (prefs.sfx === undefined) prefs.sfx = true;
  if (prefs.music === undefined) prefs.music = true;
  function savePrefs() {
    try { localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch (e) { /* tant pis : réglage pour cette visite */ }
  }
  var audioCtx = null;
  function sfx(name) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!prefs.sfx || !AC) return;
    audioCtx = audioCtx || new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    var t0 = audioCtx.currentTime;
    SOUNDS[name].forEach(function (n) {
      var osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      var start = t0 + n[1], end = start + n[2];
      osc.type = n[3];
      osc.frequency.setValueAtTime(n[0], start);
      if (n[4]) osc.frequency.exponentialRampToValueAtTime(n[4], end);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(n[3] === 'square' || n[3] === 'sawtooth' ? 0.06 : 0.2, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(end + 0.02);
    });
  }

  // ---- effets ----
  function center(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  // gerbe de particules (couleurs ou émojis) autour d'un point de l'écran
  function burst(p, opts) {
    if (calm) return;
    opts = opts || {};
    var n = opts.count || 24;
    for (var i = 0; i < n; i++) {
      var bit = document.createElement('span');
      bit.className = 'fx-bit' + (opts.chars ? ' fx-char' : '');
      var angle = Math.random() * 2 * Math.PI, dist = (opts.spread || 120) * (0.4 + Math.random() * 0.8);
      bit.style.left = p.x + 'px';
      bit.style.top = p.y + 'px';
      bit.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      bit.style.setProperty('--dy', Math.sin(angle) * dist - (opts.lift || 40) + 'px');
      bit.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      bit.style.setProperty('--t', (0.7 + Math.random() * 0.6) + 's');
      if (opts.chars) bit.textContent = opts.chars[i % opts.chars.length];
      else bit.style.background = CONFETTI[i % CONFETTI.length];
      bit.addEventListener('animationend', function () { this.remove(); });
      document.body.appendChild(bit);
    }
  }
  function floatText(p, text) {
    var t = document.createElement('span');
    t.className = 'fx-float';
    t.textContent = text;
    t.style.left = p.x + 'px';
    t.style.top = p.y + 'px';
    t.addEventListener('animationend', function () { t.remove(); });
    document.body.appendChild(t);
  }
  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // relance l'animation même si la classe était déjà là
    el.classList.add(cls);
  }

  function init() {
    var map = document.querySelector('.refuge-map');
    if (!map) return;
    var state = load();
    var world = map.querySelector('.refuge-world');
    var layer = map.querySelector('.refuge-animals');
    var pickLayer = map.querySelector('.refuge-pickups');
    var form = document.querySelector('.refuge-code');
    var input = form.querySelector('input');
    var msg = form.querySelector('.refuge-code-msg');
    var levelBox = document.querySelector('.refuge-level');
    var toasts = document.createElement('div');
    toasts.className = 'refuge-toasts';
    toasts.setAttribute('aria-live', 'polite');
    document.body.appendChild(toasts);

    function commit() { save(state); renderLevel(); renderSash(); renderSave(); }

    // ---- carte : se déplacer et zoomer ----
    var view = { s: 1, x: 0, y: 0 }, base = 0;
    function applyView() {
      var size = base * view.s;
      view.x = Math.min(0, Math.max(map.clientWidth - size, view.x));
      view.y = Math.min(0, Math.max(map.clientHeight - size, view.y));
      world.style.transform = 'translate(' + view.x + 'px, ' + view.y + 'px) scale(' + view.s + ')';
    }
    function zoomAt(px, py, s) {
      s = Math.min(MAX_ZOOM, Math.max(1, s));
      view.x = px - (px - view.x) * s / view.s;
      view.y = py - (py - view.y) * s / view.s;
      view.s = s;
      applyView();
    }
    function smoothly(fn) {
      if (!calm) world.classList.add('is-smooth');
      fn();
      setTimeout(function () { world.classList.remove('is-smooth'); }, 350);
    }
    // la carte couvre toute la fenêtre, centrée
    function fit() {
      base = Math.max(map.clientWidth, map.clientHeight);
      world.style.width = world.style.height = base + 'px';
      view = { s: 1, x: (map.clientWidth - base) / 2, y: (map.clientHeight - base) / 2 };
      applyView();
    }
    function centerOn(el, s) {
      var x = parseFloat(el.style.left) / 100 * base, y = parseFloat(el.style.top) / 100 * base;
      view.s = Math.min(MAX_ZOOM, Math.max(view.s, s));
      view.x = map.clientWidth / 2 - x * view.s;
      view.y = map.clientHeight / 2 - y * view.s;
      applyView();
    }
    var lastWidth = 0;
    new ResizeObserver(function () {
      if (map.clientWidth !== lastWidth) { lastWidth = map.clientWidth; fit(); } else applyView();
    }).observe(map);

    var pointers = {}, moved = 0;
    map.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.refuge-bubble, .refuge-map-tools')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (!Object.keys(pointers).length) moved = 0;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      map.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
      var p = pointers[e.pointerId];
      if (!p) return;
      var ids = Object.keys(pointers);
      if (ids.length === 1) {
        view.x += e.clientX - p.x;
        view.y += e.clientY - p.y;
        moved += Math.abs(e.clientX - p.x) + Math.abs(e.clientY - p.y);
        applyView();
      } else if (ids.length === 2) {
        var o = pointers[ids[0] == e.pointerId ? ids[1] : ids[0]];
        var before = Math.hypot(p.x - o.x, p.y - o.y), after = Math.hypot(e.clientX - o.x, e.clientY - o.y);
        var r = map.getBoundingClientRect();
        if (before > 0) zoomAt((e.clientX + o.x) / 2 - r.left, (e.clientY + o.y) / 2 - r.top, view.s * after / before);
        moved += 20;
      }
      p.x = e.clientX;
      p.y = e.clientY;
    });
    function release(e) {
      delete pointers[e.pointerId];
      if (!Object.keys(pointers).length) map.classList.remove('is-dragging');
    }
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    // après un glissement, le doigt levé sur un animal ne doit pas ouvrir sa bulle
    map.addEventListener('click', function (e) {
      if (e.detail && moved > 8 && !e.target.closest('.refuge-bubble, .refuge-map-tools')) {
        e.stopPropagation();
        e.preventDefault();
      } else if (e.target === world || e.target.classList.contains('refuge-map-img')) {
        closeBubble();
      }
    }, true);
    // molette avec Ctrl (ou pincement du pavé tactile) : la molette seule fait défiler la page
    map.addEventListener('wheel', function (e) {
      if (!e.ctrlKey || e.target.closest('.refuge-bubble')) return;
      e.preventDefault();
      var r = map.getBoundingClientRect();
      var d = Math.max(-50, Math.min(50, e.deltaY)); // une souris envoie de gros crans, un pavé tactile de petits
      zoomAt(e.clientX - r.left, e.clientY - r.top, view.s * Math.exp(-d * 0.01));
    }, { passive: false });
    map.addEventListener('dblclick', function (e) {
      if (e.target.closest('.refuge-bubble, .refuge-map-tools, .refuge-animal, .refuge-pickup')) return;
      var r = map.getBoundingClientRect();
      smoothly(function () { zoomAt(e.clientX - r.left, e.clientY - r.top, view.s >= MAX_ZOOM ? 1 : view.s * 2); });
    });
    map.addEventListener('keydown', function (e) {
      if (e.target !== map) return;
      var step = 80, keys = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      if (keys[e.key]) {
        e.preventDefault();
        smoothly(function () { view.x += keys[e.key][0]; view.y += keys[e.key][1]; applyView(); });
      } else if (e.key === '+' || e.key === '=' || e.key === '-') {
        smoothly(function () { zoomAt(map.clientWidth / 2, map.clientHeight / 2, view.s * (e.key === '-' ? 0.7 : 1.4)); });
      }
    });
    map.querySelectorAll('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        var z = b.getAttribute('data-zoom');
        smoothly(function () {
          if (z === 'fit') fit();
          else zoomAt(map.clientWidth / 2, map.clientHeight / 2, view.s * (z === 'in' ? 1.5 : 1 / 1.5));
        });
      });
    });

    // ---- sons et musique ----
    var music = document.querySelector('.refuge-music');
    var sfxBtn = map.querySelector('[data-sound="sfx"]'), musicBtn = map.querySelector('[data-sound="music"]');
    music.volume = 0.3;
    function renderSound() {
      sfxBtn.textContent = prefs.sfx ? '🔊' : '🔇';
      sfxBtn.setAttribute('aria-pressed', prefs.sfx);
      musicBtn.classList.toggle('is-off', !prefs.music);
      musicBtn.setAttribute('aria-pressed', prefs.music);
    }
    function playMusic() { if (prefs.music && !musicBtn.hidden) music.play().catch(function () {}); }
    sfxBtn.addEventListener('click', function () { prefs.sfx = !prefs.sfx; savePrefs(); renderSound(); sfx('pop'); });
    musicBtn.addEventListener('click', function () {
      prefs.music = !prefs.music;
      savePrefs();
      renderSound();
      if (prefs.music) playMusic(); else music.pause();
    });
    // les navigateurs n'autorisent le son qu'après un premier geste du visiteur
    document.addEventListener('pointerdown', function () { playMusic(); }, { once: true });
    // pas encore de fichier de musique : on cache le bouton
    fetch(music.getAttribute('src'), { method: 'HEAD' }).then(function (r) {
      if (!r.ok) musicBtn.hidden = true;
    }).catch(function () { musicBtn.hidden = true; });
    renderSound();

    // ---- niveau ----
    var shownLevel = levelOf(state.xp);
    function renderLevel() {
      var lvl = levelOf(state.xp), from = xpFor(lvl), to = xpFor(lvl + 1);
      levelBox.querySelector('.refuge-level-num').textContent = 'Niveau ' + lvl;
      levelBox.querySelector('.refuge-level-fill').style.width = ((state.xp - from) / (to - from) * 100) + '%';
      levelBox.querySelector('.refuge-level-xp').textContent = (state.xp - from) + ' / ' + (to - from) + ' ✨';
      if (lvl > shownLevel) {
        shownLevel = lvl;
        var banner = document.createElement('div');
        banner.className = 'refuge-levelup';
        banner.innerHTML = '<span>Niveau ' + lvl + '&nbsp;!</span>';
        banner.addEventListener('animationend', function () { banner.remove(); });
        map.appendChild(banner);
        replay(levelBox, 'is-up');
        sfx('fanfare');
        burst(center(map), { count: 60, spread: 320 });
        burst(center(map), { count: 10, chars: ['⭐', '✨'], spread: 220 });
      }
    }
    function gainXp(n, from) {
      state.xp += n;
      if (from) floatText(from, '+' + n + ' ✨');
      replay(levelBox, 'is-gain');
    }

    // ---- écharpe à badges ----
    var patches = document.querySelector('.refuge-patches');
    var info = document.querySelector('.refuge-patch-info');
    var picked = null;
    function hasBadge(b) { return state.badges.indexOf(b.id) !== -1; }
    function renderSash() {
      var fresh = [];
      BADGES.forEach(function (b) {
        if (!hasBadge(b) && b.test(state)) {
          state.badges.push(b.id);
          fresh.push(b.id);
          save(state);
          toast(b);
        }
      });
      patches.innerHTML = '';
      BADGES.forEach(function (b, i) {
        var got = hasBadge(b);
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'refuge-patch' + (got ? ' is-sewn' : '') + (fresh.indexOf(b.id) !== -1 ? ' is-new' : '') + (picked === b ? ' is-picked' : '');
        btn.style.setProperty('--c', b.color);
        btn.style.setProperty('--r', ((i * 37) % 17 - 8) + 'deg'); // chaque écusson un peu de travers, comme cousu main
        btn.setAttribute('aria-label', b.name + (got ? ' (gagné)' : ' (à gagner)'));
        btn.innerHTML = '<span class="refuge-patch-icon" aria-hidden="true"></span>' +
          (b.reward ? '<span class="refuge-patch-tag" aria-hidden="true">−' + b.reward.percent + '%</span>' : '');
        btn.querySelector('.refuge-patch-icon').textContent = got ? b.icon : '?';
        btn.addEventListener('click', function () { picked = b; showPatch(b); renderSash(); sfx('pop'); });
        li.appendChild(btn);
        patches.appendChild(li);
      });
      if (!picked) showPatch(null);
    }
    function showPatch(b) {
      info.innerHTML = '';
      if (!b) {
        info.innerHTML = '<p class="refuge-patch-empty">Touchez un écusson pour le découvrir.</p>';
        return;
      }
      var got = hasBadge(b);
      info.innerHTML = '<span class="refuge-patch-big" aria-hidden="true"></span><div><strong></strong><p></p></div>';
      info.querySelector('.refuge-patch-big').textContent = got ? b.icon : '?';
      info.querySelector('strong').textContent = b.name + (got ? ' · cousu !' : '');
      info.querySelector('p').textContent = b.desc;
      if (!b.reward) return;
      var reward = document.createElement('div');
      reward.className = 'refuge-reward';
      if (got) {
        reward.innerHTML = '<span>Votre réduction de ' + b.reward.percent + '&nbsp;% :</span> <code></code> <button type="button" class="refuge-copy">Copier</button>' +
          '<small>À saisir au moment du paiement dans la <a href="boutique.html">boutique</a>.</small>';
        reward.querySelector('code').textContent = b.reward.code;
        reward.querySelector('.refuge-copy').addEventListener('click', function () {
          var btn = this;
          navigator.clipboard.writeText(b.reward.code).then(function () {
            btn.textContent = 'Copié !';
            sfx('coin');
          }, function () { btn.textContent = b.reward.code; });
        });
      } else {
        reward.innerHTML = '<span>🎁 Récompense : −' + b.reward.percent + '&nbsp;% dans la boutique</span>';
      }
      info.querySelector('div').appendChild(reward);
    }
    // une notification à la fois, même si plusieurs badges tombent ensemble
    var toastQueue = [];
    function toast(b) {
      toastQueue.push(b);
      if (toastQueue.length === 1) showToast();
    }
    function showToast() {
      var b = toastQueue[0];
      var t = document.createElement('div');
      t.className = 'refuge-toast';
      t.innerHTML = '<span class="refuge-toast-icon" aria-hidden="true"></span><span><small></small><strong></strong></span>';
      t.querySelector('.refuge-toast-icon').textContent = b.icon;
      t.querySelector('small').textContent = b.reward ? 'Nouveau badge + −' + b.reward.percent + ' % !' : 'Nouveau badge !';
      t.querySelector('strong').textContent = b.name;
      toasts.appendChild(t);
      sfx('badge');
      setTimeout(function () { burst(center(t), { count: 18, spread: 90 }); }, 250);
      var stay = toastQueue.length > 1 ? 1800 : 3500;
      setTimeout(function () { t.classList.add('is-out'); }, stay);
      setTimeout(function () {
        t.remove();
        toastQueue.shift();
        if (toastQueue.length) showToast();
      }, stay + 400);
    }

    // ---- sauvegarde ----
    var saveBox = document.querySelector('.refuge-save');
    function renderSave() { saveBox.querySelector('.refuge-save-code').value = exportCode(state); }
    saveBox.querySelector('.refuge-save-code').addEventListener('focus', function () { this.select(); });
    saveBox.querySelector('.refuge-save-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var field = this.querySelector('input'), out = this.querySelector('.refuge-save-msg');
      try {
        state = importCode(field.value);
      } catch (err) {
        out.textContent = "Ce code de sauvegarde n'est pas valide.";
        return;
      }
      save(state);
      out.textContent = 'Refuge restauré ! Rechargement…';
      setTimeout(function () { location.reload(); }, 800);
    });

    // ---- bulle d'un animal ----
    var bubble = map.querySelector('.refuge-bubble');
    var careBtn = bubble.querySelector('.refuge-care-btn');
    var opener = null, current = null;
    function renderCare(a) {
      var c = state.care[a.id] || { n: 0, last: '' };
      var hearts = '';
      for (var i = 1; i <= SECRET_AT[1]; i++) hearts += i <= c.n ? '♥' : '♡';
      bubble.querySelector('.refuge-hearts').textContent = hearts;
      bubble.querySelector('.refuge-hearts').setAttribute('aria-label', 'Affection : ' + Math.min(c.n, SECRET_AT[1]) + ' sur ' + SECRET_AT[1]);
      var done = c.last === today();
      careBtn.disabled = done;
      careBtn.textContent = done ? 'À demain !' : 'Donner une friandise';
      var next = SECRET_AT.filter(function (n) { return n > c.n; })[0];
      bubble.querySelector('.refuge-care-msg').textContent = done
        ? a.name + ' a eu sa friandise du jour.'
        : next ? 'Encore ' + (next - c.n) + ' jour' + (next - c.n > 1 ? 's' : '') + ' pour un secret.'
        : a.name + ' vous adore !';
      var box = bubble.querySelector('.refuge-secrets');
      box.innerHTML = '';
      SECRET_AT.forEach(function (n, i) {
        if (c.n < n || !a.secrets[i]) return;
        var p = document.createElement('p');
        p.className = 'refuge-secret';
        p.textContent = '🔑 ' + a.secrets[i];
        box.appendChild(p);
      });
    }
    function openBubble(a, btn) {
      if (opener) opener.classList.remove('is-picked');
      opener = btn;
      current = a;
      btn.classList.add('is-picked');
      var img = bubble.querySelector('.refuge-bubble-img');
      img.src = a.img;
      img.alt = a.species;
      bubble.querySelector('.refuge-bubble-species').textContent = a.species;
      bubble.querySelector('#refuge-bubble-name').textContent = a.name;
      bubble.querySelector('.refuge-bubble-story').textContent = a.story;
      var list = bubble.querySelector('.refuge-bubble-facts');
      list.innerHTML = '';
      a.facts.forEach(function (f) {
        var li = document.createElement('li');
        li.textContent = f;
        list.appendChild(li);
      });
      renderCare(a);
      bubble.hidden = false;
      bubble.scrollTop = 0;
      // la bulle sort de l'animal
      var from = center(btn), r = bubble.getBoundingClientRect();
      bubble.style.transformOrigin = (from.x - r.left) + 'px ' + (from.y - r.top) + 'px';
      replay(bubble, 'is-pop');
      sfx('pop');
      bubble.querySelector('.refuge-bubble-close').focus({ preventScroll: true });
      if (state.seen.indexOf(a.id) === -1) { state.seen.push(a.id); commit(); }
    }
    function closeBubble() {
      if (bubble.hidden) return;
      bubble.hidden = true;
      if (opener) { opener.classList.remove('is-picked'); opener.focus({ preventScroll: true }); opener = null; }
    }
    careBtn.addEventListener('click', function () {
      var a = current, c = state.care[a.id] || { n: 0, last: '' };
      if (c.last === today()) return;
      var before = c.n;
      state.care[a.id] = { n: c.n + 1, last: today() };
      if (state.lastCareDay !== today()) { state.careDays += 1; state.lastCareDay = today(); }
      replay(opener, 'is-happy');
      replay(bubble.querySelector('.refuge-bubble-img'), 'is-happy');
      sfx('heart');
      burst(center(opener), { count: 14, chars: ['💛', '🧡', '♥'], spread: 120, lift: 70 });
      gainXp(XP.care, center(careBtn));
      commit();
      renderCare(a);
      var secret = bubble.querySelector('.refuge-secrets').lastElementChild;
      if (secret && SECRET_AT.indexOf(before + 1) !== -1) {
        replay(secret, 'is-new');
        sfx('badge');
        burst(center(secret), { count: 30, spread: 160 });
      }
    });
    bubble.querySelector('.refuge-bubble-close').addEventListener('click', closeBubble);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeBubble();
    });

    // ---- animaux sur la carte ----
    function place(a, isNew) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'refuge-animal' + (isNew ? ' is-new' : '');
      btn.style.width = a.size + '%';
      btn.setAttribute('aria-label', 'Voir la fiche de ' + a.name);
      btn.innerHTML = '<img src="' + a.img + '" alt="" draggable="false"><span class="refuge-animal-name">' + a.name + '</span>';
      var spot = randomSpot(a.zone);
      btn.style.left = spot.x + '%';
      btn.style.top = spot.y + '%';
      btn.addEventListener('click', function () { openBubble(a, btn); });
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

    // ---- trésors du jour ----
    function spawnPickups() {
      if (state.pickDay !== today()) { state.pickDay = today(); state.picked = 0; save(state); }
      for (var i = state.picked; i < PICKUPS_PER_DAY; i++) {
        var t = TREASURES[Math.floor(Math.random() * TREASURES.length)];
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'refuge-pickup';
        b.textContent = t.icon;
        b.setAttribute('aria-label', 'Ramasser ' + t.name);
        b.style.left = (8 + Math.random() * 84) + '%';
        b.style.top = (8 + Math.random() * 84) + '%';
        b.style.animationDelay = (-Math.random() * 2) + 's';
        b.addEventListener('click', function () {
          var p = center(this);
          sfx('coin');
          burst(p, { count: 16, spread: 70 });
          this.remove();
          state.picked += 1;
          state.found += 1;
          gainXp(XP.pickup, p);
          commit();
        });
        pickLayer.appendChild(b);
      }
    }

    // ---- arrivée d'un animal : la caisse ----
    var reveal = document.querySelector('.refuge-reveal');
    var crate = reveal.querySelector('.refuge-crate');
    var card = reveal.querySelector('.refuge-reveal-card');
    var arriving = null, knocks = 0;
    function openReveal(a) {
      arriving = a;
      knocks = 0;
      crate.hidden = false;
      reveal.querySelector('.refuge-crate-hint').hidden = false;
      card.hidden = true;
      card.querySelector('img').src = a.img;
      card.querySelector('img').alt = a.species;
      card.querySelector('.eyebrow').textContent = a.species;
      card.querySelector('h3').textContent = a.name;
      reveal.classList.remove('is-open');
      reveal.hidden = false;
      document.body.style.overflow = 'hidden';
      crate.focus();
    }
    crate.addEventListener('click', function () {
      knocks += 1;
      replay(crate, 'is-knock');
      sfx('knock');
      burst(center(crate), { count: 6, chars: ['✨'], spread: 90 });
      if (knocks < 3 && !calm) return;
      var p = center(crate);
      crate.hidden = true;
      reveal.querySelector('.refuge-crate-hint').hidden = true;
      reveal.classList.add('is-open');
      card.hidden = false;
      sfx('open');
      burst(p, { count: 80, spread: 360 });
      burst(p, { count: 12, chars: ['⭐', '✨', '💛'], spread: 260 });
      card.querySelector('.refuge-reveal-go').focus();
    });
    card.querySelector('.refuge-reveal-go').addEventListener('click', function () {
      var a = arriving;
      reveal.hidden = true;
      document.body.style.overflow = '';
      var btn = place(a, true);
      map.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
      smoothly(function () { centerOn(btn, 1.6); });
      setTimeout(function () {
        replay(map, 'is-shake');
        sfx('pop');
        var p = center(btn);
        burst(p, { count: 40, spread: 160 });
        gainXp(XP.animal, p);
        commit();
      }, calm ? 0 : 600);
      msg.textContent = 'Bienvenue à ' + a.name + ' ! Touchez ' + a.name + ' pour découvrir son histoire.';
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = input.value.toUpperCase().replace(/\s+/g, '');
      if (!code) return;
      sha256(code).then(function (hash) {
        var a = ANIMALS.filter(function (x) { return x.code === hash; })[0];
        if (!a) {
          msg.textContent = 'Ce code ne correspond à aucun animal. Vérifiez-le dans votre courrier du mois.';
          sfx('wrong');
          replay(form, 'is-wrong');
          return;
        }
        if (state.animals.indexOf(a.id) !== -1) {
          msg.textContent = a.name + ' est déjà dans votre refuge.';
          return;
        }
        state.animals.push(a.id);
        save(state);
        input.value = '';
        msg.textContent = '';
        openReveal(a);
      });
    });

    fit();
    state.animals.forEach(function (id) { place(byId(id), false); });
    spawnPickups();
    commit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
