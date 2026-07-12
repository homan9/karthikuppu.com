"use client";

import { useState, type ReactNode } from "react";
import styles from "./VizScene.module.css";

type VizSceneProps = {
  children: ReactNode;
  /**
   * Whether this scene shows a replay control. Set to `false` for
   * visualizations that animate in a continuous loop.
   * @default true
   */
  replayable?: boolean;
  /**
   * Removes the scene's inner padding so the child can fill the panel
   * edge-to-edge and control its own insets.
   * @default false
   */
  flush?: boolean;
  /** Optional caption shown beneath the scene. */
  caption?: string;
  /** Optional label for accessibility / captioning. */
  label?: string;
};

/**
 * Wraps every visualization: gives it the right background, padding (so the
 * replay control never sits on top of the viz body), and a single hover-only
 * "replay" button in the bottom-right. Clicking replay remounts the child via
 * its `key`, restarting whatever animation it runs on mount.
 *
 * Tweak its look in VizScene.module.css.
 */
export function VizScene({
  children,
  replayable = true,
  flush = false,
  caption,
  label,
}: VizSceneProps) {
  const [playCount, setPlayCount] = useState(0);

  const bodyClass = flush
    ? styles.flush
    : `${styles.body} ${replayable ? styles.withReplay : ""}`;

  return (
    <figure className={styles.figure} aria-label={label}>
      <div className={styles.scene}>
        <div key={playCount} className={bodyClass}>
          {children}
        </div>

        {replayable && (
          <button
            type="button"
            onClick={() => setPlayCount((n) => n + 1)}
            aria-label="Replay animation"
            className={styles.replay}
          >
            <ReplayIcon />
          </button>
        )}
      </div>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

function ReplayIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
