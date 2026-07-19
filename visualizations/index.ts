// Essay-facing visualizations, registered globally in mdx-components.tsx so
// essays can reference them by name with no import:
//
//   <AvatarOrbit />
//   <CapTable caption="…" />
//
// Each is a frame-driven Remotion composition (remotion/scenes/*) mounted as a
// chromeless <Player> via SceneEmbed — the same source that exports to MP4 at
// /videos/<id>. VizScene provides the panel + hover replay chrome.
export { VizScene } from "./VizScene";
export { AvatarOrbit } from "./AvatarOrbit";
export { CapTable } from "./CapTable";
