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

  reveal();
})();
