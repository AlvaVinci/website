const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.getElementById('primary-nav');
const navLinks = document.querySelectorAll('.primary-nav a, .site-footer a');
const revealElements = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contact-form');
const yearElement = document.getElementById('year');

// Keep footer year current without manual edits.
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Toggle mobile navigation panel.
if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Smooth scroll with fixed-header offset.
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  });
});

// Reveal sections once when they enter the viewport.
if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

// Client-side validation and demo submission message.
if (contactForm) {
  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message-text')
  };

  const errors = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    message: document.getElementById('message-error')
  };

  const formStatus = document.getElementById('form-status');

  const clearErrors = () => {
    Object.values(errors).forEach((errorElement) => {
      if (errorElement) errorElement.textContent = '';
    });

    if (formStatus) formStatus.textContent = '';
  };

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    let isValid = true;

    if (!fields.name.value.trim()) {
      errors.name.textContent = 'Please enter your name.';
      isValid = false;
    }

    if (!fields.email.value.trim()) {
      errors.email.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!isEmailValid(fields.email.value.trim())) {
      errors.email.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!fields.message.value.trim()) {
      errors.message.textContent = 'Please enter your message.';
      isValid = false;
    } else if (fields.message.value.trim().length < 10) {
      errors.message.textContent = 'Message should be at least 10 characters.';
      isValid = false;
    }

    if (!isValid) return;

    if (formStatus) {
      formStatus.textContent = 'Thank you. Your message has been received. (Demo submission)';
    }

    contactForm.reset();
  });
}
