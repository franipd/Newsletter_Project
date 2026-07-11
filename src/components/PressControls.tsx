"use client";

import { useEffect, useState } from "react";

/**
 * The kill switch UI. Reads status from /api/agents; flipping it requires
 * the control key (CRON_SECRET), which never leaves this browser tab.
 */
export default function PressControls() {
  const [paused, setPaused] = useState<boolean | null>(null);
  const [controlKey, setControlKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((d) => setPaused(d.paused === true))
      .catch(() => setPaused(false));
  }, []);

  async function toggle() {
    if (paused === null || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${controlKey}`,
        },
        body: JSON.stringify({ paused: !paused }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(
          res.status === 401
            ? "Wrong control key."
            : `Failed: ${data.error ?? res.status}`,
        );
      } else {
        setPaused(data.paused);
        setMessage(
          data.paused
            ? "Presses stopped. No agent will spend a token until you resume."
            : "Presses running. Next scheduled run will publish as normal.",
        );
      }
    } catch {
      setMessage("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  const statusKnown = paused !== null;

  return (
    <div className="mt-10 border-2 border-rule p-6">
      <div className="flex items-center gap-3">
        {statusKnown && !paused && (
          <span className="wire-dot" aria-hidden="true" />
        )}
        {statusKnown && paused && (
          <span
            aria-hidden="true"
            className="inline-block h-[0.45rem] w-[0.45rem] rounded-full bg-muted"
          />
        )}
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-foreground">
          {!statusKnown
            ? "Checking presses…"
            : paused
              ? "Presses stopped"
              : "Presses running"}
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {paused
          ? "The daily edition and the stop-press desk are paused. Scheduled runs exit immediately at zero cost. The site keeps serving the latest published edition."
          : "The daily edition publishes at 06:00 UTC and the stop-press desk checks every 2 hours. Pausing stops all agent runs (and API spend) until you resume."}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="password"
          value={controlKey}
          onChange={(e) => setControlKey(e.target.value)}
          placeholder="Control key"
          aria-label="Control key"
          className="flex-1 border border-rule/40 bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <button
          onClick={toggle}
          disabled={!statusKnown || busy || controlKey.length === 0}
          className="cursor-pointer border-2 border-rule bg-foreground px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-background transition-colors hover:bg-accent hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Working…" : paused ? "Resume agents" : "Pause agents"}
        </button>
      </div>

      {message && (
        <p className="mt-4 font-mono text-xs tracking-wide text-accent">
          {message}
        </p>
      )}
    </div>
  );
}
