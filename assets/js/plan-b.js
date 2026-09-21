/* ==========================================================================
   火の山 ｜ 案B：EDITORIAL LIGHT
   ========================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* 出現 */
  var targets = document.querySelectorAll('[data-reveal]');
  if (reduce || !hasIO) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
    window.setTimeout(function () {
      Array.prototype.forEach.call(targets, function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('is-in'); }
      });
    }, 2600);
  }
  window.setTimeout(function () { document.body.classList.add('is-ready'); }, 120);

  /* ヘッダー・進捗・パララックス・横スクロール */
  var head = document.querySelector('[data-head]');
  var bar = document.querySelector('[data-progress] span');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var hs = document.querySelector('[data-hscroll]');
  var track = document.querySelector('[data-htrack]');
  var ticking = false;

  function layoutHscroll() {
    if (!hs || !track) { return 0; }
    if (reduce || window.innerWidth <= 900) { hs.style.height = ''; track.style.transform = ''; return 0; }
    var distance = Math.max(0, track.scrollWidth - window.innerWidth);
    hs.style.height = (window.innerHeight + distance) + 'px';
    return distance;
  }
  var hsDistance = layoutHscroll();

  function onScroll() {
    var y = window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (head) { head.classList.toggle('is-stuck', y > 40); }
    if (bar) { bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%'; }

    var current = null;
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) { current = s.id; } });
    navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + current); });

    if (!reduce) {
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) { return; }
        var sp = parseFloat(el.dataset.parallax) || 0;
        var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.transform = 'translate3d(0,' + (p * sp).toFixed(2) + 'px,0)';
      });

      if (hs && track && hsDistance > 0) {
        var rect = hs.getBoundingClientRect();
        var progress = Math.min(1, Math.max(0, -rect.top / (hs.offsetHeight - window.innerHeight)));
        track.style.transform = 'translate3d(' + (-progress * hsDistance).toFixed(1) + 'px,0,0)';
      }
    }
    ticking = false;
  }
  function req() { if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', function () { hsDistance = layoutHscroll(); req(); });
  window.addEventListener('load', function () { hsDistance = layoutHscroll(); req(); });
  onScroll();

  /* ドロワー */
  var burger = document.querySelector('[data-burger]');
  var drawer = document.querySelector('[data-drawer]');
  function setDrawer(open) {
    if (!burger || !drawer) { return; }
    drawer.hidden = false;
    drawer.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
    if (!open) { window.setTimeout(function () { if (!drawer.classList.contains('is-open')) { drawer.hidden = true; } }, 450); }
  }
  if (burger && drawer) {
    burger.addEventListener('click', function () { setDrawer(burger.getAttribute('aria-expanded') !== 'true'); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) { setDrawer(false); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setDrawer(false); } });
  }

  /* 写真の上でだけ出るカーソル */
  var cursor = document.querySelector('[data-cursor]');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (cursor && fine && !reduce) {
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.toggle('is-on', !!e.target.closest('figure, .card, .row__fig'));
    });
    (function loop() {
      cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
      cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      window.requestAnimationFrame(loop);
    })();
  }
})();
