"use client";

import { memo } from "react";

interface BingoCellProps {
  item: string;
  index: number;
  isSelected: boolean;
  activeSetId: string;
  onClick: () => void;
}

function BingoCell({
  item,
  isSelected,
  activeSetId,
  onClick,
}: BingoCellProps) {
  const isChineseSet = activeSetId === "chinese_phonetic";

  return (
    <button
      data-grid-cell
      onClick={onClick}
      className={`aspect-square relative flex items-center justify-center border p-0.5 text-center transition-all duration-200 cursor-pointer outline-none select-none overflow-hidden ${
        isSelected
          ? "bg-black text-white border-black font-semibold"
          : "bg-white text-black border-gray-300 hover:border-black"
      }`}
    >
      {activeSetId === "world_cup" ? (
        /* World Cup Flags Render */
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
      ) : activeSetId === "mahjong" ? (
        /* Mahjong View */
        <div className="w-full h-full flex items-center justify-center relative">
          <span
            className={`text-5xl sm:text-7xl font-mono font-normal leading-none transition-all duration-200 select-none opacity-100 ${
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
        /* Chinese Phonetic */
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
            activeSetId === "words"
              ? "text-xs sm:text-base uppercase font-bold tracking-tight"
              : ""
          } ${isSelected ? "text-white line-through" : "text-black opacity-100"}`}
        >
          {item}
        </span>
      )}
    </button>
  );
}

export default memo(BingoCell);