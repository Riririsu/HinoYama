/* ==========================================================================
   鹿児島ラーメン 火の山 ｜ PROPOSAL DEMO
   モーションは「スクロール誘導」「情報の階層づけ」のためだけに使用する。
   炎・煙のエフェクトは使わない。prefers-reduced-motion では全て停止。
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- 1. スクロールに応じた表示（fade / slide / image reveal） ---------- */
  function reveal() {
    var targets = document.querySelectorAll('[data-reveal], [data-rule]');
    if (reduce.matches || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });

    /* 保険：何らかの理由で監視が働かない場合も、読み込み後に必ず表示する */
    window.setTimeout(function () {
      Array.prototype.forEach.call(targets, function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('is-in'); }
      });
    }, 2500);
  }

  /* ---- 2. 来店ステップの赤いライン（ブランドアクセント） ----------------- */
  function steps() {
    var list = document.querySelector('[data-steps]');
    var fill = document.querySelector('[data-steps-fill]');
    if (!list || !fill) { return; }
    function draw() {
      fill.style.height = Math.max(0, list.clientHeight - 28) + 'px';
    }

    if (reduce.matches || !('IntersectionObserver' in window)) { return; }

    var drawn = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        drawn = true;
        draw();
        io.unobserve(entry.target);
      });
    }, { threshold: 0.25 });
    io.observe(list);

    window.addEventListener('resize', function () { if (drawn) { draw(); } });
  }

  /* ---- 3. スマホ用 sticky CTA（Heroを過ぎたら表示） --------------------- */
  function stickyCta() {
    var bar = document.querySelector('[data-sticky]');
    var hero = document.getElementById('top');
    if (!bar || !hero) { return; }

    var mq = window.matchMedia('(max-width: 899px)');
    var io = null;

    function show(on) {
      bar.classList.toggle('is-on', on);
      document.documentElement.style.setProperty('--sticky-h', on ? bar.offsetHeight + 'px' : '0px');
    }

    function enable() {
      bar.hidden = false;
      if (!('IntersectionObserver' in window)) { show(true); return; }
      io = new IntersectionObserver(function (entries) {
        show(!entries[0].isIntersecting);
      }, { threshold: 0 });
      io.observe(hero);
    }

    function disable() {
      if (io) { io.disconnect(); io = null; }
      show(false);
      bar.hidden = true;
    }

    function apply() { mq.matches ? enable() : disable(); }

    apply();
    if (mq.addEventListener) { mq.addEventListener('change', apply); }
    else if (mq.addListener) { mq.addListener(apply); }
  }

  reveal();
  steps();
  stickyCta();
})();
