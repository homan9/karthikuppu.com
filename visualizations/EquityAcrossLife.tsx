"use client";

import { VizScene } from "./VizScene";
import styles from "./viz.module.css";

const CENTER = { x: 200, y: 110 };
const R = 80;
// Six "village" nodes evenly spaced around a central node.
const NODES = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 2;
  return {
    x: CENTER.x + R * Math.cos(angle),
    y: CENTER.y + R * Math.sin(angle),
  };
});

/**
 * A central life (you) surrounded by a village. Connections draw in one by
 * one, then the nodes settle — equity shared across everyone who helps.
 * Replayable: the whole sequence has a clear start and end.
 */
export function EquityAcrossLife() {
  return (
    <VizScene label="Equity shared across a village">
      <svg
        viewBox="0 0 400 220"
        className="mx-auto block w-full"
        style={{ maxWidth: 460 }}
        role="img"
      >
        {/* Connections */}
        {NODES.map((n, i) => (
          <line
            key={`l-${i}`}
            x1={n.x}
            y1={n.y}
            x2={CENTER.x}
            y2={CENTER.y}
            stroke="var(--caption)"
            strokeWidth={1.5}
            className={styles.draw}
            style={{ animationDelay: `${0.15 + i * 0.12}s` }}
          />
        ))}

        {/* Village nodes */}
        {NODES.map((n, i) => (
          <circle
            key={`n-${i}`}
            cx={n.x}
            cy={n.y}
            r={9}
            fill="#d8d8d2"
            className={styles.pop}
            style={{ animationDelay: `${0.25 + i * 0.12}s` }}
          />
        ))}

        {/* Central node (you) */}
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={15}
          fill="var(--ink-strong)"
          className={styles.pulse}
          style={{ animationDelay: "1.1s" }}
        />
      </svg>
    </VizScene>
  );
}
