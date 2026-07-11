/**
 * Infinite horizontal text loop, pure CSS. Two identical chunks scroll by
 * -50% for a seamless repeat; prefers-reduced-motion pauses it entirely.
 */
export default function Marquee({ text }: { text: string }) {
  // Short texts repeat to fill the track; long ones (headline wires) don't
  const repeats = text.length > 160 ? 1 : 4;
  const chunk = Array(repeats).fill(text.toUpperCase()).join("  ·  ");
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-rule/20 bg-background py-2"
    >
      <div className="marquee-track font-mono text-[11px] tracking-[0.25em] text-muted">
        <span className="whitespace-nowrap pr-8">{chunk}</span>
        <span className="whitespace-nowrap pr-8">{chunk}</span>
      </div>
    </div>
  );
}
