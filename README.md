# 🎲 Lane Crawford Style Bingo (Next.js + TypeScript)

An elegant, minimalist, editorial-style Bingo application built with Next.js (App Router), TypeScript, and Tailwind CSS. The design language is curated to match high-end fashion typography and layouts, featuring sharp monochromatic interfaces, luxury tones, and balanced whitespace.

---

## 🛠️ Project Structure Overview

```text
├── app/
│   ├── layout.tsx       # Root layout configuration
│   ├── page.tsx         # Player Page (Static Link / Root)
│   └── host/
│       └── page.tsx     # Host Page (Master Console)
├── data/
│   └── items.json       # Source JSON containing your words or numbers
├── types/
│   └── bingo.ts         # TypeScript interface declarations
├── public/              # Static assets
├── tailwind.config.ts   # Tailwind configuration
└── package.json         # Project configuration & dependencies
```

## 🚀 Getting Started

### 1. Prerequisites

- Node.js v18.x or later

### 2. Installation

1. clone the repository
1. npm install

### 3. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your web browser:

- Player View: http://localhost:3000
- Host View: http://localhost:3000/host

## ⚙️ Game Configuration & Customization

To change the items, words, or numbers generated inside the cards, simply open data/items.json and replace the array strings.

⚠️ Important: To cleanly populate a standard $5 \times 5$ Bingo grid, you must include a minimum of 25 unique items in the array.

```json
{
  "items": [
    "Luxury", "Elegance", "Couture", "Chic", "Avant-Garde",
    "Modern", "Minimalist", "Vogue", "Runway", "Atelier",
    "Tailored", "Silk", "Cashmere", "Velvet", "Monochrome",
    "Sleek", "Premium", "Curated", "Aesthetic", "Heritage",
    "Bespoke", "Artisanal", "Sophisticated", "Timeless", "Statement"
  ]
}
```

## 📦 Building for Production

When you are ready to prepare your application for web hosting, run the production build routine:

```bash
npm run build
```

This compiles your static components, optimizes server side parameters, builds the structural paths, and generates a .next folder optimized for live performance.

