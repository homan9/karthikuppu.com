---
name: videos-remotion-architecture
description: How animated scenes / videos work — Remotion compositions shared between essays and MP4 export
metadata:
  type: project
---

Animated scenes are authored ONCE as frame-driven Remotion compositions and consumed two ways: chromeless looping `<Player>` embeds in essays, and frame-by-frame inspection + MP4 export at `/videos/<id>`. No video files are shipped to the site.

**Why frame-driven, not CSS keyframes:** only `useCurrentFrame()`-based animation is frame-addressable (inspect any frame) and deterministically renderable (export). Seamless loops are guaranteed by mapping exactly one motion cycle onto `durationInFrames` (last frame wraps to frame 0 with no jump). The old CSS-keyframe visualizations could do neither.

**Layout (single source of truth per scene):**
- `remotion/scenes/<Scene>.data.ts` — plain data (props type, defaults, asset paths relative to public/, no leading slash). NO remotion/React import → safe in server components.
- `remotion/scenes/<Scene>.tsx` — the composition (imports `remotion`; wrap asset paths in `staticFile()` so they resolve in both the browser Player and the render server).
- `remotion/scenes.meta.ts` — pure metadata array (id/title/dims/fps/durationInFrames/embedMaxWidth/defaultProps). Server-safe.
- `remotion/registry.tsx` — id → component (client/bundle only).
- `remotion/Root.tsx` + `remotion/index.ts` — registers Compositions for Studio/CLI/export.
- `visualizations/SceneEmbed.tsx` — chromeless Player (all controls off, transparent bg). Takes a `loop` prop (defaults to scene's `loops` meta): loop scenes loop continuously (AvatarOrbit); one-shot scenes play once and hold the final frame with `moveToBeginningWhenEnded={false}` (CapTable). Playback is gated by an IntersectionObserver (play on scroll-in, pause loops on scroll-away) — NOT `autoPlay`. Essay-facing `visualizations/<Name>.tsx` wrappers keep the old MDX API (e.g. `<AvatarOrbit />`, `<CapTable caption=…/>`).
- **Loop vs one-shot/replay in essays:** loop scene → `<VizScene replayable={false}><SceneEmbed loop/></VizScene>` (no button). One-shot → `<VizScene flush><SceneEmbed loop={false}/></VizScene>` — VizScene's hover replay button remounts children via `key`, which resets SceneEmbed's `hasStarted` latch and replays from frame 0. No PlayerRef needed for replay.
- **Text scenes (fonts):** load fonts inside the composition via `@remotion/google-fonts/<Font>` `loadFont()` (Inter + GeistMono) and inline theme colors as hex constants in the `.data.ts`. The site's `next/font` + CSS vars do NOT exist in the render bundle, so never rely on them.
- `app/videos/[id]` + `components/VideoInspector.tsx` — Player + scrubber + arrow-key frame stepping + Export MP4.
- `app/api/render/route.ts` — `@remotion/bundler` + `@remotion/renderer`, publicDir=Next `public/`, yuv420p h264. Marked in `serverExternalPackages` in next.config.

**Gotchas learned:** (1) a server-safe meta module must NOT transitively import any file that imports `remotion` (createContext SSR guard) — that's why data is split from the composition. (2) Use `staticFile()` for assets; bare `/avatars/x.png` 404s in the render server. (3) Remotion license reminder silenced via `acknowledgeRemotionLicense` — verify the free-license terms still apply if this ever becomes a company/commercial use.

Scripts: `npm run studio` (richest timeline for craft), `npm run render`. Verified: avatar-orbit exports 1080x1080 / 30fps / 720f / 24s, seamless (frame 0 ≈ frame 719). Related: [[nextjs-is-modified]] if it exists.
