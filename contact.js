
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

        
// Page Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.page-loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
});

// ============================================
// FILTER FUNCTIONALITY
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const caseCards = document.querySelectorAll('.case-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get filter value
        const filterValue = btn.getAttribute('data-filter');
        
        // Filter cases
        caseCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (filterValue === 'all' || cardCategory === filterValue) {
                card.style.display = 'block';
                // Re-trigger fade-in animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ============================================
// LOAD MORE FUNCTIONALITY
// ============================================
const loadMoreBtn = document.getElementById('loadMoreBtn');
const hiddenCases = document.querySelector('.hidden-cases');

if (loadMoreBtn && hiddenCases) {
    loadMoreBtn.addEventListener('click', () => {
        if (!hiddenCases.classList.contains('visible')) {
            // Show hidden cases
            hiddenCases.classList.add('visible');
            hiddenCases.style.display = 'grid';
            loadMoreBtn.querySelector('span').textContent = 'Show Less';
            loadMoreBtn.querySelector('svg polyline').setAttribute('points', '18 15 12 9 6 15');
            
            // Scroll to first hidden case
            setTimeout(() => {
                const firstHiddenCase = hiddenCases.querySelector('.case-card');
                if (firstHiddenCase) {
                    const offset = 100;
                    const elementPosition = firstHiddenCase.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        } else {
            // Hide cases
            hiddenCases.classList.remove('visible');
            setTimeout(() => {
                hiddenCases.style.display = 'none';
            }, 300);
            loadMoreBtn.querySelector('span').textContent = 'View More Case Studies';
            loadMoreBtn.querySelector('svg polyline').setAttribute('points', '6 9 12 15 18 9');
            
            // Scroll back to load more button
            const offset = 150;
            const elementPosition = loadMoreBtn.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in, .text-reveal').forEach(el => {
    observer.observe(el);
});

// ============================================
// PARALLAX EFFECT
// ============================================
const parallaxImages = document.querySelectorAll('.parallax-image');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxImages.forEach(img => {
        const speed = 0.3;
        const yPos = -(scrolled * speed);
        img.style.transform = `translateY(${yPos}px) scale(1.15)`;
    });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
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

// ============================================
// INITIALIZE ON LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to elements
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 500);
    
    // Initialize text reveal
    document.querySelectorAll('.text-reveal').forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 150 + 300);
    });
    
    console.log('✨ Case Studies page loaded successfully!');
});
