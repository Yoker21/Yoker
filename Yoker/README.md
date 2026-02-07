# YOKER - Futuristic Monochrome Sportswear Brand Website

A premium, high-performance website for YOKER, a fictional futuristic monochrome athletic brand. Pure black and white design with cutting-edge animations, interactive elements, and a sci-fi inspired UI aesthetic.

## 🎨 Design Philosophy

- **Pure Monochrome**: Black (#000000) and White (#FFFFFF) only
- **Minimalistic**: Clean geometric lines, sharp angles, precise spacing
- **Futuristic**: Sci-fi HUD-inspired UI elements, grid overlays, glowing accents
- **Dynamic**: Smooth animations, micro-interactions, parallax effects
- **Premium**: High-end sports technology brand aesthetic

## 📁 Project Structure

```
yoker/
├── index.html                 # Main HTML page
├── src/
│   ├── css/
│   │   └── styles.css        # All styles and animations
│   ├── js/
│   │   └── main.js           # Interactive features and animations
│   └── assets/               # Placeholder for images/media
├── README.md                 # This file
└── .github/
    └── copilot-instructions.md
```

## ✨ Features

### 1. **Custom Cursor**
- Dual-layer cursor: white dot + ring
- Expands on interactive elements
- Smooth lag animation for premium feel

### 2. **Floating Header**
- Transparent with blur effect when scrolling
- Sticky navigation with active state tracking
- Glow effect and smooth transitions

### 3. **Hero Section**
- Full-screen impact with pulsing glow effect
- Grid overlay animation
- Animated title and subtitle with stagger
- Magnetic buttons with hover effects

### 4. **Marquee Section**
- Continuous scrolling text: "YOKER — FUTURE CLASSIC — MONOCHROME PERFORMANCE — PRECISION ENGINEERED"
- Creates motion and futuristic feeling

### 5. **Product Grid**
- Responsive 4-column layout
- Hover effects: zoom, glow line animation, lift effect
- Smooth card transitions with stagger
- Add-to-cart interactivity with feedback

### 6. **Tech Section**
- 4 feature cards with animated pulse dots
- Hover reveal effect with gradient slide
- Highlights innovation and engineering

### 7. **Brand Philosophy**
- Large, readable text
- Fade-in animations on scroll
- "Less Color, More Performance" message

### 8. **Newsletter**
- Magnetic button effect
- Form submission feedback
- Clean input styling with focus states

### 9. **Footer**
- 3-column layout
- Social and product links
- Hover underline animations

### 10. **Animations & Interactions**
- Parallax scrolling effects
- Scroll-triggered fade-in animations
- Magnetic button attraction
- Grid sliding animation on hero
- Dot pulse animations
- Glow line reveals on products
- Smooth navigation transitions

## 🚀 Getting Started

### View the Website

1. **Using Live Server** (VS Code):
   - Install "Live Server" extension from VS Code marketplace
   - Right-click on `index.html` and select "Open with Live Server"
   - Website opens at `http://localhost:5500`

2. **Direct in Browser**:
   - Open `index.html` directly in any modern browser

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14+)
- Mobile browsers: Fully responsive

## 🎯 Key Interactions

### Cursor Behavior
- Moves smoothly with lag effect
- Expands on buttons, links, and inputs
- Creates premium, sophisticated feel

### Button Interactions
- **Magnetic Effect**: Buttons attract cursor movement
- **Hover Glow**: White radiant shadow on hover
- **Scale Animation**: Slight grow on hover
- **Click Feedback**: Product "Add to Cart" changes to "✓ Added"

### Scroll Animations
- Products fade in as you scroll
- Parallax movement of hero glow
- Header becomes more opaque when scrolling
- Active navigation link follows current section

### Navigation
- Click nav links to smooth scroll to sections
- Active section automatically highlights nav link
- Click logo to scroll to top
- Arrow keys scroll page up/down

## 🛠️ Customization

### Colors
Edit `src/css/styles.css` to modify:
- Primary colors: Change `#000000` or `#FFFFFF`
- Glow colors: Edit `rgba(255, 255, 255, ...)` values
- Border colors: Adjust `rgba(255, 255, 255, 0.1)` etc.

### Typography
- Primary font: `'Inter', 'Sora'` (edit in body)
- Adjust letter-spacing for headlines
- Modify font-sizes in section titles

### Products
Edit `index.html` product cards:
- Change product names and prices
- Replace gradient colors in `.product-image`
- Add actual product images

### Copy Text
- Hero: Update `.hero-title`, `.hero-subtitle`
- Sections: Edit `.section-title` elements
- Links: Modify nav and footer links

### Animations
- Speed: Change `animation-duration` (e.g., `30s linear infinite`)
- Easing: Modify `cubic-bezier()` values
- Distance: Adjust `transform: translateY()` values

## 📱 Responsive Design

The site is fully responsive:
- **Desktop**: Full 4-column product grid
- **Tablet (1024px)**: Optimized spacing
- **Mobile (768px)**: 2-column grid
- **Phone (480px)**: Single column layout

## ⚡ Performance Optimizations

- CSS Grid for efficient layouts
- GPU-accelerated transforms
- Throttled scroll events
- Intersection Observer for lazy animations
- Minimal DOM manipulation

## 🎓 Educational Value

This project demonstrates:
- Modern CSS animations and transitions
- Intersection Observer API
- RequestAnimationFrame for smooth animations
- CSS Grid and Flexbox layouts
- Responsive design principles
- JavaScript event handling
- Accessibility best practices
- Performance optimization techniques

## 📝 License

This is a demonstration project created for educational purposes.

## 🌟 Credits

**YOKER** - A futuristic monochrome sportswear brand concept
- Design language: Minimalist + Sci-Fi aesthetics
- Color palette: Pure monochrome
- Typography: Modern sans-serif
- Inspiration: Premium tech brands, athletic performance, futurism

---

**Engineered for Motion. Built for the Future.**

*YOKER - Where minimalism meets performance.*
