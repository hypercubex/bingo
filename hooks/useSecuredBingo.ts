"use client";

import { useState, useEffect, useRef } from "react";
import { BingoSymbolSet } from "@/types/bingo";

const CARD_PREFIX = "bingo_card_";
const CARD_TIME_PREFIX = "bingo_card_time_";
const SELECTIONS_PREFIX = "bingo_selections_";
const SIGNATURE_PREFIX = "bingo_sig_";
const PUNISH_TIME_PREFIX = "bingo_cheater_until_";
const ONE_HOUR = 60 * 60 * 1000;
const GRID_SIZE = 25;

const SECURITY_SALT = "bingo_anti_cheat_v1_2026_secure_hash_salt_!!";

function generateSignature(items: string[], timestamp: string, salt: string): string {
  const payload = `${items.join("|")}::${timestamp}::${salt}`;
  let h1 = 1779033703, h2 = 3024733165, h3 = 3362454363, h4 = 502493248;
  for (let i = 0, k; i < payload.length; i++) {
    k = payload.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0]
    .map((x) => x.toString(16).padStart(8, "0"))
    .join("");
}

export function useSecuredBingo(activeSet: BingoSymbolSet) {
  const [card, setCard] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isCheater, setIsCheater] = useState<boolean>(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const cardStateRef = useRef<string[]>([]);

  useEffect(() => {
    cardStateRef.current = card;
  }, [card]);

  const themeId = activeSet.id;
  const cacheKey = `${CARD_PREFIX}${themeId}`;
  const cacheTimeKey = `${CARD_TIME_PREFIX}${themeId}`;
  const selectionKey = `${SELECTIONS_PREFIX}${themeId}`;
  const sigKey = `${SIGNATURE_PREFIX}${themeId}`;
  const punishTimeKey = `${PUNISH_TIME_PREFIX}${themeId}`;

  const getLockoutRemaining = (): number => {
    const penaltyTimestamp = localStorage.getItem(punishTimeKey);
    if (!penaltyTimestamp) { return 0; }
    const timeLeft = parseInt(penaltyTimestamp, 10) - Date.now();
    return timeLeft > 0 ? timeLeft : 0;
  };

  useEffect(() => {
    if (typeof window === "undefined") { return; }

    const remainingTime = getLockoutRemaining();
    if (remainingTime > 0) {
      setIsCheater(true);
      setLockoutTimeLeft(remainingTime);
      setIsLoaded(true);

      const timer = setTimeout(() => {
        localStorage.removeItem(punishTimeKey);
        setIsCheater(false);
        setLockoutTimeLeft(0);
        window.location.reload();
      }, remainingTime);

      return () => { clearTimeout(timer); };
    } else {
      localStorage.removeItem(punishTimeKey);
      setIsCheater(false);
    }

    const savedCard = localStorage.getItem(cacheKey);
    const savedTime = localStorage.getItem(cacheTimeKey);
    const savedSig = localStorage.getItem(sigKey);
    const now = Date.now();

    let parsedCard: string[] = [];
    if (savedCard) {
      try {
        parsedCard = JSON.parse(savedCard);
      } catch {
        parsedCard = [];
      }
    }

    if (parsedCard.length === GRID_SIZE && savedTime && savedSig) {
      const computedSig = generateSignature(parsedCard, savedTime, SECURITY_SALT);
      const isTimeExpired = now - parseInt(savedTime, 10) > ONE_HOUR;

      if (computedSig !== savedSig) {
        triggerPunishment();
        return;
      }

      if (!isTimeExpired) {
        setCard(parsedCard);
        loadSelections();
        setIsLoaded(true);
        return;
      }
    }

    const itemsToShuffle = activeSet.markers || [];
    const shuffled = [...itemsToShuffle]
      .sort(() => 0.5 - Math.random())
      .slice(0, GRID_SIZE);

    const newTimestamp = Date.now().toString();
    const newSig = generateSignature(shuffled, newTimestamp, SECURITY_SALT);

    localStorage.setItem(cacheKey, JSON.stringify(shuffled));
    localStorage.setItem(cacheTimeKey, newTimestamp);
    localStorage.setItem(sigKey, newSig);

    setCard(shuffled);
    setSelectedCells([]);
    localStorage.removeItem(selectionKey);
    setIsLoaded(true);
  }, [activeSet]);

  useEffect(() => {
    if (!isCheater || lockoutTimeLeft <= 0) { return; }

    const interval = setInterval(() => {
      const remaining = getLockoutRemaining();
      if (remaining <= 0) {
        localStorage.removeItem(punishTimeKey);
        setIsCheater(false);
        clearInterval(interval);
        window.location.reload();
      } else {
        setLockoutTimeLeft(remaining);
      }
    }, 1000);

    return () => { clearInterval(interval); };
  }, [isCheater, lockoutTimeLeft]);

  // Anti-Cheat Mutation Observer
  useEffect(() => {
    if (!boardRef.current || isCheater || card.length !== GRID_SIZE) { return; }

    const targetNode = boardRef.current;

    const observer = new MutationObserver(() => {
      // Direct Select only buttons holding game values, skipping footer controls
      const cells = Array.from(targetNode.querySelectorAll("[data-grid-cell]"));
      const currentCardState = cardStateRef.current;

      const hasTampered = cells.some((cell, index) => {
        const expectedValue = currentCardState[index];
        if (!expectedValue) { return false; }

        if (activeSet.id === "world_cup") {
          const img = cell.querySelector("img");
          return !img || !img.getAttribute("src")?.includes(expectedValue);
        }

        const visibleText = (cell.textContent || "").replace(/\s+/g, "").toLowerCase();
        const cleanExpected = expectedValue.replace(/\s+/g, "").toLowerCase();
        return !visibleText.includes(cleanExpected);
      });

      if (hasTampered) {
        triggerPunishment();
      }
    });

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    return () => { observer.disconnect(); };
  }, [card, isCheater, activeSet]);

  const loadSelections = () => {
    const savedSelections = localStorage.getItem(selectionKey);
    if (savedSelections) {
      try {
        setSelectedCells(JSON.parse(savedSelections));
      } catch {
        setSelectedCells([]);
      }
    }
  };

  const triggerPunishment = () => {
    setIsCheater(true);
    setLockoutTimeLeft(ONE_HOUR);

    localStorage.removeItem(cacheKey);
    localStorage.removeItem(cacheTimeKey);
    localStorage.removeItem(sigKey);
    localStorage.removeItem(selectionKey);

    const unlockTime = Date.now() + ONE_HOUR;
    localStorage.setItem(punishTimeKey, unlockTime.toString());
    setIsLoaded(true);
  };

  const toggleCell = (index: number): void => {
    if (isCheater) { return; }

    const savedCard = localStorage.getItem(cacheKey);
    const savedTime = localStorage.getItem(cacheTimeKey);
    const savedSig = localStorage.getItem(sigKey);

    if (!savedCard || !savedTime || !savedSig) {
      triggerPunishment();
      return;
    }

    const parsed = JSON.parse(savedCard);
    const verifySig = generateSignature(parsed, savedTime, SECURITY_SALT);

    if (verifySig !== savedSig) {
      triggerPunishment();
      return;
    }

    let updated: number[];
    if (selectedCells.includes(index)) {
      updated = selectedCells.filter((i) => i !== index);
    } else {
      updated = [...selectedCells, index];
    }
    setSelectedCells(updated);
    localStorage.setItem(selectionKey, JSON.stringify(updated));
  };

  const resetCurrentBoard = (): void => {
    if (isCheater) { return; }
    if (confirm(`Reset your marks for this game?`)) {
      setSelectedCells([]);
      localStorage.removeItem(selectionKey);
    }
  };

  return {
    card,
    selectedCells,
    isCheater,
    lockoutTimeLeft,
    isLoaded,
    boardRef,
    toggleCell,
    resetCurrentBoard,
  };
}