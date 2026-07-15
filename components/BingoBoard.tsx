"use client";

import { useState, useEffect } from "react";
import { useCustomTitle } from "@/hooks/useCustomTitle";
import { BingoSymbolSet } from "@/types/bingo";

const CARD_PREFIX = "bingo_card_";
const CARD_TIME_PREFIX = "bingo_card_time_";
const SELECTIONS_PREFIX = "bingo_selections_";
const ONE_HOUR = 60 * 60 * 1000;
const GRID_SIZE = 25; // Locked to 5x5 for all sets

interface BingoBoardProps {
  activeSet: BingoSymbolSet;
}

export default function BingoBoard({ activeSet }: BingoBoardProps) {
  // Pull custom title with fallback to standard "BINGO"
  const pageTitle = useCustomTitle("BINGO");

  const [card, setCard] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const isChineseSet = activeSet.id === "chinese_phonetic";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const themeId = activeSet.id;
    const cacheKey = `${CARD_PREFIX}${themeId}`;
    const cacheTimeKey = `${CARD_TIME_PREFIX}${themeId}`;
    const selectionKey = `${SELECTIONS_PREFIX}${themeId}`;

    const savedCard = localStorage.getItem(cacheKey);
    const savedTime = localStorage.getItem(cacheTimeKey);
    const now = Date.now();

    let parsedCard: string[] = [];
    if (savedCard) {
      try {
        parsedCard = JSON.parse(savedCard);
      } catch {
        parsedCard = [];
      }
    }

    // Reuse existing card if generated within the hour
    if (parsedCard.length === GRID_SIZE && savedTime && now - parseInt(savedTime, 10) < ONE_HOUR) {
      setCard(parsedCard);
    } else {
      const itemsToShuffle = activeSet.markers || [];
      const shuffled = [...itemsToShuffle]
        .sort(() => 0.5 - Math.random())
        .slice(0, GRID_SIZE);

      localStorage.setItem(cacheKey, JSON.stringify(shuffled));
      localStorage.setItem(cacheTimeKey, now.toString());
      setCard(shuffled);
    }

    const savedSelections = localStorage.getItem(selectionKey);
    if (savedSelections) {
      try {
        setSelectedCells(JSON.parse(savedSelections));
      } catch {
        setSelectedCells([]);
      }
    } else {
      setSelectedCells([]);
    }

    setIsLoaded(true);
  }, [activeSet]);

  const toggleCell = (index: number): void => {
    let updated: number[];
    if (selectedCells.includes(index)) {
      updated = selectedCells.filter((i) => i !== index);
    } else {
      updated = [...selectedCells, index];
    }
    setSelectedCells(updated);
    localStorage.setItem(`${SELECTIONS_PREFIX}${activeSet.id}`, JSON.stringify(updated));
  };

  const resetCurrentBoard = (): void => {
    if (confirm(`Reset your marks for this game board?`)) {
      setSelectedCells([]);
      localStorage.removeItem(`${SELECTIONS_PREFIX}${activeSet.id}`);
    }
  };

  if (!isLoaded || card.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-widest animate-pulse text-gray-400 font-sans">
          Assembling Grid...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans antialiased px-4 py-12 md:px-16 flex flex-col items-center">
      <div className="w-full max-w-xl">

        {/* Minimal Page Title */}
        <header className="border-b border-black pb-4 mb-12 text-center tracking-[0.2em] uppercase">
          <h1 className="text-2xl font-light">{pageTitle}</h1>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">
            {activeSet.label} Edition
          </p>
        </header>

        {/* Board Container */}
        <main className="bg-white border border-black p-4 sm:p-8 shadow-sm">

          {/* Classic Bingo letters header */}
          <div className="grid grid-cols-5 gap-1 mb-6 text-center text-xs font-bold tracking-[0.4em] opacity-30 select-none">
            {["B", "I", "N", "G", "O"].map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>

          {/* Grid Layout (Uniform 5x5 Grid) */}
          <div className="grid grid-cols-5 gap-2.5">
            {card.map((item, index) => {
              const isSelected = selectedCells.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => toggleCell(index)}
                  className={`aspect-square relative flex items-center justify-center border p-1 text-center transition-all duration-300 cursor-pointer outline-none select-none ${
                    isSelected
                      ? "bg-black text-white border-black font-semibold"
                      : "bg-white text-black border-gray-100 hover:border-black"
                  }`}
                >
                  {activeSet.id === "world_cup" ? (
                    /* World Cup Flags Render */
                    <div className="w-full h-full flex flex-col items-center justify-center p-0.5">
                      <img
                        src={`https://flagcdn.com/w80/${item}.png`}
                        alt="Flag"
                        className={`w-10 sm:w-12 h-auto object-contain transition-all duration-300 ${
                          isSelected ? "opacity-100 scale-110 shadow-sm" : "opacity-30 hover:opacity-100"
                        }`}
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full ring-2 ring-white" />
                      )}
                    </div>
                  ) : isChineseSet ? (
                    /* Highly Legible Chinese 5x5 layout adjustments */
                    <div className="flex flex-col items-center justify-center h-full w-full gap-0.5">
                      <span className={`
                        font-bold leading-none block transition-all
                        ${isSelected ? "text-red-500 scale-105" : "text-black"}
                        text-2xl sm:text-3xl
                      `}>
                        {item.split(" ")[0]}
                      </span>
                      <span className={`
                        font-mono tracking-tight leading-tight block text-[8px] sm:text-[10px]
                        ${isSelected ? "text-white/60" : "text-gray-400"}
                      `}>
                        {item.substring(item.indexOf(" ") + 1)}
                      </span>
                    </div>
                  ) : (
                    /* Mahjong / Standard Words View */
                    <span
                      className={`
                        leading-tight transition-all duration-300 break-words px-0.5
                        ${activeSet.id === "mahjong" ? "text-2xl sm:text-3xl font-mono" : ""}
                        ${activeSet.id === "words" ? "text-[8px] sm:text-[10px] uppercase" : ""}
                        ${isSelected ? "opacity-30 line-through" : "opacity-100"}
                      `}
                    >
                      {item}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <footer className="mt-8 pt-4 border-t border-gray-50 flex justify-center">
            <button
              onClick={resetCurrentBoard}
              className="text-[9px] uppercase tracking-[0.3em] text-gray-300 hover:text-black transition-colors cursor-pointer"
            >
              Reset Board
            </button>
          </footer>
        </main>

        <p className="mt-10 text-center text-[9px] text-gray-300 uppercase tracking-widest leading-loose">
          Card layouts and selections are stored independently in your browser.
        </p>
      </div>
    </div>
  );
}