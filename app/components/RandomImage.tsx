'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface RandomImageProps {
  fallbackSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function RandomImage({
  fallbackSrc = 'https://onlymatt-public-zone.b-cdn.net/card/solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.JPEG',
  alt,
  className = '',
  sizes = '112px',
  priority = false,
}: RandomImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch une image aléatoire au chargement
    fetch('/api/random-image')
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setImageSrc(data.url);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch random image:', error);
        // Garde l'image fallback en cas d'erreur
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="relative w-28 h-28 rounded-full overflow-hidden border border-zinc-800 shadow-2xl shadow-zinc-900/50">
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover ${className}`}
        priority={priority}
        onError={() => {
          // En cas d'erreur de chargement, retombe sur le fallback
          setImageSrc(fallbackSrc);
        }}
      />
    </div>
  );
}
