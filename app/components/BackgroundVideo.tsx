"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface BackgroundVideoProps {
  src: string;
  className?: string;
}

export default function BackgroundVideo({ src, className }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const handleReady = useCallback(() => {
    setOverlayVisible(true);
  }, []);

  // Fallback: show overlay after 1200 ms even if video never fires ready events
  // (e.g. autoplay blocked on mobile, slow network)
  useEffect(() => {
    const t = setTimeout(handleReady, 1200);
    return () => clearTimeout(t);
  }, [handleReady]);

  // handler to restart immediately when loop event fires to avoid gap
  const handleEnded = () => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {
        /* ignore */
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black z-0 pointer-events-none select-none">
        <div className="w-[100vmin] h-[100vmin]">
          <video
            ref={videoRef}
            src={src}
            preload="auto"
            className={`w-full h-full object-contain ${className ?? ''}`}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={handleReady}
            onCanPlay={handleReady}
            onEnded={handleEnded}
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
        className="fixed inset-0 z-[1] pointer-events-none bg-white/70 transition-opacity duration-700"
        style={{ opacity: overlayVisible ? 1 : 0 }}
      />
    </>
  );
}
