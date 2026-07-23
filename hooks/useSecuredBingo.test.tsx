import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, renderHook, act } from "@testing-library/react";
import { useSecuredBingo } from "./useSecuredBingo";
import { BingoSymbolSet } from "@/types/bingo";

// Mock Active Symbol Set
const mockActiveSet: BingoSymbolSet = {
  id: "test_set",
  label: "Test Edition",
  markers: Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`),
};

describe("useSecuredBingo Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should generate a brand new cryptographically signed board on first load", () => {
    const { result } = renderHook(() => useSecuredBingo(mockActiveSet));

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isCheater).toBe(false);
    expect(result.current.card).toHaveLength(25);

    // Verify cryptographic keys were written to localStorage
    expect(localStorage.getItem("bingo_card_test_set")).not.toBeNull();
    expect(localStorage.getItem("bingo_card_time_test_set")).not.toBeNull();
    expect(localStorage.getItem("bingo_sig_test_set")).not.toBeNull();
  });

  it("should load an existing valid board from local storage", () => {
    // Generate an initial board to save credentials
    const { result: firstRender } = renderHook(() => useSecuredBingo(mockActiveSet));
    const savedCard = firstRender.current.card;

    // Retrieve storage items
    const cardData = localStorage.getItem("bingo_card_test_set");
    const cardTime = localStorage.getItem("bingo_card_time_test_set");
    const cardSig = localStorage.getItem("bingo_sig_test_set");

    // Clear hook state and reload
    const { result: secondRender } = renderHook(() => useSecuredBingo(mockActiveSet));

    expect(secondRender.current.card).toEqual(savedCard);
    expect(secondRender.current.isCheater).toBe(false);
  });

  it("should flag user as cheater if signature is tampered with in storage", () => {
    // 1. Generate valid board first
    renderHook(() => useSecuredBingo(mockActiveSet));

    // 2. Tamper with the cached board values in storage manually
    localStorage.setItem("bingo_card_test_set", JSON.stringify(Array(25).fill("Hacked!")));

    // 3. Reload hook to trigger signature validation mismatch
    const { result } = renderHook(() => useSecuredBingo(mockActiveSet));

    expect(result.current.isCheater).toBe(true);
    expect(result.current.lockoutTimeLeft).toBeGreaterThan(0);
    expect(localStorage.getItem("bingo_cheater_until_test_set")).not.toBeNull();
  });

  it("should bypass anti-cheat protections when disabled", () => {
    const { result } = renderHook(() => useSecuredBingo(mockActiveSet, { enabled: false }));

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isCheater).toBe(false);
    expect(result.current.card).toHaveLength(25);

    act(() => {
      result.current.toggleCell(0);
    });

    expect(result.current.selectedCells).toContain(0);

    localStorage.setItem("bingo_sig_test_set", "invalid_signature");

    const { result: reloaded } = renderHook(() => useSecuredBingo(mockActiveSet, { enabled: false }));

    expect(reloaded.current.isCheater).toBe(false);
    expect(reloaded.current.card).toHaveLength(25);
  });

  it("should enforce the 1-hour lockout expiration window", () => {
    const { result } = renderHook(() => useSecuredBingo(mockActiveSet));

    // Force trigger punishment directly
    act(() => {
      // Manually mismatch signature to simulate cheat
      localStorage.setItem("bingo_sig_test_set", "invalid_signature");
    });

    // Re-render to register the change
    const { result: reloadResult } = renderHook(() => useSecuredBingo(mockActiveSet));
    expect(reloadResult.current.isCheater).toBe(true);

    // Advance time by 30 minutes (lockout should still be active)
    act(() => {
      vi.advanceTimersByTime(30 * 60 * 1000);
    });
    expect(reloadResult.current.isCheater).toBe(true);

    // Mock window reload for when timer expires
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, reload: vi.fn() };

    // Advance time by remaining 30 minutes (total 1 hour)
    act(() => {
      vi.advanceTimersByTime(30 * 60 * 1000);
    });

    // Lockout should expire
    expect(localStorage.getItem("bingo_cheater_until_test_set")).toBeNull();
    expect(window.location.reload).toHaveBeenCalled();

    window.location = originalLocation;
  });

 it("should catch DOM tampering via MutationObserver", async () => {
    vi.useRealTimers();

    let hookResults: any = null;

    // 1. Define a helper component that naturally mounts the ref and calls our hook
    function TestComponent() {
      const result = useSecuredBingo(mockActiveSet);
      hookResults = result; // Expose the hook's return state to our test scope

      return (
        <div ref={result.boardRef}>
          {result.card.map((item, index) => (
            <button key={index} data-grid-cell>
              {item}
            </button>
          ))}
        </div>
      );
    }

    // 2. Render the wrapper component
    const { container } = render(
      <React.Suspense fallback={null}>
        <TestComponent />
      </React.Suspense>
    );

    // Wait for the hook to set up and generate the card
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // 3. Alter a button element in the DOM inside our mounted container
    act(() => {
      const firstCell = container.querySelector("[data-grid-cell]");
      if (firstCell) {
        firstCell.textContent = "Hacked Value";
      }
    });

    // 4. Wait briefly for the MutationObserver microtask queue to process
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // Verify cheater state was caught by our active observer!
    expect(hookResults.isCheater).toBe(true);

    vi.useFakeTimers();
  });
});
