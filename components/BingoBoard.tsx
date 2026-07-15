"use client";

import { useSecuredBingo } from "@/hooks/useSecuredBingo";
import { useCustomTitle } from "@/hooks/useCustomTitle";
import { BingoSymbolSet } from "@/types/bingo";
import CheatAlert from "@/components/CheatAlert";
import BingoCell from "@/components/BingoCell";

interface BingoBoardProps {
  activeSet: BingoSymbolSet;
}

export default function BingoBoard({ activeSet }: BingoBoardProps) {
  const pageTitle = useCustomTitle("BINGO");

  // Mount the secure game logic and active observer references
  const {
    card,
    selectedCells,
    isCheater,
    lockoutTimeLeft,
    isLoaded,
    boardRef,
    toggleCell,
    resetCurrentBoard,
  } = useSecuredBingo(activeSet);

  // 1. Render immediate punishment overlay if cheated
  if (isLoaded && isCheater) {
    return <CheatAlert timeRemainingMs={lockoutTimeLeft} />;
  }

  // 2. Loading State Fallback
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
        <main
          ref={boardRef}
          className="bg-white border border-black p-4 sm:p-8 shadow-sm"
        >
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
                <BingoCell
                  key={index}
                  item={item}
                  index={index}
                  isSelected={isSelected}
                  activeSetId={activeSet.id}
                  onClick={() => { toggleCell(index); }}
                />
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
          Card layouts and selections are secured cryptographically. Manual edits to local storage or DOM nodes will lock the interface.
        </p>
      </div>
    </div>
  );
}