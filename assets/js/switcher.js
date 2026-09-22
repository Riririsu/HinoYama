/* ==========================================================================
   デザイン案の切り替え（提案用デモの閲覧補助）
   ・現在のページに aria-current を付ける
   ・1 / 2 / 3 キーでも切り替えられる
   ・× で隠し、下のつまみから戻せる
   実案件化するときは、このスクリプトと .pswitch のマークアップを削除する。
   ========================================================================== */
(function () {
  'use strict';
  var bar = document.querySelector('[data-pswitch]');
  if (!bar) { return; }

  var links = Array.prototype.slice.call(bar.querySelectorAll('a'));
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  links.forEach(function (a) {
    var target = a.getAttribute('href').toLowerCase();
    if (target === here || (here === '' && target === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* 1 / 2 / 3 キーで切り替え */
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) { return; }
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) { return; }
    var i = ['1', '2', '3'].indexOf(e.key);
    if (i === -1 || !links[i]) { return; }
    if (links[i].getAttribute('aria-current') === 'page') { return; }
    location.href = links[i].getAttribute('href');
  });

  /* 隠す・戻す */
  var peek = document.createElement('button');
  peek.type = 'button';
  peek.className = 'pswitch-peek';
  peek.textContent = 'DESIGN';
  peek.setAttribute('aria-label', 'デザイン案の切り替えを表示');
  document.body.appendChild(peek);

  function setOpen(open) {
    bar.classList.toggle('is-away', !open);
    peek.classList.toggle('is-on', !open);
    bar.setAttribute('aria-hidden', String(!open));
  }
  var close = bar.querySelector('[data-pswitch-close]');
  if (close) { close.addEventListener('click', function () { setOpen(false); peek.focus(); }); }
  peek.addEventListener('click', function () { setOpen(true); links[0].focus(); });
})();
