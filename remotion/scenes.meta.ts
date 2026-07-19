import { avatarOrbitDefaultProps } from "./scenes/AvatarOrbit.data";
import { capTableDefaultProps } from "./scenes/CapTable.data";

// Pure metadata for every scene — NO React/remotion component imports, so this
// module is safe to pull into the Next server (the /api/render route) and into
// server components without dragging the renderer into the bundle.
//
// The component itself lives in registry.tsx, keyed by the same id. Both the
// essay embed, the /videos inspector, the Remotion Root, and the exporter read
// from these two files, so a scene is defined in exactly one place.

export type SceneMeta = {
  id: string;
  title: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  /** Suggested display width (px) for the chromeless essay embed. */
  embedMaxWidth: number;
  /**
   * Whether the scene animates continuously (true → essay embed loops with no
   * controls, e.g. AvatarOrbit) or plays once (false → essay embed plays a
   * single time and shows a replay button, e.g. CapTable).
   */
  loops: boolean;
  defaultProps: Record<string, unknown>;
};

export const scenesMeta: SceneMeta[] = [
  {
    id: "avatar-orbit",
    title: "Avatar Orbit",
    width: 1080,
    height: 1080,
    fps: 30,
    // One 24s revolution. durationInFrames defines the loop length, and the
    // composition maps exactly one revolution onto it → seamless.
    durationInFrames: 24 * 30,
    embedMaxWidth: 320,
    loops: true,
    defaultProps: avatarOrbitDefaultProps as unknown as Record<string, unknown>,
  },
  {
    id: "cap-table",
    title: "Cap Table",
    width: 1080,
    height: 1080,
    fps: 30,
    // Plays once: 5 steps × 0.5s + a short tail holding the final state.
    durationInFrames: 90,
    embedMaxWidth: 460,
    loops: false,
    defaultProps: capTableDefaultProps as unknown as Record<string, unknown>,
  },
];

export function getSceneMeta(id: string): SceneMeta | undefined {
  return scenesMeta.find((s) => s.id === id);
}
