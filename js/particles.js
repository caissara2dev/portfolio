/* ===== PARTICLE BACKGROUND ANIMATION ===== */

class ParticleSystem {
    constructor(canvasId, options = {}) {
        this.canvas = DOM.get(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        
        // Default options
        this.options = {
            particleCount: 50,
            particleSize: { min: 1, max: 3 },
            speed: { min: 0.5, max: 2 },
            color: 'rgba(99, 102, 241, 0.6)',
            connectionDistance: 120,
            connectionOpacity: 0.3,
            enableConnections: true,
            enableMouse: true,
            mouseRadius: 150,
            ...options
        };
        
        this.mouse = { x: 0, y: 0, isActive: false };
        this.resizeTimeout = null;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.start();
    }
    
    setupCanvas() {
        const updateCanvasSize = () => {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            
            this.ctx.scale(dpr, dpr);
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            
            // Update particle boundaries
            this.width = rect.width;
            this.height = rect.height;
        };
        
        updateCanvasSize();
        
        // Handle resize with debouncing
        DOM.on(window, 'resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                updateCanvasSize();
                this.createParticles(); // Recreate particles for new dimensions
            }, 250);
        });
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * (this.options.speed.max - this.options.speed.min) + this.options.speed.min,
            vy: (Math.random() - 0.5) * (this.options.speed.max - this.options.speed.min) + this.options.speed.min,
            size: Math.random() * (this.options.particleSize.max - this.options.particleSize.min) + this.options.particleSize.min,
            opacity: Math.random() * 0.5 + 0.5
        };
    }
    
    setupEventListeners() {
        if (this.options.enableMouse) {
            DOM.on(this.canvas, 'mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
                this.mouse.isActive = true;
            });
            
            DOM.on(this.canvas, 'mouseleave', () => {
                this.mouse.isActive = false;
            });
        }
        
        // Pause animation when page is not visible
        DOM.on(document, 'visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Respect user's motion preferences
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            this.pause();
        }
        
        DOM.on(mediaQuery, 'change', (e) => {
            if (e.matches) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.width, particle.x));
            }
            
            if (particle.y <= 0 || particle.y >= this.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.height, particle.y));
            }
            
            // Mouse interaction
            if (this.options.enableMouse && this.mouse.isActive) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.mouseRadius) {
                    const force = (this.options.mouseRadius - distance) / this.options.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    
                    particle.vx -= Math.cos(angle) * force * 0.5;
                    particle.vy -= Math.sin(angle) * force * 0.5;
                }
            }
            
            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Ensure minimum speed
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed < this.options.speed.min) {
                const angle = Math.atan2(particle.vy, particle.vx);
                particle.vx = Math.cos(angle) * this.options.speed.min;
                particle.vy = Math.sin(angle) * this.options.speed.min;
            }
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw connections first (behind particles)
        if (this.options.enableConnections) {
            this.drawConnections();
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.options.color.replace(/[\d.]+\)$/g, `${particle.opacity})`);
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.connectionDistance) {
                    const opacity = (1 - distance / this.options.connectionDistance) * this.options.connectionOpacity;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.options.color.replace(/[\d.]+\)$/g, `${opacity})`);
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.updateParticles();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }
    
    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.isRunning) {
            this.start();
        }
    }
    
    destroy() {
        this.pause();
        
        // Remove event listeners
        DOM.off(window, 'resize');
        DOM.off(this.canvas, 'mousemove');
        DOM.off(this.canvas, 'mouseleave');
        DOM.off(document, 'visibilitychange');
        
        // Clear canvas
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
        
        this.particles = [];
    }
    
    // Public methods for customization
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.createParticles(); // Recreate particles with new options
    }
    
    setTheme(isDark) {
        const lightColor = 'rgba(99, 102, 241, 0.6)';
        const darkColor = 'rgba(139, 92, 246, 0.6)';
        
        this.options.color = isDark ? darkColor : lightColor;
    }
}

// Auto-initialize particle systems
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero particles if canvas exists
    const heroCanvas = DOM.get('hero-particles');
    if (heroCanvas) {
        window.heroParticles = new ParticleSystem('hero-particles', {
            particleCount: 60,
            particleSize: { min: 1, max: 2 },
            speed: { min: 0.3, max: 1.5 },
            connectionDistance: 100,
            enableMouse: true,
            mouseRadius: 120
        });
        
        // Update particles theme when theme changes
        DOM.on(document, 'theme-changed', (e) => {
            if (window.heroParticles) {
                window.heroParticles.setTheme(e.detail.isDark);
            }
        });
    }
});

// Export for use in other modules
window.ParticleSystem = ParticleSystem;