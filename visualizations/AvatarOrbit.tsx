"use client";

import { VizScene } from "./VizScene";
import { SceneEmbed } from "./SceneEmbed";

/**
 * A person surrounded by their village — profile pics orbiting the central one.
 *
 * The actual animation now lives as a frame-driven Remotion composition
 * (remotion/scenes/AvatarOrbit.tsx) so the very same source can be inspected
 * frame-by-frame and exported to MP4 at /videos/avatar-orbit. Here it's mounted
 * as a chromeless, looping Player inside the usual VizScene panel, so in the
 * essay it looks and feels exactly like the old inline version.
 */
export function AvatarOrbit() {
  return (
    <VizScene replayable={false} label="A village orbiting a person">
      <SceneEmbed id="avatar-orbit" />
    </VizScene>
  );
}
