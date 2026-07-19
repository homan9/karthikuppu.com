// Plain data for the CapTable scene — NO remotion/React imports, safe in
// server components. Sizes are in composition px (1080-wide canvas).

export type CapHolder = { name: string; src: string; pct: number };

export const CAP_OWNER = { name: "Jane", handle: "@jane", src: "avatars/jane.png" };

// The four shareholders who come on board, in order, with the stake each takes.
// The first takes 3%, the rest 1% — so shareholders themselves differ.
export const CAP_SHAREHOLDERS: CapHolder[] = [
  { name: "Bob", src: "avatars/jane-1.png", pct: 3 },
  { name: "Cindy", src: "avatars/jane-2.png", pct: 1 },
  { name: "Dan", src: "avatars/jane-5.png", pct: 1 },
  { name: "Ella", src: "avatars/jane-4.png", pct: 1 },
];

// Valuation ($M) per step. Step 0 is just Jane, so no valuation; it appears
// once the first shareholder joins, then climbs.
export const CAP_VALUATIONS = [10, 10, 20, 50, 100];

// Theme tokens pulled from the shared TS palette (remotion/theme.ts), so the
// composition renders identically in the essay (where these come from global
// CSS vars) and in the render bundle (where the global stylesheet does not
// exist). The green pair is scene-specific and stays local.
import { THEME } from "../theme";

export const CAP_COLORS = {
  ink: THEME.ink,
  inkStrong: THEME.inkStrong,
  caption: THEME.caption,
  hairline: THEME.hairline,
  green: "#00bf4c",
  greenBg: "rgba(0, 191, 76, 0.14)",
};

export type CapTableProps = {
  /**
   * Panel background. Transparent for the essay embed; a solid color for the
   * exported video (X renders transparency black).
   */
  background: string;
};

export const capTableDefaultProps: CapTableProps = {
  background: "transparent",
};
