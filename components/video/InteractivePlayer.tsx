"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import CheckpointOverlay from "./CheckpointOverlay";
import type { VideoCheckpoint } from "@/lib/mock-data";

interface Props {
  videoSrc?: string;
  vimeoId?: string;
  lessonId: string;
  checkpoints: VideoCheckpoint[];
}

export default function InteractivePlayer({ videoSrc, vimeoId, lessonId, checkpoints }: Props) {
  const videoRef            = useRef<HTMLVideoElement>(null);
  const vimeoContainerRef   = useRef<HTMLDivElement>(null);
  const playerWrapperRef    = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vimeoPlayerRef      = useRef<any>(null);
  const answeredRef         = useRef<Set<string>>(new Set());
  const activeCheckpointRef = useRef<VideoCheckpoint | null>(null);

  const [activeCheckpoint, setActiveCheckpoint]       = useState<VideoCheckpoint | null>(null);
  const [answeredCheckpoints, setAnsweredCheckpoints] = useState<Map<string, { selected: number; isCorrect: boolean }>>(new Map());
  const [isFullscreen, setIsFullscreen]               = useState(false);

  const lessonCheckpoints = checkpoints.filter((cp) => cp.lessonId === lessonId);

  const findTriggered = useCallback(
    (currentSeconds: number): VideoCheckpoint | undefined =>
      lessonCheckpoints.find(
        (cp) =>
          !answeredRef.current.has(cp.id) &&
          currentSeconds >= cp.timestampSeconds &&
          currentSeconds < cp.timestampSeconds + 2
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lessonId]
  );

  // ── Fullscreen toggle ─────────────────────────────────────────────────────
  function toggleFullscreen() {
    const el = playerWrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

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
        width: vimeoContainerRef.current.clientWidth,
        height: vimeoContainerRef.current.clientHeight,
        responsive: false,
        dnt: true,
      });
      vimeoPlayerRef.current = player;
      player.on("timeupdate", (data: Record<string, unknown>) => {
        const seconds = data.seconds as number;
        if (activeCheckpointRef.current) return;
        const triggered = findTriggered(seconds);
        if (triggered) {
          activeCheckpointRef.current = triggered;
          player.pause();
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

  // ── Checkpoint answer ─────────────────────────────────────────────────────
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
  const answeredCount    = answeredCheckpoints.size;
  const correctCount     = [...answeredCheckpoints.values()].filter((a) => a.isCorrect).length;

  return (
    <div className="space-y-3">
      {/* Player wrapper — fullscreen target */}
      <div
        ref={playerWrapperRef}
        className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/8 group"
      >
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
            <div ref={vimeoContainerRef} className="vimeo-container absolute inset-0 w-full h-full" />
          )}

          {/* Checkpoint overlay */}
          {activeCheckpoint && (
            <CheckpointOverlay
              checkpoint={activeCheckpoint}
              onContinue={handleContinue}
            />
          )}

          {/* Fullscreen button — shown on hover when no checkpoint active */}
          {!activeCheckpoint && (
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-lg bg-black/60 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              {isFullscreen ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
                </svg>
              )}
            </button>
          )}
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
