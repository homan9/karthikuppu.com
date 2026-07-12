"use client";

import { useEffect, useRef, useState } from "react";
import { VizScene } from "./VizScene";
import styles from "./ValuationGraph.module.css";

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------
const W = 380;
const H = 250;
const ORIGIN_X = 30; // y-axis
const BASE_Y = 190; // x-axis (the "ground")
const RIGHT_X = 356; // valuation flag / end of life
const TOP_Y = 26; // top of the plot area
const PLOT_W = RIGHT_X - ORIGIN_X;
const PLOT_H = BASE_Y - TOP_Y;

// Fraction along the x-axis for each life stage.
const NET_WORTH_X = 1 / 3; // the "woman" — reality ends here

const toXY = ([xf, yf]: [number, number]): [number, number] => [
  ORIGIN_X + xf * PLOT_W,
  BASE_Y - yf * PLOT_H,
];

// Value created over a life. Up and down, but trending upward.
// Reality (solid): birth → net worth. Stays on the ground, then lifts off.
const REALITY: [number, number][] = [
  [0.0, 0.0],
  [0.1, 0.015],
  [0.18, 0.05],
  [0.24, 0.14],
  [0.28, 0.31],
  [0.305, 0.25],
  [NET_WORTH_X, 0.42],
];

// Future (dashed): net worth → death. Same character, still trending up.
const FUTURE: [number, number][] = [
  [NET_WORTH_X, 0.42],
  [0.4, 0.54],
  [0.47, 0.48],
  [0.55, 0.66],
  [0.62, 0.58],
  [0.7, 0.77],
  [0.79, 0.67],
  [0.88, 0.85],
  [1.0, 0.9],
];

// Four phases of life, evenly spaced (0, 1/3, 2/3, 1).
const EMOJIS: { emoji: string; xf: number }[] = [
  { emoji: "👶", xf: 0 },
  { emoji: "👧", xf: NET_WORTH_X },
  { emoji: "👩", xf: 2 / 3 },
  { emoji: "👵", xf: 1 },
];

// Colors
const AXIS = "#dcdcd8"; // axis + flags share this light gray
const HATCH = "#cfcfca"; // vertical fill lines under the future
const LABEL = "#1c1c1a"; // rendered at 0.5 opacity
const CURVE = "#0b0b0a";

// Smooth path through points via Catmull-Rom → cubic béziers.
function smoothSegments(points: [number, number][]): string {
  let d = "";
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  return `M ${points[0][0]} ${points[0][1]}${smoothSegments(points)}`;
}

/**
 * Value created across a life. The solid line is reality (net worth so far);
 * the dashed continuation — with the hatched area beneath it — is the future
 * the market prices in but that hasn't happened yet (valuation).
 * The curve draws itself once the scene scrolls into view; replayable.
 */
export function ValuationGraph() {
  return (
    <VizScene flush label="Net worth vs. valuation across a life">
      <ValuationGraphInner />
    </VizScene>
  );
}

function ValuationGraphInner() {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setPlaying(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        setPlaying(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const realityPts = REALITY.map(toXY);
  const solid = smoothPath(realityPts);
  const futurePts = FUTURE.map(toXY);
  const dashed = smoothPath(futurePts);

  // Solid-filled area beneath the reality curve (value actually created).
  const [nwX] = realityPts[realityPts.length - 1];
  const realityArea = `${solid} L ${nwX} ${BASE_Y} Z`;

  // Hatched area beneath the future curve, down to the x-axis.
  const [startX, startY] = futurePts[0];
  const [endX] = futurePts[futurePts.length - 1];
  const futureArea = `M ${startX} ${BASE_Y} L ${startX} ${startY}${smoothSegments(
    futurePts,
  )} L ${endX} ${BASE_Y} Z`;

  const netWorthX = ORIGIN_X + NET_WORTH_X * PLOT_W;
  const nwArrowY = 58;
  const valArrowY = 30;

  // Space the hatch lines so they divide the net-worth→valuation span evenly,
  // landing exactly on both flags.
  const hatchStep = (RIGHT_X - netWorthX) / 34;

  return (
    <div
      ref={ref}
      className={`${styles.wrap} ${playing ? styles.playing : ""}`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        role="img"
        aria-label="Value created across a life: a solid curve up to today's net worth, continuing dashed to the valuation at end of life."
      >
        <defs>
          <clipPath id="vg-reveal">
            <rect
              className={styles.revealRect}
              x={ORIGIN_X}
              y={0}
              width={PLOT_W}
              height={H}
            />
          </clipPath>
          <pattern
            id="vg-hatch"
            x={netWorthX}
            width={hatchStep}
            height={8}
            patternUnits="userSpaceOnUse"
          >
            <line x1={0} y1={0} x2={0} y2={8} stroke={HATCH} strokeWidth={1} />
          </pattern>
        </defs>

        {/* Axes */}
        <line
          x1={ORIGIN_X}
          y1={TOP_Y - 6}
          x2={ORIGIN_X}
          y2={BASE_Y}
          stroke={AXIS}
          strokeWidth={1.25}
        />
        <line
          x1={ORIGIN_X}
          y1={BASE_Y}
          x2={RIGHT_X + 4}
          y2={BASE_Y}
          stroke={AXIS}
          strokeWidth={1.25}
        />

        {/* y-axis label */}
        <text
          x={12}
          y={(TOP_Y + BASE_Y) / 2}
          transform={`rotate(-90 12 ${(TOP_Y + BASE_Y) / 2})`}
          textAnchor="middle"
          fontSize={11}
          fontWeight={480}
          fill={LABEL}
          opacity={0.5}
        >
          value created
        </text>

        {/* Flags: net worth (at the woman, 1/3) and valuation (at death) */}
        <Flag x={netWorthX} arrowY={nwArrowY} label="net worth" />
        <Flag x={RIGHT_X} arrowY={valArrowY} label="valuation" />

        {/* Curve + future fill, revealed left-to-right */}
        <g
          clipPath="url(#vg-reveal)"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={futureArea} fill="url(#vg-hatch)" stroke="none" />
          <path d={realityArea} fill={AXIS} stroke="none" />
          <path d={solid} stroke={CURVE} strokeWidth={1.75} />
          <path
            d={dashed}
            stroke={CURVE}
            strokeWidth={1.5}
            strokeDasharray="4 5"
          />
        </g>

        {/* Life-stage emojis under the x-axis */}
        {EMOJIS.map(({ emoji, xf }) => (
          <text
            key={emoji}
            x={ORIGIN_X + xf * PLOT_W}
            y={BASE_Y + 28}
            textAnchor="middle"
            fontSize={17}
          >
            {emoji}
          </text>
        ))}
      </svg>
    </div>
  );
}

// A vertical marker with a label whose arrow reaches back to the y-axis.
function Flag({
  x,
  arrowY,
  label,
}: {
  x: number;
  arrowY: number;
  label: string;
}) {
  return (
    <g>
      {/* vertical marker down to the x-axis */}
      <line x1={x} y1={arrowY} x2={x} y2={BASE_Y} stroke={AXIS} strokeWidth={1.25} />
      {/* horizontal arrow back to the y-axis */}
      <line
        x1={x}
        y1={arrowY}
        x2={ORIGIN_X}
        y2={arrowY}
        stroke={AXIS}
        strokeWidth={1.25}
      />
      <path
        d={`M ${ORIGIN_X + 6} ${arrowY - 4} L ${ORIGIN_X} ${arrowY} L ${ORIGIN_X + 6} ${arrowY + 4}`}
        fill="none"
        stroke={AXIS}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* label sits at the flag, above the arrow */}
      <text
        x={x}
        y={arrowY - 8}
        textAnchor="end"
        fontSize={11}
        fontWeight={480}
        fill={LABEL}
        opacity={0.5}
      >
        {label}
      </text>
    </g>
  );
}
