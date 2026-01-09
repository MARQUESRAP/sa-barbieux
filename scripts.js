/* ==========================================================================
   SA BARBIEUX - Scripts Partagés
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    const header = document.getElementById('header');
    const scrollTop = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            if (scrollTop) scrollTop.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            if (scrollTop) scrollTop.classList.remove('visible');
        }
    });
    
    // Trigger on load if already scrolled
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    }
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Fermer le menu sur clic d'un lien
        const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-link, .nav-cta');
        allNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }
    
    // Reveal animations on scroll
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => revealObserver.observe(el));
    
    // Counter animation
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const suffix = entry.target.getAttribute('data-suffix') || '';
                animateCounter(entry.target, target, suffix);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    function animateCounter(element, target, suffix) {
        let current = 0;
        const increment = target / 80;
        const duration = 2000;
        const stepTime = duration / 80;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString('fr-FR') + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString('fr-FR') + suffix;
            }
        }, stepTime);
    }
    
    // Portfolio filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 10);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
    
    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all others
                faqItems.forEach(i => i.classList.remove('active'));
                
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            console.log('Form submitted:', Object.fromEntries(formData));
            
            // Show success message
            alert('Merci pour votre message ! Nous vous recontacterons dans les plus brefs délais.');
            this.reset();
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ===== LIGHTBOX =====
    // Créer la lightbox dynamiquement
    const lightboxHTML = `
        <div class="lightbox" id="lightbox">
            <div class="lightbox-content">
                <button class="lightbox-close" id="lightboxClose">
                    <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <img src="" alt="" id="lightboxImg">
                <div class="lightbox-caption">
                    <h4 id="lightboxTitle"></h4>
                    <span id="lightboxLocation"></span>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxLocation = document.getElementById('lightboxLocation');
    const lightboxClose = document.getElementById('lightboxClose');
    
    // Ajouter data-lightbox aux portfolio-item avec images
    document.querySelectorAll('.portfolio-item').forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            item.setAttribute('data-lightbox', 'true');
            item.addEventListener('click', function() {
                const overlay = item.querySelector('.portfolio-overlay');
                const title = overlay ? overlay.querySelector('h4')?.textContent : '';
                const location = overlay ? overlay.querySelector('span')?.textContent : '';
                
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxTitle.textContent = title;
                lightboxLocation.textContent = location;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
    });
    
    // Fermer la lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // ===== SERVICE CARDS BACKGROUND IMAGES =====
    document.querySelectorAll('.service-card[data-image]').forEach(card => {
        const imageSrc = card.getAttribute('data-image');
        const bgElement = card.querySelector('.service-card-bg');
        if (bgElement && imageSrc) {
            bgElement.style.backgroundImage = `url('${imageSrc}')`;
        }
        
        // Rendre toute la carte cliquable
        card.addEventListener('click', function(e) {
            // Ne pas interférer si on clique sur le lien lui-même
            if (e.target.closest('.service-link')) return;
            
            const link = card.querySelector('.service-link');
            if (link) {
                window.location.href = link.getAttribute('href');
            }
        });
    });
    
});
