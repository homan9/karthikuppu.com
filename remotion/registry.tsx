import type { ComponentType } from "react";
import { AvatarOrbit } from "./scenes/AvatarOrbit";
import { CapTable } from "./scenes/CapTable";

// Maps scene id → its composition component. Imports the actual React
// components, so this is consumed only where the component is needed: the
// Remotion Root (bundled for Studio/render) and the client-side Player embeds.
// Server-only code (the exporter) reads scenes.meta.ts instead.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: Record<string, ComponentType<any>> = {
  "avatar-orbit": AvatarOrbit,
  "cap-table": CapTable,
};

export function getSceneComponent(id: string) {
  const component = components[id];
  if (!component) throw new Error(`Unknown scene id: ${id}`);
  return component;
}
