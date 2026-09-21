/* ==========================================================================
   鹿児島ラーメン 火の山 ｜ PROPOSAL DEMO
   モーションは「キービジュアルの空気（灯り・湯気・墨）」をWebで再現するために使う。
   prefers-reduced-motion では全て停止し、JS無効でも本文が読める実装にしている。
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---- 1. 文字ごとの出現（見出しを1文字ずつ分解） ---------------------- */
  function split(el) {
    if (el.dataset.splitDone) { return; }
    var text = el.textContent;
    var frag = document.createDocumentFragment();
    var i = 0;
    text.split('').forEach(function (ch) {
      if (ch === '\n' || ch === ' ' || ch === '　') {
        var sp = document.createElement('span');
        sp.className = 'char char--space';
        frag.appendChild(sp);
        return;
      }
      var wrap = document.createElement('span');
      var inner = document.createElement('i');
      wrap.className = 'char';
      wrap.style.setProperty('--i', i++);
      inner.textContent = ch;
      wrap.appendChild(inner);
      frag.appendChild(wrap);
    });
    el.textContent = '';
    el.appendChild(frag);
    el.dataset.splitDone = '1';
    el.setAttribute('aria-label', text);
  }
  if (!reduce) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-split]'), split);
  }

  /* ---- 1b. 縦書き（1文字ずつ積む） ------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-vertical]'), function (el) {
    var text = el.textContent.trim();
    var frag = document.createDocumentFragment();
    text.split('').forEach(function (ch, i) {
      var s = document.createElement('span');
      var cls = 'vch';
      if (/[ー―−‐–—]/.test(ch)) { cls += ' vch--dash'; }
      if (/[、。，．]/.test(ch)) { cls += ' vch--punc'; }
      s.className = cls;
      s.style.setProperty('--i', i);
      s.textContent = ch;
      frag.appendChild(s);
    });
    el.textContent = '';
    el.appendChild(frag);
    el.classList.add('is-split');
  });

  /* ---- 2. スクロールで出現 -------------------------------------------- */
  var revealTargets = document.querySelectorAll('[data-reveal], .frame, .dish__media');

  function showAll() {
    Array.prototype.forEach.call(revealTargets, function (el) { el.classList.add('is-in'); });
  }

  if (reduce || !hasIO) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    Array.prototype.forEach.call(revealTargets, function (el) { io.observe(el); });

    /* 保険：監視が働かない場合も、読み込み後に画面内の要素は必ず表示する */
    window.setTimeout(function () {
      Array.prototype.forEach.call(revealTargets, function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('is-in'); }
      });
    }, 2600);
  }

  /* ---- 3. ローディング（暖簾が開く）→ ヒーローの導入 -------------------- */
  function start() {
    document.body.classList.add('is-ready');
  }

  if (reduce) {
    root.classList.add('is-loaded', 'is-done');
    start();
  } else {
    window.addEventListener('load', function () {
      window.setTimeout(function () {
        root.classList.add('is-loaded');
        start();
        window.setTimeout(function () { root.classList.add('is-done'); }, 1400);
      }, 1500);
    });
    /* 読み込みが遅い場合の保険 */
    window.setTimeout(function () {
      if (!root.classList.contains('is-loaded')) {
        root.classList.add('is-loaded');
        start();
        window.setTimeout(function () { root.classList.add('is-done'); }, 1400);
      }
    }, 5000);
  }

  /* ---- 4. ヘッダー・進捗・トップへ戻る -------------------------------- */
  var head = document.querySelector('[data-head]');
  var bar = document.querySelector('[data-progress] span');
  var toTop = document.querySelector('[data-totop]');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;

    if (head) { head.classList.toggle('is-stuck', y > 60); }
    if (bar) { bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%'; }
    if (toTop) { toTop.classList.toggle('is-on', y > window.innerHeight * 0.9); }

    /* 現在地に応じてナビの下線を移す */
    var current = null;
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= window.innerHeight * 0.4) { current = sec.id; }
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('href') === '#' + current);
    });

    /* パララックス（見えているものだけ動かす） */
    if (!reduce) {
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) { return; }
        var speed = parseFloat(el.dataset.parallax) || 0;
        var progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.transform = 'translate3d(0,' + (progress * speed).toFixed(2) + 'px,0)';
      });
    }
    ticking = false;
  }

  function requestScroll() {
    if (ticking) { return; }
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---- 5. モバイルのドロワー ------------------------------------------ */
  var burger = document.querySelector('[data-burger]');
  var drawer = document.querySelector('[data-drawer]');

  function setDrawer(open) {
    if (!burger || !drawer) { return; }
    drawer.hidden = false;
    drawer.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
    if (!open) {
      window.setTimeout(function () {
        if (!drawer.classList.contains('is-open')) { drawer.hidden = true; }
      }, 500);
    }
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      setDrawer(burger.getAttribute('aria-expanded') !== 'true');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setDrawer(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setDrawer(false); }
    });
  }

  /* ---- 6. カーソルの灯り・ヒーロー写真のわずかな追従 -------------------- */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var glow = document.querySelector('[data-cursor]');
  var tilt = document.querySelector('[data-tilt]');

  if (fine && !reduce) {
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    var cx = gx, cy = gy, tx = 0, ty = 0, mx = 0, my = 0;

    window.addEventListener('mousemove', function (e) {
      gx = e.clientX; gy = e.clientY;
      if (glow) { glow.style.opacity = '1'; }
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    (function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      if (glow) { glow.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; }

      tx += (mx * 14 - tx) * 0.06;
      ty += (my * 10 - ty) * 0.06;
      if (tilt) { tilt.style.transform = 'translate3d(' + (-tx).toFixed(2) + 'px,' + (-ty).toFixed(2) + 'px,0)'; }

      window.requestAnimationFrame(loop);
    })();
  }
})();
