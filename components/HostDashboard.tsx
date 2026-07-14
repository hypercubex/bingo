"use client";

import { useState, useEffect } from "react";
import { useCustomTitle } from "@/hooks/useCustomTitle";
import { BingoSymbolSet } from "@/types/bingo";

// Import all your datasets directly here
import wordsSet from "@/data/words.json";
import mahjongSet from "@/data/mahjong.json";
import chineseSet from "@/data/chinese.json";
import flagsSet from "@/data/flags.json";

// Map datasets to identifiers
const GAME_DATASETS: Record<string, BingoSymbolSet> = {
  words: wordsSet as BingoSymbolSet,
  mahjong: mahjongSet as BingoSymbolSet,
  chinese: chineseSet as BingoSymbolSet,
  flags: flagsSet as BingoSymbolSet,
};

const CALLED_PREFIX = "bingo_called_";

export default function HostDashboard() {
  const pageTitle = useCustomTitle("HOST BOARD");

  // State for active dataset key
  const [activeSetKey, setActiveSetKey] = useState<string>("words");
  const activeSet = GAME_DATASETS[activeSetKey];

  const [calledItems, setCalledItems] = useState<string[]>([]);
  const [lastCalled, setLastCalled] = useState<string | null>(null);
  const [remainingItems, setRemainingItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const storageKey = `${CALLED_PREFIX}${activeSet.id}`;

  // Sync state whenever active game changes or page mounts
  useEffect(() => {
    if (typeof window === "undefined") return;

    const allMarkers = activeSet.markers || [];
    const savedCalled = localStorage.getItem(storageKey);

    if (savedCalled) {
      try {
        const parsed = JSON.parse(savedCalled);
        setCalledItems(parsed);
        setLastCalled(parsed[parsed.length - 1] || null);
        setRemainingItems(allMarkers.filter((item) => !parsed.includes(item)));
      } catch {
        setCalledItems([]);
        setRemainingItems(allMarkers);
      }
    } else {
      setCalledItems([]);
      setRemainingItems(allMarkers);
    }

    setIsLoaded(true);
  }, [activeSetKey, activeSet, storageKey]);

  const callNextItem = () => {
    if (remainingItems.length === 0) {
      alert("All items have been called!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingItems.length);
    const selected = remainingItems[randomIndex];

    const updatedCalled = [...calledItems, selected];
    const updatedRemaining = remainingItems.filter((_, idx) => idx !== randomIndex);

    setCalledItems(updatedCalled);
    setLastCalled(selected);
    setRemainingItems(updatedRemaining);

    localStorage.setItem(storageKey, JSON.stringify(updatedCalled));
  };

  const resetGame = () => {
    if (confirm(`Reset the ${activeSet.label} board? This deletes history of called symbols for this game.`)) {
      setCalledItems([]);
      setLastCalled(null);
      setRemainingItems(activeSet.markers || []);
      localStorage.removeItem(storageKey);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-widest animate-pulse text-gray-400 font-sans">
          Loading Host Panel...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans antialiased px-4 py-8 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-6xl">

        {/* Header */}
        <header className="border-b border-black pb-4 mb-6 text-center tracking-[0.2em] uppercase">
          <h1 className="text-3xl font-light">{pageTitle}</h1>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            Multi-Game Presenter Console
          </p>
        </header>

        {/* Game Mode Selector Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 pb-4 border-b border-gray-100">
          {Object.entries(GAME_DATASETS).map(([key, data]) => {
            const isActive = activeSetKey === key;
            return (
              <button
                key={key}
                onClick={() => setActiveSetKey(key)}
                className={`px-4 py-2 text-xs uppercase tracking-wider border cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white border-black font-semibold"
                    : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                }`}
              >
                {data.label}
              </button>
            );
          })}
        </div>

        {/* Huge, Screen-Share Friendly Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Main Presenter Controls (2/3 width on large displays) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white border-2 border-black p-8 md:p-12 text-center shadow-md flex flex-col items-center justify-center min-h-[450px]">
              <span className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-6 block font-semibold">
                &mdash; Last Drawn: {activeSet.label} &mdash;
              </span>

              {lastCalled ? (
                activeSet.id === "world_cup" ? (
                  <div className="flex flex-col items-center gap-6">
                    <img
                      src={`https://flagcdn.com/w320/${lastCalled}.png`}
                      alt="Flag"
                      className="w-64 sm:w-80 h-auto object-contain shadow-md border-2 border-gray-100 rounded"
                    />
                    <span className="text-2xl uppercase tracking-widest font-mono font-semibold text-black">
                      {lastCalled.toUpperCase()}
                    </span>
                  </div>
                ) : activeSet.id === "chinese_phonetic" ? (
                  /* Custom layout to keep pinyin and main char scaled beautifully */
                  <div className="flex flex-col items-center gap-2">
                    <h2 className="text-9xl font-bold tracking-tight text-red-600 animate-fade-in">
                      {lastCalled.split(" ")[0]}
                    </h2>
                    <span className="text-3xl font-mono text-gray-500 font-medium">
                      {lastCalled.substring(lastCalled.indexOf(" ") + 1)}
                    </span>
                  </div>
                ) : (
                  /* Massive Text Output for Mahjong and Words */
                  <h2 className={`font-bold tracking-tight text-black break-words max-w-xl ${
                    activeSet.id === "mahjong" ? "text-9xl" : "text-6xl md:text-7xl"
                  }`}>
                    {lastCalled}
                  </h2>
                )
              ) : (
                <p className="text-xl italic text-gray-300 py-12">No symbols called yet</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={callNextItem}
                disabled={remainingItems.length === 0}
                className="flex-1 py-5 bg-black text-white hover:bg-gray-900 border border-black uppercase text-sm tracking-[0.2em] font-semibold transition-colors disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-400 cursor-pointer"
              >
                Draw Random ({remainingItems.length} left)
              </button>
              <button
                onClick={resetGame}
                className="py-5 px-8 border border-gray-200 hover:border-black text-sm uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                Reset Board
              </button>
            </div>
          </div>

          {/* Large Called History Panel */}
          <div className="bg-white border border-black p-6 shadow-sm flex flex-col h-[526px] w-full">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold border-b pb-3 mb-4 flex justify-between">
              <span>Draw History</span>
              <span className="text-gray-400">Total: {calledItems.length}</span>
            </h3>

            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
              {calledItems.slice().reverse().map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-2 border-b border-gray-100">
                  <span className="text-xs font-mono text-gray-300 w-10 font-bold">
                    #{calledItems.length - idx}
                  </span>

                  {activeSet.id === "world_cup" ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://flagcdn.com/w80/${item}.png`}
                        alt="flag"
                        className="h-6 w-auto object-contain border shadow-sm"
                      />
                      <span className="font-mono uppercase text-sm font-semibold">{item}</span>
                    </div>
                  ) : (
                    <span className="text-base font-semibold text-gray-800 truncate">
                      {item}
                    </span>
                  )}
                </div>
              ))}
              {calledItems.length === 0 && (
                <p className="text-xs text-gray-300 italic text-center mt-12">No elements called during this session.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}