
function initSplashScreen() {
  const splashScreen = document.getElementById('splashScreen');
  const splashVideo = document.getElementById('splashVideo');

  if (!splashScreen || !splashVideo) return;

  function hideSplash() {
    // Only set opacity to fade - never remove from DOM to prevent black flash
    splashScreen.classList.add('hidden');
  }

  // Listen for video end
  splashVideo.addEventListener('ended', () => {
    hideSplash();
  }, { once: true });

  // Safety fallback - hide after 20 seconds if video doesn't end
  setTimeout(hideSplash, 20000);
}

// Initialize splash screen
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSplashScreen);
} else {
  initSplashScreen();
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});




// Book appointment button handlers
document.querySelectorAll('.btn-appointment-nav, .btn-appointment-hero').forEach(button => {
    button.addEventListener('click', () => {
        alert('Thank you for your interest! Please contact us to book your appointment.\n\nPhone: (555) 123-4567\nEmail: info@lumedental.com');
    });
});

// Contact Us button: scroll to contacts section or open mail client as fallback
document.querySelectorAll('.btn-contact-nav, .btn-contact-hero').forEach(button => {
    button.addEventListener('click', () => {
        const target = document.querySelector('#contacts');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.location.href = 'mailto:info@lumedental.com';
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

/* ------------------- Parallax (scroll + mouse) ------------------- */
(function() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ticking = false;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function updateParallax() {
        // stronger page background move
        const bgY = window.scrollY * 0.18; // moves slower than scroll but stronger now
        document.documentElement.style.setProperty('--bg-translate', `${bgY}px`);

        if (hero && heroImage) {
            const rect = hero.getBoundingClientRect();
            const offset = -rect.top * 0.28; // stronger vertical parallax for image
            const mx = (mouseX - window.innerWidth / 2) / window.innerWidth * 28; // px horizontal stronger
            const my = (mouseY - window.innerHeight / 2) / window.innerHeight * 14; // px vertical stronger

            // rotation values for 3D tilt
            const rotateY = (mouseX - window.innerWidth / 2) / window.innerWidth * 4; // deg
            const rotateX = (window.innerHeight / 2 - mouseY) / window.innerHeight * 2.5; // deg

            if (!prefersReduced) {
                heroImage.style.transform = `translate3d(${mx}px, ${offset + my}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                heroImage.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
        }

        if (hero && heroContent) {
            const rect = hero.getBoundingClientRect();
            const contentOffset = -rect.top * 0.12; // a bit stronger
            const contentMx = (mouseX - window.innerWidth / 2) / window.innerWidth * 12;
            if (!prefersReduced) {
                heroContent.style.transform = `translate3d(${contentMx}px, ${contentOffset}px, 0)`;
            } else {
                heroContent.style.transform = `translate3d(0, ${contentOffset}px, 0)`;
            }
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        requestTick();
    }, { passive: true });

    // entrance animation: add class after short delay on load
    if (!prefersReduced) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelector('.hero')?.classList.add('is-animated');
            }, 260);
        });
    } else {
        // if reduced motion, immediately mark animated (no transitions)
        document.querySelector('.hero')?.classList.add('is-animated');
    }

    // initialize
    requestTick();
})();

/* ---------- Page entry preloader ---------- */
(function() {
    const preloader = document.querySelector('.page-preloader');
    if (!preloader) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function removePreloader() {
        // remove element after transition ends
        preloader.addEventListener('transitionend', () => {
            preloader.remove();
        }, { once: true });
    }

    if (prefersReduced) {
        // remove immediately if user prefers reduced motion
        preloader.remove();
    } else {
        // Wait for full load, then fade out the preloader
        window.addEventListener('load', () => {
            // small delay so users see an entry flash then it fades
            setTimeout(() => {
                preloader.classList.add('is-hidden');
                removePreloader();
            }, 180); // short delay before starting the fade
        });

        // fallback: if load didn't fire within 6s, hide anyway
        setTimeout(() => {
            if (document.contains(preloader) && !preloader.classList.contains('is-hidden')) {
                preloader.classList.add('is-hidden');
                removePreloader();
            }
        }, 10000);
    }
})();


const today = new Date().toISOString().split('T')[0];
document.getElementById('preferredDate').setAttribute('min', today);

// Form submission handler with WhatsApp integration
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        treatment: document.getElementById('treatment').value,
        preferredDate: document.getElementById('preferredDate').value,
        preferredTime: document.getElementById('preferredTime').value,
        message: document.getElementById('message').value
    };

    // Get the actual treatment text (not just the value)
    const treatmentText = document.getElementById('treatment').selectedOptions[0].text;

    // Create WhatsApp message
    const whatsappMessage = ` *New Appointment Request - SmileFix Dental*

*Patient Details:*
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
 Phone: ${formData.phone}

*Treatment Requested:*
${treatmentText}

*Preferred Schedule:*
Date: ${formData.preferredDate}
Time: ${formData.preferredTime}

 *Additional Notes:*
${formData.message || 'None'}

---
Please confirm this appointment at your earliest convenience.`;

    // WhatsApp number (your client's number)
    const whatsappNumber = '9840534242'; // Format: country code + number (no spaces)
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Send thank you email to user
    sendThankYouEmail(formData.email, formData.firstName);
    
    // Show success message
    alert('Thank you for booking an appointment! We will contact you shortly to confirm.');
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Reset form
    this.reset();
    
    console.log('Form submitted:', formData);
});

// Phone number formatting (optional enhancement)
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    e.target.value = value;
});

function sendThankYouEmail(email, firstName) {
    const serviceID = 'service_zpyvsw6';   // Replace with YOUR Service ID
    const templateID = 'template_mv941zo';  // Replace with YOUR Template ID
    
    const templateParams = {
        to_email: email,
        to_name: firstName,
        from_name: "SmileFix Dental Care"
    };
    
    emailjs.send(serviceID, templateID, templateParams)
        .then(function(response) {
            console.log('Thank you email sent!', response.status);
        }, function(error) {
            console.log('Email failed:', error);
        });
}

// Smooth scroll for footer links
        document.querySelectorAll('.footer-links a, .footer-legal a').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Click to call/email functionality
        const phoneLink = document.querySelector('a[href^="tel:"]');
        const emailLink = document.querySelector('a[href^="mailto:"]');

        if (phoneLink) {
            phoneLink.addEventListener('click', function() {
                console.log('Phone call initiated');
            });
        }

        if (emailLink) {
            emailLink.addEventListener('click', function() {
                console.log('Email client opened');
            });
        }


        // ============================================
        // PAGE LOADER
        // ============================================
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelector('.page-loader').style.display = 'none';
            }, 2200);
        });

        // ============================================
        // SCROLL REVEAL ANIMATION
        // ============================================
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in, .text-reveal').forEach(el => {
            observer.observe(el);
        });

        // ============================================
        // PARALLAX EFFECT
        // ============================================
        let ticking = false;

        function updateParallax() {
            const parallaxImages = document.querySelectorAll('.parallax-image');
            
            parallaxImages.forEach(image => {
                const wrapper = image.closest('.parallax-wrapper');
                if (!wrapper) return;
                
                const rect = wrapper.getBoundingClientRect();
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = -(rect.top - window.innerHeight / 2) * 0.15;
                    image.style.transform = `translateY(${yPos}px) scale(1.15)`;
                }
            });
            
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        // ============================================
        // TREATMENT ACCORDION
        // ============================================
        function toggleTreatment(header) {
            const card = header.closest('.treatment-card');
            card.classList.toggle('expanded');
        }

        // ============================================
        // SMOOTH SCROLL
        // ============================================
        function scrollToCategory(categoryId) {
            const element = document.getElementById(categoryId);
            if (element) {
                const offset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }

        // ============================================
        // INITIALIZE
        // ============================================
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Services page loaded with premium animations and images');
        });

        // ============================================
// MOBILE NAV — hamburger + slide panel + overlay
// ============================================
(function () {
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  // Inject overlay element once
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.insertBefore(overlay, document.querySelector('.navbar') || document.body.firstChild);
  }

  // Inject mobile CTA button at the end of nav-menu
  if (!navMenu.querySelector('.mobile-cta')) {
    const cta = document.createElement('a');
    cta.href = '#book';
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


// ============================================
// NAVBAR SCROLL SHADOW
// ============================================
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 60) {
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = '';
    }
  });
})();


// ============================================
// PAGE LOADER
// ============================================
window.addEventListener('load', function () {
  setTimeout(function () {
    const loader = document.querySelector('.page-loader');
    if (loader) loader.style.display = 'none';
  }, 2200);
});


// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
(function () {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .text-reveal').forEach(function (el) {
    observer.observe(el);
  });
})();


// ============================================
// PARALLAX EFFECT FOR IMAGES
// ============================================
(function () {
  let ticking = false;

  function updateParallax() {
    document.querySelectorAll('.parallax-image').forEach(function (image) {
      const wrapper = image.closest('.parallax-wrapper');
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -(rect.top - window.innerHeight / 2) * 0.15;
        image.style.transform = 'translateY(' + yPos + 'px) scale(1.15)';
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
})();


// ============================================
// TREATMENT ACCORDION TOGGLE
// ============================================
function toggleTreatment(header) {
  const card = header.closest('.treatment-card');
  if (!card) return;

  // Close other expanded cards (optional - comment out for multi-expand)
  document.querySelectorAll('.treatment-card.expanded').forEach(function (otherCard) {
    if (otherCard !== card) {
      otherCard.classList.remove('expanded');
    }
  });

  card.classList.toggle('expanded');
}


// ============================================
// SMOOTH SCROLL TO CATEGORY
// ============================================
function scrollToCategory(categoryId) {
  const element = document.getElementById(categoryId);
  if (!element) return;

  const offset = 100;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}


// ============================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ============================================
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
})();


// ============================================
// FAQ ACCORDION (if needed)
// ============================================
(function () {
  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      const answer = this.nextElementSibling;
      const isOpen = answer.style.display === 'block';

      // Close all FAQ answers
      document.querySelectorAll('.faq-answer').forEach(function (a) {
        a.style.display = 'none';
      });

      // Toggle current answer
      if (!isOpen) {
        answer.style.display = 'block';
      }
    });
  });

  // Hide all answers initially
  document.querySelectorAll('.faq-answer').forEach(function (answer) {
    answer.style.display = 'none';
  });
})();


// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  console.log('Services page loaded with premium animations');
});

