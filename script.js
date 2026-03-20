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

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    /* --- Mobile menu toggle --- */
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');
    var navLinks = document.querySelectorAll('.nav-link');

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

    /* --- Smooth scrolling --- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            var headerHeight = header.offsetHeight;
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

});
