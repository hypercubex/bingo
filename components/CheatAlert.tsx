"use client";

interface CheatAlertProps {
  /** Lockout duration remaining in milliseconds */
  timeRemainingMs: number;
}

export default function CheatAlert({ timeRemainingMs }: CheatAlertProps) {
  // Format milliseconds into MM:SS format
  const formatTime = (ms: number) => {
    if (ms <= 0) {
      return "00:00";
    }
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-red-950 text-red-200 font-mono flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="border-2 border-red-500 p-8 max-w-md bg-black/50 backdrop-blur-md shadow-2xl rounded-sm">
        <span className="text-5xl block mb-4 animate-pulse">🔒</span>
        <h1 className="text-2xl font-black tracking-widest text-red-500 mb-2 uppercase">
          SESSION SUSPENDED
        </h1>
        <p className="text-xs text-red-400 uppercase tracking-wider mb-6">
          Illegal DOM Modification Detected
        </p>

        <hr className="border-red-900 my-4" />

        <p className="text-xs leading-relaxed text-red-300/80 mb-6 font-sans">
          You have been locked out for altering active board markup via browser tools. Standard game functions will restore once the safety countdown completes.
        </p>

        <div className="flex flex-col gap-2 items-center bg-red-950/80 p-4 rounded border border-red-900/50">
          <div className="text-xs text-red-400 uppercase tracking-widest font-semibold">
            LOCKOUT COOLDOWN
          </div>
          <div className="text-3xl font-bold tracking-widest text-red-500 font-mono">
            {formatTime(timeRemainingMs)}
          </div>
        </div>
      </div>
    </div>
  );
}