"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface BackgroundVideoProps {
  src: string;
  className?: string;
  /** Tailwind classes for the fixed overlay above the video. Defaults to the light theme veil. */
  overlayClassName?: string;
}

export default function BackgroundVideo({ src, className, overlayClassName }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

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

  // Ambient progressive slow motion while muted. Disabled as soon as sound is on,
  // so beat-synced videos play at real speed with their audio.
  useEffect(() => {
    if (!isVideoReady || soundOn) return;
    const v = videoRef.current;
    if (!v) return;

    const slowdownTimer = setTimeout(() => {
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

        if (progress < 1 && !v.paused) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }, 3000);

    return () => {
      clearTimeout(slowdownTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVideoReady, soundOn]);

  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (soundOn) {
      v.muted = true;
      setSoundOn(false);
    } else {
      // Sound on: stop the ambient slow motion and play at real speed
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      v.playbackRate = 1;
      v.muted = false;
      v.play().catch(() => {
        /* ignore play errors */
      });
      setSoundOn(true);
    }
  }, [soundOn]);

  return (
    <>
      <div className="fixed inset-0 bg-black z-0 pointer-events-none select-none">
        <video
          ref={videoRef}
          src={src}
          preload="auto"
          className={`w-full h-full object-cover ${className ?? ''}`}
          autoPlay
          loop
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
      {/* Overlay: sits above video (z-[1]) but below all content (z-20).
          Starts transparent so the video is the first thing seen,
          then fades in once the video is ready to play. */}
      <div
        className={`fixed inset-0 z-[1] pointer-events-none transition-opacity duration-700 ${overlayClassName ?? 'bg-white/45'}`}
        style={{ opacity: overlayVisible ? 1 : 0 }}
      />
      {/* Sound toggle — browsers only allow audio after a user gesture */}
      <button
        type="button"
        onClick={toggleSound}
        className="fixed bottom-5 right-5 z-20 rounded-full border border-white/30 bg-black/60 backdrop-blur-sm px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-black/80 hover:scale-105 transition-all"
      >
        {soundOn ? '🔇 Mute' : '🔊 Sound on'}
      </button>
    </>
  );
}
