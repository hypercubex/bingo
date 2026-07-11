"use client";

import { useState, useEffect } from "react";
import rawBingoData from "@/data/items.json";
import { BingoData } from "@/types/bingo";

const bingoData = rawBingoData as BingoData;

export default function HostPage() {
  const [availablePool, setAvailablePool] = useState<string[]>([]);
  const [calledItems, setCalledItems] = useState<string[]>([]);
  const [currentCall, setCurrentCall] = useState<string | null>(null);
  const [gameTitle, setGameTitle] = useState<string>("BINGO");

  useEffect(() => {
    setAvailablePool(bingoData.items);

    // Parse Custom Title directly out of URL Hash Fragment
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setGameTitle(decodeURIComponent(hash).toUpperCase());
      }
    }
  }, []);

  const drawNumber = (): void => {
    if (availablePool.length === 0) {
      alert("All items have been called!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * availablePool.length);
    const selected = availablePool[randomIndex];

    setCurrentCall(selected);
    setCalledItems([selected, ...calledItems]);
    setAvailablePool(availablePool.filter((_, i) => i !== randomIndex));
  };

  const resetGame = (): void => {
    if (confirm("Are you sure you want to reset the game? This wipes all drawn items.")) {
      setAvailablePool(bingoData.items);
      setCalledItems([]);
      setCurrentCall(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans antialiased px-6 py-12 md:px-16">
      {/* Fully Customized Dynamic Header */}
      <header className="border-b border-black pb-6 mb-12 text-center md:text-left tracking-widest uppercase">
        <h1 className="text-3xl font-light tracking-[0.1em] text-black">
          {gameTitle} <span className="font-medium text-gray-400">HOST</span>
        </h1>
        <p className="text-[10px] text-gray-400 tracking-wider mt-2">Experience Curator Console</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {/* Left Control Panel */}
        <div className="lg:col-span-1 flex flex-col justify-between border border-black p-8 bg-white h-[400px] shadow-sm">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-4 font-semibold">Now Calling</span>
            <div className="h-40 flex items-center justify-center border-b border-gray-100 mb-6">
              <p className="text-3xl font-light tracking-wide text-center uppercase text-black">
                {currentCall || "—"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={drawNumber}
              className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-widest font-medium hover:bg-[#222222] transition-colors duration-300 cursor-pointer"
            >
              Draw Next Item ({availablePool.length} Remaining)
            </button>
            <button
              onClick={resetGame}
              className="w-full border border-gray-200 text-gray-400 py-2.5 text-[9px] uppercase tracking-widest font-medium hover:border-black hover:text-black transition-colors duration-300 cursor-pointer"
            >
              Reset Board
            </button>
          </div>
        </div>

        {/* Right Master Grid Matrix */}
        <div className="lg:col-span-2">
          <h2 className="text-[10px] uppercase tracking-widest mb-4 font-semibold text-gray-400">Master Registry Matrix</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {bingoData.items.map((item, index) => {
              const isCalled = calledItems.includes(item);
              return (
                <div
                  key={index}
                  className={`border p-4 text-center text-[10px] tracking-wider uppercase transition-all duration-500 flex items-center justify-center min-h-[70px] ${
                    isCalled
                      ? "bg-black text-white border-black font-medium"
                      : "bg-white text-gray-300 border-gray-100"
                  }`}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}