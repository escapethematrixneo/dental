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

// ============================================================
// LEGAL PAGES JAVASCRIPT
// For Privacy Policy, Terms of Service, and Disclaimer
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // SMOOTH SCROLLING FOR TOC LINKS
    // ============================================================
    const tocLinks = document.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const offset = 100;
                const targetPosition = targetSection.offsetTop - navbarHeight - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================
    // ACTIVE TOC LINK ON SCROLL
    // ============================================================
    function updateActiveTOCLink() {
        const sections = document.querySelectorAll('.legal-section[id]');
        const scrollPosition = window.scrollY;
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 150;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active class
        tocLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Throttle scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(function() {
            updateActiveTOCLink();
        });
    });

    // Initial call
    updateActiveTOCLink();

    // ============================================================
    // STICKY TOC BEHAVIOR
    // ============================================================
    const toc = document.querySelector('.toc');
    
    if (toc) {
        const tocOriginalTop = toc.offsetTop;
        
        window.addEventListener('scroll', function() {
            if (window.innerWidth > 768) {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > tocOriginalTop - 120) {
                    toc.style.position = 'sticky';
                    toc.style.top = '120px';
                } else {
                    toc.style.position = 'static';
                }
            }
        });
    }

    // ============================================================
    // PRINT FUNCTIONALITY
    // ============================================================
    function addPrintButton() {
        const legalArticle = document.querySelector('.legal-article');
        
        if (legalArticle && !document.querySelector('.print-button')) {
            const printButton = document.createElement('button');
            printButton.className = 'print-button';
            printButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Print this document
            `;
            
            printButton.addEventListener('click', function() {
                window.print();
            });
            
            // Add print button styles
            const printStyle = document.createElement('style');
            printStyle.textContent = `
                .print-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.85rem 1.75rem;
                    background: white;
                    border: 2px solid var(--primary);
                    color: var(--primary);
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Manrope', sans-serif;
                    margin: 2rem 0;
                    float: right;
                }
                
                .print-button:hover {
                    background: var(--primary);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(26, 35, 50, 0.15);
                }
                
                .print-button svg {
                    stroke: currentColor;
                }
                
                @media print {
                    .print-button {
                        display: none !important;
                    }
                }
                
                @media (max-width: 768px) {
                    .print-button {
                        float: none;
                        width: 100%;
                        justify-content: center;
                    }
                }
            `;
            document.head.appendChild(printStyle);
            
            // Insert before first section
            const firstSection = legalArticle.querySelector('.legal-section');
            if (firstSection) {
                legalArticle.insertBefore(printButton, firstSection);
            }
        }
    }

    // Add print button
    addPrintButton();

    // ============================================================
    // MOBILE TOC TOGGLE
    // ============================================================
    function createMobileTOCToggle() {
        const toc = document.querySelector('.toc');
        
        if (toc && window.innerWidth <= 768) {
            if (!document.querySelector('.toc-toggle')) {
                const toggle = document.createElement('button');
                toggle.className = 'toc-toggle';
                toggle.innerHTML = `
                    📋 Table of Contents
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                `;
                
                const tocNav = toc.querySelector('.toc-nav');
                const tocHeader = toc.querySelector('.toc-header');
                
                toggle.addEventListener('click', function() {
                    tocNav.classList.toggle('expanded');
                    this.classList.toggle('active');
                });
                
                toc.insertBefore(toggle, tocNav);
                
                // Add mobile TOC styles
                const mobileStyle = document.createElement('style');
                mobileStyle.textContent = `
                    @media (max-width: 768px) {
                        .toc-toggle {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            width: 100%;
                            padding: 1rem;
                            background: var(--primary);
                            color: white;
                            border: none;
                            border-radius: 12px;
                            font-weight: 600;
                            font-size: 1rem;
                            cursor: pointer;
                            margin-bottom: 1rem;
                            transition: all 0.3s ease;
                        }
                        
                        .toc-toggle:hover {
                            background: var(--primary-light);
                        }
                        
                        .toc-toggle svg {
                            transition: transform 0.3s ease;
                        }
                        
                        .toc-toggle.active svg {
                            transform: rotate(180deg);
                        }
                        
                        .toc-header {
                            display: none;
                        }
                        
                        .toc-nav {
                            max-height: 0;
                            overflow: hidden;
                            transition: max-height 0.4s ease;
                        }
                        
                        .toc-nav.expanded {
                            max-height: 1000px;
                        }
                    }
                    
                    @media (min-width: 769px) {
                        .toc-toggle {
                            display: none;
                        }
                    }
                `;
                document.head.appendChild(mobileStyle);
            }
        }
    }

    createMobileTOCToggle();

    // Recreate on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            createMobileTOCToggle();
        }
    });

    // ============================================================
    // EXPAND/COLLAPSE LONG SECTIONS (OPTIONAL)
    // ============================================================
    function addReadMoreButtons() {
        const longSections = document.querySelectorAll('.legal-section');
        
        longSections.forEach(section => {
            const content = section.querySelector('p, ul, ol');
            if (content && section.scrollHeight > 1000) {
                section.classList.add('collapsible');
                
                const readMoreBtn = document.createElement('button');
                readMoreBtn.className = 'read-more-btn';
                readMoreBtn.textContent = 'Read More';
                
                readMoreBtn.addEventListener('click', function() {
                    section.classList.toggle('expanded');
                    this.textContent = section.classList.contains('expanded') ? 'Read Less' : 'Read More';
                });
                
                section.appendChild(readMoreBtn);
            }
        });
        
        // Add styles for collapsible sections
        const collapsibleStyle = document.createElement('style');
        collapsibleStyle.textContent = `
            .legal-section.collapsible {
                max-height: 800px;
                overflow: hidden;
                position: relative;
            }
            
            .legal-section.collapsible::after {
                content: '';
                position: absolute;
                bottom: 60px;
                left: 0;
                right: 0;
                height: 150px;
                background: linear-gradient(to bottom, transparent, white);
                pointer-events: none;
            }
            
            .legal-section.collapsible.expanded {
                max-height: none;
            }
            
            .legal-section.collapsible.expanded::after {
                display: none;
            }
            
            .read-more-btn {
                margin-top: 1.5rem;
                padding: 0.75rem 2rem;
                background: var(--accent);
                color: white;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Manrope', sans-serif;
            }
            
            .read-more-btn:hover {
                background: var(--accent-dark);
                transform: translateY(-2px);
            }
        `;
        // Uncomment to enable read more functionality
        // document.head.appendChild(collapsibleStyle);
    }

    // Optionally add read more buttons (currently disabled)
    // addReadMoreButtons();

    // ============================================================
    // HIGHLIGHT SEARCHED TEXT (FROM URL HASH)
    // ============================================================
    function highlightHashTarget() {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                setTimeout(() => {
                    target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                    target.style.transition = 'background-color 0.5s ease';
                    
                    setTimeout(() => {
                        target.style.backgroundColor = '';
                    }, 2000);
                }, 500);
            }
        }
    }

    highlightHashTarget();

    // ============================================================
    // COPY SECTION LINK
    // ============================================================
    const sectionHeadings = document.querySelectorAll('.legal-section h2, .legal-section h3');
    
    sectionHeadings.forEach(heading => {
        const section = heading.closest('.legal-section');
        if (section && section.id) {
            heading.style.cursor = 'pointer';
            heading.title = 'Click to copy link to this section';
            
            heading.addEventListener('click', function() {
                const url = window.location.origin + window.location.pathname + '#' + section.id;
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(url).then(() => {
                        showCopiedNotification(heading);
                    });
                }
            });
        }
    });

    function showCopiedNotification(element) {
        const notification = document.createElement('span');
        notification.className = 'copied-notification';
        notification.textContent = '✓ Link copied!';
        
        element.appendChild(notification);
        
        const notificationStyle = document.createElement('style');
        notificationStyle.textContent = `
            .copied-notification {
                display: inline-block;
                margin-left: 1rem;
                padding: 0.35rem 0.75rem;
                background: var(--accent);
                color: white;
                border-radius: 6px;
                font-size: 0.8rem;
                font-weight: 600;
                animation: fadeInOut 2s ease;
            }
            
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; }
                10%, 90% { opacity: 1; }
            }
        `;
        
        if (!document.querySelector('#copied-notification-style')) {
            notificationStyle.id = 'copied-notification-style';
            document.head.appendChild(notificationStyle);
        }
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // ============================================================
    // PROGRESS BAR FOR LONG DOCUMENTS
    // ============================================================
    function createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        document.body.appendChild(progressBar);
        
        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .reading-progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                height: 4px;
                background: linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 100%);
                z-index: 9999;
                transition: width 0.2s ease;
                box-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
            }
            
            @media print {
                .reading-progress-bar {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(progressStyle);
        
        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            
            progressBar.style.width = Math.min(progress, 100) + '%';
        });
    }

    createProgressBar();

    // ============================================================
    // LAST UPDATED DATE FORMATTING
    // ============================================================
    const lastUpdatedElements = document.querySelectorAll('.meta-item, .signature-line');
    
    lastUpdatedElements.forEach(element => {
        const text = element.textContent;
        if (text.includes('February') || text.includes('2026')) {
            element.style.fontStyle = 'italic';
            element.style.color = 'var(--text-muted)';
        }
    });

    // ============================================================
    // CONSOLE INFO
    // ============================================================
    console.log('%c📄 Legal Pages Loaded', 'color: #D4AF37; font-size: 16px; font-weight: bold;');
    console.log('%c✓ Smooth scrolling active', 'color: #1A2332; font-size: 12px;');
    console.log('%c✓ Table of contents navigation ready', 'color: #1A2332; font-size: 12px;');
    console.log('%c✓ Print functionality enabled', 'color: #1A2332; font-size: 12px;');
    console.log('%c✓ Mobile responsive features active', 'color: #1A2332; font-size: 12px;');
});

// ============================================================
// ACCESSIBILITY: ESC KEY TO CLOSE MOBILE TOC
// ============================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const tocNav = document.querySelector('.toc-nav.expanded');
        const tocToggle = document.querySelector('.toc-toggle.active');
        
        if (tocNav && tocToggle) {
            tocNav.classList.remove('expanded');
            tocToggle.classList.remove('active');
        }
    }
});