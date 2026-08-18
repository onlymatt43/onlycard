"use client";

import React, { useState, useRef, useCallback } from "react";

interface BackgroundVideoProps {
  src: string;
  className?: string;
  /** Tailwind classes for the fixed overlay above the video. Defaults to the light theme veil. */
  overlayClassName?: string;
}

export default function BackgroundVideo({ src, className, overlayClassName }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = soundOn;
    if (!soundOn) {
      v.play().catch(() => {
        /* ignore play errors */
      });
    }
    setSoundOn(!soundOn);
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
          style={{
            WebkitTransform: 'translateZ(0)',
          }}
          tabIndex={-1}
          aria-hidden="true"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      {/* Overlay: above the video (z-[1]), below all content */}
      <div className={`fixed inset-0 z-[1] pointer-events-none ${overlayClassName ?? 'bg-white/45'}`} />
      {/* Sound toggle — browsers only allow audio after a user gesture */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={soundOn ? 'Mute' : 'Unmute'}
        className="fixed top-4 right-4 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-black/80 text-white text-sm hover:bg-black transition-colors"
      >
        {soundOn ? '🔊' : '🔇'}
      </button>
    </>
  );
}
