import Link from "next/link";
import type { Metadata } from "next";
import { scenesMeta } from "@/remotion/scenes.meta";

export const metadata: Metadata = {
  title: "Videos",
  robots: { index: false },
};

// Index of every scene. Each links to its frame-by-frame inspector + exporter.
export default function VideosIndexPage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 1.25rem" }}>
      <h1 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>Videos</h1>
      <p style={{ color: "var(--caption)", marginBottom: "2rem" }}>
        Each scene is a frame-driven Remotion composition — the same source that
        renders in the essays. Open one to inspect it frame by frame and export
        an MP4 for X.
      </p>
      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {scenesMeta.map((s) => (
          <li key={s.id}>
            <Link
              href={`/videos/${s.id}`}
              style={{ display: "flex", justifyContent: "space-between", padding: "0.85rem 1rem", border: "1px solid #e6e6e0", borderRadius: 12 }}
            >
              <span>{s.title}</span>
              <span style={{ color: "var(--caption)", fontVariantNumeric: "tabular-nums" }}>
                {s.width}×{s.height} · {(s.durationInFrames / s.fps).toFixed(0)}s
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
