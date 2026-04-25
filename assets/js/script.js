/* ============================================
   alvavinci LLC — Landing Page Scripts
   Vanilla JavaScript only
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* --- Header scroll effect --- */
    var header = document.getElementById('header');

    function handleHeaderScroll() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    if (header) {
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll();
    }

    /* --- Mobile menu toggle --- */
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');
    var navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && nav) {
        function toggleMenu() {
            var isActive = hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', toggleMenu);

        navLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
    }

    /* --- Smooth scrolling --- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            var headerHeight = header ? header.offsetHeight : 0;
            var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    /* --- Scroll-based fade-in animations --- */
    var fadeElements = document.querySelectorAll('.fade-in');

    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(function (el) {
        observer.observe(el);
    });

    /* ============================================
       Hero Canvas Animation
       ============================================ */
    var canvas = document.getElementById('heroCanvas');

    if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var w = 0;
        var h = 0;
        var animId = null;
        var lastTime = 0;
        var elapsed = 0;
        var paused = false;

        /* --- Mouse tracking --- */
        var mouseX = 0.5;
        var mouseY = 0.5;
        var targetMouseX = 0.5;
        var targetMouseY = 0.5;

        /* --- Configuration --- */
        var isMobile = window.innerWidth <= 768;
        var GRID_SPACING = 40;
        var PARTICLE_COUNT = isMobile ? 18 : 30;
        var NODE_COUNT = isMobile ? 5 : 7;
        var ARC_COUNT = 3;
        var CONNECTION_DIST = 150;
        var PARALLAX_AMOUNT = 15;

        var COL_GRID = 'rgba(58, 109, 240, 0.06)';
        var COL_ARC = 'rgba(24, 199, 223, 0.16)';
        var COL_CHART = 'rgba(58, 109, 240, 0.22)';
        var COL_PARTICLE_BASE = [24, 199, 223];
        var COL_NODE = 'rgba(58, 109, 240, 0.46)';
        var COL_NODE_GLOW = 'rgba(24, 199, 223, 0.18)';
        var COL_CONNECTION = 'rgba(58, 109, 240, 0.1)';

        /* --- Entity arrays --- */
        var particles = [];
        var nodes = [];
        var arcs = [];

        /* --- Resize handler --- */
        var resizeTimer = null;

        function resize() {
            var rect = canvas.parentElement.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function handleResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                isMobile = window.innerWidth <= 768;
                PARTICLE_COUNT = isMobile ? 18 : 30;
                NODE_COUNT = isMobile ? 5 : 7;
                resize();
                initEntities();
            }, 250);
        }

        /* --- Entity creation --- */
        function createParticle() {
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: 1 + Math.random() * 1.5,
                baseAlpha: 0.12 + Math.random() * 0.18,
                phase: Math.random() * Math.PI * 2
            };
        }

        function createNode() {
            return {
                x: w * 0.15 + Math.random() * w * 0.7,
                y: h * 0.15 + Math.random() * h * 0.7,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                r: 3 + Math.random() * 2
            };
        }

        function createArc(index) {
            return {
                cx: w * (0.3 + index * 0.2),
                cy: h * (0.3 + index * 0.15),
                radius: 60 + index * 40,
                startAngle: Math.random() * Math.PI * 2,
                sweep: Math.PI * 0.5 + Math.random() * Math.PI * 0.5,
                speed: 0.0003 + Math.random() * 0.0003,
                direction: index % 2 === 0 ? 1 : -1
            };
        }

        function initEntities() {
            var i;
            particles = [];
            nodes = [];
            arcs = [];

            for (i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(createParticle());
            }
            for (i = 0; i < NODE_COUNT; i++) {
                nodes.push(createNode());
            }
            for (i = 0; i < ARC_COUNT; i++) {
                arcs.push(createArc(i));
            }
        }

        /* --- Drawing functions --- */
        function drawGrid() {
            ctx.fillStyle = COL_GRID;
            var px = (mouseX - 0.5) * PARALLAX_AMOUNT * 0.3;
            var py = (mouseY - 0.5) * PARALLAX_AMOUNT * 0.3;
            var cols = Math.ceil(w / GRID_SPACING) + 1;
            var rows = Math.ceil(h / GRID_SPACING) + 1;
            for (var c = 0; c < cols; c++) {
                for (var r = 0; r < rows; r++) {
                    ctx.beginPath();
                    ctx.arc(
                        c * GRID_SPACING + px,
                        r * GRID_SPACING + py,
                        1, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }

        function drawArcs(dt) {
            ctx.strokeStyle = COL_ARC;
            ctx.lineWidth = 1.5;
            for (var i = 0; i < arcs.length; i++) {
                var a = arcs[i];
                a.startAngle += a.speed * dt * a.direction;
                ctx.beginPath();
                ctx.arc(a.cx, a.cy, a.radius, a.startAngle, a.startAngle + a.sweep);
                ctx.stroke();
            }
        }

        function drawChartLine(dt) {
            elapsed += dt * 0.0005;
            ctx.strokeStyle = COL_CHART;
            ctx.lineWidth = 1.5;
            ctx.beginPath();

            var segments = 80;
            for (var i = 0; i <= segments; i++) {
                var t = i / segments;
                var x = t * w;
                var baseY = h * 0.65 - t * h * 0.3;
                var wave = Math.sin(t * Math.PI * 3 + elapsed) * 20;
                var wave2 = Math.sin(t * Math.PI * 5 + elapsed * 1.3) * 8;
                var y = baseY + wave + wave2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }

        function updateAndDrawParticles(dt) {
            var px = (mouseX - 0.5) * PARALLAX_AMOUNT;
            var py = (mouseY - 0.5) * PARALLAX_AMOUNT;

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx * dt * 0.06;
                p.y += p.vy * dt * 0.06;
                p.phase += dt * 0.002;

                /* Wrap around edges */
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;

                var alpha = p.baseAlpha + Math.sin(p.phase) * 0.08;
                ctx.fillStyle = 'rgba(' + COL_PARTICLE_BASE[0] + ',' + COL_PARTICLE_BASE[1] + ',' + COL_PARTICLE_BASE[2] + ',' + alpha.toFixed(3) + ')';
                ctx.beginPath();
                ctx.arc(p.x + px, p.y + py, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function updateAndDrawNodes(dt) {
            var px = (mouseX - 0.5) * PARALLAX_AMOUNT;
            var py = (mouseY - 0.5) * PARALLAX_AMOUNT;
            var i, j, n, n2, dx, dy, dist;

            /* Update positions */
            for (i = 0; i < nodes.length; i++) {
                n = nodes[i];
                n.x += n.vx * dt * 0.06;
                n.y += n.vy * dt * 0.06;

                /* Bounce off edges with margin */
                if (n.x < 20 || n.x > w - 20) n.vx *= -1;
                if (n.y < 20 || n.y > h - 20) n.vy *= -1;
                n.x = Math.max(20, Math.min(w - 20, n.x));
                n.y = Math.max(20, Math.min(h - 20, n.y));
            }

            /* Draw connections */
            ctx.strokeStyle = COL_CONNECTION;
            ctx.lineWidth = 1;
            for (i = 0; i < nodes.length; i++) {
                for (j = i + 1; j < nodes.length; j++) {
                    n = nodes[i];
                    n2 = nodes[j];
                    dx = (n.x + px) - (n2.x + px);
                    dy = (n.y + py) - (n2.y + py);
                    dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DIST) {
                        var opacity = (1 - dist / CONNECTION_DIST) * 0.12;
                        ctx.strokeStyle = 'rgba(58, 109, 240, ' + opacity.toFixed(3) + ')';
                        ctx.beginPath();
                        ctx.moveTo(n.x + px, n.y + py);
                        ctx.lineTo(n2.x + px, n2.y + py);
                        ctx.stroke();
                    }
                }
            }

            /* Draw nodes with glow */
            for (i = 0; i < nodes.length; i++) {
                n = nodes[i];
                var nx = n.x + px;
                var ny = n.y + py;

                /* Glow */
                ctx.fillStyle = COL_NODE_GLOW;
                ctx.beginPath();
                ctx.arc(nx, ny, n.r * 3, 0, Math.PI * 2);
                ctx.fill();

                /* Core */
                ctx.fillStyle = COL_NODE;
                ctx.beginPath();
                ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        /* --- Main animation loop --- */
        function animate(timestamp) {
            if (paused) {
                animId = requestAnimationFrame(animate);
                lastTime = timestamp;
                return;
            }

            if (!lastTime) lastTime = timestamp;
            var dt = Math.min(timestamp - lastTime, 50);
            lastTime = timestamp;

            /* Smooth mouse interpolation */
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            ctx.clearRect(0, 0, w, h);

            drawGrid();
            drawArcs(dt);
            drawChartLine(dt);
            updateAndDrawParticles(dt);
            updateAndDrawNodes(dt);

            animId = requestAnimationFrame(animate);
        }

        /* --- Event listeners --- */
        canvas.parentElement.addEventListener('mousemove', function (e) {
            var rect = canvas.parentElement.getBoundingClientRect();
            targetMouseX = (e.clientX - rect.left) / rect.width;
            targetMouseY = (e.clientY - rect.top) / rect.height;
        });

        canvas.parentElement.addEventListener('mouseleave', function () {
            targetMouseX = 0.5;
            targetMouseY = 0.5;
        });

        /* Page Visibility API */
        document.addEventListener('visibilitychange', function () {
            paused = document.hidden;
        });

        window.addEventListener('resize', handleResize, { passive: true });

        /* --- Initialize --- */
        resize();
        initEntities();
        animId = requestAnimationFrame(animate);
    }

});
