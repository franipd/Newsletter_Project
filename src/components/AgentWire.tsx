"use client";

import { useEffect, useState } from "react";

/**
 * Types out the agent-activity line like a newsroom wire ticker, once per
 * page load, with a blinking caret. Users who prefer reduced motion get the
 * full line on the first tick instead of the character-by-character reveal.
 */
export default function AgentWire({ text }: { text: string }) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    if (visibleChars >= text.length) {
      return;
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = setTimeout(
      () => {
        setVisibleChars((n) =>
          reduceMotion ? text.length : Math.min(n + 2, text.length),
        );
      },
      reduceMotion ? 0 : 18,
    );
    return () => clearTimeout(timer);
  }, [visibleChars, text]);

  const done = visibleChars >= text.length;

  return (
    <p
      aria-label={text}
      className="mt-2 text-center text-xs tracking-wide text-muted"
    >
      <span aria-hidden="true">
        {text.slice(0, visibleChars)}
        {!done && <span className="wire-caret">&nbsp;</span>}
      </span>
    </p>
  );
}
