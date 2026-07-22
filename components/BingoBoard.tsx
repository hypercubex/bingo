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
    if (typeof window === "undefined") {
      return;
    }

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
    if (
      parsedCard.length === GRID_SIZE &&
      savedTime &&
      now - parseInt(savedTime, 10) < ONE_HOUR
    ) {
      setCard(parsedCard);
    } else {
      const itemsToShuffle = activeSet.markers || [];
      const shuffled = [...itemsToShuffle]
        .sort(() => {
          return 0.5 - Math.random();
        })
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
      updated = selectedCells.filter((i) => {
        return i !== index;
      });
    } else {
      updated = [...selectedCells, index];
    }
    setSelectedCells(updated);
    localStorage.setItem(
      `${SELECTIONS_PREFIX}${activeSet.id}`,
      JSON.stringify(updated)
    );
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
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans antialiased px-2 py-6 sm:px-8 md:px-16 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Minimal Page Title */}
        <header className="border-b border-black pb-3 mb-6 text-center tracking-[0.2em] uppercase">
          <h1 className="text-2xl font-light">{pageTitle}</h1>
          <p className="text-[10px] text-gray-400 mt-1 font-medium">
            {activeSet.label} Edition
          </p>
        </header>

        {/* Board Container */}
        <main className="bg-white border-2 border-black p-2 sm:p-4 shadow-sm">
          {/* Classic Bingo letters header */}
          <div className="grid grid-cols-5 gap-1 mb-3 text-center text-xs font-bold tracking-[0.4em] opacity-30 select-none">
            {["B", "I", "N", "G", "O"].map((l) => {
              return <div key={l}>{l}</div>;
            })}
          </div>

          {/* Grid Layout (5x5 Grid) */}
          <div className="grid grid-cols-5 gap-1.5">
            {card.map((item, index) => {
              const isSelected = selectedCells.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => {
                    toggleCell(index);
                  }}
                  className={`aspect-square relative flex items-center justify-center border p-0.5 text-center transition-all duration-200 cursor-pointer outline-none select-none overflow-hidden ${
                    isSelected
                      ? "bg-black text-white border-black font-semibold"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {activeSet.id === "world_cup" ? (
                    /* World Cup Flags Render - 100% crisp visibility before select */
                    <div className="w-full h-full flex items-center justify-center p-0.5 relative">
                      <img
                        src={`https://flagcdn.com/w160/${item}.png`}
                        alt="Flag"
                        className={`w-full max-h-[85%] object-contain transition-all duration-300 opacity-100 ${
                          isSelected ? "scale-105" : "hover:scale-105"
                        }`}
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full ring-2 ring-black" />
                      )}
                    </div>
                  ) : activeSet.id === "mahjong" ? (
                    /* Mahjong View - 100% crisp visibility before select */
                    <div className="w-full h-full flex items-center justify-center relative">
                      <span
                        className={`text-5xl sm:text-7xl font-mono font-bold leading-none transition-all duration-200 select-none opacity-100 ${
                          isSelected ? "text-white scale-105" : "text-black"
                        }`}
                      >
                        {item}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full ring-2 ring-black" />
                      )}
                    </div>
                  ) : isChineseSet ? (
                    /* Chinese Phonetic 5x5 layout */
                    <div className="flex flex-col items-center justify-center h-full w-full gap-0">
                      <span
                        className={`font-bold leading-none block transition-all text-4xl sm:text-6xl ${
                          isSelected ? "text-red-500 scale-105" : "text-black"
                        }`}
                      >
                        {item.split(" ")[0]}
                      </span>
                      <span
                        className={`font-mono tracking-tighter leading-tight block text-[10px] sm:text-sm font-semibold -mt-1 ${
                          isSelected ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {item.substring(item.indexOf(" ") + 1)}
                      </span>
                    </div>
                  ) : (
                    /* Standard Words View */
                    <span
                      className={`leading-none transition-all duration-200 break-words w-full px-0.5 select-none ${
                        activeSet.id === "words"
                          ? "text-xs sm:text-base uppercase font-bold tracking-tight"
                          : ""
                      } ${
                        isSelected ? "text-white line-through" : "text-black opacity-100"
                      }`}
                    >
                      {item}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <footer className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
            <button
              onClick={resetCurrentBoard}
              className="text-[9px] uppercase tracking-[0.3em] text-gray-300 hover:text-black transition-colors cursor-pointer"
            >
              Reset Board
            </button>
          </footer>
        </main>

        <p className="mt-6 text-center text-[9px] text-gray-300 uppercase tracking-widest leading-loose">
          Card layouts and selections are stored independently in your browser.
        </p>
      </div>
    </div>
  );
}