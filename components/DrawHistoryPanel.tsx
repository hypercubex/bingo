"use client";

import { BingoSymbolSet } from "@/types/bingo";

interface DrawHistoryPanelProps {
  calledItems: string[];
  activeSet: BingoSymbolSet;
}

export function DrawHistoryPanel({
  calledItems,
  activeSet,
}: DrawHistoryPanelProps) {
  const isMahjong = activeSet.id === "mahjong";
  const isChineseSet = activeSet.id === "chinese_phonetic";

  return (
    <div className="bg-white border border-black p-6 shadow-sm flex flex-col h-[526px] w-full overflow-hidden">
      <h3 className="text-xs uppercase tracking-[0.2em] font-bold border-b pb-3 mb-4 flex justify-between shrink-0">
        <span>Draw History</span>
        <span className="text-gray-400">Total: {calledItems.length}</span>
      </h3>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 min-h-0">
        {calledItems
          .slice()
          .reverse()
          .map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center gap-4 py-2 border-b border-gray-100 min-w-0"
              >
                <span className="text-xs font-mono text-gray-300 w-10 shrink-0">
                  #{calledItems.length - idx}
                </span>

                <div className="flex-1 min-w-0 overflow-hidden flex items-center">
                  {activeSet.id === "world_cup" ? (
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={`https://flagcdn.com/w80/${item}.png`}
                        alt="flag"
                        className="h-6 w-auto object-contain border shadow-sm shrink-0"
                      />
                      <span className="font-mono uppercase text-sm font-normal truncate">
                        {item}
                      </span>
                    </div>
                  ) : isMahjong ? (
                    <span className="text-2xl font-mono font-normal text-black leading-none select-none">
                      {item}
                    </span>
                  ) : isChineseSet ? (
                    <div className="flex items-baseline gap-2 min-w-0 leading-none">
                      <span className="text-xl font-bold text-black shrink-0">
                        {item.split(" ")[0]}
                      </span>
                      <span className="text-xs font-mono text-gray-500 font-semibold truncate">
                        {item.substring(item.indexOf(" ") + 1)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-gray-800 break-words line-clamp-2 w-full">
                      {item}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

        {calledItems.length === 0 && (
          <p className="text-xs text-gray-300 italic text-center mt-12">
            No elements called during this session.
          </p>
        )}
      </div>
    </div>
  );
}