# Portfolio Website

A vibrant, interactive portfolio website showcasing web development with creative animations, and seamless user experiences. Built with vanilla HTML, CSS, and JavaScript.

## 🎯 Project Overview

Digital showcase featuring:
- Interactive project demonstrations with filtering and search
- Responsive navigation with optimized layout
- Professional networking opportunities
- Creative animations and modern design
- Mobile-first responsive experience
- Light/dark theme toggle functionality

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **CSS Architecture**: BEM methodology with custom properties
- **Fonts**: Inter & Poppins from Google Fonts
- **Animations**: CSS transitions with Intersection Observer API
- **Hosting**: Linode VPS (Ubuntu 20.04 LTS)
- **Version Control**: Git with GitHub repository
- **CDN**: Cloudflare for performance optimization

## ✨ Key Features

### 🎨 Design System
- **Responsive Grid System**: 8px spacing with flexible layouts
- **Color Palette**: Comprehensive design tokens with 220+ CSS variables
- **Typography**: Inter (body) and Poppins (headings) font pairing
- **Theme Toggle**: Seamless light/dark mode switching
- **Component Library**: Reusable buttons, cards, forms, and navigation

### 🚀 Interactive Elements
- **Hero Section**: Particle background animation with typing effects
- **Navigation**: Optimized responsive navbar with proper height constraints
- **Project Showcase**: Masonry grid layout with filtering and real-time search
- **Animations**: Scroll-triggered animations using Intersection Observer
- **Image Loading**: Lazy loading for optimal performance

### 📱 Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Navigation Heights**: 50px mobile, 60px tablet, 70px medium desktop, 80px large desktop
- **Smooth Scrolling**: CSS scroll-behavior with proper scroll padding
- **Touch-Friendly**: Accessible navigation and interactions

## 📁 Project Structure

```
/
├── assets/                 # Images, fonts, icons, videos
│   ├── favicon.ico
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   └── videos/
├── css/                   # Modular CSS architecture
│   ├── reset.css          # CSS reset and normalization
│   ├── variables.css      # Design tokens and CSS custom properties
│   ├── components.css     # Reusable component styles
│   └── main.css          # Main styles and layout
├── js/                    # JavaScript modules
│   ├── main.js           # Application initialization
│   ├── theme.js          # Theme toggle functionality
│   ├── navigation.js     # Navigation interactions
│   ├── particles.js      # Particle animation system
│   ├── typing.js         # Typing animation effects
│   ├── animations.js     # Scroll-triggered animations
│   └── utils.js          # Utility functions
├── projects/              # Project showcase
│   └── index.html        # Projects listing page
├── index.html             # Home page
├── about.html             # About page
├── skills.html            # Skills and technologies
├── contact.html           # Contact form
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. **Switch to development branch**
   ```bash
   git checkout development
   ```

3. **Open in browser**
   ```bash
   # Simply open index.html in your preferred browser
   # Or use a local server (recommended)
   python -m http.server 8000
   # Or with Node.js
   npx serve .
   ```

4. **Development workflow**
   ```bash
   # Use Live Server extension in VS Code for hot reload
   # Or any local development server
   
   # Make changes on development branch
   git add .
   git commit -m "Your commit message"
   
   # When ready to merge to main
   git checkout master
   git merge development
   ```

## 🌿 Git Branching Strategy

- **`master`**: Production-ready code, stable releases only
- **`development`**: Active development branch for new features
- **Feature branches**: Create from development for specific features

**Workflow**:
1. All development work happens on the `development` branch
2. Create feature branches from `development` for major features
3. Merge completed features back to `development`
4. Merge `development` to `master` only when ready for production

## 🔄 Development Progress

**Total Estimated Time**: 180 hours over 12 weeks  
**Current Progress**: 16/35 tasks completed (46%)

### Phase 1: Foundation ✅ COMPLETED
- [x] Set up development environment and project structure
- [x] Initialize Git repository with proper .gitignore
- [x] Create basic HTML structure for all pages
- [x] Set up CSS architecture using BEM methodology
- [x] Implement responsive grid system with 8px spacing

### Phase 2: Design System ✅ COMPLETED
- [x] Create color palette and typography scales (Inter/Poppins fonts)
- [x] Build comprehensive component library (buttons, cards, forms, modals, navigation)
- [x] Implement theme toggle functionality (light/dark mode)
- [x] Create animation utilities and CSS transitions
- [x] Optimize responsive navigation bar with proper height constraints

### Phase 3: Interactive Features ✅ COMPLETED
- [x] Build hero section with particle background animation
- [x] Implement typing animation for hero text
- [x] Add scroll-triggered animations using Intersection Observer
- [x] Implement lazy loading for images and videos
- [x] Build projects showcase with masonry grid layout
- [x] Add project filtering by technology stack
- [x] Implement real-time project search functionality

### Phase 4: Content & Pages 🚧 IN PROGRESS
- [ ] Design and implement custom SVG icons
- [ ] Create about page with personal story content
- [ ] Create individual project detail pages
- [ ] Build skills page with animated progress bars
- [ ] Implement contact form with validation
- [ ] Add spam protection (honeypot + rate limiting)

### Phase 5: Optimization & Testing 📋 PENDING
- [ ] Optimize performance (< 3s load time, < 500KB page size)
- [ ] Implement PWA features with service worker
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness testing across devices
- [ ] Accessibility audit for WCAG 2.1 AA compliance
- [ ] SEO optimization with proper meta tags

### Phase 6: Deployment 📋 PENDING
- [ ] Set up Linode VPS with Ubuntu 20.04 LTS
- [ ] Configure Nginx web server
- [ ] Install SSL certificate with Let's Encrypt
- [ ] Configure Cloudflare CDN
- [ ] Deploy to staging environment for testing
- [ ] Final production deployment
- [ ] Configure analytics and monitoring

## 📊 Performance Goals

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Performance Score**: > 90
- **Mobile Responsiveness**: All devices (320px - 2560px)
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🎨 Design Principles

- **Mobile-First**: Responsive design starting from 320px
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation
- **Performance**: Optimized animations and lazy loading
- **Visual Identity**: Vibrant gradients with modern typography
- **User Experience**: Smooth interactions and intuitive navigation
- **Progressive Enhancement**: Works without JavaScript

## 🔧 Technical Highlights

### CSS Architecture
- **BEM Methodology**: Consistent naming convention
- **CSS Custom Properties**: 220+ design tokens
- **Modular Structure**: Separate files for reset, variables, components, and main styles
- **Responsive Design**: Mobile-first with strategic breakpoints

### JavaScript Features
- **ES6+ Modules**: Clean, maintainable code structure
- **Intersection Observer**: Efficient scroll-triggered animations
- **Theme System**: Persistent light/dark mode with system preference detection
- **Performance Optimized**: Lazy loading and efficient event handling

### Navigation System
- **Responsive Heights**: Optimized for each breakpoint
- **Smooth Scrolling**: CSS scroll-behavior with proper padding
- **Z-index Management**: Proper layering (header: 1000, mobile nav: 1100)
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Deployment Architecture

- **Hosting**: Linode VPS with Nginx reverse proxy
- **SSL**: Let's Encrypt with automatic renewal
- **CDN**: Cloudflare for global performance
- **Domain**: Custom domain with DNS management
- **Monitoring**: Performance and uptime tracking

## 💰 Annual Budget

- **Domain**: $12/year
- **Hosting**: $60/year (Linode VPS - 1GB RAM, 25GB SSD)
- **CDN**: Free (Cloudflare)
- **SSL**: Free (Let's Encrypt)
- **Monitoring**: Free tier (various services)
- **Total**: ~$72/year

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Status**: Active Development | **Version**: 1.0.0-beta | **Last Updated**: July 2025

**Current Phase**: Content & Pages Development  
**Next Milestone**: Custom SVG Icons and About Page Content