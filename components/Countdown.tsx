"use client";
import { useEffect, useState } from "react";

/** Rolling-window countdown — returns remaining ms to next boundary. */
function remaining(now: number, hours: number) {
  const period = hours * 3600 * 1000;
  return period - (now % period);
}

export function useCountdown(hours = 48) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return "—";
  const ms = remaining(now, hours);
  const H = Math.floor(ms / 3600000);
  const M = Math.floor((ms % 3600000) / 60000);
  const S = Math.floor((ms % 60000) / 1000);
  return `${String(H).padStart(2, "0")}h ${String(M).padStart(2, "0")}m ${String(S).padStart(2, "0")}s`;
}

/** Podium-top style HH/MM/SEC update countdown (next Sunday 18:00 UTC). */
export function useUpdateCountdown(): [number, number, number] {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return [0, 0, 0];
  const d = new Date(now);
  const nxt = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + ((7 - d.getUTCDay()) % 7 || 7), 18),
  );
  let ms = Math.max(0, nxt.getTime() - now);
  const H = Math.floor(ms / 3600000);
  const M = Math.floor((ms % 3600000) / 60000);
  const S = Math.floor((ms % 60000) / 1000);
  return [H, M, S];
}
