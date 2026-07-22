"use client";

import { BingoSymbolSet } from "@/types/bingo";

interface BingoDisplayViewsProps {
  activeSet: BingoSymbolSet;
  lastCalled: string | null;
}

export function BingoDisplayViews({ activeSet, lastCalled }: BingoDisplayViewsProps) {
  return (
    <div className="bg-white border-2 border-black p-1 md:p-2 text-center shadow-md flex flex-col items-center justify-center min-h-[650px] w-full overflow-hidden relative">
      <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 block font-semibold absolute top-2 left-1/2 -translate-x-1/2 z-10">
        &mdash; Last Drawn: {activeSet.label} &mdash;
      </span>

      {lastCalled ? (
        activeSet.id === "world_cup" ? (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-full pt-5">
            <img
              src={`https://flagcdn.com/w1280/${lastCalled}.png`}
              alt="Flag"
              className="w-full max-w-[1200px] h-auto max-h-[500px] object-contain shadow-2xl border-2 border-black rounded"
            />
            <span className="text-6xl sm:text-8xl uppercase tracking-widest font-mono text-black">
              {lastCalled.toUpperCase()}
            </span>
          </div>
        ) : activeSet.id === "chinese_phonetic" ? (
          <div className="flex flex-col items-center justify-center w-full h-full pt-2">
            <h2 className="text-[24rem] sm:text-[32rem] leading-none font-extrabold tracking-tight text-red-600 animate-fade-in select-none -mt-8">
              {lastCalled.split(" ")[0]}
            </h2>
            <span className="text-6xl sm:text-8xl font-mono text-gray-800 font-bold -mt-8">
              {lastCalled.substring(lastCalled.indexOf(" ") + 1)}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <h2
              className={`tracking-tight text-black break-words leading-none select-none ${
                activeSet.id === "mahjong"
                  ? "text-[26rem] sm:text-[34rem]"
                  : "text-9xl sm:text-[20rem]"
              }`}
            >
              {lastCalled}
            </h2>
          </div>
        )
      ) : (
        <p className="text-2xl italic text-gray-300 py-12">No symbols called yet</p>
      )}
    </div>
  );
}