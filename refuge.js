// ===== Le Sanctuaire : carte où les animaux débloqués se promènent =====
// (sanctuaire.html ; les classes CSS gardent leur ancien préfixe « refuge- »)
// Pour ajouter l'animal du mois : une entrée dans ANIMALS.
//  - code : empreinte SHA-256 du code en majuscules sans espaces
//    (terminal : echo -n ZURI2026 | sha256sum)
//  - biome : le morceau de carte où il vit (voir BIOMES)
//  - zone : ellipse de son enclos, en % de la carte (centre x/y, rayons rx/ry)
//  - size : largeur de l'animal, en % de la carte
//  - hint : indice affiché tant qu'il n'est qu'une silhouette
//  - secrets : deux anecdotes débloquées après 3 et 7 jours de friandises
// shortcut: site statique, la progression est gardée dans le navigateur
// (localStorage, + code de sauvegarde) et un visiteur curieux peut tricher ;
// un vrai serveur ne vaut la peine que si les codes doivent rester secrets.
(function () {
  var ANIMALS = [
    {
      id: 'quinoa',
      code: '9dbd69b8962baf2e52aed27728bf8924770672822e43b0bfa5c3a13e41534452',
      img: 'photo/sanctuaire-lama.png',
      biome: 'ile',
      zone: { x: 40, y: 47, rx: 5, ry: 3.5 },
      size: 7.3,
      hint: "Il porte sa laine comme un manteau et regarde toujours les montagnes.",
      name: "Quinoa",
      species: "Lama",
      story: "Quinoa est arrivé au sanctuaire après avoir porté, pendant des années, les sacs des randonneurs dans les montagnes. Aujourd'hui, il ne porte plus rien d'autre que sa belle laine, et il passe ses après-midi à contempler les sommets.",
      facts: [
        "Le lama vit dans les Andes, en Amérique du Sud, parfois à plus de 4 000 mètres d'altitude.",
        "Les lamas crachent surtout… sur d'autres lamas, pour régler leurs disputes.",
        "Depuis des milliers d'années, les peuples des Andes l'utilisent pour porter des charges.",
        "C'est un animal très sociable, qui n'aime pas vivre seul."
      ],
      secrets: [
        "Quinoa fredonne : les lamas émettent un petit son doux, comme un bourdonnement, quand ils sont contents.",
        "Chaque matin, Quinoa attend l'ara Rubis au pied de la montagne pour lui dire bonjour."
      ]
    },
    {
      id: 'inti',
      code: 'd4dd79c2b047ba36c72c31e84d36c8a8037b1d98b38d88163826af02c8a27da0',
      img: 'photo/sanctuaire-ours-lunettes.png',
      biome: 'ile',
      zone: { x: 52, y: 52, rx: 4, ry: 2.5 },
      size: 8.8,
      hint: "Il porte des « lunettes » dessinées par la nature.",
      name: "Inti",
      species: "Ours à lunettes",
      story: "Inti (« soleil » en quechua) a été recueilli tout petit, seul au bord d'une forêt de nuages. Il est devenu un grand grimpeur et se construit des nids de branches pour faire la sieste au soleil.",
      facts: [
        "C'est le seul ours d'Amérique du Sud.",
        "Les taches claires autour de ses yeux sont différentes pour chaque ours, comme une empreinte.",
        "Excellent grimpeur, il se fabrique des plateformes de branches dans les arbres.",
        "Il mange surtout des plantes : fruits, feuilles et cœurs de broméliacées."
      ],
      secrets: [
        "Inti garde toujours une figue cachée derrière son oreille… enfin, il essaie.",
        "Les soirs de pleine lune, Inti s'assoit en haut de son arbre et regarde les étoiles."
      ]
    },
    {
      id: 'rubis',
      code: 'b73222a2be32ef5c24816d3ae577d11691d635a82f154ea9f5d41145de45cb4e',
      img: 'photo/sanctuaire-ara.png',
      biome: 'ile',
      zone: { x: 22, y: 52, rx: 6, ry: 4 },
      size: 12.8,
      hint: "Rouge, bleu et jaune, il ne tient pas en place.",
      name: "Rubis",
      species: "Ara rouge",
      story: "Rubis a vécu longtemps dans une cage trop petite. Au sanctuaire, il a réappris à voler, d'abord d'une branche à l'autre, puis au-dessus de toute l'île. Il ne s'arrête plus de faire des loopings.",
      facts: [
        "Un ara peut vivre plusieurs dizaines d'années.",
        "Les aras vivent souvent en couple toute leur vie.",
        "Ils mangent de l'argile au bord des rivières, qui les aide à digérer certaines graines.",
        "Son bec est si puissant qu'il casse des noix très dures."
      ],
      secrets: [
        "Rubis imite le rire des soigneurs, et ça fait rire tout le monde.",
        "Rubis a choisi Quinoa comme meilleur ami : il se pose parfois sur son dos."
      ]
    },
    {
      id: 'bruyere',
      code: '44919c43467526be1f10cca801f0a46fbd7dc85cdfc64894a0802ce1f5e04f3c',
      img: 'photo/sanctuaire-vache-highland.png',
      biome: 'doree',
      zone: { x: 84, y: 64, rx: 4, ry: 2.5 },
      size: 9.3,
      hint: "Une frange, des cornes et un manteau tout roux.",
      name: "Bruyère",
      species: "Vache Highland",
      story: "Bruyère vient d'une ferme où elle était la plus petite du troupeau. Au sanctuaire, elle a trouvé sa place : elle veille sur tout le monde depuis la colline, la frange au vent.",
      facts: [
        "La vache Highland vient des Highlands, les montagnes d'Écosse.",
        "Son double pelage la protège du froid, du vent et de la pluie.",
        "Sa longue frange protège ses yeux du vent et des insectes.",
        "Elle est très rustique : elle vit dehors toute l'année."
      ],
      secrets: [
        "Bruyère adore qu'on lui gratte le front, juste sous la frange.",
        "Quand il pleut, Bruyère se met à l'abri… à côté de la martre Noisette, pour lui faire de l'ombre."
      ]
    },
    {
      id: 'noisette',
      code: '26a2ba91d38a7049d7f5ac8655728dfacf9682bfc3c48e073e19ff4524800e8a',
      img: 'photo/sanctuaire-martre.png',
      biome: 'doree',
      zone: { x: 68, y: 69, rx: 4, ry: 1.5 },
      size: 9.3,
      hint: "Une queue touffue et une tache claire sous le menton.",
      name: "Noisette",
      species: "Martre des pins",
      story: "Noisette a été retrouvée dans un grenier, bien loin de sa forêt. Au sanctuaire, elle file entre les arbres comme une flèche et connaît toutes les cachettes de l'île.",
      facts: [
        "La martre des pins vit dans les forêts et grimpe très bien aux arbres.",
        "La tache claire sur sa gorge est différente pour chaque martre.",
        "Elle est surtout active au crépuscule et la nuit.",
        "Elle aime les fruits et les baies autant que les petites proies."
      ],
      secrets: [
        "Noisette cache des baies dans un vieux tronc, et oublie toujours où.",
        "Noisette fait sa toilette avec beaucoup de soin, au moins dix fois par jour."
      ]
    },
    {
      id: 'myrtille',
      code: 'd148fb0ac3d5739312928226823fdf1f1f569f7cb5dadde7e53fc9dbd89f5b8b',
      img: 'photo/sanctuaire-ourse.png',
      biome: 'doree',
      zone: { x: 63, y: 86, rx: 3.5, ry: 2 },
      size: 13.4,
      hint: "Une maman, un ourson et un poisson qui gigote.",
      name: "Myrtille et Pépin",
      species: "Ours brun",
      story: "Myrtille est arrivée au sanctuaire avec Pépin, son ourson, après un hiver difficile. Elle lui apprend à pêcher dans la rivière : Pépin, lui, préfère encore regarder les poissons.",
      facts: [
        "Les oursons restent deux à trois ans avec leur mère, qui leur apprend tout.",
        "L'ours brun pêche les saumons quand ils remontent les rivières.",
        "En hiver, il peut passer des mois dans sa tanière sans manger.",
        "Son odorat est l'un des meilleurs de tout le monde animal."
      ],
      secrets: [
        "Pépin a peur des grenouilles, mais il ne veut pas que Myrtille le sache.",
        "Myrtille donne toujours le plus beau poisson à Pépin."
      ]
    },
    {
      id: 'galet',
      code: 'eb8904a399c3e6bcf3af6833d65af26b2a00aac0e271d10ba35d63e28bdb1904',
      img: 'photo/sanctuaire-phoque.png',
      biome: 'ilot',
      zone: { x: 13, y: 37, rx: 3, ry: 1 },
      size: 5.3,
      hint: "Il sort la tête de l'eau pour voir ce qui se passe.",
      name: "Galet",
      species: "Phoque veau-marin",
      story: "Galet a été trouvé sur une plage, tout seul, quand il n'était qu'un bébé phoque. Il a grandi au sanctuaire et passe ses journées à sortir la tête de l'eau pour observer ce qui se passe.",
      facts: [
        "Le phoque veau-marin vit aussi sur les côtes de la mer du Nord.",
        "Ses moustaches sentent le mouvement des poissons dans l'eau, même dans le noir.",
        "Il peut rester sous l'eau jusqu'à une demi-heure.",
        "Chaque phoque a des taches différentes."
      ],
      secrets: [
        "Galet a toujours l'air de sourire, même quand il dort.",
        "Galet salue chaque bateau qui passe en tapant l'eau avec sa nageoire."
      ]
    },
    {
      id: 'flocon',
      code: 'd087287ed282c8f9b8e7664b8b7e12c14daaaa3da9fd529f845a919139e9de0e',
      img: 'photo/sanctuaire-ours-polaire.png',
      biome: 'banquise',
      zone: { x: 74, y: 36, rx: 3, ry: 0.8 },
      size: 8.4,
      hint: "Blanc comme la neige, il adore glisser sur le ventre.",
      name: "Flocon",
      species: "Ours polaire",
      story: "Flocon a été recueilli tout petit, quand la glace de sa banquise a fondu trop tôt. Il adore glisser sur le ventre et faire des bulles en nageant.",
      facts: [
        "Sous ses poils, la peau de l'ours polaire est noire, et ses poils sont transparents.",
        "C'est un excellent nageur, capable de nager pendant des heures.",
        "Son odorat lui permet de sentir un phoque à plus d'un kilomètre.",
        "Les oursons naissent dans une tanière creusée dans la neige."
      ],
      secrets: [
        "Flocon se roule dans la neige pour se sécher, comme un chien.",
        "Flocon et Galet se regardent de loin, chacun sur son îlot. Les soigneurs pensent qu'ils sont amis."
      ]
    }
  ];

  // La carte : une seule image. CELL_MAP la découpe en CELLS × CELLS cases ; chaque lettre dit
  // à quel biome appartient la case (majuscule : la terre, minuscule : la mer autour, qui s'ouvre
  // avec l'île ; point : l'horizon, dévoilé une fois tous les biomes ouverts). Le premier biome
  // est ouvert d'office, les autres restent dans les nuages jusqu'à l'arrivée de leur premier animal.
  var MAP_IMG = 'photo/sanctuaire-carte.webp';
  var CELLS = 25;
  var CELL_MAP = [
    '.........................',
    '.........................',
    '.........................',
    '.........................',
    '.........................',
    '.........................',
    '................pppppp...',
    '.ggggg..sssssssspPPPPp...',
    'ggGGGgsssSSSSSSSsPPPpp...',
    'gGGGgssSSSSSSSSSsPppp....',
    'ggggSSSSSSSSSSSSSpp...ddd',
    '...sSSSSSSSSSSSSSs..dddDd',
    '..ssSSSSSSSSSSSSss..dDDDd',
    '..sSSSSSSSSSSSSsdddddDDDd',
    '..sSSSSSSSSSSSsdDDDDDDDDd',
    '..ssSSSSSSSSSssdDDDDDDDDd',
    '...sSSSSSSSSss.dDDDDDDDDd',
    '..ssSSSSSSSSsdddDDDDDDDDD',
    '..sSSSSSSSssDDdDDDDDDDDDD',
    '..sSSSSSssdDDDDDDDDDDDddd',
    '..sSSSSss.dDDDDDDDDdddd..',
    '..ssssss..dDDDDDDDDd.....',
    '..........dddddDDDdd.....',
    '..............ddDdd......',
    '...............ddd.......'
  ];
  var BIOMES = [
    { id: 'ile', key: 's', name: 'La Grande Île' },
    { id: 'doree', key: 'd', name: "L'Île Dorée" },
    { id: 'ilot', key: 'g', name: "L'Îlot des Phoques" },
    { id: 'banquise', key: 'p', name: 'La Banquise' },
    { id: 'horizon', key: '.', name: "L'Horizon" }
  ];
  // décor fixe, en % de la carte (x, y : le pied de l'objet)
  var DECOR = [
    { img: 'photo/sanctuaire-buisson.png', x: 83, y: 47, size: 7.6 }
  ];
  var CELL_OWNER = CELL_MAP.map(function (line) {
    return line.split('').map(function (ch) {
      return BIOMES.filter(function (b) { return b.key === ch.toLowerCase(); })[0].id;
    });
  });
  // Le prochain pensionnaire, montré en silhouette avant son arrivée.
  var NEXT = { id: 'quinoa', when: 'Arrive en novembre' };
  var CLOUD = 'photo/refuge-nuage.png';

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
    { id: 'arche', icon: '🌍', color: '#657007', name: 'Grand sanctuaire', desc: 'Accueillir 5 animaux', reward: { percent: 5, code: 'REFUGE-ARCHE5' }, test: function (s) { return s.animals.length >= 5; } },
    { id: 'glaneur', icon: '🧺', color: '#8B5A2B', name: 'Glaneur', desc: 'Ramasser 25 trésors', test: function (s) { return s.found >= 25; } },
    { id: 'fidele', icon: '📅', color: '#C9787A', name: 'Soigneur fidèle', desc: 'Venir gâter vos animaux 7 jours différents', reward: { percent: 5, code: 'REFUGE-FIDELE5' }, test: function (s) { return s.careDays >= 7; } },
    { id: 'ami', icon: '💛', color: '#E07B39', name: 'Ami pour la vie', desc: 'Remplir le cœur d\'un animal', test: function (s) { return maxAffection(s) >= SECRET_AT[1]; } },
    { id: 'explorateur', icon: '🧭', color: '#3E7C8C', name: 'Explorateur', desc: 'Ouvrir un nouveau biome', test: function (s) { return openIds(s).length >= 2; } },
    { id: 'cartographe', icon: '🗺️', color: '#9B6B43', name: 'Cartographe', desc: 'Ouvrir tous les biomes', test: function (s) { return openIds(s).length === BIOMES.length; } },
    { id: 'niveau5', icon: '⭐', color: '#283C23', name: 'Sanctuaire étoilé', desc: 'Atteindre le niveau 5', reward: { percent: 10, code: 'REFUGE-ETOILE10' }, test: function (s) { return levelOf(s.xp) >= 5; } }
  ];

  var STORE = 'refuge-etat-3'; // nouvelle clé = progression remise à zéro (nouvelle carte, nouveaux animaux)
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
  function biomeOf(a) { return BIOMES.filter(function (b) { return b.id === a.biome; })[0]; }
  // biomes ouverts : le premier, ceux où vit au moins un animal accueilli, et l'horizon à la fin
  function openIds(s) {
    var ids = BIOMES.filter(function (b, i) {
      return i === 0 || s.animals.some(function (id) { return byId(id).biome === b.id; });
    }).map(function (b) { return b.id; });
    if (ids.length === BIOMES.length - 1) ids.push('horizon');
    return ids;
  }
  // toutes les cases [ligne, colonne] d'un biome
  function cellsOf(id) {
    var out = [];
    CELL_OWNER.forEach(function (line, r) { line.forEach(function (o, c) { if (o === id) out.push([r, c]); }); });
    return out;
  }
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
      return normalize(saved ? JSON.parse(saved) : {});
    } catch (e) { return normalize({}); }
  }
  function save(s) {
    try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) { /* navigation privée : le sanctuaire dure jusqu'au rechargement */ }
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

    // ---- carte : se déplacer et zoomer, dans les limites des biomes ouverts ----
    var MARGIN = 0.06; // on voit les nuages autour des biomes ouverts (en fraction de carte)
    var view = { s: 1, x: 0, y: 0 }, tile = 0, box = null; // tile : taille de la carte en px, au zoom 1
    function computeBox() {
      var cells = [];
      openIds(state).forEach(function (id) { cells = cells.concat(cellsOf(id)); });
      var rows = cells.map(function (c) { return c[0]; }), cols = cells.map(function (c) { return c[1]; });
      box = {
        x0: Math.max(0, Math.min.apply(null, cols) / CELLS - MARGIN), y0: Math.max(0, Math.min.apply(null, rows) / CELLS - MARGIN),
        x1: Math.min(1, (Math.max.apply(null, cols) + 1) / CELLS + MARGIN), y1: Math.min(1, (Math.max.apply(null, rows) + 1) / CELLS + MARGIN)
      };
    }
    // zoom minimal : la zone ouverte remplit juste la fenêtre
    function minScale() {
      return Math.max(map.clientWidth / ((box.x1 - box.x0) * tile), map.clientHeight / ((box.y1 - box.y0) * tile));
    }
    function applyView() {
      var min = minScale();
      view.s = Math.min(min * MAX_ZOOM, Math.max(min, view.s));
      view.x = Math.min(-box.x0 * tile * view.s, Math.max(map.clientWidth - box.x1 * tile * view.s, view.x));
      view.y = Math.min(-box.y0 * tile * view.s, Math.max(map.clientHeight - box.y1 * tile * view.s, view.y));
      world.style.transform = 'translate(' + view.x + 'px, ' + view.y + 'px) scale(' + view.s + ')';
    }
    function zoomAt(px, py, s) {
      var min = minScale();
      s = Math.min(min * MAX_ZOOM, Math.max(min, s));
      view.x = px - (px - view.x) * s / view.s;
      view.y = py - (py - view.y) * s / view.s;
      view.s = s;
      applyView();
    }
    function smoothly(fn, ms) {
      if (!calm) world.classList.add('is-smooth');
      world.style.transitionDuration = (ms || 300) + 'ms';
      fn();
      setTimeout(function () { world.classList.remove('is-smooth'); }, (ms || 300) + 50);
    }
    // vue d'ensemble : toute la zone ouverte, centrée
    function fit() {
      tile = Math.max(map.clientWidth, map.clientHeight);
      world.style.width = world.style.height = tile + 'px';
      computeBox();
      view.s = minScale();
      view.x = map.clientWidth / 2 - (box.x0 + box.x1) / 2 * tile * view.s;
      view.y = map.clientHeight / 2 - (box.y0 + box.y1) / 2 * tile * view.s;
      applyView();
    }
    function centerOn(el, zoom) {
      var x = parseFloat(el.style.left) / 100 * tile, y = parseFloat(el.style.top) / 100 * tile;
      view.s = Math.max(view.s, minScale() * zoom);
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
      smoothly(function () { zoomAt(e.clientX - r.left, e.clientY - r.top, view.s >= minScale() * MAX_ZOOM * 0.99 ? 0 : view.s * 2); });
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
      out.textContent = 'Sanctuaire restauré ! Rechargement…';
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

    // ---- biomes : tuiles, brume et silhouettes ----
    var fogs = map.querySelector('.refuge-fogs');
    map.querySelector('.refuge-map-img').src = MAP_IMG;
    DECOR.forEach(function (d) {
      var img = document.createElement('img');
      img.className = 'refuge-decor-item';
      img.src = d.img;
      img.alt = '';
      img.draggable = false;
      img.style.left = d.x + '%';
      img.style.top = d.y + '%';
      img.style.width = d.size + '%';
      map.querySelector('.refuge-decor').appendChild(img);
    });
    var shownOpen = [];
    function renderBiomes() {
      var open = openIds(state);
      function isOpenCell(r, c) { return r >= 0 && c >= 0 && r < CELLS && c < CELLS && open.indexOf(CELL_OWNER[r][c]) !== -1; }
      var step = 100 / CELLS;
      fogs.innerHTML = '';
      BIOMES.forEach(function (b, n) {
        if (open.indexOf(b.id) !== -1) return;
        var cells = cellsOf(b.id);
        if (!cells.length) return;
        var fog = document.createElement('div');
        fog.className = 'refuge-fog';
        fog.setAttribute('data-biome', b.id);
        fog.setAttribute('role', 'img');
        fog.setAttribute('aria-label', b.name + ', encore dans les nuages');
        // masse de nuages : les cases du biome, un peu élargies et adoucies
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CELLS + ' ' + CELLS + '" preserveAspectRatio="none">' +
          '<filter id="f" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="0.3"/></filter><g filter="url(#f)">' +
          cells.map(function (c) { return '<rect x="' + (c[1] - 0.35) + '" y="' + (c[0] - 0.35) + '" width="1.7" height="1.7"/>'; }).join('') + '</g></svg>';
        var fill = document.createElement('div');
        fill.className = 'refuge-fog-fill';
        fill.style.webkitMaskImage = fill.style.maskImage = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
        fog.appendChild(fill);
        // les nuages, toujours les mêmes pour un biome : une rangée sur chaque bord qui touche
        // une zone ouverte (jamais de ligne droite), et quelques-uns qui flânent au-dessus
        var seed = n * 9301 + 49297;
        function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
        var mid = cells.reduce(function (m, c) { return [m[0] + c[0] / cells.length, m[1] + c[1] / cells.length]; }, [0, 0]);
        function cloud(x, y, w) {
          var img = document.createElement('img');
          img.className = 'refuge-cloud';
          img.src = CLOUD;
          img.alt = '';
          img.draggable = false;
          img.style.left = x * step + '%';
          img.style.top = y * step + '%';
          img.style.width = w * step + '%';
          if (rand() < 0.5) img.style.scale = '-1 1';
          img.style.setProperty('--drift', (rand() * 6 + 2) * (rand() < 0.5 ? -1 : 1) + '%');
          img.style.animationDuration = (10 + rand() * 10) + 's';
          img.style.animationDelay = (-rand() * 20) + 's';
          // en se levant, chaque nuage s'envole loin du centre du biome
          var dx = x - mid[1] - 0.5, dy = y - mid[0] - 0.5, len = Math.hypot(dx, dy) || 1;
          img.style.setProperty('--fly-x', dx / len * 160 + '%');
          img.style.setProperty('--fly-y', dy / len * 400 + '%');
          img.style.transitionDelay = rand() * 0.35 + 's';
          fog.appendChild(img);
        }
        cells.forEach(function (c) {
          var r = c[0], k = c[1];
          // décalages au hasard : sinon les nuages s'alignent en colonnes
          if (isOpenCell(r, k - 1)) { cloud(k + rand() * 0.5, r + 0.2 + rand() * 0.15, 1.4 + rand() * 0.9); cloud(k + rand() * 0.5, r + 0.65 + rand() * 0.15, 1.4 + rand() * 0.9); }
          if (isOpenCell(r, k + 1)) { cloud(k + 0.5 + rand() * 0.5, r + 0.2 + rand() * 0.15, 1.4 + rand() * 0.9); cloud(k + 0.5 + rand() * 0.5, r + 0.65 + rand() * 0.15, 1.4 + rand() * 0.9); }
          if (isOpenCell(r - 1, k)) cloud(k + 0.3 + rand() * 0.4, r + rand() * 0.3, 1.8 + rand() * 0.9);
          if (isOpenCell(r + 1, k)) cloud(k + 0.3 + rand() * 0.4, r + 0.7 + rand() * 0.3, 1.8 + rand() * 0.9);
          if (rand() < 0.3) cloud(k + rand(), r + rand(), 2.2 + rand() * 1.2);
        });
        fogs.appendChild(fog);
      });
      shownOpen = open;
    }
    // les nuages se lèvent sur un biome qui vient d'ouvrir
    function liftFog(b, then) {
      var fog = fogs.querySelector('.refuge-fog[data-biome="' + b.id + '"]');
      sfx('open');
      if (fog) {
        fog.classList.add('is-lifting');
        setTimeout(function () { burst(center(map), { count: 50, spread: 260 }); }, 300);
      }
      computeBox();
      var cells = cellsOf(b.id);
      var cy = (cells.reduce(function (t, c) { return t + c[0]; }, 0) / cells.length + 0.5) / CELLS;
      var cx = (cells.reduce(function (t, c) { return t + c[1]; }, 0) / cells.length + 0.5) / CELLS;
      smoothly(function () {
        view.s = minScale() * 1.6;
        view.x = map.clientWidth / 2 - cx * tile * view.s;
        view.y = map.clientHeight / 2 - cy * tile * view.s;
        applyView();
      }, 900);
      // les biomes encore fermés qui touchent le nouveau reçoivent leur bordure de nuages
      setTimeout(function () { renderBiomes(); then(); }, calm ? 0 : 1500);
    }
    var ghost = null;
    function renderGhost() {
      if (ghost) { ghost.remove(); ghost = null; }
      var a = byId(NEXT.id);
      if (!a || state.animals.indexOf(a.id) !== -1 || openIds(state).indexOf(a.biome) === -1) return;
      ghost = place(a, false, true);
    }

    // ---- animaux sur la carte ----
    // ghost : le prochain pensionnaire, en silhouette, qui ne se laisse pas encore approcher
    function place(a, isNew, isGhost) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'refuge-animal' + (isNew ? ' is-new' : '') + (isGhost ? ' is-ghost' : '');
      btn.style.width = a.size + '%';
      if (isGhost) {
        btn.setAttribute('aria-label', 'Un mystérieux pensionnaire. ' + NEXT.when);
        btn.innerHTML = '<img src="' + a.img + '" alt="" draggable="false"><span class="refuge-animal-name">?</span>' +
          '<span class="refuge-ghost-tip"><strong></strong><span></span></span>';
        btn.querySelector('.refuge-ghost-tip strong').textContent = NEXT.when;
        btn.querySelector('.refuge-ghost-tip span').textContent = a.hint || '';
        btn.addEventListener('click', function () { btn.classList.toggle('is-told'); sfx('pop'); });
      } else {
        btn.setAttribute('aria-label', 'Voir la fiche de ' + a.name);
        btn.innerHTML = '<img src="' + a.img + '" alt="" draggable="false"><span class="refuge-animal-name">' + a.name + '</span>';
        btn.addEventListener('click', function () { openBubble(a, btn); });
        map.classList.add('has-animals');
      }
      var spot = randomSpot(a.zone);
      btn.style.left = spot.x + '%';
      btn.style.top = spot.y + '%';
      layer.appendChild(btn);
      if (!calm) wander(a, btn, spot);
      return btn;
    }
    function wander(a, btn, from) {
      setTimeout(function () {
        if (!btn.isConnected) return;
        var to = randomSpot(a.zone);
        var dist = Math.hypot(to.x - from.x, to.y - from.y);
        btn.style.transitionDuration = (dist * 1.5).toFixed(1) + 's';
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
        // une case au hasard parmi celles des biomes ouverts
        var cells = [];
        openIds(state).forEach(function (id) { cells = cells.concat(cellsOf(id)); });
        var cell = cells[Math.floor(Math.random() * cells.length)];
        b.style.left = (cell[1] + 0.2 + Math.random() * 0.6) * 100 / CELLS + '%';
        b.style.top = (cell[0] + 0.2 + Math.random() * 0.6) * 100 / CELLS + '%';
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
      map.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
      msg.textContent = 'Bienvenue à ' + a.name + ' ! Touchez ' + a.name + ' pour découvrir son histoire.';
      function arrive() {
        renderGhost();
        var btn = place(a, true);
        smoothly(function () { centerOn(btn, 1.6); });
        setTimeout(function () {
          replay(map, 'is-shake');
          sfx('pop');
          var p = center(btn);
          burst(p, { count: 40, spread: 160 });
          gainXp(XP.animal, p);
          commit();
        }, calm ? 0 : 600);
      }
      // nouveau biome : on lève d'abord la brume, puis l'animal entre
      if (shownOpen.indexOf(a.biome) === -1) setTimeout(function () { liftFog(biomeOf(a), arrive); }, calm ? 0 : 500);
      else arrive();
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
          msg.textContent = a.name + ' est déjà dans votre sanctuaire.';
          return;
        }
        state.animals.push(a.id);
        save(state);
        input.value = '';
        msg.textContent = '';
        openReveal(a);
      });
    });

    renderBiomes();
    fit();
    state.animals.forEach(function (id) { place(byId(id), false); });
    renderGhost();
    spawnPickups();
    commit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
