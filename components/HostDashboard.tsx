"use client";

import { useState, useEffect } from "react";
import { useCustomTitle } from "@/hooks/useCustomTitle";
import { BingoSymbolSet } from "@/types/bingo";
import { TabNavigation } from "@/components/TabNavigation";
import { BingoDisplayViews } from "@/components/BingoDisplayViews";
import { DrawHistoryPanel } from "@/components/DrawHistoryPanel";
import { AutoPickBar } from "@/components/AutoPickBar";
import { useBingoTimer } from "@/hooks/useBingoTimer";

import wordsSet from "@/data/words.json";
import mahjongSet from "@/data/mahjong.json";
import chineseSet from "@/data/chinese.json";
import flagsSet from "@/data/flags.json";

const GAME_DATASETS: Record<string, BingoSymbolSet> = {
  words: wordsSet as BingoSymbolSet,
  mahjong: mahjongSet as BingoSymbolSet,
  chinese: chineseSet as BingoSymbolSet,
  flags: flagsSet as BingoSymbolSet,
};

const CALLED_PREFIX = "bingo_called_";

export default function HostDashboard() {
  const pageTitle = useCustomTitle("HOST BOARD");

  const [activeSetKey, setActiveSetKey] = useState<string>("words");
  const activeSet = GAME_DATASETS[activeSetKey];

  const [calledItems, setCalledItems] = useState<string[]>([]);
  const [lastCalled, setLastCalled] = useState<string | null>(null);
  const [remainingItems, setRemainingItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const storageKey = `${CALLED_PREFIX}${activeSet.id}`;

  const callNextItem = () => {
    if (remainingItems.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingItems.length);
    const selected = remainingItems[randomIndex];

    const updatedCalled = [...calledItems, selected];
    const updatedRemaining = remainingItems.filter((_, idx) => {
      return idx !== randomIndex;
    });

    setCalledItems(updatedCalled);
    setLastCalled(selected);
    setRemainingItems(updatedRemaining);

    localStorage.setItem(storageKey, JSON.stringify(updatedCalled));
  };

  const {
    intervalSeconds,
    timeLeft,
    isAutoCounting,
    handleDurationChange,
    toggleAutoCount,
    resetTimer,
  } = useBingoTimer({
    initialInterval: 3,
    onPick: callNextItem,
    hasItemsRemaining: remainingItems.length > 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const allMarkers = activeSet.markers || [];
    const savedCalled = localStorage.getItem(storageKey);

    if (savedCalled) {
      try {
        const parsed = JSON.parse(savedCalled);
        setCalledItems(parsed);
        setLastCalled(parsed[parsed.length - 1] || null);
        setRemainingItems(
          allMarkers.filter((item) => {
            return !parsed.includes(item);
          })
        );
      } catch {
        setCalledItems([]);
        setLastCalled(null);
        setRemainingItems(allMarkers);
      }
    } else {
      setCalledItems([]);
      setLastCalled(null);
      setRemainingItems(allMarkers);
    }

    resetTimer();
    setIsLoaded(true);
  }, [activeSetKey, activeSet, storageKey]);

  const handleSelectTab = (key: string) => {
    if (activeSetKey !== key) {
      resetTimer();
      // Immediately clear state for clean tab transition
      setCalledItems([]);
      setLastCalled(null);
      setRemainingItems([]);
      setActiveSetKey(key);
    }
  };

  const resetGame = () => {
    if (
      confirm(
        `Reset the ${activeSet.label} board? This deletes history of called symbols for this game.`
      )
    ) {
      resetTimer();
      setCalledItems([]);
      setLastCalled(null);
      setRemainingItems(activeSet.markers || []);
      localStorage.removeItem(storageKey);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-widest animate-pulse text-gray-400 font-sans">
          Loading Host Panel...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans antialiased px-4 py-8 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <header className="border-b border-black pb-4 mb-6 text-center tracking-[0.2em] uppercase">
          <h1 className="text-3xl font-light">{pageTitle}</h1>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            Multi-Game Presenter Console
          </p>
        </header>

        <TabNavigation
          gameDatasets={GAME_DATASETS}
          activeSetKey={activeSetKey}
          onSelectTab={handleSelectTab}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <AutoPickBar
              isAutoCounting={isAutoCounting}
              timeLeft={timeLeft}
              intervalSeconds={intervalSeconds}
              hasRemaining={remainingItems.length > 0}
              onIntervalChange={handleDurationChange}
              onToggleAutoCount={toggleAutoCount}
            />

            <BingoDisplayViews
              key={activeSetKey}
              activeSet={activeSet}
              lastCalled={lastCalled}
            />

            <div className="flex gap-4">
              <button
                onClick={callNextItem}
                disabled={remainingItems.length === 0 || isAutoCounting}
                className="flex-1 py-5 bg-black text-white hover:bg-gray-900 border border-black uppercase text-sm tracking-[0.2em] font-semibold transition-colors disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-400 cursor-pointer"
              >
                Draw Random ({remainingItems.length} left)
              </button>
              <button
                onClick={resetGame}
                className="py-5 px-8 border border-gray-200 hover:border-black text-sm uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                Reset Board
              </button>
            </div>
          </div>

          <DrawHistoryPanel
            key={activeSetKey}
            calledItems={calledItems}
            activeSet={activeSet}
          />
        </div>
      </div>
    </div>
  );
}