"use client";

import { BingoSymbolSet } from "@/types/bingo";

interface DrawHistoryPanelProps {
  calledItems: string[];
  activeSet: BingoSymbolSet;
}

export function DrawHistoryPanel({ calledItems, activeSet }: DrawHistoryPanelProps) {
  return (
    <div className="bg-white border border-black p-6 shadow-sm flex flex-col h-[526px] w-full">
      <h3 className="text-xs uppercase tracking-[0.2em] font-bold border-b pb-3 mb-4 flex justify-between">
        <span>Draw History</span>
        <span className="text-gray-400">Total: {calledItems.length}</span>
      </h3>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
        {calledItems
          .slice()
          .reverse()
          .map((item, idx) => {
            return (
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