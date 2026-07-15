"use client";

interface BingoCellProps {
  item: string;
  index: number;
  isSelected: boolean;
  activeSetId: string;
  onClick: () => void;
}

export default function BingoCell({
  item,
  index,
  isSelected,
  activeSetId,
  onClick,
}: BingoCellProps) {
  const isChineseSet = activeSetId === "chinese_phonetic";

  return (
    <button
      data-grid-cell
      onClick={onClick}
      className={`aspect-square relative flex items-center justify-center border p-1 text-center transition-all duration-300 cursor-pointer outline-none select-none ${
        isSelected
          ? "bg-black text-white border-black font-semibold"
          : "bg-white text-black border-gray-100 hover:border-black"
      }`}
    >
      {activeSetId === "world_cup" ? (
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
        /* Traditional Chinese Layout */
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
            ${activeSetId === "mahjong" ? "text-2xl sm:text-3xl font-mono" : ""}
            ${activeSetId === "words" ? "text-[8px] sm:text-[10px] uppercase" : ""}
            ${isSelected ? "opacity-30 line-through" : "opacity-100"}
          `}
        >
          {item}
        </span>
      )}
    </button>
  );
}