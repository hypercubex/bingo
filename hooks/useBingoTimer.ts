"use client";

import { useState, useEffect, useRef } from "react";

interface UseBingoTimerProps {
  initialInterval?: number;
  onPick: () => void;
  hasItemsRemaining: boolean;
}

export function useBingoTimer({
  initialInterval = 3,
  onPick,
  hasItemsRemaining,
}: UseBingoTimerProps) {
  const [intervalSeconds, setIntervalSeconds] = useState<number>(initialInterval);
  const [timeLeft, setTimeLeft] = useState<number>(initialInterval);
  const [isAutoCounting, setIsAutoCounting] = useState<boolean>(false);

  // Keep a stable ref to onPick to avoid resetting interval timers
  const onPickRef = useRef(onPick);
  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  // Main countdown timer loop
  useEffect(() => {
    if (!isAutoCounting) {
      return;
    }

    const timer = setInterval(() => {
      if (!hasItemsRemaining) {
        setIsAutoCounting(false);
        return;
      }

      setTimeLeft((prev) => {
        if (prev <= 1) {
          onPickRef.current();
          return intervalSeconds;
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isAutoCounting, intervalSeconds, hasItemsRemaining]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value, 10) || 1);
    setIntervalSeconds(value);
    if (!isAutoCounting) {
      setTimeLeft(value);
    }
  };

  const toggleAutoCount = () => {
    if (!isAutoCounting && hasItemsRemaining) {
      setTimeLeft(intervalSeconds);
      setIsAutoCounting(true);
    } else {
      setIsAutoCounting(false);
      setTimeLeft(intervalSeconds);
    }
  };

  const resetTimer = () => {
    setIsAutoCounting(false);
    setTimeLeft(intervalSeconds);
  };

  return {
    intervalSeconds,
    timeLeft,
    isAutoCounting,
    handleDurationChange,
    toggleAutoCount,
    resetTimer,
  };
}