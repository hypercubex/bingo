"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function InstructionsPage() {
  const [gameTitle, setGameTitle] = useState<string>("BINGO");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setGameTitle(decodeURIComponent(hash));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] font-sans antialiased px-4 py-12 md:px-16 flex flex-col items-center justify-between">
      <div className="w-full max-w-xl flex flex-col items-center">
        <header className="border-b border-black pb-4 mb-10 w-full text-center tracking-widest uppercase">
          <h1 className="text-2xl font-light tracking-[0.15em]">{gameTitle}</h1>
          <p className="text-[9px] text-gray-400 tracking-wider mt-1.5">Game Documentation</p>
        </header>

        <div className="w-full bg-white border border-black p-6 sm:p-8 shadow-sm">
          <div className="text-center border-b border-black pb-6 mb-8">
            <h2 className="text-xl font-light tracking-[0.1em] text-black uppercase">How to Play {gameTitle}</h2>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <span className="font-mono text-xs border border-black rounded-full w-6 h-6 flex items-center justify-center shrink-0">01</span>
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold mb-1 text-black">Acquire Your Card</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Open the game link on your mobile device or browser. A unique, scrambled 5x5 digital grid will instantly generate specifically for you.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-mono text-xs border border-black rounded-full w-6 h-6 flex items-center justify-center shrink-0">02</span>
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold mb-1 text-black">Listen for the Host</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  The game master will pull and call custom phrases randomly from the master registry console. Pay close attention to each keyword drawn.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-mono text-xs border border-black rounded-full w-6 h-6 flex items-center justify-center shrink-0">03</span>
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold mb-1 text-black">Mark Your Progress</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  If an item called by the host matches a block on your layout grid, tap that square. It will invert to solid black to lock in your marker selection.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-mono text-xs border border-black rounded-full w-6 h-6 flex items-center justify-center shrink-0">04</span>
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold mb-1 text-black">Claim Victory</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  The first person to complete an unbroken pattern of 5 markers across any row, column, or diagonal line wins the round.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-black pt-6">
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">Rule Summary Matrix</h4>
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-gray-100 text-[11px]">
                  <td className="py-2.5 font-medium uppercase tracking-wider text-black w-1/3">Target pattern</td>
                  <td className="py-2.5 text-gray-500">5 items in a straight row (Horizontal, Vertical, or Diagonal)</td>
                </tr>
                <tr className="border-b border-gray-100 text-[11px]">
                  <td className="py-2.5 font-medium uppercase tracking-wider text-black">Card state lock</td>
                  <td className="py-2.5 text-gray-500">Persists for 1 hour locally to safeguard against accidental device refreshes</td>
                </tr>
                <tr className="text-[11px]">
                  <td className="py-2.5 font-medium uppercase tracking-wider text-black">Reset rule</td>
                  <td className="py-2.5 text-gray-500">Use the link at the bottom of the card block to clear highlights without altering current text distributions</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-center">
            <Link
              href={`/#${encodeURIComponent(gameTitle)}`}
              className="bg-black text-white px-6 py-3 text-[10px] uppercase tracking-widest font-medium hover:bg-[#222222] transition-colors duration-200 cursor-pointer"
            >
              Enter Game Card
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center max-w-xs">
        <p className="text-[9px] text-gray-400 tracking-wide uppercase leading-relaxed">
          Loading...
        </p>
      </footer>
    </div>
  );
}