"use client";

import { BingoSymbolSet } from "@/types/bingo";

interface TabNavigationProps {
  gameDatasets: Record<string, BingoSymbolSet>;
  activeSetKey: string;
  onSelectTab: (key: string) => void;
}

export function TabNavigation({
  gameDatasets,
  activeSetKey,
  onSelectTab,
}: TabNavigationProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8 pb-4 border-b border-gray-100">
      {Object.entries(gameDatasets).map(([key, data]) => {
        const isActive = activeSetKey === key;
        return (
          <button
            key={key}
            onClick={() => {
              onSelectTab(key);
            }}
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
  );
}