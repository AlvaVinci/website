/* =====================================================================
   alvavinci LLC — corporate site
   共通スクリプト
     1. ヘッダーのスクロール状態
     2. モバイルドロワー
     3. スクロールリビール
     4. 高電圧アーク (Canvas) の描画
   外部ライブラリには依存しない。
   ===================================================================== */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* -----------------------------------------------------------------
       1. ヘッダー: スクロール量に応じて背景を出す
       ----------------------------------------------------------------- */
    var header = document.getElementById('header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-stuck', window.scrollY > 24);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* -----------------------------------------------------------------
       2. モバイルドロワー
       ----------------------------------------------------------------- */
    var burger = document.getElementById('hamburger');
    var drawer = document.getElementById('drawer');

    if (burger && drawer) {
        var setDrawer = function (open) {
            burger.setAttribute('aria-expanded', String(open));
            burger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
            drawer.classList.toggle('is-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };

        burger.addEventListener('click', function () {
            setDrawer(burger.getAttribute('aria-expanded') !== 'true');
        });

        drawer.addEventListener('click', function (e) {
            if (e.target.closest('a')) { setDrawer(false); }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { setDrawer(false); }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1024) { setDrawer(false); }
        });
    }

    /* -----------------------------------------------------------------
       3. スクロールリビール
       ----------------------------------------------------------------- */
    var targets = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window) || reduceMotion) {
        Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
    }

    /* -----------------------------------------------------------------
       4. 高電圧アーク
       data-arc 属性を持つ canvas を初期化する。
         data-origin-x / data-origin-y : 放電の起点 (0〜1 の相対座標)
         data-intensity                : 放電の量 (0.4〜1.4 程度)
       ----------------------------------------------------------------- */
    var canvases = document.querySelectorAll('canvas[data-arc]');
    if (!canvases.length) { return; }

    Array.prototype.forEach.call(canvases, function (canvas) {
        var ctx = canvas.getContext('2d');
        if (!ctx) { return; }

        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = 0;
        var h = 0;
        var bolts = [];
        var motes = [];
        var origin = { x: 0, y: 0 };
        var intensity = parseFloat(canvas.getAttribute('data-intensity')) || 1;
        var ox = parseFloat(canvas.getAttribute('data-origin-x'));
        var oy = parseFloat(canvas.getAttribute('data-origin-y'));
        var nextBoltAt = 0;
        var rafId = null;

        if (isNaN(ox)) { ox = 0.78; }
        if (isNaN(oy)) { oy = 0.42; }

        /* 画面サイズに追従 */
        function resize() {
            var rect = canvas.getBoundingClientRect();
            w = Math.max(rect.width, 1);
            h = Math.max(rect.height, 1);
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            origin.x = w * ox;
            origin.y = h * oy;
            seedMotes();
        }

        /* 漂う微粒子 (帯電した塵) */
        function seedMotes() {
            var count = Math.round((w * h) / 34000 * intensity);
            motes = [];
            for (var i = 0; i < count; i++) {
                motes.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.1 + 0.25,
                    vx: (Math.random() - 0.5) * 0.13,
                    vy: -Math.random() * 0.16 - 0.02,
                    a: Math.random() * 0.4 + 0.12
                });
            }
        }

        /* 中点変位法で稲妻の折れ線をつくる */
        function makePath(x1, y1, x2, y2, offset) {
            var pts = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
            for (var pass = 0; pass < 5; pass++) {
                var next = [];
                for (var i = 0; i < pts.length - 1; i++) {
                    var a = pts[i];
                    var b = pts[i + 1];
                    var mx = (a.x + b.x) / 2;
                    var my = (a.y + b.y) / 2;
                    var nx = -(b.y - a.y);
                    var ny = (b.x - a.x);
                    var len = Math.sqrt(nx * nx + ny * ny) || 1;
                    var d = (Math.random() - 0.5) * offset;
                    next.push(a, { x: mx + (nx / len) * d, y: my + (ny / len) * d });
                }
                next.push(pts[pts.length - 1]);
                pts = next;
                offset *= 0.55;
            }
            return pts;
        }

        /* 放電を1本生成する (枝分かれ付き) */
        function spawnBolt() {
            var angle = Math.random() * Math.PI * 2;
            var reach = Math.min(w, h) * (0.32 + Math.random() * 0.42);
            var tx = origin.x + Math.cos(angle) * reach;
            var ty = origin.y + Math.sin(angle) * reach * 0.85;

            var main = makePath(origin.x, origin.y, tx, ty, reach * 0.34);
            var paths = [{ pts: main, width: 1.5 }];

            var branchCount = 1 + Math.floor(Math.random() * 3);
            for (var b = 0; b < branchCount; b++) {
                var from = main[Math.floor(main.length * (0.25 + Math.random() * 0.55))];
                var ba = angle + (Math.random() - 0.5) * 1.9;
                var br = reach * (0.18 + Math.random() * 0.3);
                paths.push({
                    pts: makePath(from.x, from.y, from.x + Math.cos(ba) * br, from.y + Math.sin(ba) * br, br * 0.4),
                    width: 0.7
                });
            }

            bolts.push({ paths: paths, life: 1, decay: 0.018 + Math.random() * 0.03 });
        }

        function strokePath(pts, width, alpha, color, blur) {
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (var i = 1; i < pts.length; i++) { ctx.lineTo(pts[i].x, pts[i].y); }
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = width;
            ctx.shadowBlur = blur;
            ctx.shadowColor = 'rgba(127,227,255,.9)';
            ctx.stroke();
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            /* 微粒子 */
            for (var m = 0; m < motes.length; m++) {
                var p = motes[m];
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
                if (p.x < -6) { p.x = w + 6; }
                if (p.x > w + 6) { p.x = -6; }
                ctx.beginPath();
                ctx.globalAlpha = p.a;
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(127,227,255,.7)';
                ctx.fillStyle = '#9ceaff';
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            /* コロナ (起点のにじみ) */
            var corona = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, Math.min(w, h) * 0.34);
            corona.addColorStop(0, 'rgba(127,227,255,.16)');
            corona.addColorStop(1, 'rgba(127,227,255,0)');
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.fillStyle = corona;
            ctx.fillRect(0, 0, w, h);

            /* 放電 */
            for (var i = bolts.length - 1; i >= 0; i--) {
                var bolt = bolts[i];
                var ease = bolt.life * bolt.life;
                for (var j = 0; j < bolt.paths.length; j++) {
                    var pth = bolt.paths[j];
                    strokePath(pth.pts, pth.width * 3.4, ease * 0.16, 'rgba(47,149,196,1)', 22);
                    strokePath(pth.pts, pth.width, ease * 0.85, 'rgba(180,240,255,1)', 14);
                    strokePath(pth.pts, pth.width * 0.4, ease, '#ffffff', 6);
                }
                bolt.life -= bolt.decay;
                if (bolt.life <= 0) { bolts.splice(i, 1); }
            }

            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.globalCompositeOperation = 'source-over';
        }

        function loop(now) {
            if (now > nextBoltAt && bolts.length < 5) {
                spawnBolt();
                nextBoltAt = now + (420 + Math.random() * 1500) / intensity;
            }
            draw();
            rafId = requestAnimationFrame(loop);
        }

        resize();

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 180);
        });

        if (reduceMotion) {
            /* 動きを抑える設定では、静止した一枚の放電図として描く */
            spawnBolt();
            spawnBolt();
            draw();
            return;
        }

        /* 画面外では描画を止める */
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && rafId === null) {
                        rafId = requestAnimationFrame(loop);
                    } else if (!entry.isIntersecting && rafId !== null) {
                        cancelAnimationFrame(rafId);
                        rafId = null;
                    }
                });
            }, { threshold: 0 }).observe(canvas);
        } else {
            rafId = requestAnimationFrame(loop);
        }
    });
})();
