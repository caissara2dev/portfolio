/* ===== TYPING ANIMATION EFFECTS ===== */

class TypingAnimation {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? DOM.get(element) : element;
        if (!this.element) return;
        
        // Default options
        this.options = {
            strings: ['Developer', 'Designer', 'Creator'],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            cursorBlinkSpeed: 530,
            fadeOut: false,
            fadeOutClass: 'typed-fade-out',
            fadeOutDelay: 500,
            preStringTyped: null,
            onStringTyped: null,
            preStringDeleted: null,
            onStringDeleted: null,
            onComplete: null,
            onReset: null,
            shuffle: false,
            ...options
        };
        
        this.currentStringIndex = 0;
        this.currentCharIndex = 0;
        this.isTyping = false;
        this.isDeleting = false;
        this.isPaused = false;
        this.isComplete = false;
        this.timeout = null;
        this.cursorTimeout = null;
        
        this.originalText = this.element.textContent;
        this.strings = this.options.strings.length ? this.options.strings : [this.originalText];
        
        if (this.options.shuffle) {
            this.shuffleStrings();
        }
        
        this.init();
    }
    
    init() {
        this.setupCursor();
        this.start();
    }
    
    setupCursor() {
        if (this.options.showCursor) {
            this.cursor = document.createElement('span');
            this.cursor.className = 'typed-cursor';
            this.cursor.textContent = this.options.cursorChar;
            this.cursor.style.cssText = `
                animation: typed-blink ${this.options.cursorBlinkSpeed}ms infinite;
                font-weight: inherit;
                color: inherit;
            `;
            
            // Add cursor styles if not already present
            if (!DOM.query('style[data-typed-cursor]')) {
                const style = document.createElement('style');
                style.setAttribute('data-typed-cursor', '');
                style.textContent = `
                    @keyframes typed-blink {
                        0%, 50% { opacity: 1; }
                        51%, 100% { opacity: 0; }
                    }
                    .typed-cursor--hidden { opacity: 0 !important; }
                `;
                document.head.appendChild(style);
            }
            
            this.element.parentNode.insertBefore(this.cursor, this.element.nextSibling);
        }
    }
    
    start() {
        if (this.isComplete) return;
        
        this.timeout = setTimeout(() => {
            this.type();
        }, this.options.startDelay);
    }
    
    type() {
        if (this.isPaused || this.isComplete) return;
        
        const currentString = this.strings[this.currentStringIndex];
        
        if (!this.isDeleting) {
            // Typing forward
            if (this.currentCharIndex < currentString.length) {
                if (!this.isTyping) {
                    this.isTyping = true;
                    if (this.options.preStringTyped) {
                        this.options.preStringTyped(this.currentStringIndex);
                    }
                }
                
                this.element.textContent = currentString.substring(0, this.currentCharIndex + 1);
                this.currentCharIndex++;
                
                this.timeout = setTimeout(() => this.type(), this.getTypeSpeed());
            } else {
                // String complete
                this.isTyping = false;
                
                if (this.options.onStringTyped) {
                    this.options.onStringTyped(this.currentStringIndex);
                }
                
                // Check if we should continue or complete
                if (this.currentStringIndex === this.strings.length - 1 && !this.options.loop) {
                    this.complete();
                } else {
                    this.timeout = setTimeout(() => {
                        this.backspace();
                    }, this.options.backDelay);
                }
            }
        }
    }
    
    backspace() {
        if (this.isPaused || this.isComplete) return;
        
        const currentString = this.strings[this.currentStringIndex];
        
        if (!this.isDeleting) {
            this.isDeleting = true;
            if (this.options.preStringDeleted) {
                this.options.preStringDeleted(this.currentStringIndex);
            }
        }
        
        if (this.currentCharIndex > 0) {
            this.element.textContent = currentString.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            this.timeout = setTimeout(() => this.backspace(), this.options.backSpeed);
        } else {
            // Backspace complete
            this.isDeleting = false;
            
            if (this.options.onStringDeleted) {
                this.options.onStringDeleted(this.currentStringIndex);
            }
            
            // Move to next string
            this.currentStringIndex = (this.currentStringIndex + 1) % this.strings.length;
            
            // Start typing next string
            this.timeout = setTimeout(() => this.type(), this.options.typeSpeed);
        }
    }
    
    complete() {
        this.isComplete = true;
        
        if (this.cursor) {
            this.cursor.classList.add('typed-cursor--hidden');
        }
        
        if (this.options.fadeOut) {
            this.element.classList.add(this.options.fadeOutClass);
        }
        
        if (this.options.onComplete) {
            this.options.onComplete();
        }
    }
    
    getTypeSpeed() {
        // Add some randomness to typing speed for more natural feel
        const variance = this.options.typeSpeed * 0.3;
        return this.options.typeSpeed + (Math.random() - 0.5) * variance;
    }
    
    shuffleStrings() {
        for (let i = this.strings.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.strings[i], this.strings[j]] = [this.strings[j], this.strings[i]];
        }
    }
    
    // Public methods
    pause() {
        this.isPaused = true;
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
    
    resume() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        
        if (this.isDeleting) {
            this.backspace();
        } else {
            this.type();
        }
    }
    
    reset() {
        this.pause();
        
        this.currentStringIndex = 0;
        this.currentCharIndex = 0;
        this.isTyping = false;
        this.isDeleting = false;
        this.isComplete = false;
        
        this.element.textContent = '';
        
        if (this.cursor) {
            this.cursor.classList.remove('typed-cursor--hidden');
        }
        
        if (this.options.fadeOut) {
            this.element.classList.remove(this.options.fadeOutClass);
        }
        
        if (this.options.onReset) {
            this.options.onReset();
        }
        
        this.start();
    }
    
    destroy() {
        this.pause();
        
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
        
        // Remove cursor styles if no other instances
        const cursors = DOM.queryAll('.typed-cursor');
        if (cursors.length === 0) {
            const style = DOM.query('style[data-typed-cursor]');
            if (style) {
                style.remove();
            }
        }
        
        this.element.textContent = this.originalText;
    }
    
    updateStrings(newStrings) {
        this.strings = newStrings;
        if (this.options.shuffle) {
            this.shuffleStrings();
        }
    }
}

// Multi-line typing animation
class MultiLineTyping {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? DOM.get(element) : element;
        if (!this.element) return;
        
        this.options = {
            lines: [],
            lineDelay: 1000,
            typeSpeed: 50,
            showCursor: true,
            cursorChar: '|',
            onLineComplete: null,
            onComplete: null,
            ...options
        };
        
        this.currentLineIndex = 0;
        this.lineElements = [];
        this.isComplete = false;
        
        this.init();
    }
    
    init() {
        this.setupLines();
        this.start();
    }
    
    setupLines() {
        this.element.innerHTML = '';
        
        this.options.lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'typed-line';
            lineElement.style.opacity = '0';
            this.element.appendChild(lineElement);
            this.lineElements.push(lineElement);
        });
    }
    
    start() {
        this.typeLine(0);
    }
    
    typeLine(index) {
        if (index >= this.options.lines.length) {
            this.complete();
            return;
        }
        
        const lineElement = this.lineElements[index];
        lineElement.style.opacity = '1';
        
        const typing = new TypingAnimation(lineElement, {
            strings: [this.options.lines[index]],
            typeSpeed: this.options.typeSpeed,
            loop: false,
            showCursor: index === this.options.lines.length - 1 ? this.options.showCursor : false,
            cursorChar: this.options.cursorChar,
            onComplete: () => {
                if (this.options.onLineComplete) {
                    this.options.onLineComplete(index);
                }
                
                setTimeout(() => {
                    this.typeLine(index + 1);
                }, this.options.lineDelay);
            }
        });
    }
    
    complete() {
        this.isComplete = true;
        
        if (this.options.onComplete) {
            this.options.onComplete();
        }
    }
}

// Auto-initialize typing animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero typing animation
    const heroTyping = DOM.get('hero-typing');
    if (heroTyping) {
        window.heroTyping = new TypingAnimation(heroTyping, {
            strings: [
                'Full Stack Developer',
                'UI/UX Designer', 
                'Problem Solver',
                'Creative Thinker'
            ],
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 2000,
            startDelay: 1000,
            loop: true
        });
    }
    
    // Initialize any elements with data-typing attribute
    DOM.queryAll('[data-typing]').forEach(element => {
        const strings = element.dataset.typing.split('|');
        const options = {
            strings: strings,
            typeSpeed: parseInt(element.dataset.typeSpeed) || 100,
            backSpeed: parseInt(element.dataset.backSpeed) || 50,
            backDelay: parseInt(element.dataset.backDelay) || 2000,
            loop: element.dataset.loop !== 'false'
        };
        
        new TypingAnimation(element, options);
    });
});

// Export for use in other modules
window.TypingAnimation = TypingAnimation;
window.MultiLineTyping = MultiLineTyping;