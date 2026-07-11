"use client";

import { useState, useEffect } from "react";
import rawBingoData from "@/data/items.json";
import { BingoData } from "@/types/bingo";

const bingoData = rawBingoData as BingoData;

const CACHE_KEY = "lc_bingo_card";
const CACHE_TIME_KEY = "lc_bingo_card_timestamp";
const ONE_HOUR = 60 * 60 * 1000;

export default function PlayerPage() {
  const [card, setCard] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);

  useEffect(() => {
    // Guards against SSR environment safely
    if (typeof window === "undefined") return;

    const savedCard = localStorage.getItem(CACHE_KEY);
    const savedTime = localStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    if (savedCard && savedTime && now - parseInt(savedTime, 10) < ONE_HOUR) {
      setCard(JSON.parse(savedCard));
    } else {
      // Generate unique structural layout
      const shuffled = [...bingoData.items]
        .sort(() => 0.5 - Math.random())
        .slice(0, 25);

      localStorage.setItem(CACHE_KEY, JSON.stringify(shuffled));
      localStorage.setItem(CACHE_TIME_KEY, now.toString());
      setCard(shuffled);
    }

    const savedSelections = localStorage.getItem("lc_bingo_selections");
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
    localStorage.setItem("lc_bingo_selections", JSON.stringify(updated));
  };

  if (card.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest animate-pulse">Loading Card...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans antialiased px-4 py-12 md:px-16 flex flex-col items-center">
      {/* Brand Header */}
      <header className="border-b border-black pb-4 mb-10 w-full max-w-xl text-center tracking-widest uppercase">
        <h1 className="text-2xl font-light">Bingo</h1>
        <p className="text-[10px] text-gray-500 mt-1">Guest Pass</p>
      </header>

      {/* Bingo Grid Container */}
      <div className="w-full max-w-xl bg-white border border-black p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-5 gap-1 border-b border-black pb-2 mb-4 text-center text-xs font-semibold tracking-widest text-gray-400">
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
                className={`aspect-square p-1 sm:p-2 flex flex-col items-center justify-center border text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 outline-none select-none relative group ${
                  isSelected
                    ? "bg-black text-white border-black font-semibold"
                    : "bg-white text-black border-gray-200 hover:border-black"
                }`}
              >
                {isSelected && (
                  <span className="absolute inset-0.5 border border-white opacity-20 pointer-events-none" />
                )}
                <span className="text-center break-words leading-tight">{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="mt-8 text-center">
        <p className="text-[10px] text-gray-400 tracking-wide uppercase">
          Your card layout is locked for 1 hour to prevent accidental refreshes.
        </p>
      </footer>
    </div>
  );
}