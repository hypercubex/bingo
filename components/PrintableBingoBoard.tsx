"use client";

import { type ReactElement, useMemo } from "react";
import { useSecuredBingo } from "@/hooks/useSecuredBingo";
import { BingoSymbolSet } from "@/types/bingo";

interface PrintableBingoBoardProps {
  activeSet: BingoSymbolSet;
  copyCount?: number;
  differentCopies?: boolean;
}

function renderCellContent(item: string, activeSetId: string): ReactElement {
  if (activeSetId === "world_cup") {
    return (
      <div className="flex h-full w-full items-center justify-center p-0.5">
        <img
          src={`https://flagcdn.com/w160/${item}.png`}
          alt="Flag"
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  if (activeSetId === "mahjong") {
    return <span className="text-5xl font-mono font-normal leading-none sm:text-7xl">{item}</span>;
  }

  if (activeSetId === "chinese_phonetic") {
    const [head, tail] = item.split(" ");
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-0">
        <span className="text-5xl font-bold leading-none sm:text-7xl">{head}</span>
        <span className="text-[0.6rem] font-mono font-semibold uppercase tracking-tighter sm:text-[0.8rem]">
          {tail || ""}
        </span>
      </div>
    );
  }

  return <span className="w-full px-0.5 text-5xl uppercase font-bold tracking-tight leading-none sm:text-7xl">{item}</span>;
}

export default function PrintableBingoBoard({
  activeSet,
  copyCount = 1,
  differentCopies = false,
}: PrintableBingoBoardProps) {
  const { card, selectedCells, isLoaded } = useSecuredBingo(activeSet, { enabled: false });

  const boards = useMemo(() => {
    const count = Math.max(1, copyCount || 1);

    return Array.from({ length: count }, () => {
      if (differentCopies) {
        const markers = activeSet.markers || [];
        const regenerated = [...markers]
          .sort(() => 0.5 - Math.random())
          .slice(0, 25);

        return { items: regenerated, selected: [] as number[] };
      }

      return { items: card, selected: selectedCells };
    });
  }, [activeSet, card, copyCount, differentCopies, selectedCells]);

  if (!isLoaded || card.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBFA] text-[10px] uppercase tracking-[0.3em] text-gray-400">
        Preparing print board...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] p-4 text-[#111111] print:bg-white print:p-0">
      {boards.map(({ items, selected }, index) => (
        <section
          key={`${activeSet.id}-${index}`}
          className="mb-8 break-after-page border-2 border-black bg-white p-4 shadow-sm print:mb-0 print:border-0 print:shadow-none"
        >
          <div className="mx-auto max-w-[900px]">
            <div className="rounded-none border-2 border-black bg-white p-2 sm:p-4">
              <div className="mb-2 border-b border-black pb-2 text-center uppercase tracking-[0.2em]">
                <h1 className="text-[20px] font-light sm:text-[24px]">BINGO</h1>
                <p className="mt-1 text-[8px] font-medium text-gray-400 sm:text-[10px]">{activeSet.label} Edition</p>
              </div>

              <div className="mb-2 grid grid-cols-5 gap-1 text-center text-[10px] font-bold tracking-[0.4em] text-black/30 print:mb-1">
                {['B','I','N','G','O'].map((letter) => (
                  <div key={letter}>{letter}</div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-1.5 print:gap-1">
                {items.map((item, cellIndex) => {
                  const isSelected = selected.includes(cellIndex);
                  return (
                    <div
                      key={`${item}-${cellIndex}`}
                      className={`aspect-square relative flex items-center justify-center overflow-hidden border p-0.5 print:p-0.5 ${
                        isSelected ? "border-black bg-black text-white" : "border-gray-300 bg-white text-black"
                      }`}
                    >
                      {renderCellContent(item, activeSet.id)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
