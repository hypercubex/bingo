"use client";

import { useState, useEffect } from "react";
import rawBingoData from "@/data/items.json";
import { BingoData } from "@/types/bingo";

const bingoData = rawBingoData as BingoData;

const CACHE_KEY = "premium_bingo_card";
const CACHE_TIME_KEY = "premium_bingo_card_timestamp";
const SELECTION_CACHE_KEY = "premium_bingo_selections";
const ONE_HOUR = 60 * 60 * 1000;

export default function PlayerPage() {
  const [card, setCard] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [pageTitle, setPageTitle] = useState<string>("BINGO");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Parse Hash Fragment
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setPageTitle(decodeURIComponent(hash));
    }

    // Handle Card Seed State
    const savedCard = localStorage.getItem(CACHE_KEY);
    const savedTime = localStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    if (savedCard && savedTime && now - parseInt(savedTime, 10) < ONE_HOUR) {
      setCard(JSON.parse(savedCard));
    } else {
      const shuffled = [...bingoData.items]
        .sort(() => 0.5 - Math.random())
        .slice(0, 25);

      localStorage.setItem(CACHE_KEY, JSON.stringify(shuffled));
      localStorage.setItem(CACHE_TIME_KEY, now.toString());
      setCard(shuffled);
    }

    // Load Selections
    const savedSelections = localStorage.getItem(SELECTION_CACHE_KEY);
    if (savedSelections) {
      setSelectedCells(JSON.parse(savedSelections));
    }
  }, []);

  const toggleCell = (index: number): void => {
    let updated: number[];
    if (selectedCells.includes(index)) {
      updated = selectedCells.filter((i) => i !== index);
    } else {
      updated = [...selectedCells, index];
    }
    setSelectedCells(updated);
    localStorage.setItem(SELECTION_CACHE_KEY, JSON.stringify(updated));
  };

  const clearSelections = (): void => {
    if (confirm("Clear all your selected markers? This keeps your current card layout.")) {
      setSelectedCells([]);
      localStorage.removeItem(SELECTION_CACHE_KEY);
    }
  };

  if (card.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-widest animate-pulse text-gray-400">Syncing Matrix...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans antialiased px-4 py-12 md:px-16 flex flex-col items-center justify-between">
      <div className="w-full max-w-xl flex flex-col items-center">
        <header className="border-b border-black pb-4 mb-10 w-full text-center tracking-widest uppercase">
          <h1 className="text-2xl font-light tracking-[0.15em]">{pageTitle}</h1>
          <p className="text-[9px] text-gray-400 tracking-wider mt-1.5">Guest Pass</p>
        </header>

        <div className="w-full bg-white border border-black p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-5 gap-1 border-b border-black pb-3 mb-6 text-center text-xs font-semibold tracking-[0.25em] text-black">
            <div>B</div>
            <div>I</div>
            <div>N</div>
            <div>G</div>
            <div>O</div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {card.map((item, index) => {
              const isSelected = selectedCells.includes(index);
              return (
                <button
                  key={index}
                  onClick={() => toggleCell(index)}
                  className={`aspect-square p-1 sm:p-2 flex flex-col items-center justify-center border text-[9px] sm:text-[11px] uppercase tracking-wider transition-all duration-300 outline-none select-none relative group cursor-pointer ${
                    isSelected
                      ? "bg-black text-white border-black font-medium"
                      : "bg-white text-black border-gray-100 hover:border-black"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute inset-0.5 border border-white opacity-20 pointer-events-none" />
                  )}
                  <span className="text-center break-words leading-tight p-0.5">{item}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 flex justify-center">
            <button
              onClick={clearSelections}
              className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black font-medium transition-colors duration-200 border-b border-transparent hover:border-black pb-0.5 cursor-pointer"
            >
              Clear Selected Markers
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center max-w-xs">
        <p className="text-[9px] text-gray-400 tracking-wide uppercase leading-relaxed">
          Your card is kept for 1 hour to prevent accidental refreshes.
        </p>
      </footer>
    </div>
  );
}