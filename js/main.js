/* ===== MAIN APPLICATION INITIALIZATION ===== */

// Application state
const App = {
    isInitialized: false,
    theme: 'light',
    isMobile: false,
    components: {},
    
    // Initialize the application
    init() {
        if (this.isInitialized) return;
        
        this.detectDevice();
        this.initializeTheme();
        this.setupEventListeners();
        this.initializeComponents();
        this.setupPerformanceOptimizations();
        
        this.isInitialized = true;
        console.log('Portfolio application initialized');
        
        // Trigger app ready event
        DOM.trigger(document, 'app-ready');
    },
    
    // Detect device type
    detectDevice() {
        this.isMobile = window.innerWidth <= 768;
        document.documentElement.classList.toggle('is-mobile', this.isMobile);
        
        // Add touch device detection
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        document.documentElement.classList.toggle('is-touch', isTouch);
    },
    
    // Initialize theme system
    initializeTheme() {
        // Theme will be handled by theme.js
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
    },
    
    // Setup global event listeners
    setupEventListeners() {
        // Handle window resize
        let resizeTimeout;
        DOM.on(window, 'resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.detectDevice();
                this.handleResize();
            }, 250);
        });
        
        // Handle theme changes
        DOM.on(document, 'theme-changed', (e) => {
            this.theme = e.detail.theme;
            this.updateComponentsTheme(e.detail.isDark);
        });
        
        // Handle scroll events
        this.setupScrollHandlers();
        
        // Handle keyboard navigation
        this.setupKeyboardHandlers();
        
        // Handle focus management
        this.setupFocusManagement();
    },
    
    // Setup scroll-related handlers
    setupScrollHandlers() {
        let scrollTimeout;
        let isScrolling = false;
        let lastScrollY = window.scrollY;
        
        DOM.on(window, 'scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (!isScrolling) {
                document.body.classList.add('is-scrolling');
                isScrolling = true;
            }
            
            // Add scroll direction classes
            if (currentScrollY > lastScrollY) {
                document.body.classList.add('scroll-down');
                document.body.classList.remove('scroll-up');
            } else {
                document.body.classList.add('scroll-up');
                document.body.classList.remove('scroll-down');
            }
            
            lastScrollY = currentScrollY;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
                isScrolling = false;
            }, 150);
        });
    },
    
    // Setup keyboard handlers
    setupKeyboardHandlers() {
        DOM.on(document, 'keydown', (e) => {
            // Handle escape key globally
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
            
            // Handle tab navigation
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        // Remove keyboard navigation class on mouse use
        DOM.on(document, 'mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    },
    
    // Setup focus management
    setupFocusManagement() {
        // Skip links for accessibility
        const skipLink = DOM.get('skip-to-main');
        if (skipLink) {
            DOM.on(skipLink, 'click', (e) => {
                e.preventDefault();
                const main = DOM.get('main-content') || DOM.query('main');
                if (main) {
                    main.focus();
                    main.scrollIntoView();
                }
            });
        }
    },
    
    // Initialize components
    initializeComponents() {
        console.log('Initializing components...');
        
        // Store component references
        this.components = {
            theme: window.themeManager,
            navigation: window.navigationManager,
            particles: window.heroParticles,
            typing: window.heroTyping,
            animations: window.scrollAnimations
        };
        
        // Initialize lazy loading
        this.initializeLazyLoading();
        
        // Initialize smooth scrolling
        this.initializeSmoothScrolling();
        
        // Initialize form enhancements
        this.initializeFormEnhancements();
    },
    
    // Initialize lazy loading for images
    initializeLazyLoading() {
        const lazyImages = DOM.queryAll('img[data-src], [data-bg]');
        
        if (lazyImages.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.dataset.bg) {
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                        img.removeAttribute('data-bg');
                    }
                    
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    },
    
    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling() {
        DOM.queryAll('a[href^="#"]').forEach(link => {
            DOM.on(link, 'click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = DOM.query(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = DOM.query('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without triggering scroll
                    history.pushState(null, null, href);
                }
            });
        });
    },
    
    // Initialize form enhancements
    initializeFormEnhancements() {
        // Add floating labels
        DOM.queryAll('.form-group input, .form-group textarea').forEach(input => {
            const updateLabel = () => {
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.toggle('has-value', input.value.length > 0);
                }
            };
            
            DOM.on(input, 'input', updateLabel);
            DOM.on(input, 'blur', updateLabel);
            updateLabel(); // Initial check
        });
        
        // Add form validation feedback
        DOM.queryAll('form').forEach(form => {
            DOM.on(form, 'submit', (e) => {
                const isValid = form.checkValidity();
                form.classList.toggle('was-validated', true);
                
                if (!isValid) {
                    e.preventDefault();
                    
                    // Focus first invalid field
                    const firstInvalid = form.querySelector(':invalid');
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                }
            });
        });
    },
    
    // Setup performance optimizations
    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup connection optimizations
        this.setupConnectionOptimizations();
        
        // Monitor performance
        this.monitorPerformance();
    },
    
    // Preload critical resources
    preloadCriticalResources() {
        // Preload fonts
        const fontPreloads = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
        ];
        
        fontPreloads.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    },
    
    // Setup connection optimizations
    setupConnectionOptimizations() {
        // Add dns-prefetch for external domains
        const domains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
        
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    },
    
    // Monitor performance
    monitorPerformance() {
        // Log performance metrics
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Performance metrics:', {
                    loadTime: perfData.loadEventEnd - perfData.fetchStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
                    firstPaint: performance.getEntriesByType('paint')[0]?.startTime
                });
            }, 0);
        });
    },
    
    // Handle window resize
    handleResize() {
        // Trigger custom resize event for components
        DOM.trigger(window, 'app-resize', {
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: this.isMobile
        });
        
        // Update components that need resize handling
        if (this.components.particles) {
            // Particles will handle resize automatically
        }
        
        if (this.components.animations) {
            this.components.animations.refreshObservers();
        }
    },
    
    // Handle escape key globally
    handleEscapeKey() {
        // Close any open modals, menus, etc.
        const openModal = DOM.query('.modal.is-active');
        if (openModal) {
            openModal.classList.remove('is-active');
            return;
        }
        
        // Close mobile navigation if open
        if (this.components.navigation && this.components.navigation.isMenuOpen) {
            this.components.navigation.closeMobileMenu();
            return;
        }
    },
    
    // Update components theme
    updateComponentsTheme(isDark) {
        if (this.components.particles) {
            this.components.particles.setTheme(isDark);
        }
    },
    
    // Public methods for component management
    getComponent(name) {
        return this.components[name];
    },
    
    registerComponent(name, component) {
        this.components[name] = component;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        if (App.components.particles) {
            App.components.particles.pause();
        }
    } else {
        // Resume animations when page is visible
        if (App.components.particles) {
            App.components.particles.resume();
        }
    }
});

// Export for global access
window.App = App;