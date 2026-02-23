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

// Update current time
function updateCurrentTime() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    const timeString = `Today, ${dayName}, ${hours}:${minutesStr}${ampm}`;
    document.getElementById('currentTime').textContent = timeString;
}

// Update time on page load
updateCurrentTime();

// Update time every minute
setInterval(updateCurrentTime, 60000);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Book appointment button handlers
    document.querySelectorAll('.btn-appointment-nav, .btn-appointment-hero, .btn-contact-hero').forEach(button => {
        button.addEventListener('click', () => {
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

// Scroll Animation for About Section
function initAboutAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe clinic image
  const clinicImage = document.querySelector('.about-image');
  if (clinicImage) {
    clinicImage.style.opacity = '0';
    clinicImage.style.transform = 'translateY(30px)';
    clinicImage.style.transition = 'all 0.8s ease 0.3s';
    observer.observe(clinicImage);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutAnimations);
} else {
  initAboutAnimations();
}

 // Treatment links navigation
        document.querySelectorAll('.treatment-link, .view-all-button').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
            });
        });

        // Enhanced scroll reveal animation
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.treatment-card').forEach(card => {
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });

     // Carousel functionality - scrolls ONE card at a time
        const track = document.getElementById('testimonialTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const viewMoreContainer = document.getElementById('viewMoreContainer');
        const cards = document.querySelectorAll('.testimonial-card');
        
        let currentIndex = 0;
        let cardsPerView = 3;
        const totalCards = cards.length; // Only 6 testimonials now

        // Update cards per view based on screen size
        function updateCardsPerView() {
            if (window.innerWidth <= 768) {
                cardsPerView = 1;
            } else if (window.innerWidth <= 1024) {
                cardsPerView = 2;
            } else {
                cardsPerView = 3;
            }
            updateCarousel();
        }

        // Update carousel position
        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const gap = window.innerWidth <= 1024 ? (window.innerWidth <= 768 ? 32 : 28) : 32;
            const offset = -(currentIndex * (cardWidth + gap));
            track.style.transform = `translateX(${offset}px)`;
            
            // Update button states
            prevBtn.disabled = currentIndex === 0;
            
            // Calculate max index
            const maxIndex = Math.max(0, totalCards - cardsPerView);
            
            // Show "View More Reviews" when reaching last set
            if (currentIndex >= maxIndex - 1 || currentIndex >= maxIndex) {
                nextBtn.disabled = currentIndex >= maxIndex;
                viewMoreContainer.classList.add('visible');
            } else {
                nextBtn.disabled = false;
                viewMoreContainer.classList.remove('visible');
            }
        }

        // Previous button - scroll ONE card
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Next button - scroll ONE card
        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, totalCards - cardsPerView);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentIndex = 0; // Reset to start on resize for better UX
                updateCardsPerView();
            }, 250);
        });

        // Initialize
        updateCardsPerView();

                // ---------------------------
                // Treatments carousel (show 3 cards, rest navigable)
                // ---------------------------
                const treatTrack = document.getElementById('treatmentsTrack');
                const treatPrev = document.getElementById('treatPrevBtn');
                const treatNext = document.getElementById('treatNextBtn');
                const treatCards = document.querySelectorAll('.treatment-card');
                let treatIndex = 0;
                let treatPerView = 3;
                const treatTotal = treatCards.length;

                function updateTreatPerView() {
                    if (window.innerWidth <= 768) {
                        treatPerView = 1;
                    } else if (window.innerWidth <= 1024) {
                        treatPerView = 2;
                    } else {
                        treatPerView = 3;
                    }
                    updateTreatCarousel();
                }

                function updateTreatCarousel() {
                    if (!treatCards.length) return;
                    const cardWidth = treatCards[0].offsetWidth;
                    const gap = 28; // match testimonials gap
                    const offset = -(treatIndex * (cardWidth + gap));
                    treatTrack.style.transform = `translateX(${offset}px)`;
                    treatPrev.disabled = treatIndex === 0;
                    const maxIndex = Math.max(0, treatTotal - treatPerView);
                    treatNext.disabled = treatIndex >= maxIndex;
                }

                treatPrev.addEventListener('click', () => {
                    if (treatIndex > 0) {
                        treatIndex--;
                        updateTreatCarousel();
                    }
                });

                treatNext.addEventListener('click', () => {
                    const maxIndex = Math.max(0, treatTotal - treatPerView);
                    if (treatIndex < maxIndex) {
                        treatIndex++;
                        updateTreatCarousel();
                    }
                });

                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() => {
                        treatIndex = 0;
                        updateTreatPerView();
                    }, 250);
                });

                // initialize treatments carousel
                updateTreatPerView();

        // Optional: Auto-advance carousel (uncomment if desired)
        /*
        let autoScrollTimer;
        function startAutoScroll() {
            autoScrollTimer = setInterval(() => {
                const maxIndex = Math.max(0, totalCards - cardsPerView);
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            }, 5000); // Change every 5 seconds
        }

        function stopAutoScroll() {
            clearInterval(autoScrollTimer);
        }

        // Start auto-scroll
        startAutoScroll();

        // Pause on hover
        const carouselWrapper = document.querySelector('.testimonials-carousel-wrapper');
        carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
        carouselWrapper.addEventListener('mouseleave', startAutoScroll);
        */



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

        