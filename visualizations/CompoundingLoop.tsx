"use client";

import { VizScene } from "./VizScene";
import styles from "./viz.module.css";

const RINGS = [0, 1, 2];

/**
 * Value compounding outward, forever. This scene loops continuously, so it has
 * no replay control (replayable={false}).
 */
export function CompoundingLoop() {
  return (
    <VizScene replayable={false} label="Value compounding outward">
      <svg
        viewBox="0 0 400 200"
        className="mx-auto block w-full"
        style={{ maxWidth: 460 }}
        role="img"
      >
        {RINGS.map((i) => (
          <circle
            key={i}
            cx={200}
            cy={100}
            r={40}
            fill="none"
            stroke="var(--caption)"
            strokeWidth={1.5}
            className={styles.ripple}
            style={{ animationDelay: `${i * 1.06}s` }}
          />
        ))}
        <circle cx={200} cy={100} r={13} fill="var(--ink-strong)" />
      </svg>
    </VizScene>
  );
}
