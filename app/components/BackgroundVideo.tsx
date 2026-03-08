"use client";

import React from "react";

interface BackgroundVideoProps {
  src: string;
  className?: string;
}

export default function BackgroundVideo({ src, className }: BackgroundVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

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
    <video
      ref={videoRef}
      src={src}
      preload="auto"
      className={`fixed top-0 left-0 w-screen object-contain bg-black z-0 pointer-events-none select-none ${className ?? ''}`}
      autoPlay
      muted
      loop
      playsInline
      onEnded={handleEnded}
      style={{
        width: '100vw',
        height: 'auto',
        maxHeight: '100vh',
        WebkitTransform: 'translateZ(0)',
      }}
      tabIndex={-1}
      aria-hidden="true"
    >
      Your browser does not support the video tag.
    </video>
  );
}
