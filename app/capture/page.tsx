import { AvatarOrbitBody } from "@/visualizations/AvatarOrbit";

// Full-bleed render of a visualization for screen-recording (e.g. X previews).
// No essay chrome, no scene panel, solid background.
//
// Tweak via query params, e.g.:
//   /capture?radius=350&size=140&duration=10&bg=white
export default async function CapturePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const num = (v: string | string[] | undefined, fallback: number) =>
    typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))
      ? Number(v)
      : fallback;

  const radius = num(sp.radius, 300);
  const avatarSize = num(sp.size, 120);
  const durationSec = num(sp.duration, 16);

  const bgRaw = typeof sp.bg === "string" ? sp.bg : "#f5f5f2";
  const bg = /^[0-9a-fA-F]{3,8}$/.test(bgRaw) ? `#${bgRaw}` : bgRaw;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
      }}
    >
      <AvatarOrbitBody
        radius={radius}
        avatarSize={avatarSize}
        durationSec={durationSec}
      />
    </div>
  );
}
