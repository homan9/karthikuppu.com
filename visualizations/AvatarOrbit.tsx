"use client";

/* Demo avatars are remote; plain <img> avoids next/image remote-domain config. */
/* eslint-disable @next/next/no-img-element */

import { VizScene } from "./VizScene";
import styles from "./AvatarOrbit.module.css";

// Demo avatars from public/avatars. Center is jane; villagers are jane-1..10.
const DEMO_OWNER = "/avatars/jane.png";
const DEMO_VILLAGERS = [
  "/avatars/jane-1.png",
  "/avatars/jane-2.png",
  "/avatars/jane-3.png",
  "/avatars/jane-4.png",
  "/avatars/jane-5.png",
  "/avatars/jane-6.png",
  "/avatars/jane-7.png",
  "/avatars/jane-8.png",
  "/avatars/jane-9.png",
  "/avatars/jane-10.png",
];

type AvatarOrbitProps = {
  /** The central profile pic. */
  ownerPicSrc?: string;
  /** The profile pics that rotate around the center. */
  villagerSrcs?: string[];
  /** How far the rotating avatars sit from the center, in px. */
  radius?: number;
  /** Diameter of each rotating avatar, in px. */
  avatarSize?: number;
  /** Seconds for one full revolution. */
  durationSec?: number;
};

/**
 * A person (center) surrounded by their village — six profile pics orbiting the
 * central one. Loops forever, so VizScene shows no replay control.
 */
export function AvatarOrbit({
  ownerPicSrc = DEMO_OWNER,
  villagerSrcs = DEMO_VILLAGERS,
  radius = 100,
  avatarSize = 48,
  durationSec = 24,
}: AvatarOrbitProps) {
  const ownerSize = avatarSize; // owner is the same size as the villagers
  const box = radius * 2 + avatarSize; // fits the outermost avatars
  const count = villagerSrcs.length;

  return (
    <VizScene replayable={false} label="A village orbiting a person">
      <div className={styles.wrap} style={{ width: box, height: box }}>
        <div
          className={styles.ring}
          style={{ animationDuration: `${durationSec}s` }}
        >
          {villagerSrcs.map((src, i) => {
            const angle = (2 * Math.PI * i) / count - Math.PI / 2; // start at top
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            return (
              <span
                key={i}
                className={styles.slot}
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
              >
                <img
                  className={styles.face}
                  src={src}
                  alt=""
                  style={{ animationDuration: `${durationSec}s` }}
                />
              </span>
            );
          })}
        </div>

        <img
          className={styles.owner}
          src={ownerPicSrc}
          alt=""
          style={{ width: ownerSize, height: ownerSize }}
        />
      </div>
    </VizScene>
  );
}
