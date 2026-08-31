/* =====================================================================
   alvavinci LLC — corporate site
   共通スクリプト
     1. モバイルドロワー
     2. スクロールリビール
   外部ライブラリには依存しない。
   ===================================================================== */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* -----------------------------------------------------------------
       1. モバイルドロワー
       ----------------------------------------------------------------- */
    var burger = document.getElementById('hamburger');
    var drawer = document.getElementById('drawer');

    if (burger && drawer) {
        var label = burger.getAttribute('data-label-open') || 'メニューを開く';
        var labelClose = burger.getAttribute('data-label-close') || 'メニューを閉じる';

        var setDrawer = function (open) {
            burger.setAttribute('aria-expanded', String(open));
            burger.setAttribute('aria-label', open ? labelClose : label);
            drawer.setAttribute('aria-hidden', String(!open));
            drawer.classList.toggle('is-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };

        setDrawer(false);

        burger.addEventListener('click', function () {
            setDrawer(burger.getAttribute('aria-expanded') !== 'true');
        });

        drawer.addEventListener('click', function (e) {
            if (e.target.closest('a')) { setDrawer(false); }
        });

        document.addEventListener('click', function (e) {
            if (burger.getAttribute('aria-expanded') === 'true' &&
                !drawer.contains(e.target) && !burger.contains(e.target)) {
                setDrawer(false);
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
                setDrawer(false);
                burger.focus();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1080) { setDrawer(false); }
        });
    }

    /* -----------------------------------------------------------------
       2. スクロールリビール
       ----------------------------------------------------------------- */
    var targets = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window) || reduceMotion) {
        Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
})();
