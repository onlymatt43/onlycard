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
  );
}
