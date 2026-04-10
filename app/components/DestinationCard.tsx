'use client';

import { useState, useEffect } from 'react';

interface Destination {
  city: string;
  country: string;
  dates: string;
  status: string;
  description: string;
  emoji: string;
  link?: string;
  image?: string;
}

interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
}

const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|avif|svg|bmp)(\?|$)/i;
const VIDEO_EXTS = /\.(mp4|webm|mov|ogg)(\?|$)/i;

function getMediaType(url: string): 'image' | 'video' | 'web' {
  if (IMAGE_EXTS.test(url)) return 'image';
  if (VIDEO_EXTS.test(url)) return 'video';
  return 'web';
}

function CardBackground({ media }: { media: string }) {
  const type = getMediaType(media);
  const [ogImage, setOgImage] = useState<string | null>(null);

  useEffect(() => {
    if (type !== 'web') return;
    fetch(`/api/fetch-meta?url=${encodeURIComponent(media)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.image) setOgImage(data.image);
      })
      .catch(() => {});
  }, [media, type]);

  if (type === 'video') {
    return (
      <>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={media}
        />
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />
      </>
    );
  }

  if (type === 'image') {
    return (
      <>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${media})` }} />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      </>
    );
  }

  // Web URL → fetched OG image
  if (ogImage) {
    return (
      <>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ogImage})` }} />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      </>
    );
  }

  return null;
}

export default function DestinationCard({ dest, style }: { dest: Destination; style: StatusStyle }) {
  const bookParams = new URLSearchParams();
  if (dest.city !== 'YOUR CITY?') bookParams.set('city', dest.city);
  if (dest.dates) bookParams.set('dates', dest.dates);
  const bookUrl = `https://book.onlymatt.ca${bookParams.toString() ? `?${bookParams}` : ''}`;

  const hasMedia = !!dest.image;
  const cardClass = `relative block border ${style.border} rounded-xl p-5 backdrop-blur-sm overflow-hidden transition-all duration-300 ${hasMedia ? '' : 'bg-white/[0.02] hover:bg-white/[0.05]'}`;

  return (
    <div className={cardClass}>
      {hasMedia && <CardBackground media={dest.image!} />}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{dest.emoji}</span>
            <div>
              <h3 className="font-semibold tracking-wider text-slate-100" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                {dest.city}
              </h3>
              <p className="text-slate-500 text-xs tracking-wider uppercase">{dest.country} — {dest.dates}</p>
            </div>
          </div>
          <span className={`${style.bg} ${style.text} text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-full border ${style.border}`}>
            {style.label}
          </span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed pl-10">
          {dest.description}
        </p>
        <div className="flex items-center gap-3 mt-3 pl-10">
          {dest.link && (
            <a href={dest.link} target="_blank" rel="noopener noreferrer" className="text-emerald-400/60 text-xs tracking-wider hover:text-emerald-300 transition-colors">
              View event →
            </a>
          )}
          <a
            href={bookUrl}
            className="ml-auto bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full hover:bg-emerald-500/30 hover:scale-105 transition-all"
          >
            BOOK ME
          </a>
        </div>
      </div>
    </div>
  );
}
