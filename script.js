// script.js

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    // 1 & 6. Unified Scroll and Resize Handling with cleaner requestAnimationFrame
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('progressBar');
    
    let scrollFrame;
    window.addEventListener('scroll', () => {
        if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
        scrollFrame = window.requestAnimationFrame(() => {
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            if (progressBar) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                if (height > 0) {
                    progressBar.style.width = ((window.scrollY / height) * 100) + '%';
                }
            }
        });
    }, { passive: true });

    // 3. Current Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 4 & 5. Scroll Animations (Intersection Observer with Fallback)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
            const scrollObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            animatedElements.forEach(el => scrollObserver.observe(el));
        } else {
            // Fallback for unsupported browsers
            animatedElements.forEach(el => el.classList.add('visible'));
        }
    }

    // 5 & 3 (focus trap). Mobile Menu Toggle & UX
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        const mobileBtnIcon = mobileBtn.querySelector('i');
        
        const closeMobileMenu = () => {
            navLinks.classList.remove('active');
            mobileBtn.setAttribute('aria-expanded', 'false');
            if (mobileBtnIcon) mobileBtnIcon.classList.replace('ph-x', 'ph-list');
        };

        const toggleMobileMenu = (e) => {
            if (e) e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            mobileBtn.setAttribute('aria-expanded', isActive);
            if (mobileBtnIcon) {
                if (isActive) {
                    mobileBtnIcon.classList.replace('ph-list', 'ph-x');
                } else {
                    mobileBtnIcon.classList.replace('ph-x', 'ph-list');
                }
            }
        };

        mobileBtn.addEventListener('click', toggleMobileMenu);

        // Focus Trap Setup
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const navFocusables = navLinks.querySelectorAll(focusableSelectors);
        const firstFocusable = navFocusables[0];
        const lastFocusable = navFocusables[navFocusables.length - 1];

        // Close on link click
        navLinks.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', closeMobileMenu);
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Keydown Handlers (ESC + Focus Trap)
        document.addEventListener('keydown', (e) => {
            if (!navLinks.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeMobileMenu();
                mobileBtn.focus();
            } else if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        if (lastFocusable) lastFocusable.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        if (firstFocusable) firstFocusable.focus();
                    }
                }
            }
        });
    }

    // 6. FAQ Accordion (Scoped & A11y & CSS Toggle)
    const faqContainer = document.querySelector('.faq-container');
    if (faqContainer) {
        const faqItems = faqContainer.querySelectorAll('.faq-item');
        
        faqContainer.addEventListener('click', (e) => {
            const questionBtn = e.target.closest('.faq-question');
            if (!questionBtn) return;
            
            const currentItem = questionBtn.closest('.faq-item');
            if (!currentItem) return;

            const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

            // Close others
            faqItems.forEach(item => {
                if (item !== currentItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    const btn = item.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current (CSS handles the height animation)
            if (isExpanded) {
                currentItem.classList.remove('active');
                questionBtn.setAttribute('aria-expanded', 'false');
            } else {
                currentItem.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // 7. Mobile Sliders & Resize Handling
    const mobileSliders = document.querySelectorAll('.mobile-slider');

    mobileSliders.forEach(slider => {
        const track = slider.querySelector('.mobile-slider-track');
        const prevBtn = slider.querySelector('.mobile-slider-prev');
        const nextBtn = slider.querySelector('.mobile-slider-next');

        if (!track || !prevBtn || !nextBtn) return;

        let scrollAmount = 0;

        const calculateScrollAmount = () => {
            const firstItem = track.firstElementChild;
            if (!firstItem) return;
            const rect = firstItem.getBoundingClientRect();
            if (rect.width === 0) return;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            scrollAmount = rect.width + gap;
        };

        // Double rAF: first frame commits layout, second reads stable dimensions
        requestAnimationFrame(() => requestAnimationFrame(calculateScrollAmount));

        prevBtn.addEventListener('click', () => {
            if (scrollAmount > 0) track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            if (scrollAmount > 0) track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        let resizeFrame;
        window.addEventListener('resize', () => {
            if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
            resizeFrame = window.requestAnimationFrame(() =>
                requestAnimationFrame(calculateScrollAmount)
            );
        });
    });
});
