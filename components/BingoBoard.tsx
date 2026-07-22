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

  if (!isLoaded || card.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-widest animate-pulse text-gray-400 font-sans">
          Assembling Grid...
        </p>
      </div>
    );
  }

  if (isCheater) {
    return <CheatAlert timeRemainingMs={lockoutTimeLeft} />;
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

        {/* Board Container monitored by MutationObserver via boardRef */}
        <main
          ref={boardRef}
          className="bg-white border-2 border-black p-2 sm:p-4 shadow-sm"
        >
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
                <BingoCell
                  key={index}
                  item={item}
                  index={index}
                  isSelected={isSelected}
                  activeSetId={activeSet.id}
                  onClick={() => {
                    toggleCell(index);
                  }}
                />
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