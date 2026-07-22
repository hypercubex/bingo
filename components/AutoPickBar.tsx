"use client";

import { useState } from "react";

interface AutoPickBarProps {
  isAutoCounting: boolean;
  timeLeft: number;
  intervalSeconds: number;
  hasRemaining: boolean;
  onIntervalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleAutoCount: () => void;
}

export function AutoPickBar({
  isAutoCounting,
  timeLeft,
  intervalSeconds,
  hasRemaining,
  onIntervalChange,
  onToggleAutoCount,
}: AutoPickBarProps) {
  const [showConfig, setShowConfig] = useState<boolean>(false);

  return (
    <div className="bg-white border-2 border-black p-4 flex flex-col gap-4 shadow-sm min-h-[90px] transition-all">
      <div className="grid grid-cols-3 items-center w-full gap-4">
        {/* Left: Minimal Arrow Toggle & Interval Label */}
        <div className="flex items-center gap-2 justify-start">
          <button
            onClick={() => {
              setShowConfig((prev) => {
                return !prev;
              });
            }}
            title={showConfig ? "Hide timer config" : "Show timer config"}
            aria-label={showConfig ? "Hide timer config" : "Show timer config"}
            className="w-8 h-8 flex items-center justify-center text-xs font-bold border border-gray-300 hover:border-black bg-white text-black transition-colors cursor-pointer"
          >
            {showConfig ? "▼" : "▶"}
          </button>

          {!showConfig && (
            <span className="text-xs font-mono text-gray-400 font-medium ml-1 hidden sm:inline">
              {intervalSeconds}s interval
            </span>
          )}
        </div>

        {/* Center: Countdown Timer */}
        <div className="flex items-center justify-center">
          {isAutoCounting ? (
            <div className="flex items-center leading-none gap-2">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-bold hidden md:inline">
                Next draw:
              </span>
              <span className="text-7xl font-mono font-black text-black tracking-tighter">
                {timeLeft}
              </span>
            </div>
          ) : (
            <span className="text-xs uppercase tracking-widest text-gray-300 font-semibold hidden sm:inline">
              Auto Pick Inactive
            </span>
          )}
        </div>

        {/* Right: Start / Stop Button */}
        <div className="flex items-center justify-end">
          <button
            onClick={onToggleAutoCount}
            disabled={!hasRemaining}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-bold border transition-colors cursor-pointer disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 ${
              isAutoCounting
                ? "bg-neutral-800 text-white border-black hover:bg-black"
                : "bg-black text-white border-black hover:bg-gray-800"
            }`}
          >
            {isAutoCounting ? "Stop" : "Start Auto Pick"}
          </button>
        </div>
      </div>

      {/* Collapsible Config Drawer */}
      {showConfig && (
        <div className="pt-3 border-t border-gray-200 flex items-center gap-4 animate-fade-in">
          <label className="text-xs uppercase tracking-wider font-semibold text-gray-600">
            Timer Interval (seconds):
          </label>
          <input
            type="number"
            min={1}
            max={60}
            disabled={isAutoCounting}
            value={intervalSeconds}
            onChange={onIntervalChange}
            className="w-20 px-3 py-1.5 border border-gray-300 text-center text-sm font-mono font-bold focus:outline-none focus:border-black disabled:bg-gray-100 disabled:text-gray-400"
          />
          {isAutoCounting && (
            <span className="text-xs text-gray-400 font-medium italic">
              Stop timer to change interval
            </span>
          )}
        </div>
      )}
    </div>
  );
}