/* ==========================================================================
   火の山 ｜ 案C：SPLIT / 縦書き
   ========================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* 縦書きを1文字ずつ積む */
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

  /* 暖簾が上がる */
  function open() { document.body.classList.add('is-ready'); }
  if (reduce) {
    root.classList.add('is-open', 'is-done');
    open();
  } else {
    window.addEventListener('load', function () {
      window.setTimeout(function () {
        root.classList.add('is-open');
        open();
        window.setTimeout(function () { root.classList.add('is-done'); }, 1500);
      }, 1200);
    });
    window.setTimeout(function () {
      if (!root.classList.contains('is-open')) {
        root.classList.add('is-open');
        open();
        window.setTimeout(function () { root.classList.add('is-done'); }, 1500);
      }
    }, 4500);
  }

  /* 進捗・現在地 */
  var bar = document.querySelector('[data-progress]');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.side__nav a'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) { bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%'; }
    var current = null;
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) { current = s.id; } });
    navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + current); });
    ticking = false;
  }
  function req() { if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  onScroll();

  /* ドロワー */
  var burger = document.querySelector('[data-burger]');
  var drawer = document.querySelector('[data-drawer]');
  function setDrawer(o) {
    if (!burger || !drawer) { return; }
    drawer.hidden = false;
    drawer.classList.toggle('is-open', o);
    burger.setAttribute('aria-expanded', String(o));
    document.body.classList.toggle('is-locked', o);
    if (!o) { window.setTimeout(function () { if (!drawer.classList.contains('is-open')) { drawer.hidden = true; } }, 450); }
  }
  if (burger && drawer) {
    burger.addEventListener('click', function () { setDrawer(burger.getAttribute('aria-expanded') !== 'true'); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) { setDrawer(false); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setDrawer(false); } });
  }
})();
