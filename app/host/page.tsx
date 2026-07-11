"use client";

import { useState, useEffect } from "react";
import rawBingoData from "@/data/items.json";
import { BingoData } from "@/types/bingo";

// Cast JSON import to our verified type
const bingoData = rawBingoData as BingoData;

export default function HostPage() {
  const [availablePool, setAvailablePool] = useState<string[]>([]);
  const [calledItems, setCalledItems] = useState<string[]>([]);
  const [currentCall, setCurrentCall] = useState<string | null>(null);

  useEffect(() => {
    setAvailablePool(bingoData.items);
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
    if (confirm("Are you sure you want to reset the game?")) {
      setAvailablePool(bingoData.items);
      setCalledItems([]);
      setCurrentCall(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans antialiased px-6 py-12 md:px-16">
      {/* Header */}
      <header className="border-b border-black pb-6 mb-12 text-center md:text-left tracking-widest uppercase">
        <h1 className="text-3xl font-light">LANE CRAWFORD STYLE BINGO</h1>
        <p className="text-xs text-gray-500 mt-2">Master Host Console</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Controls & Current Call */}
        <div className="lg:col-span-1 flex flex-col justify-between border border-black p-8 bg-white shadow-sm">
          <div>
            <span className="text-xs uppercase tracking-widest text-gray-400 block mb-2">Now Calling</span>
            <div className="h-32 flex items-center justify-center border-b border-gray-100 mb-6">
              <p className="text-4xl font-serif font-semibold tracking-wide text-center">
                {currentCall || "—"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={drawNumber}
              className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest font-medium hover:bg-[#222222] transition-colors duration-300"
            >
              Draw Next Item ({availablePool.length} Left)
            </button>
            <button
              onClick={resetGame}
              className="w-full border border-gray-300 text-gray-600 py-3 text-xs uppercase tracking-widest font-medium hover:border-black hover:text-black transition-colors duration-300"
            >
              Reset Board
            </button>
          </div>
        </div>

        {/* Master Board Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-xs uppercase tracking-widest mb-4 font-semibold">Master Registry</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {bingoData.items.map((item, index) => {
              const isCalled = calledItems.includes(item);
              return (
                <div
                  key={index}
                  className={`border p-4 text-center text-xs tracking-wider uppercase transition-all duration-500 ${
                    isCalled
                      ? "bg-black text-white border-black font-medium"
                      : "bg-white text-gray-400 border-gray-200"
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