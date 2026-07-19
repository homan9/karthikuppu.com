"use client";

import { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { getSceneComponent } from "@/remotion/registry";
import { getSceneMeta } from "@/remotion/scenes.meta";

type SceneEmbedProps = {
  /** Scene id, as registered in scenes.meta.ts. */
  id: string;
  /** Max display width in px; defaults to the scene's embedMaxWidth. */
  maxWidth?: number;
  /**
   * Loop continuously (true) or play once and hold the final frame (false).
   * Defaults to the scene's `loops` metadata.
   */
  loop?: boolean;
  /** Override any of the scene's default props. */
  inputProps?: Record<string, unknown>;
};

/**
 * Mounts a Remotion scene as a *chromeless* animation for embedding in an essay.
 * Every interactive affordance is off, so it reads like the old inline SVG
 * visualizations — no controls, no cursor change, no click-to-pause.
 *
 * Playback is gated on the viewport: nothing runs until the scene scrolls into
 * view. Looping scenes then loop (and pause when scrolled away); one-shot scenes
 * play exactly once and hold their final frame. One-shot scenes are meant to sit
 * inside a <VizScene> whose replay button remounts this component to replay —
 * remounting resets the "already played" latch and starts from frame 0.
 */
export function SceneEmbed({ id, maxWidth, loop, inputProps }: SceneEmbedProps) {
  const meta = getSceneMeta(id);
  if (!meta) throw new Error(`Unknown scene id: ${id}`);
  const component = getSceneComponent(id);
  const shouldLoop = loop ?? meta.loops;

  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  // Play when the scene enters the viewport. Looping scenes resume/pause as they
  // scroll in and out; one-shot scenes fire a single time.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const player = playerRef.current;
        if (!player) return;
        if (entry.isIntersecting) {
          if (shouldLoop) player.play();
          else if (!hasStartedRef.current) {
            hasStartedRef.current = true;
            player.play();
          }
        } else if (shouldLoop) {
          player.pause();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoop]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: maxWidth ?? meta.embedMaxWidth,
        margin: "0 auto",
        // Reserve the composition's aspect ratio so the Player (whose internals
        // are absolutely positioned) has a real box to fill instead of
        // collapsing to zero height.
        aspectRatio: `${meta.width} / ${meta.height}`,
      }}
    >
      <Player
        ref={playerRef}
        component={component}
        durationInFrames={meta.durationInFrames}
        fps={meta.fps}
        compositionWidth={meta.width}
        compositionHeight={meta.height}
        // Transparent by default so the composition sits on the essay panel bg.
        inputProps={{ ...meta.defaultProps, background: "transparent", ...inputProps }}
        acknowledgeRemotionLicense
        // Playback is driven by the IntersectionObserver above, not autoPlay.
        // Muted so programmatic play() is allowed without a user gesture.
        initiallyMuted
        loop={shouldLoop}
        // One-shot scenes hold their final frame instead of snapping to the start.
        moveToBeginningWhenEnded={shouldLoop}
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
