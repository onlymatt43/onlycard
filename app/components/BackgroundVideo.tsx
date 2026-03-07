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
      className={`w-full h-full object-cover ${className ?? ''}`}
      autoPlay
      muted
      loop
      playsInline
      style={{
        // Pour mobile: forcer le scaling paysage
        aspectRatio: '16/9',
        maxWidth: '100vw',
        maxHeight: '100vh',
        objectFit: 'cover',
        // Pour iOS Safari: éviter le zoom
        WebkitTransform: 'translateZ(0)',
      }}
    >
      Your browser does not support the video tag.
    </video>
  );
}
