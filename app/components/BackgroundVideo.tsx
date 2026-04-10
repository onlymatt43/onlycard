"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface BackgroundVideoProps {
  src: string;
  className?: string;
}

export default function BackgroundVideo({ src, className }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const handleReady = useCallback(() => {
    setOverlayVisible(true);
    setIsVideoReady(true);
  }, []);

  // Fallback: show overlay after 1200 ms even if video never fires ready events
  // (e.g. autoplay blocked on mobile, slow network)
  useEffect(() => {
    const t = setTimeout(handleReady, 1200);
    return () => clearTimeout(t);
  }, [handleReady]);

  useEffect(() => {
    if (!isVideoReady) return;
    const v = videoRef.current;
    if (!v) return;

    let rafId: number | null = null;
    let slowdownTimer: ReturnType<typeof setTimeout> | null = null;

    // Start playback 5 seconds after the video is shown.
    const startTimer = setTimeout(() => {
      v.playbackRate = 1;
      v.play().catch(() => {
        /* ignore autoplay errors */
      });

      // Apply a long progressive slow motion after normal playback starts.
      slowdownTimer = setTimeout(() => {
        const startTime = performance.now();
        const startRate = 1;
        const endRate = 0.35;
        const durationMs = 18000;

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / durationMs, 1);
          const eased = easeOutCubic(progress);
          v.playbackRate = startRate - (startRate - endRate) * eased;

          if (progress < 1 && !v.ended && !v.paused) {
            rafId = requestAnimationFrame(tick);
          }
        };

        rafId = requestAnimationFrame(tick);
      }, 3000);
    }, 5000);

    return () => {
      clearTimeout(startTimer);
      if (slowdownTimer) clearTimeout(slowdownTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVideoReady]);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black z-0 pointer-events-none select-none">
        <div className="w-[100vmin] h-[100vmin]">
          <video
            ref={videoRef}
            src={src}
            preload="auto"
            className={`w-full h-full object-contain ${className ?? ''}`}
            muted
            playsInline
            onLoadedData={handleReady}
            onCanPlay={handleReady}
            style={{
              WebkitTransform: 'translateZ(0)',
            }}
            tabIndex={-1}
            aria-hidden="true"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      {/* Overlay: sits above video (z-[1]) but below all content (z-20).
          Starts transparent so the video is the first thing seen,
          then fades in once the video is ready to play. */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none bg-white/45 transition-opacity duration-700"
        style={{ opacity: overlayVisible ? 1 : 0 }}
      />
    </>
  );
}
