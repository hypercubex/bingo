# 🎲 Bingo (Next.js + TypeScript)

An elegant, minimalist, editorial-style Bingo application built with Next.js (App Router), TypeScript, and Tailwind CSS. The design language is curated to match high-end fashion typography and layouts, featuring sharp monochromatic interfaces, luxury tones, and balanced whitespace.

---

## 🛠️ Project Structure Overview

```text
├── components/           # Reusable UI Components (Outside app/)
│   ├── BingoBoard.tsx    # Shared Player Board logic
│   └── HostDashboard.tsx # Unified Host Presenter logic
│
├── hooks/                # Custom React Hooks
│   └── useCustomTitle.ts # Real-time URL Hash to page title parser
│
├── app/                  # Next.js Directory Routing (Strictly Routes)
│   ├── layout.tsx        # Global CSS & HTML wrapping
│   ├── page.tsx          # Player Board: Default (Words)
│   │
│   ├── host/
│   │   └── page.tsx      # Unified Host Controller page
│   │
│   ├── mahjong/
│   │   └── page.tsx      # Player Board: Mahjong Tiles
│   │
│   ├── chinese/
│   │   └── page.tsx      # Player Board: Traditional Chinese (3x3)
│   │
│   └── flags/
│       └── page.tsx      # Player Board: World Cup Flags
│
├── data/                 # JSON configuration sets
│   ├── words.json
│   ├── mahjong.json
│   ├── chinese.json
│   └── flags.json
│
├── public/               # Static assets
└── package.json
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