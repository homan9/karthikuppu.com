"use client";

/* Demo avatars are remote; plain <img> avoids next/image remote-domain config. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
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
 * A person (center) surrounded by their village — profile pics orbiting the
 * central one. Loops forever, so VizScene shows no replay control.
 */
export function AvatarOrbit(props: AvatarOrbitProps) {
  return (
    <VizScene replayable={false} label="A village orbiting a person">
      <AvatarOrbitBody {...props} />
    </VizScene>
  );
}

/**
 * Just the orbit visuals, with no VizScene panel — so it can be rendered
 * full-bleed (e.g. the /capture page) as well as inside a scene.
 */
export function AvatarOrbitBody({
  ownerPicSrc = DEMO_OWNER,
  villagerSrcs = DEMO_VILLAGERS,
  radius = 100,
  avatarSize = 48,
  durationSec = 24,
}: AvatarOrbitProps) {
  const ownerSize = avatarSize; // owner is the same size as the villagers
  const box = radius * 2 + avatarSize; // fits the outermost avatars
  const count = villagerSrcs.length;

  // Hold the orbit hidden until every avatar has decoded, then fade the whole
  // thing in together — no piecemeal "half-loaded" appearance on first visit.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const imgs = Array.from(root.querySelectorAll("img"));
    if (imgs.length === 0) {
      setReady(true);
      return;
    }
    let remaining = imgs.length;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) setReady(true);
    };
    const cleanups: (() => void)[] = [];
    imgs.forEach((img) => {
      // Already cached / decoded.
      if (img.complete && img.naturalWidth > 0) {
        done();
        return;
      }
      // `error` also resolves so a missing image never hangs the reveal.
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
      cleanups.push(() => {
        img.removeEventListener("load", done);
        img.removeEventListener("error", done);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      style={{
        width: box,
        height: box,
        opacity: ready ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <div
        className={styles.ring}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {villagerSrcs.map((src, i) => {
          const angle = (2 * Math.PI * i) / count - Math.PI / 2; // start at top
          // Round so near-zero values don't serialize as scientific notation
          // (e.g. 6.1e-15), which is invalid in CSS and breaks hydration.
          const x = Math.round(radius * Math.cos(angle) * 1000) / 1000;
          const y = Math.round(radius * Math.sin(angle) * 1000) / 1000;
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
                fetchPriority="high"
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
        fetchPriority="high"
        style={{ width: ownerSize, height: ownerSize }}
      />
    </div>
  );
}
