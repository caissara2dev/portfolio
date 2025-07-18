/* ===== SCROLL-TRIGGERED ANIMATIONS ===== */

class ScrollAnimations {
    constructor(options = {}) {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            animationDelay: 100,
            staggerDelay: 150,
            ...options
        };
        
        this.observers = new Map();
        this.animatedElements = new Set();
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.observeElements();
        this.setupScrollProgress();
        this.setupParallaxElements();
    }
    
    setupIntersectionObserver() {
        // Main animation observer
        this.mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        });
        
        // Progress bar observer
        this.progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });
        
        // Counter observer
        this.counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
    }
    
    observeElements() {
        // Observe elements with animation classes
        const animationSelectors = [
            '[data-animate="fade-in"]',
            '[data-animate="slide-up"]',
            '[data-animate="slide-down"]',
            '[data-animate="slide-left"]',
            '[data-animate="slide-right"]',
            '[data-animate="scale-in"]',
            '[data-animate="rotate-in"]',
            '[data-animate="flip-in"]',
            '.animate-on-scroll',
            '.fade-in-up',
            '.fade-in-down',
            '.fade-in-left',
            '.fade-in-right',
            '.zoom-in',
            '.bounce-in'
        ];
        
        animationSelectors.forEach(selector => {
            DOM.queryAll(selector).forEach(element => {
                this.prepareElement(element);
                this.mainObserver.observe(element);
            });
        });
        
        // Observe progress bars
        DOM.queryAll('.progress-bar, [data-progress]').forEach(element => {
            this.progressObserver.observe(element);
        });
        
        // Observe counters
        DOM.queryAll('[data-counter], .counter').forEach(element => {
            this.counterObserver.observe(element);
        });
    }
    
    prepareElement(element) {
        // Set initial state for animations
        const animationType = element.dataset.animate || this.getAnimationTypeFromClass(element);
        
        switch (animationType) {
            case 'fade-in':
                element.style.opacity = '0';
                break;
            case 'slide-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(50px)';
                break;
            case 'slide-down':
                element.style.opacity = '0';
                element.style.transform = 'translateY(-50px)';
                break;
            case 'slide-left':
                element.style.opacity = '0';
                element.style.transform = 'translateX(50px)';
                break;
            case 'slide-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-50px)';
                break;
            case 'scale-in':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                break;
            case 'rotate-in':
                element.style.opacity = '0';
                element.style.transform = 'rotate(-10deg) scale(0.9)';
                break;
            case 'flip-in':
                element.style.opacity = '0';
                element.style.transform = 'rotateY(-90deg)';
                break;
        }
        
        // Add transition
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    getAnimationTypeFromClass(element) {
        const classList = Array.from(element.classList);
        
        if (classList.includes('fade-in-up')) return 'slide-up';
        if (classList.includes('fade-in-down')) return 'slide-down';
        if (classList.includes('fade-in-left')) return 'slide-left';
        if (classList.includes('fade-in-right')) return 'slide-right';
        if (classList.includes('zoom-in')) return 'scale-in';
        if (classList.includes('bounce-in')) return 'scale-in';
        
        return 'fade-in';
    }
    
    animateElement(element) {
        const delay = parseInt(element.dataset.delay) || 0;
        const stagger = this.calculateStaggerDelay(element);
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.classList.add('animated');
            
            // Trigger custom event
            element.dispatchEvent(new CustomEvent('animated', {
                detail: { element }
            }));
        }, delay + stagger);
    }
    
    calculateStaggerDelay(element) {
        // Calculate stagger delay for grouped elements
        const parent = element.closest('[data-stagger]');
        if (!parent) return 0;
        
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(element);
        
        return index * this.options.staggerDelay;
    }
    
    animateProgressBar(element) {
        const progress = parseInt(element.dataset.progress) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        
        let currentProgress = 0;
        const increment = progress / (duration / 16); // 60fps
        
        const animate = () => {
            currentProgress += increment;
            
            if (currentProgress >= progress) {
                currentProgress = progress;
            }
            
            // Update progress bar
            const progressBar = element.querySelector('.progress-bar__fill') || element;
            progressBar.style.width = `${currentProgress}%`;
            
            // Update text if present
            const progressText = element.querySelector('.progress-bar__text');
            if (progressText) {
                progressText.textContent = `${Math.round(currentProgress)}%`;
            }
            
            if (currentProgress < progress) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.counter) || parseInt(element.textContent) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        
        let current = 0;
        const increment = target / (duration / 16); // 60fps
        
        const animate = () => {
            current += increment;
            
            if (current >= target) {
                current = target;
            }
            
            element.textContent = prefix + Math.round(current) + suffix;
            
            if (current < target) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    setupScrollProgress() {
        const progressBar = DOM.get('scroll-progress');
        if (!progressBar) return;
        
        let ticking = false;
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
            ticking = false;
        };
        
        DOM.on(window, 'scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        });
    }
    
    setupParallaxElements() {
        const parallaxElements = DOM.queryAll('[data-parallax]');
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollTop * speed);
                
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        DOM.on(window, 'scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
    
    // Public methods
    animateElementManually(element, animationType = 'fade-in') {
        if (typeof element === 'string') {
            element = DOM.get(element);
        }
        
        if (!element) return;
        
        element.dataset.animate = animationType;
        this.prepareElement(element);
        
        setTimeout(() => {
            this.animateElement(element);
        }, 100);
    }
    
    resetElement(element) {
        if (typeof element === 'string') {
            element = DOM.get(element);
        }
        
        if (!element) return;
        
        this.animatedElements.delete(element);
        element.classList.remove('animated');
        this.prepareElement(element);
    }
    
    refreshObservers() {
        // Disconnect all observers
        this.mainObserver.disconnect();
        this.progressObserver.disconnect();
        this.counterObserver.disconnect();
        
        // Clear animated elements
        this.animatedElements.clear();
        
        // Re-observe elements
        this.observeElements();
    }
    
    destroy() {
        // Disconnect all observers
        this.mainObserver.disconnect();
        this.progressObserver.disconnect();
        this.counterObserver.disconnect();
        
        // Remove scroll listeners
        DOM.off(window, 'scroll');
        
        // Clear sets and maps
        this.animatedElements.clear();
        this.observers.clear();
    }
}

// Utility functions for manual animations
const AnimationUtils = {
    // Animate elements in sequence
    animateSequence(elements, delay = 200) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                if (typeof element === 'string') {
                    element = DOM.get(element);
                }
                
                if (element) {
                    element.style.opacity = '1';
                    element.style.transform = 'none';
                    element.classList.add('animated');
                }
            }, index * delay);
        });
    },
    
    // Fade in element
    fadeIn(element, duration = 300) {
        if (typeof element === 'string') {
            element = DOM.get(element);
        }
        
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    },
    
    // Fade out element
    fadeOut(element, duration = 300) {
        if (typeof element === 'string') {
            element = DOM.get(element);
        }
        
        if (!element) return;
        
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    },
    
    // Slide element
    slideIn(element, direction = 'up', duration = 400) {
        if (typeof element === 'string') {
            element = DOM.get(element);
        }
        
        if (!element) return;
        
        const transforms = {
            up: 'translateY(20px)',
            down: 'translateY(-20px)',
            left: 'translateX(20px)',
            right: 'translateX(-20px)'
        };
        
        element.style.opacity = '0';
        element.style.transform = transforms[direction];
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }
};

// Auto-initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        window.scrollAnimations = new ScrollAnimations();
    }
});

// Export for use in other modules
window.ScrollAnimations = ScrollAnimations;
window.AnimationUtils = AnimationUtils;