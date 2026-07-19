// Plain data for the AvatarOrbit scene — NO remotion/React imports, so it's
// safe to pull into server components (scenes.meta.ts, the /videos pages, the
// export route) without tripping Remotion's "use client" guard.

// Demo avatars from public/avatars. Center is jane; villagers are jane-1..10.
// Paths are relative to public/ (no leading slash) — the composition wraps them
// in Remotion's staticFile() so they resolve both when served by Next (essay
// embed) and by the render server (export).
export const DEMO_OWNER = "avatars/jane.png";
export const DEMO_VILLAGERS = [
  "avatars/jane-1.png",
  "avatars/jane-2.png",
  "avatars/jane-3.png",
  "avatars/jane-4.png",
  "avatars/jane-5.png",
  "avatars/jane-6.png",
  "avatars/jane-7.png",
  "avatars/jane-8.png",
  "avatars/jane-9.png",
  "avatars/jane-10.png",
];

export type AvatarOrbitProps = {
  /** The central profile pic. */
  ownerSrc: string;
  /** The profile pics that rotate around the center. */
  villagerSrcs: string[];
  /** How far the rotating avatars sit from the center, in composition px. */
  radius: number;
  /** Diameter of each rotating avatar, in composition px. */
  avatarSize: number;
  /** Diameter of the central avatar, in composition px. */
  ownerSize: number;
  /**
   * Panel background. Transparent for essay embeds (so the scene bleeds onto
   * the page); a solid color for exported video (X renders transparency black).
   */
  background: string;
};

export const avatarOrbitDefaultProps: AvatarOrbitProps = {
  ownerSrc: DEMO_OWNER,
  villagerSrcs: DEMO_VILLAGERS,
  radius: 330,
  avatarSize: 170,
  ownerSize: 170,
  background: "transparent",
};
