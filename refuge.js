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

  // Badges : test sur l'état du refuge
  var BADGES = [
    { id: 'premier', icon: '🐾', name: 'Premier pensionnaire', desc: 'Accueillir un premier animal', test: function (s) { return s.animals.length >= 1; } },
    { id: 'famille', icon: '🏡', name: 'Petite famille', desc: 'Accueillir 3 animaux', test: function (s) { return s.animals.length >= 3; } },
    { id: 'arche', icon: '🌍', name: 'Grand refuge', desc: 'Accueillir 5 animaux', test: function (s) { return s.animals.length >= 5; } },
    { id: 'friandise', icon: '🍎', name: 'Première friandise', desc: 'Gâter un animal', test: function (s) { return totalCare(s) >= 1; } },
    { id: 'fidele', icon: '📅', name: 'Soigneur fidèle', desc: 'Venir gâter vos animaux 7 jours différents', test: function (s) { return s.careDays >= 7; } },
    { id: 'secret', icon: '🔑', name: 'Gardien de secrets', desc: 'Découvrir le secret d\'un animal', test: function (s) { return maxAffection(s) >= SECRET_AT[0]; } },
    { id: 'ami', icon: '💛', name: 'Ami pour la vie', desc: 'Remplir le cœur d\'un animal', test: function (s) { return maxAffection(s) >= SECRET_AT[1]; } },
    { id: 'glaneur', icon: '🧺', name: 'Glaneur', desc: 'Ramasser 25 trésors', test: function (s) { return s.found >= 25; } },
    { id: 'niveau5', icon: '⭐', name: 'Refuge étoilé', desc: 'Atteindre le niveau 5', test: function (s) { return levelOf(s.xp) >= 5; } },
    { id: 'curieux', icon: '📖', name: 'Curieux', desc: 'Lire la fiche de 3 animaux', test: function (s) { return s.seen.length >= 3; } }
  ];

  var STORE = 'refuge-etat';
  var OLD_STORE = 'refuge-animaux'; // première version : simple liste d'animaux
  var XP = { animal: 15, care: 5, pickup: 2 };
  var SECRET_AT = [3, 7]; // jours de friandises pour débloquer chaque secret
  var PICKUPS_PER_DAY = 3;
  var TREASURES = [
    { icon: '🪶', name: 'une plume' }, { icon: '🌼', name: 'une fleur' },
    { icon: '🍎', name: 'une pomme' }, { icon: '🦋', name: 'un papillon' },
    { icon: '🌰', name: 'une noisette' }, { icon: '🐚', name: 'un coquillage' }
  ];
  var CONFETTI = ['#D8560E', '#B6BD77', '#657007', '#F4D9C4', '#F2B544'];
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

    function commit() { save(state); renderLevel(); renderBadges(); renderSave(); }

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
        burst(center(map), { count: 60, spread: 320 });
        burst(center(map), { count: 10, chars: ['⭐', '✨'], spread: 220 });
      }
    }
    function gainXp(n, from) {
      state.xp += n;
      if (from) floatText(from, '+' + n + ' ✨');
      replay(levelBox, 'is-gain');
    }

    // ---- badges ----
    var badgeList = document.querySelector('.refuge-trophy-list');
    function renderBadges() {
      BADGES.forEach(function (b) {
        if (state.badges.indexOf(b.id) === -1 && b.test(state)) {
          state.badges.push(b.id);
          save(state);
          toast(b);
        }
      });
      badgeList.innerHTML = '';
      BADGES.forEach(function (b) {
        var li = document.createElement('li');
        var got = state.badges.indexOf(b.id) !== -1;
        li.className = 'refuge-trophy' + (got ? ' is-got' : '');
        li.innerHTML = '<span class="refuge-trophy-icon" aria-hidden="true"></span><strong></strong><small></small>';
        li.querySelector('.refuge-trophy-icon').textContent = got ? b.icon : '🔒';
        li.querySelector('strong').textContent = b.name;
        li.querySelector('small').textContent = b.desc;
        badgeList.appendChild(li);
      });
    }
    function toast(b) {
      var t = document.createElement('div');
      t.className = 'refuge-toast';
      t.innerHTML = '<span class="refuge-toast-icon" aria-hidden="true"></span><span><small>Nouveau badge&nbsp;!</small><strong></strong></span>';
      t.querySelector('.refuge-toast-icon').textContent = b.icon;
      t.querySelector('strong').textContent = b.name;
      toasts.appendChild(t);
      setTimeout(function () { burst(center(t), { count: 18, spread: 90 }); }, 250);
      setTimeout(function () { t.classList.add('is-out'); }, 3800);
      setTimeout(function () { t.remove(); }, 4300);
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

    // ---- fiche ----
    var modal = document.querySelector('.refuge-fiche');
    var careBtn = modal.querySelector('.refuge-care-btn');
    var opener = null, current = null;
    function renderCare(a) {
      var c = state.care[a.id] || { n: 0, last: '' };
      var hearts = '';
      for (var i = 1; i <= SECRET_AT[1]; i++) hearts += i <= c.n ? '♥' : '♡';
      modal.querySelector('.refuge-hearts').textContent = hearts;
      modal.querySelector('.refuge-hearts').setAttribute('aria-label', 'Affection : ' + Math.min(c.n, SECRET_AT[1]) + ' sur ' + SECRET_AT[1]);
      var done = c.last === today();
      careBtn.disabled = done;
      careBtn.textContent = done ? 'À demain !' : 'Donner une friandise';
      var next = SECRET_AT.filter(function (n) { return n > c.n; })[0];
      modal.querySelector('.refuge-care-msg').textContent = done
        ? a.name + ' a eu sa friandise du jour. Revenez demain !'
        : next ? 'Encore ' + (next - c.n) + ' jour' + (next - c.n > 1 ? 's' : '') + ' de friandises pour découvrir un secret de ' + a.name + '.'
        : a.name + ' vous adore !';
      var box = modal.querySelector('.refuge-secrets');
      box.innerHTML = '';
      SECRET_AT.forEach(function (n, i) {
        if (c.n < n || !a.secrets[i]) return;
        var p = document.createElement('p');
        p.className = 'refuge-secret';
        p.textContent = '🔑 ' + a.secrets[i];
        box.appendChild(p);
      });
    }
    function openFiche(a, btn) {
      opener = btn;
      current = a;
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
      renderCare(a);
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      modal.querySelector('.artwork-modal-close').focus();
      if (state.seen.indexOf(a.id) === -1) { state.seen.push(a.id); commit(); }
    }
    function closeFiche() {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    }
    careBtn.addEventListener('click', function () {
      var a = current, c = state.care[a.id] || { n: 0, last: '' };
      if (c.last === today()) return;
      var before = c.n;
      state.care[a.id] = { n: c.n + 1, last: today() };
      if (state.lastCareDay !== today()) { state.careDays += 1; state.lastCareDay = today(); }
      var img = modal.querySelector('.artwork-modal-img');
      replay(img, 'is-happy');
      burst(center(img), { count: 14, chars: ['💛', '🧡', '♥'], spread: 160, lift: 80 });
      gainXp(XP.care, center(careBtn));
      commit();
      renderCare(a);
      var secret = modal.querySelector('.refuge-secrets').lastElementChild;
      if (secret && SECRET_AT.indexOf(before + 1) !== -1) {
        replay(secret, 'is-new');
        burst(center(secret), { count: 30, spread: 180 });
      }
    });
    modal.querySelector('.artwork-modal-close').addEventListener('click', closeFiche);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeFiche(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeFiche();
    });

    // ---- animaux sur la carte ----
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
      burst(center(crate), { count: 6, chars: ['✨'], spread: 90 });
      if (knocks < 3 && !calm) return;
      var p = center(crate);
      crate.hidden = true;
      reveal.querySelector('.refuge-crate-hint').hidden = true;
      reveal.classList.add('is-open');
      card.hidden = false;
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
      setTimeout(function () {
        replay(map, 'is-shake');
        var p = center(btn);
        burst(p, { count: 40, spread: 160 });
        gainXp(XP.animal, p);
        commit();
      }, calm ? 0 : 600);
      msg.textContent = 'Bienvenue à ' + a.name + ' ! Cliquez sur ' + a.name + ' pour découvrir son histoire.';
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = input.value.toUpperCase().replace(/\s+/g, '');
      if (!code) return;
      sha256(code).then(function (hash) {
        var a = ANIMALS.filter(function (x) { return x.code === hash; })[0];
        if (!a) {
          msg.textContent = 'Ce code ne correspond à aucun animal. Vérifiez-le dans votre courrier du mois.';
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
