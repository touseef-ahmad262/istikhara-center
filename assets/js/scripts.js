/* ============================================
   ROHANI GUIDANCE - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // ============ DYNAMIC NAVBAR & FOOTER LOADING ============
    loadComponent('navbar', 'header');
    loadComponent('footer', 'footer');

    function loadComponent(componentName, targetSelector) {
        const target = document.querySelector(targetSelector);
        if (!target) return;

        // Determine base path based on current page location
        const isInPages = window.location.pathname.includes('/pages/');
        const basePath = isInPages ? '../' : '';
        const componentPath = basePath + 'components/' + componentName + '.html';

        fetch(componentPath)
            .then(response => {
                if (!response.ok) throw new Error('Failed to load ' + componentName);
                return response.text();
            })
            .then(html => {
                target.innerHTML = html;
                if (componentName === 'navbar') {
                    initNavbar();
                }
            })
            .catch(error => {
                console.error('Error loading ' + componentName + ':', error);
            });
    }

    // ============ NAVBAR FUNCTIONALITY ============
    function initNavbar() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function () {
                navLinks.classList.toggle('open');
                const icon = navToggle.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = navLinks.classList.contains('open') ? 'close' : 'menu';
                }
            });

            // Close menu when clicking a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function () {
                    navLinks.classList.remove('open');
                    const icon = navToggle.querySelector('.material-symbols-outlined');
                    if (icon) icon.textContent = 'menu';
                });
            });
        }

        // Navbar scroll effect
        const navbar = document.getElementById('mainNavbar');
        if (navbar) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Set active nav link based on current page
        setActiveNavLink();
    }

    function setActiveNavLink() {
        const currentPage = getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-links a[data-page]');
        navLinks.forEach(link => {
            if (link.dataset.page === currentPage) {
                link.classList.add('active');
            }
        });
    }

    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';

        if (filename === 'index.html' || filename === '') return 'home';
        if (filename.includes('about')) return 'about';
        if (filename.includes('service')) return 'services';
        if (filename.includes('services')) return 'services';
        if (filename.includes('problems')) return 'problems';
        if (filename.includes('faq')) return 'faq';
        if (filename.includes('contact')) return 'contact';
        return '';
    }

    // ============ SCROLL REVEAL ANIMATIONS ============
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('animate-fade-up'));
    }

    // ============ COUNTER ANIMATION ============
    const counters = document.querySelectorAll('.counter');

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + '+';
                        }
                    };

                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ============ CONTACT FORM HANDLING ============
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('.btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Sending...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="material-symbols-outlined">send</span> Send Message';
                contactForm.reset();
                showFormMessage('Your message has been sent successfully! We will get back to you soon.', 'success');
            }, 1500);
        });
    }

    function showFormMessage(message, type) {
        let messageEl = document.querySelector('.form-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'form-message';
            const form = document.getElementById('contactForm');
            form.parentNode.insertBefore(messageEl, form.nextSibling);
        }

        messageEl.textContent = message;
        messageEl.className = 'form-message ' + type;
        messageEl.style.display = 'block';

        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }

    // ============ TESTIMONIAL SLIDER ============
    const testimonialTrack = document.querySelector('.testimonial-track');
    if (testimonialTrack) {
        let currentIndex = 0;
        const slides = testimonialTrack.children;
        const totalSlides = slides.length;

        if (totalSlides > 0) {
            const prevBtn = document.querySelector('.testimonial-prev');
            const nextBtn = document.querySelector('.testimonial-next');

            function updateSlider() {
                const slideWidth = slides[0].offsetWidth;
                testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', function () {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateSlider();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', function () {
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    updateSlider();
                });
            }

            // Auto-slide
            setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlider();
            }, 5000);

            window.addEventListener('resize', updateSlider);
        }
    }

    // ============ FAQ ACCORDION ============
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', function () {
                const isActive = item.classList.contains('active');

                // Close all items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // ============ BACK TO TOP BUTTON ============
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
