"use client";

import React, { useEffect, useRef } from "react";

interface BackgroundVideoProps {
  src: string;
  className?: string;
}

const SLOW_DURATION_SECONDS = 2; // durée du ralenti au début et à la fin
const SLOW_PLAYBACK_RATE = 0.6;
const NORMAL_PLAYBACK_RATE = 1;

export default function BackgroundVideo({ src, className }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Assurer un démarrage fluide
    video.playbackRate = SLOW_PLAYBACK_RATE;

    const handleTimeUpdate = () => {
      const duration = video.duration;
      if (!isFinite(duration) || duration === 0) return;

      const currentTime = video.currentTime;
      const isAtBeginning = currentTime <= SLOW_DURATION_SECONDS;
      const isAtEnd = currentTime >= duration - SLOW_DURATION_SECONDS;

      if (isAtBeginning || isAtEnd) {
        if (video.playbackRate !== SLOW_PLAYBACK_RATE) {
          video.playbackRate = SLOW_PLAYBACK_RATE;
        }
      } else {
        if (video.playbackRate !== NORMAL_PLAYBACK_RATE) {
          video.playbackRate = NORMAL_PLAYBACK_RATE;
        }
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
    >
      Your browser does not support the video tag.
    </video>
  );
}
