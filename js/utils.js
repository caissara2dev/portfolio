/* ===== UTILITY FUNCTIONS ===== */

// DOM utilities
const DOM = {
    // Get element by ID
    get: (id) => document.getElementById(id),
    
    // Get elements by class name
    getByClass: (className) => document.getElementsByClassName(className),
    
    // Query selector
    query: (selector) => document.querySelector(selector),
    
    // Query selector all
    queryAll: (selector) => document.querySelectorAll(selector),
    
    // Create element
    create: (tag, className = '', content = '') => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    },
    
    // Add event listener
    on: (element, event, handler) => {
        if (element) element.addEventListener(event, handler);
    },
    
    // Remove event listener
    off: (element, event, handler) => {
        if (element) element.removeEventListener(event, handler);
    },
    
    // Trigger custom event
    trigger: (element, eventName, data = {}) => {
        const event = new CustomEvent(eventName, {
            detail: data,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }
};

// Animation utilities
const Animation = {
    // Fade in element
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Fade out element
    fadeOut: (element, duration = 300) => {
        const start = performance.now();
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Slide up element
    slideUp: (element, duration = 300) => {
        element.style.height = element.offsetHeight + 'px';
        element.style.overflow = 'hidden';
        
        const start = performance.now();
        const initialHeight = element.offsetHeight;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = initialHeight * (1 - progress) + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Slide down element
    slideDown: (element, duration = 300) => {
        element.style.display = 'block';
        const targetHeight = element.scrollHeight;
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = targetHeight * progress + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = '';
                element.style.overflow = '';
            }
        };
        
        requestAnimationFrame(animate);
    }
};

// Storage utilities
const Storage = {
    // Set item in localStorage
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    },
    
    // Get item from localStorage
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('localStorage not available:', e);
            return defaultValue;
        }
    },
    
    // Remove item from localStorage
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    },
    
    // Clear all localStorage
    clear: () => {
        try {
            localStorage.clear();
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    }
};

// Validation utilities
const Validate = {
    // Email validation
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // Phone validation
    phone: (phone) => {
        const regex = /^[\+]?[1-9][\d]{0,15}$/;
        return regex.test(phone.replace(/\s/g, ''));
    },
    
    // URL validation
    url: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    // Required field validation
    required: (value) => {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    // Minimum length validation
    minLength: (value, min) => {
        return value && value.toString().length >= min;
    },
    
    // Maximum length validation
    maxLength: (value, max) => {
        return value && value.toString().length <= max;
    }
};

// Format utilities
const Format = {
    // Format date
    date: (date, options = {}) => {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
    },
    
    // Format number
    number: (number, decimals = 0) => {
        return Number(number).toFixed(decimals);
    },
    
    // Format currency
    currency: (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Capitalize first letter
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    // Truncate text
    truncate: (str, length = 100, suffix = '...') => {
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    }
};

// Export utilities to global scope
window.DOM = DOM;
window.Animation = Animation;
window.Storage = Storage;
window.Validate = Validate;
window.Format = Format;