// ===== Le Musée du Club : la salle où s'accrochent les cartes du Refuge Club =====
// (musee-du-club.html ; réutilise le décor du musée et la caisse du Sanctuaire)
// Pour ouvrir une nouvelle carte : remplir sa ligne dans CARDS.
//  - hash : empreinte SHA-256 du début du code, en majuscules, sans le numéro
//    (terminal : echo -n OURS1226 | sha256sum)
//  - le code imprimé au dos = ce début + un tiret + le numéro de la carte sur 4 chiffres
//    (ex. OURS1226-0247), le numéro doit être entre 1 et total
// shortcut: site statique, la collection est gardée dans le navigateur et un
// visiteur curieux peut inventer un numéro ; un vrai serveur ne vaut la peine
// que si chaque code doit être unique et utilisable une seule fois.
(function () {
  var CARDS = [
    {
      id: '2026-12', no: 1, when: 'Décembre 2026', month: 'décembre',
      title: 'Ours polaire', arrival: "L'ours polaire",
      img: 'photo/club-carte-ours-polaire.jpg',
      alt: "Carte de l'ours polaire : il n'est pas blanc, ses poils sont transparents et sa peau est noire",
      hash: '9b8195bf2f68f7c6174cd5219a88ae74beb5221253add4a4f5bf5b3169bb22d1',
      total: 1300
    },
    { id: '2027-01', no: 2, when: 'Janvier 2027', month: 'janvier' },
    { id: '2027-02', no: 3, when: 'Février 2027', month: 'février' },
    { id: '2027-03', no: 4, when: 'Mars 2027', month: 'mars' },
    // hors-série vendu en boutique : il s'accroche entre deux mois, hors des 12 de la saison
    { id: 'hs-1', hs: true, when: 'Mars – avril 2027' },
    { id: '2027-04', no: 5, when: 'Avril 2027', month: 'avril' },
    { id: '2027-05', no: 6, when: 'Mai 2027', month: 'mai' },
    { id: '2027-06', no: 7, when: 'Juin 2027', month: 'juin' },
    { id: '2027-07', no: 8, when: 'Juillet 2027', month: 'juillet' },
    { id: '2027-08', no: 9, when: 'Août 2027', month: 'août' },
    { id: '2027-09', no: 10, when: 'Septembre 2027', month: 'septembre' },
    { id: '2027-10', no: 11, when: 'Octobre 2027', month: 'octobre' },
    { id: '2027-11', no: 12, when: 'Novembre 2027', month: 'novembre' }
  ];
  var STORE = 'museeClub-v1';
  var CONFETTI = ['#D8560E', '#B6BD77', '#657007', '#F4D9C4', '#F2B544'];
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var wall = document.querySelector('.club-wall');
  if (!wall) return;
  var form = document.querySelector('.club-code');
  var input = form.querySelector('input');
  var msg = form.querySelector('.refuge-code-msg');

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || { cards: {} }; } catch (e) { return { cards: {} }; }
  }
  var state = load();
  if (!state.cards) state.cards = {};
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* navigation privée : la salle dure jusqu'au rechargement */ }
  }

  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }
  function pad(n, size) { n = String(n); while (n.length < size) n = '0' + n; return n; }
  function nb(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  // ---- la salle ----
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function render(newId) {
    wall.textContent = '';
    CARDS.forEach(function (c) {
      var num = state.cards[c.id];
      var owned = !!num && !!c.img;
      var li = el('li', 'club-slot');
      li.id = 'carte-' + c.id;
      if (c.hs) { li.classList.add('is-hs'); li.appendChild(el('span', 'club-hs-tag', 'Hors-série')); }

      var card = el(owned ? 'button' : 'div', 'club-card');
      var frame = el('span', 'artwork-frame');
      if (owned) {
        card.type = 'button';
        card.setAttribute('aria-label', c.title + ', carte n° ' + num + ' sur ' + c.total + ' : voir en grand');
        var img = el('img');
        img.src = c.img;
        img.alt = '';
        frame.appendChild(img);
        frame.appendChild(el('span', 'club-shine'));
        card.addEventListener('click', function () { openModal(c, num, card); });
        li.classList.add('is-owned');
        if (c.id === newId) li.classList.add('is-new');
      } else {
        frame.appendChild(el('span', 'club-blank', '?'));
        li.classList.add(c.hash ? 'is-waiting' : 'is-future');
      }
      card.appendChild(frame);
      var label = el('span', 'artwork-label');
      label.setAttribute('aria-hidden', 'true');
      card.appendChild(label);
      li.appendChild(card);

      var cartel = el('p', 'club-cartel');
      cartel.appendChild(el('span', '', c.hs ? 'Hors-série · ' + c.when : 'N°' + pad(c.no, 2) + ' · ' + c.when));
      if (owned) {
        cartel.appendChild(el('strong', '', c.title));
        cartel.appendChild(el('small', '', 'Carte n° ' + num + ' sur ' + nb(c.total)));
      } else if (c.hash) {
        cartel.appendChild(el('strong', '', 'Votre carte vous attend'));
        cartel.appendChild(el('small', '', 'Entrez son code ci-dessus'));
      } else if (c.hs) {
        cartel.appendChild(el('strong', '', 'Édition boutique'));
        cartel.appendChild(el('small', '', 'Bientôt'));
      } else {
        cartel.appendChild(el('strong', '', 'À découvrir'));
        cartel.appendChild(el('small', '', 'Avec la lettre de ' + c.month));
      }
      li.appendChild(cartel);
      wall.appendChild(li);
    });

    var season = CARDS.filter(function (c) { return !c.hs; });
    var got = season.filter(function (c) { return state.cards[c.id] && c.img; }).length;
    document.querySelector('.club-count').textContent = got + (got > 1 ? ' cartes' : ' carte') + ' sur ' + season.length;
    document.querySelector('.club-progress-fill').style.width = (got / season.length * 100) + '%';
  }

  // ---- effets (les mêmes que dans le Sanctuaire) ----
  function center(e) {
    var r = e.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
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
  function replay(e, cls) {
    e.classList.remove(cls);
    void e.offsetWidth;
    e.classList.add(cls);
  }

  var toasts = el('div', 'refuge-toasts');
  toasts.setAttribute('aria-live', 'polite');
  document.body.appendChild(toasts);
  function toast(c) {
    var t = el('div', 'refuge-toast');
    var icon = el('img', 'club-toast-img');
    icon.src = c.img;
    icon.alt = '';
    t.appendChild(icon);
    var txt = el('span');
    txt.appendChild(el('small', '', 'Nouvelle carte'));
    txt.appendChild(el('strong', '', c.arrival + ' a rejoint votre salle'));
    t.appendChild(txt);
    toasts.appendChild(t);
    setTimeout(function () { t.classList.add('is-out'); }, 4200);
    setTimeout(function () { t.remove(); }, 4700);
  }

  // ---- l'arrivée : la caisse ----
  var reveal = document.querySelector('.club-reveal');
  var crate = reveal.querySelector('.refuge-crate');
  var hint = reveal.querySelector('.refuge-crate-hint');
  var rcard = reveal.querySelector('.club-reveal-card');
  var go = rcard.querySelector('.club-reveal-go');
  var arriving = null, knocks = 0;

  function openReveal(c, num) {
    arriving = { card: c, num: num };
    knocks = 0;
    crate.hidden = false;
    hint.hidden = false;
    rcard.hidden = true;
    rcard.querySelector('img').src = c.img;
    rcard.querySelector('img').alt = c.alt;
    rcard.querySelector('.eyebrow').textContent = 'Nouvelle carte · ' + c.when;
    rcard.querySelector('h3').textContent = c.title;
    rcard.querySelector('.club-reveal-num').textContent = 'Carte n° ' + num + ' sur ' + nb(c.total);
    reveal.classList.remove('is-open');
    reveal.hidden = false;
    document.body.style.overflow = 'hidden';
    crate.focus();
  }

  crate.addEventListener('click', function () {
    knocks += 1;
    replay(crate, 'is-knock');
    burst(center(crate), { count: 6, chars: ['✨'], spread: 90 });
    if (knocks < 3 && !calm) {
      hint.textContent = knocks === 1 ? 'Encore une fois…' : 'Une dernière fois !';
      return;
    }
    var p = center(crate);
    crate.hidden = true;
    hint.hidden = true;
    hint.textContent = "Touchez la caisse pour l'ouvrir !";
    reveal.classList.add('is-open');
    rcard.hidden = false;
    burst(p, { count: 80, spread: 360 });
    burst(p, { count: 14, chars: ['⭐', '✨', '💛'], spread: 260 });
    setTimeout(function () { burst(p, { count: 30, spread: 220, lift: 80 }); }, 450);
    go.focus();
  });

  go.addEventListener('click', function () {
    var a = arriving;
    reveal.hidden = true;
    document.body.style.overflow = '';
    state.cards[a.card.id] = a.num;
    save();
    render(a.card.id);
    var slot = document.getElementById('carte-' + a.card.id);
    slot.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
    msg.textContent = '';
    input.value = '';
    setTimeout(function () {
      var p = center(slot.querySelector('.artwork-frame'));
      burst(p, { count: 50, spread: 180 });
      burst(p, { count: 8, chars: ['✨', '⭐'], spread: 140 });
      toast(a.card);
      input.focus({ preventScroll: true });
    }, calm ? 0 : 750);
  });

  // ---- le code ----
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var raw = input.value.toUpperCase().replace(/\s+/g, '');
    var m = raw.match(/^([A-Z0-9]+?)-?(\d{4})$/);
    function wrong(text) {
      msg.textContent = text;
      replay(form, 'is-wrong');
    }
    if (!m) return wrong('Le code complet est au dos de la carte, par exemple ABCD1226-0001.');
    sha256(m[1]).then(function (hash) {
      var c = CARDS.filter(function (x) { return x.hash === hash; })[0];
      var num = parseInt(m[2], 10);
      if (!c) return wrong('Ce code ne correspond à aucune carte. Vérifiez les lettres et les chiffres.');
      if (num < 1 || num > c.total) return wrong("Ce numéro de carte n'existe pas.");
      if (state.cards[c.id]) {
        msg.textContent = 'Cette carte est déjà accrochée dans votre salle.';
        document.getElementById('carte-' + c.id).scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
        return;
      }
      msg.textContent = '';
      openReveal(c, num);
    });
  });

  // ---- une carte en grand ----
  var modal = document.querySelector('.artwork-modal');
  var mImg = modal.querySelector('.artwork-modal-img');
  var mTitle = modal.querySelector('.artwork-modal-text h3');
  var mDesc = modal.querySelector('.artwork-modal-text p');
  var opener = null;
  function openModal(c, num, btn) {
    opener = btn;
    mImg.src = c.img;
    mImg.alt = c.alt;
    mTitle.textContent = c.title;
    mDesc.textContent = 'Carte n° ' + num + ' sur ' + nb(c.total) + ', arrivée avec la lettre de ' + c.month + '.';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.artwork-modal-close').focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (opener) { opener.focus(); opener = null; }
  }
  modal.querySelector('.artwork-modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  render();
})();
