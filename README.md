# PlantBoom 🌱

بلانت بوم – موقع منتجات نباتية عضوية | PlantBoom – Organic plant products website

## Overview

Static website for PlantBoom (GreenBooster), an organic plant-growth product brand based in Morocco. Built with vanilla HTML, CSS, and JavaScript.

## Project Structure

```
/
├── index.html              ← Main landing page
├── cart.html               ← Shopping cart page
├── product-detail.html     ← Product detail page
├── enhanced-styles.css     ← Custom styles (glassmorphism, RTL, animations)
├── enhanced-scripts.js     ← Custom interactions (jQuery-based)
├── rtl-overrides.css       ← RTL layout overrides
├── react-components.jsx    ← React components (loaded via Babel)
├── assets/
│   ├── video/              ← Hero, benefits, and product background videos
│   ├── images/             ← Product photos and gallery images
│   └── lib/                ← Third-party CSS/JS (jQuery, Slick, WOW.js, etc.)
├── .github/workflows/
│   └── deploy.yml          ← GitHub Pages auto-deploy workflow
├── .gitignore
└── README.md
```

## Run Locally

Open `index.html` in a browser, or start any static server:

```bash
# Option A — Python
python -m http.server 8000

# Option B — Node (npx)
npx -y serve . -p 3000
```

Then visit `http://localhost:8000` (or `:3000`).

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Source** and select **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` will auto-deploy on every push to `main`.

> **Publish directory**: `/` (root — no build step needed)

## Tech Stack

- HTML5, CSS3, JavaScript (ES6)
- Bootstrap 5.3 (RTL)
- jQuery 3.5.1
- Font Awesome 6.4
- WOW.js + Slick Carousel
- Google Fonts (Almarai)
