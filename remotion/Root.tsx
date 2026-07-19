import { Composition } from "remotion";
import { scenesMeta } from "./scenes.meta";
import { getSceneComponent } from "./registry";

// Registers every scene as a Remotion <Composition>. This is what Remotion
// Studio (`npm run studio`) and the renderer (`npm run render` / the export
// route) load. Because it's driven by scenes.meta.ts, adding a scene there +
// registry.tsx makes it appear everywhere automatically.
export function RemotionRoot() {
  return (
    <>
      {scenesMeta.map((s) => (
        <Composition
          key={s.id}
          id={s.id}
          component={getSceneComponent(s.id)}
          durationInFrames={s.durationInFrames}
          fps={s.fps}
          width={s.width}
          height={s.height}
          defaultProps={s.defaultProps}
        />
      ))}
    </>
  );
}
