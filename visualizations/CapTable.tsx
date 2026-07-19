"use client";

import { VizScene } from "./VizScene";
import { SceneEmbed } from "./SceneEmbed";

/**
 * Jane's personal-token cap table, built up one shareholder at a time.
 *
 * The animation is a frame-driven Remotion composition
 * (remotion/scenes/CapTable.tsx). It plays once and holds its final frame; the
 * surrounding VizScene provides the hover replay button, whose remount restarts
 * the scene — same one-shot-with-replay feel as before.
 */
export function CapTable({ caption }: { caption?: string }) {
  return (
    <VizScene flush caption={caption} label="Jane's personal token cap table">
      <SceneEmbed id="cap-table" loop={false} />
    </VizScene>
  );
}
