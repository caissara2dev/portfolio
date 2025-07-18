/* ===== NAVIGATION FUNCTIONALITY ===== */

class NavigationManager {
    constructor() {
        this.navToggle = DOM.get('nav-toggle');
        this.navMenu = DOM.get('nav-menu');
        this.navLinks = DOM.queryAll('.nav__link');
        this.header = DOM.query('.header');
        
        this.isMenuOpen = false;
        this.lastScrollY = window.scrollY;
        
        this.init();
    }
    
    init() {
        this.setupMobileNavigation();
        this.setupScrollBehavior();
        this.setupActiveLinks();
        this.setupKeyboardNavigation();
    }
    
    setupMobileNavigation() {
        if (this.navToggle && this.navMenu) {
            // Toggle mobile menu
            DOM.on(this.navToggle, 'click', () => this.toggleMobileMenu());
            
            // Close menu when clicking on links
            this.navLinks.forEach(link => {
                DOM.on(link, 'click', () => this.closeMobileMenu());
            });
            
            // Close menu when clicking outside
            DOM.on(document, 'click', (e) => {
                if (this.isMenuOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
            
            // Close menu on escape key
            DOM.on(document, 'keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMenuOpen = true;
        this.navMenu.classList.add('nav__menu--open');
        this.navToggle.classList.add('nav__toggle--open');
        this.navToggle.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item
        const firstLink = this.navMenu.querySelector('.nav__link');
        if (firstLink) firstLink.focus();
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove('nav__menu--open');
        this.navToggle.classList.remove('nav__toggle--open');
        this.navToggle.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    setupScrollBehavior() {
        let ticking = false;
        
        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            if (this.header) {
                // Add/remove scrolled class
                if (currentScrollY > 50) {
                    this.header.classList.add('header--scrolled');
                } else {
                    this.header.classList.remove('header--scrolled');
                }
                
                // Hide/show header on scroll
                if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                    // Scrolling down
                    this.header.classList.add('header--hidden');
                } else {
                    // Scrolling up
                    this.header.classList.remove('header--hidden');
                }
            }
            
            this.lastScrollY = currentScrollY;
            ticking = false;
        };
        
        DOM.on(window, 'scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }
    
    setupActiveLinks() {
        // Update active link based on current page
        const currentPath = window.location.pathname;
        
        this.navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (linkPath === currentPath || 
                (currentPath === '/' && linkPath === '/') ||
                (currentPath.includes(linkPath) && linkPath !== '/')) {
                link.classList.add('nav__link--active');
            } else {
                link.classList.remove('nav__link--active');
            }
        });
        
        // Update active link on scroll for single page sections
        this.setupScrollSpy();
    }
    
    setupScrollSpy() {
        const sections = DOM.queryAll('section[id]');
        if (sections.length === 0) return;
        
        const observerOptions = {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const correspondingLink = DOM.query(`a[href="#${sectionId}"]`);
                    
                    if (correspondingLink) {
                        // Remove active class from all links
                        this.navLinks.forEach(link => {
                            link.classList.remove('nav__link--active');
                        });
                        
                        // Add active class to current link
                        correspondingLink.classList.add('nav__link--active');
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    setupKeyboardNavigation() {
        // Handle keyboard navigation in menu
        DOM.on(this.navMenu, 'keydown', (e) => {
            if (!this.isMenuOpen) return;
            
            const focusableElements = this.navMenu.querySelectorAll('.nav__link');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    // Public methods
    getCurrentActiveLink() {
        return DOM.query('.nav__link--active');
    }
    
    setActiveLink(href) {
        this.navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === href) {
                link.classList.add('nav__link--active');
            }
        });
    }
}

// Initialize navigation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});

// Export for use in other modules
window.NavigationManager = NavigationManager;