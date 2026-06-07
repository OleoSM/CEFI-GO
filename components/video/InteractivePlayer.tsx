"use client";

import { useEffect, useRef, useState } from "react";
import CheckpointOverlay from "./CheckpointOverlay";
import type { VideoCheckpoint } from "@/lib/mock-data";

interface Props {
  /** Local video file path, e.g. "/videos/lesson-1-3.mp4". Used during dev. */
  videoSrc?: string;
  /** Vimeo numeric ID. Used in production once admin uploads to Vimeo. */
  vimeoId?: string;
  lessonId: string;
  /** All checkpoints — component filters to those matching lessonId. */
  checkpoints: VideoCheckpoint[];
}

export default function InteractivePlayer({ videoSrc, vimeoId, lessonId, checkpoints }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const vimeoContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vimeoPlayerRef = useRef<any>(null);
  const answeredRef = useRef<Set<string>>(new Set());
  const activeCheckpointRef = useRef<VideoCheckpoint | null>(null);

  const [activeCheckpoint, setActiveCheckpoint] = useState<VideoCheckpoint | null>(null);
  const [answeredCheckpoints, setAnsweredCheckpoints] = useState<
    Map<string, { selected: number; isCorrect: boolean }>
  >(new Map());

  const lessonCheckpoints = checkpoints.filter((cp) => cp.lessonId === lessonId);

  function findTriggered(currentSeconds: number): VideoCheckpoint | undefined {
    return lessonCheckpoints.find(
      (cp) =>
        !answeredRef.current.has(cp.id) &&
        currentSeconds >= cp.timestampSeconds &&
        currentSeconds < cp.timestampSeconds + 2
    );
  }

  // ── Local video mode ──────────────────────────────────────────────────────
  function handleTimeUpdate() {
    if (!videoRef.current || activeCheckpointRef.current) return;
    const triggered = findTriggered(videoRef.current.currentTime);
    if (triggered) {
      videoRef.current.pause();
      activeCheckpointRef.current = triggered;
      setActiveCheckpoint(triggered);
    }
  }

  // ── Vimeo mode ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!vimeoId || !vimeoContainerRef.current) return;

    let destroyed = false;

    import("@vimeo/player").then(({ default: VimeoPlayer }) => {
      if (destroyed || !vimeoContainerRef.current) return;

      const player = new VimeoPlayer(vimeoContainerRef.current, {
        id: Number(vimeoId),
        responsive: true,
        dnt: true,
      });

      vimeoPlayerRef.current = player;

      player.on("timeupdate", ({ seconds }: { seconds: number }) => {
        if (activeCheckpointRef.current) return;
        const triggered = findTriggered(seconds);
        if (triggered) {
          player.pause();
          activeCheckpointRef.current = triggered;
          setActiveCheckpoint(triggered);
        }
      });
    });

    return () => {
      destroyed = true;
      vimeoPlayerRef.current?.destroy().catch(() => {});
      vimeoPlayerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vimeoId, lessonId]);

  // ── Checkpoint answer handler ─────────────────────────────────────────────
  function handleContinue(selectedIndex: number, isCorrect: boolean) {
    const cp = activeCheckpointRef.current;
    if (!cp) return;
    answeredRef.current.add(cp.id);
    activeCheckpointRef.current = null;
    setAnsweredCheckpoints((prev) =>
      new Map(prev).set(cp.id, { selected: selectedIndex, isCorrect })
    );
    setActiveCheckpoint(null);

    if (videoRef.current) videoRef.current.play();
    if (vimeoPlayerRef.current) vimeoPlayerRef.current.play();
  }

  const totalCheckpoints = lessonCheckpoints.length;
  const answeredCount = answeredCheckpoints.size;
  const correctCount = [...answeredCheckpoints.values()].filter((a) => a.isCorrect).length;

  return (
    <div className="space-y-3">
      {/* Player wrapper */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-white/8">
        <div style={{ paddingBottom: "56.25%" }} className="relative">

          {/* Local video */}
          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              onTimeUpdate={handleTimeUpdate}
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}

          {/* Vimeo embed container */}
          {vimeoId && (
            <div ref={vimeoContainerRef} className="absolute inset-0 w-full h-full" />
          )}

          {/* Checkpoint overlay — covers both player types */}
          {activeCheckpoint && (
            <CheckpointOverlay
              checkpoint={activeCheckpoint}
              onContinue={handleContinue}
            />
          )}
        </div>
      </div>

      {/* Checkpoint status bar */}
      {totalCheckpoints > 0 && (
        <div className="flex items-center gap-3 text-xs text-white/50">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>
            {answeredCount === 0
              ? `Este video tiene ${totalCheckpoints} pregunta${totalCheckpoints > 1 ? "s" : ""} interactiva${totalCheckpoints > 1 ? "s" : ""}`
              : `${correctCount}/${answeredCount} correcta${correctCount !== 1 ? "s" : ""} · ${totalCheckpoints - answeredCount} restante${totalCheckpoints - answeredCount !== 1 ? "s" : ""}`}
          </span>
          <div className="flex-1 flex gap-1">
            {lessonCheckpoints.map((cp) => {
              const result = answeredCheckpoints.get(cp.id);
              return (
                <div
                  key={cp.id}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    !result ? "bg-white/15" : result.isCorrect ? "bg-emerald-500" : "bg-red-400"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
