// Copied from about.js - minimal adjustments for privacy page

function initSplashScreen() {
  const splashScreen = document.getElementById('splashScreen');
  const splashVideo = document.getElementById('splashVideo');

  if (!splashScreen || !splashVideo) return;

  function hideSplash() {
    splashScreen.classList.add('hidden');
  }

  splashVideo.addEventListener('ended', () => {
    hideSplash();
  }, { once: true });

  setTimeout(hideSplash, 20000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSplashScreen);
} else {
  initSplashScreen();
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
      });
  });
}

// Contact/appointment handlers
const btnAppointmentElements = document.querySelectorAll('.btn-appointment-nav, .btn-appointment-hero, .cta-button');
btnAppointmentElements.forEach(button => {
  button.addEventListener('click', () => {
    const target = document.querySelector('.appointment-form-wrapper');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      alert('Please visit our contact page to book an appointment.');
    }
  });
});

// Smooth scroll for footer links that use hashes
document.querySelectorAll('.footer-links a, .footer-legal a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Appointment form handlers (basic)
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you. We received your request and will get back to you.');
    this.reset();
  });
}

// Mobile nav overlay and CTA injection (safe guards included)
(function () {
  if (!hamburger || !navMenu) return;

  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.insertBefore(overlay, document.querySelector('.navbar'));
  }

  if (!navMenu.querySelector('.mobile-cta')) {
    const cta = document.createElement('a');
    cta.href = '#contact';
    cta.className = 'mobile-cta';
    cta.textContent = 'Book an Appointment';
    navMenu.appendChild(cta);
  }

  function openMenu() {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
})();
