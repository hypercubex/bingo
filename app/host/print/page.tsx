"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PrintableBingoBoard from "@/components/PrintableBingoBoard";
import wordsSet from "@/data/words.json";
import chineseSet from "@/data/chinese.json";
import flagsSet from "@/data/flags.json";
import mahjongSet from "@/data/mahjong.json";
import { BingoSymbolSet } from "@/types/bingo";

const themeMap: Record<string, BingoSymbolSet> = {
  words: wordsSet as BingoSymbolSet,
  chinese: chineseSet as BingoSymbolSet,
  flags: flagsSet as BingoSymbolSet,
  mahjong: mahjongSet as BingoSymbolSet,
};

const themeOptions = [
  { value: "words", label: "Words" },
  { value: "chinese", label: "Chinese" },
  { value: "flags", label: "Flags" },
  { value: "mahjong", label: "Mahjong" },
];

export default function PrintPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState("words");
  const [copies, setCopies] = useState(1);
  const [differentCopies, setDifferentCopies] = useState(false);

  useEffect(() => {
    const nextType = (searchParams.get("type") || "words").toLowerCase();
    const nextCopies = Number.parseInt(searchParams.get("copies") || "1", 10);
    const nextDifferent = searchParams.get("different") === "1";

    setType(themeMap[nextType] ? nextType : "words");
    setCopies(Number.isFinite(nextCopies) && nextCopies > 0 ? nextCopies : 1);
    setDifferentCopies(nextDifferent);
  }, [searchParams]);

  const activeSet = useMemo(() => themeMap[type] || themeMap.words, [type]);

  const updateQuery = (nextType: string, nextCopies: number, nextDifferent: boolean) => {
    const params = new URLSearchParams();
    params.set("type", nextType);
    params.set("copies", String(nextCopies));
    params.set("different", nextDifferent ? "1" : "0");
    router.replace(`/host/print?${params.toString()}`);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextType = event.target.value;
    setType(nextType);
    updateQuery(nextType, copies, differentCopies);
  };

  const handleCopiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextCopies = Number.parseInt(event.target.value, 10);
    const safeCopies = Number.isFinite(nextCopies) && nextCopies > 0 ? nextCopies : 1;
    setCopies(safeCopies);
    updateQuery(type, safeCopies, differentCopies);
  };

  const handleDifferentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextDifferent = event.target.checked;
    setDifferentCopies(nextDifferent);
    updateQuery(type, copies, nextDifferent);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] p-4 text-[#111111]">
      <div className="mx-auto mb-6 flex max-w-5xl flex-col gap-4 rounded border border-black bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between print:hidden">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500" htmlFor="game-type">
            Game type
          </label>
          <select
            id="game-type"
            value={type}
            onChange={handleTypeChange}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500" htmlFor="copy-count">
            Copies
          </label>
          <input
            id="copy-count"
            type="number"
            min="1"
            value={copies}
            onChange={handleCopiesChange}
            className="w-24 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={differentCopies}
            onChange={handleDifferentChange}
            className="h-4 w-4"
          />
          Different copies
        </label>

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded border border-black bg-black px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white"
        >
          Print
        </button>
      </div>

      <PrintableBingoBoard
        activeSet={activeSet}
        copyCount={copies}
        differentCopies={differentCopies}
      />
    </div>
  );
}
