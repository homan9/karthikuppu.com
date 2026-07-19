"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { getSceneComponent } from "@/remotion/registry";
import type { SceneMeta } from "@/remotion/scenes.meta";
import styles from "./VideoInspector.module.css";

/**
 * The craft surface for a scene: a Player with full playback + single-frame
 * stepping + a scrubber + a frame counter, and an inline export-to-MP4 button.
 * Used at /videos/<id>. This is where you confirm every frame is right and that
 * frame 0 lines up with the final frame for a seamless loop.
 *
 * The video is exported on a SOLID background (X renders transparency as black),
 * while the preview here shows that same solid background so what you inspect is
 * what you export.
 */
export function VideoInspector({ meta }: { meta: SceneMeta }) {
  const component = getSceneComponent(meta.id);
  const playerRef = useRef<PlayerRef>(null);

  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const last = meta.durationInFrames - 1;
  // Solid background so the inspector matches the exported video exactly.
  const exportBg = "#f5f5f2";
  const inputProps = { ...meta.defaultProps, background: exportBg };

  // Mirror the player's frame + play state into React so the UI can display them.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onFrame = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    return () => {
      player.removeEventListener("frameupdate", onFrame);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
    };
  }, []);

  const seek = useCallback((f: number) => {
    const clamped = Math.max(0, Math.min(last, f));
    playerRef.current?.pause();
    playerRef.current?.seekTo(clamped);
  }, [last]);

  const stepBy = useCallback((delta: number) => seek(frame + delta), [frame, seek]);

  // Arrow keys step frames; space toggles playback — the expected craft shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); stepBy(e.shiftKey ? 10 : 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); stepBy(e.shiftKey ? -10 : -1); }
      else if (e.key === " ") { e.preventDefault(); playerRef.current?.toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepBy]);

  const onExport = useCallback(async () => {
    setExporting(true);
    setError(null);
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: meta.id, inputProps }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${meta.id}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.id]);

  const seconds = (frame / meta.fps).toFixed(2);
  const totalSeconds = (meta.durationInFrames / meta.fps).toFixed(2);

  return (
    <div className={styles.wrap}>
      <div className={styles.stage} style={{ aspectRatio: `${meta.width} / ${meta.height}` }}>
        <Player
          ref={playerRef}
          component={component}
          durationInFrames={meta.durationInFrames}
          fps={meta.fps}
          compositionWidth={meta.width}
          compositionHeight={meta.height}
          inputProps={inputProps}
          acknowledgeRemotionLicense
          loop
          controls={false}
          clickToPlay={false}
          spaceKeyToPlayOrPause={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Scrubber */}
      <input
        type="range"
        min={0}
        max={last}
        value={frame}
        onChange={(e) => seek(Number(e.target.value))}
        className={styles.scrubber}
        aria-label="Timeline"
      />

      <div className={styles.controls}>
        <div className={styles.transport}>
          <button type="button" onClick={() => seek(0)} title="First frame">⏮</button>
          <button type="button" onClick={() => stepBy(-1)} title="Previous frame (←)">◀</button>
          <button type="button" onClick={() => playerRef.current?.toggle()} title="Play / pause (space)">
            {playing ? "❚❚" : "▶"}
          </button>
          <button type="button" onClick={() => stepBy(1)} title="Next frame (→)">▶</button>
          <button type="button" onClick={() => seek(last)} title="Last frame">⏭</button>
        </div>

        <div className={styles.counter}>
          <span className={styles.frameNum}>frame {frame} / {last}</span>
          <span className={styles.time}>{seconds}s / {totalSeconds}s · {meta.fps}fps · {meta.width}×{meta.height}</span>
        </div>

        <button type="button" onClick={onExport} disabled={exporting} className={styles.export}>
          {exporting ? "Rendering…" : "Export MP4"}
        </button>
      </div>

      <p className={styles.hint}>
        ← / → step one frame (hold shift for 10). To check the loop, compare
        frame 0 with frame {last} — they should differ by exactly one step of motion.
      </p>

      {error && <pre className={styles.error}>{error}</pre>}
    </div>
  );
}
