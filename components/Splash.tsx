"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Startup splash — modeled on the shipped behavior (analysis/REA-REPORT.md §7):
 * - 56px circular emblem + fade-in ("awaken")
 * - progress stages: 0→0.30 during first 250ms, 0.30→0.85 through ~430ms,
 *   final 15% reserved for app readiness; percent counter
 * - skip on ANY keydown or pointerup anywhere; scroll-lock while visible
 * - leaves with 200ms fade; disabled under prefers-reduced-motion
 * Evidence: JavaScript/css observed in the served HTML of the original.
 */
export default function Splash() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const root = document.getElementById("app-root");
    root?.setAttribute("inert", "");

    const started = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let skipped = false;
    let frame = 0;
    let fallback = 0;
    let leaving = false;
    let lastFrame = started;
    let finishElapsed = 0;
    let completedAt: number | null = null;

    // readiness signal: mark ready after first paint settles (this app is
    // fully client-rendered; "ready" when hydrated + one rAF later)
    let readyFlag = false;
    const markReady = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        readyFlag = true;
        overlay.dataset.ready = "true";
      }));
    };
    markReady();

    const ease = (v: number) => v * v * (3 - 2 * v);
    const stages: Array<[number, number, number, number]> = [
      [0, 250, 0, 0.3],
      [280, 150, 0.3, 0.85],
    ];
    const skip = () => {
      skipped = true;
    };
    const preventScroll = (e: Event) => e.preventDefault();

    const cleanup = () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pagehide", cleanup);
      overlay.removeEventListener("pointerup", skip);
      overlay.removeEventListener("wheel", preventScroll);
      overlay.removeEventListener("touchmove", preventScroll);
      overlay.removeEventListener("transitionend", cleanup);
      root?.removeAttribute("inert");
      setGone(true);
    };

    const tick = (now: number) => {
      const elapsed = now - started;
      const ready = overlay.dataset.ready === "true";
      let progress = 0;
      for (const [begin, duration, from, to] of stages) {
        if (elapsed < begin) break;
        const t = Math.min((elapsed - begin) / duration, 1);
        progress = from + (to - from) * ease(t);
      }
      if (elapsed >= 450) {
        if (ready) {
          finishElapsed = Math.min(150, finishElapsed + Math.max(0, now - Math.max(lastFrame, started + 450)));
        } else {
          finishElapsed = Math.min(finishElapsed, 149);
        }
        progress = 0.85 + 0.15 * Math.pow(finishElapsed / 150, 2);
      }
      if (skipped || reduced) progress = ready ? 1 : Math.min(progress, 0.99);
      lastFrame = now;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
      if (pctRef.current) pctRef.current.textContent = String(Math.floor(progress * 100));
      if (progress === 1 && ready) {
        completedAt ??= now;
      } else {
        completedAt = null;
      }
      const hold = skipped || reduced ? 0 : 100;
      if (completedAt !== null && now - completedAt >= hold && !leaving) {
        leaving = true;
        overlay.classList.add("is-leaving");
        overlay.addEventListener("transitionend", cleanup);
        fallback = window.setTimeout(cleanup, reduced ? 0 : 250);
      } else if (!leaving) {
        frame = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("keydown", skip);
    window.addEventListener("pagehide", cleanup);
    overlay.addEventListener("pointerup", skip);
    overlay.addEventListener("wheel", preventScroll, { passive: false });
    overlay.addEventListener("touchmove", preventScroll, { passive: false });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pagehide", cleanup);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      id="re-startup"
      data-ready="false"
      ref={overlayRef}
      role="status"
      aria-label="Loading Chad Rankings"
    >
      <div className="re-startup-content">
        <div className="re-startup-emblem" aria-hidden="true">
          CR
        </div>
        <h1 className="re-startup-title">CHAD RANKINGS</h1>
        <p className="re-startup-subtitle">OFFICIAL STANDINGS</p>
        <div className="re-startup-track" aria-hidden="true">
          <div className="re-startup-fill" ref={fillRef} />
        </div>
        <div className="re-startup-meta" aria-hidden="true">
          <span>SEALING THE CYCLE</span>
          <span id="re-startup-percent" ref={pctRef}>
            0
          </span>
        </div>
        <button aria-label="Skip loading animation" className="re-startup-skip" type="button">
          <span className="re-startup-key">PRESS ANY KEY TO SKIP</span>
          <span className="re-startup-tap">TAP ANYWHERE TO SKIP</span>
        </button>
      </div>
    </div>
  );
}
