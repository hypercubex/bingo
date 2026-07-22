# 🎲 Bingo (Next.js + TypeScript)

An elegant, minimalist, editorial-style Bingo application built with Next.js (App Router), TypeScript, and Tailwind CSS. The design language is curated to match high-end fashion typography and layouts, featuring sharp monochromatic interfaces, luxury tones, and balanced whitespace.

---

## 🛠️ Project Structure Overview

```text
bingo/
├── 🧪 hooks/
│   ├── useSecuredBingo.ts         # Secure state management, signature verification, & anti-cheat engine
│   └── useSecuredBingo.test.tsx    # Comprehensive Vitest suite (localStorage, cryptographic validation, DOM testing)
│
├── 🧱 components/
│   ├── BingoBoard.tsx             # Game dashboard container (manages grid layouts, header controls, & reset states)
│   ├── BingoCell.tsx              # Pure visual grid cell (handles multi-language layouts, image lazy-loading, & active states)
│   └── CheatAlert.tsx             # Interactive lockdown screen indicating remaining penalty lockout time
│
├── 🏷️ types/
│   └── bingo.ts                   # Unified TypeScript definitions for symbol sets and configurations
│
├── ⚙️ Config Files
│   ├── next.config.js             # Consolidated Next.js build setup (optimized for Next 12/14 pipelines)
│   ├── vitest.config.ts           # Vitest unit test environment configuration (runs JSDOM & fast SWC)
│   └── package.json               # Defined framework and testing dependencies
└── README.md                      # Project documentation and guidelines
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

## ⚙️ How to Visit & Customize Boards

You can change the displayed game name instantly using URL hashes.
Placing text after a # sign in your browser address bar replaces the generic titles on both player and host pages.

💡 Tip: Replace spaces with underscores (_) in your URL hash; the app automatically formats them back into readable titles.


| Game Mode	| Player Board URL | Host Presenter URL |
| :--- | :---: | ---: |
| Default Words |	http://localhost:3000/#Classroom_Fun	| http://localhost:3000/host/#Classroom_Fun|
Mahjong Tiles |	http://localhost:3000/mahjong/#Friday_Night_Rumble	| http://localhost:3000/host/#Friday_Night_Rumble |
Chinese	| http://localhost:3000/chinese/#Vocabulary_Quiz	| http://localhost:3000/host/#Vocabulary_Quiz |
Flags	| http://localhost:3000/flags/#World_Cup_Trivia	| http://localhost:3000/host/#World_Cup_Trivia |