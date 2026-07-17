"use client";

/* Local avatar cutouts; plain <img> avoids next/image remote config. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { VizScene } from "./VizScene";
import styles from "./CapTable.module.css";

type Holder = { name: string; src: string };

const OWNER = {
  name: "Jane",
  handle: "@jane",
  src: "/avatars/jane.png",
  bio: "",
};

// The four shareholders who come on board, in order, with the stake each takes.
// The first takes 3%, the rest 1% — so shareholders themselves differ.
const SHAREHOLDERS: (Holder & { pct: number })[] = [
  { name: "Bob", src: "/avatars/jane-1.png", pct: 3 },
  { name: "Cindy", src: "/avatars/jane-2.png", pct: 1 },
  { name: "Dan", src: "/avatars/jane-5.png", pct: 1 },
  { name: "Ella", src: "/avatars/jane-4.png", pct: 1 },
];

// Valuation ($M) per step. Step 0 is just Jane, so it isn't shown; the
// valuation appears once the first shareholder joins, then climbs.
const VALUATIONS = [10, 10, 20, 50, 100];

const TOTAL_STEPS = VALUATIONS.length; // 5
const STEP_MS = 500;
const AVATAR = 28;
const HEADER_AVATAR = 44;

export function CapTable({ caption }: { caption?: string }) {
  // The sequenced part lives INSIDE VizScene so that VizScene's replay (which
  // remounts its children) resets the animation and plays it from the top.
  return (
    <VizScene flush caption={caption} label="Jane's personal token cap table">
      <CapTableInner />
    </VizScene>
  );
}

function CapTableInner() {
  const [step, setStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setStep(TOTAL_STEPS - 1);
      return;
    }

    const el = cardRef.current;
    if (!el) return;

    let timers: ReturnType<typeof setTimeout>[] = [];
    // Only start the sequence once the card scrolls into view.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        timers = Array.from({ length: TOTAL_STEPS - 1 }, (_, i) =>
          setTimeout(() => setStep(i + 1), (i + 1) * STEP_MS),
        );
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const shown = SHAREHOLDERS.slice(0, step);
  const ownerPct = 100 - shown.reduce((sum, h) => sum + h.pct, 0);
  const showValuation = step >= 1;

  const rows = [{ name: OWNER.name, src: OWNER.src, pct: ownerPct }, ...shown];

  return (
    <div className={styles.frame}>
      <div ref={cardRef} className={styles.card}>
        {/* Identity + valuation */}
        <div className={styles.header}>
          <div className={styles.identity}>
            <Avatar src={OWNER.src} size={HEADER_AVATAR} />
            <div className={styles.nameBlock}>
              <span className={styles.name}>{OWNER.name}</span>
              <span className={styles.handle}>{OWNER.handle}</span>
            </div>
          </div>
          {showValuation && (
            // Badge stays put; only the number inside changes as it climbs.
            <span className={styles.valuation}>${VALUATIONS[step]}M</span>
          )}
        </div>

        <p className={styles.bio}>{OWNER.bio}</p>

        {/* Cap table */}
        <div className={styles.rows}>
          {rows.map((row) => (
            <div key={row.name} className={styles.row}>
              <Avatar src={row.src} size={AVATAR} />
              <span className={styles.rowName}>{row.name}</span>
              <span className={styles.leader} aria-hidden="true" />
              <span className={styles.rowPct}>{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Avatar({ src, size }: { src: string; size: number }) {
  return (
    <span className={styles.avatar} style={{ width: size, height: size }}>
      <img src={src} alt="" />
    </span>
  );
}
