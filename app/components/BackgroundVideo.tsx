"use client";

import React from "react";

interface BackgroundVideoProps {
  src: string;
  className?: string;
}

export default function BackgroundVideo({ src, className }: BackgroundVideoProps) {
  return (
    <video
      src={src}
      className={`fixed top-0 left-0 w-screen h-screen object-cover z-0 pointer-events-none select-none ${className ?? ''}`}
      autoPlay
      muted
      loop
      playsInline
      style={{
        objectFit: 'cover',
        minWidth: '100vw',
        minHeight: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        aspectRatio: '16/9',
        WebkitTransform: 'translateZ(0)',
      }}
      tabIndex={-1}
      aria-hidden="true"
    >
      Your browser does not support the video tag.
    </video>
  );
}
