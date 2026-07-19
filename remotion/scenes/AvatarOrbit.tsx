import type { CSSProperties } from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { AvatarOrbitProps } from "./AvatarOrbit.data";

export type { AvatarOrbitProps };

/**
 * A person (center) surrounded by their village — profile pics orbiting the
 * central one.
 *
 * Frame-driven, not CSS-driven: every position is a pure function of
 * `useCurrentFrame()`. One full revolution is mapped to the composition's full
 * duration, so the last frame lands one step before 360° and wraps cleanly to
 * frame 0 — a seamless loop by construction (verify in /videos/avatar-orbit by
 * comparing frame 0 with the final frame).
 *
 * Faces stay upright because each avatar is *positioned* on the circle rather
 * than the whole ring being rotated — no counter-rotation needed.
 */
export function AvatarOrbit({
  ownerSrc,
  villagerSrcs,
  radius,
  avatarSize,
  ownerSize,
  background,
}: AvatarOrbitProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // One revolution over the whole composition → seamless loop.
  const rotation = (frame / durationInFrames) * 2 * Math.PI;
  const count = villagerSrcs.length;

  // Each avatar is positioned from the frame's center (50%/50%) and offset onto
  // the circle. `maxWidth: none` defeats any global `img { max-width: 100% }`
  // reset (e.g. Tailwind preflight) that the host page applies but the render
  // bundle does not — without it the avatars collapse to zero width in-browser.
  const avatarStyle = (size: number): CSSProperties => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    width: size,
    height: size,
    maxWidth: "none",
    display: "block",
    borderRadius: "50%",
    objectFit: "cover",
  });

  return (
    <div style={{ position: "absolute", inset: 0, background }}>
      {villagerSrcs.map((src, i) => {
        const angle = (2 * Math.PI * i) / count - Math.PI / 2 + rotation;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return (
          <Img
            key={i}
            src={staticFile(src)}
            alt=""
            style={{
              ...avatarStyle(avatarSize),
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            }}
          />
        );
      })}

      <Img
        src={staticFile(ownerSrc)}
        alt=""
        style={{
          ...avatarStyle(ownerSize),
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      />
    </div>
  );
}
