/**
 * SVG Icon System
 * Utility functions for managing and using SVG icons
 */

class IconSystem {
  constructor() {
    this.iconsLoaded = false;
    this.iconSprite = null;
    this.loadIcons();
  }

  /**
   * Load the SVG icon sprite
   */
  async loadIcons() {
    // Icons are embedded in HTML, so just mark as loaded
    this.iconsLoaded = true;
    this.iconSprite = document.querySelector('svg[style*="display: none"]');
    
    // Dispatch event when icons are loaded
    document.dispatchEvent(new CustomEvent('iconsLoaded'));
  }

  /**
   * Create an SVG icon element
   * @param {string} iconId - The icon ID (without 'icon-' prefix)
   * @param {Object} options - Configuration options
   * @returns {SVGElement} The SVG icon element
   */
  createIcon(iconId, options = {}) {
    const {
      size = 'base',
      className = '',
      color = '',
      ariaLabel = '',
      title = ''
    } = options;

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', `icon icon--${size} ${className}`.trim());
    svg.setAttribute('aria-hidden', ariaLabel ? 'false' : 'true');
    
    if (ariaLabel) {
      svg.setAttribute('aria-label', ariaLabel);
      svg.setAttribute('role', 'img');
    }

    if (color) {
      svg.style.color = color;
    }

    // Create use element
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#icon-${iconId}`);

    // Add title for accessibility if provided
    if (title) {
      const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleElement.textContent = title;
      svg.appendChild(titleElement);
    }

    svg.appendChild(use);
    return svg;
  }

  /**
   * Create an icon button
   * @param {string} iconId - The icon ID
   * @param {Object} options - Configuration options
   * @returns {HTMLButtonElement} The button element with icon
   */
  createIconButton(iconId, options = {}) {
    const {
      size = 'base',
      className = '',
      ariaLabel = '',
      onClick = null,
      variant = 'default'
    } = options;

    const button = document.createElement('button');
    button.setAttribute('class', `icon-btn icon-btn--${variant} ${className}`.trim());
    button.setAttribute('type', 'button');
    
    if (ariaLabel) {
      button.setAttribute('aria-label', ariaLabel);
    }

    if (onClick) {
      button.addEventListener('click', onClick);
    }

    const icon = this.createIcon(iconId, { size });
    button.appendChild(icon);

    return button;
  }

  /**
   * Create an icon with text
   * @param {string} iconId - The icon ID
   * @param {string} text - The text content
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The container element
   */
  createIconText(iconId, text, options = {}) {
    const {
      size = 'base',
      className = '',
      reverse = false,
      vertical = false,
      tag = 'span'
    } = options;

    const container = document.createElement(tag);
    const classes = ['icon-text'];
    
    if (reverse) classes.push('icon-text--reverse');
    if (vertical) classes.push('icon-text--vertical');
    if (className) classes.push(className);
    
    container.setAttribute('class', classes.join(' '));

    const icon = this.createIcon(iconId, { size });
    const textElement = document.createElement('span');
    textElement.textContent = text;

    container.appendChild(icon);
    container.appendChild(textElement);

    return container;
  }

  /**
   * Replace placeholder icons in the DOM
   */
  replacePlaceholderIcons() {
    if (!this.iconsLoaded) {
      document.addEventListener('iconsLoaded', () => this.replacePlaceholderIcons());
      return;
    }

    // Find all elements with data-icon attribute
    const placeholders = document.querySelectorAll('[data-icon]');
    
    placeholders.forEach(placeholder => {
      const iconId = placeholder.getAttribute('data-icon');
      const size = placeholder.getAttribute('data-icon-size') || 'base';
      const className = placeholder.getAttribute('data-icon-class') || '';
      const ariaLabel = placeholder.getAttribute('data-icon-label') || '';
      
      const icon = this.createIcon(iconId, { size, className, ariaLabel });
      placeholder.replaceWith(icon);
    });
  }

  /**
   * Update theme toggle icon based on current theme
   */
  updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const currentTheme = document.documentElement.getAttribute('data-theme');
    const iconContainer = themeToggle.querySelector('.theme-toggle__icon');
    
    if (iconContainer) {
      // Clear existing content
      iconContainer.innerHTML = '';
      
      // Add appropriate icon
      const iconId = currentTheme === 'dark' ? 'moon' : 'sun';
      const icon = this.createIcon(iconId, { 
        size: 'sm', 
        className: 'theme-icon',
        ariaLabel: `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`
      });
      
      iconContainer.appendChild(icon);
    }
  }

  /**
   * Initialize icon system
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
      return;
    }

    // Replace placeholder icons
    this.replacePlaceholderIcons();

    // Update theme icon
    this.updateThemeIcon();

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          this.updateThemeIcon();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }
}

// Create global instance
const iconSystem = new IconSystem();

// Auto-initialize
iconSystem.init();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IconSystem;
}

// Global access
window.IconSystem = IconSystem;
window.iconSystem = iconSystem;