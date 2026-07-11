"use client";

import { useEffect, useState } from "react";

/**
 * The finite-edition meter: a hairline progress bar at the top and a small
 * counter that flips to "DONE" at the end — the anti-infinite-feed promise
 * as UI. Scroll-driven, so it stays honest under prefers-reduced-motion.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 1;
      setProgress(Math.min(100, Math.max(0, Math.round(ratio * 100))));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed left-0 top-0 z-50 h-[3px] bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div
        aria-hidden="true"
        className="fixed bottom-4 right-4 z-50 border border-rule/20 bg-foreground px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-background"
      >
        {progress >= 100 ? "DONE — GO BUILD" : `${String(progress).padStart(3, "0")}%`}
      </div>
    </>
  );
}
