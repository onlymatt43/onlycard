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

interface Booking {
  id: string;
  twitterUsername: string;
  twitterImage: string;
  twitterUrl: string;
  name: string;
  type: string;
  city: string;
  dates: string;
  message: string;
  createdAt: string;
}

interface Creator {
  username: string;
  name: string;
  image: string;
  bio: string;
  claimed: boolean;
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

export default function DestinationCard({ dest, style, bookings = [], creators = [], highlightBooking }: { dest: Destination; style: StatusStyle; bookings?: Booking[]; creators?: Creator[]; highlightBooking?: string | null }) {
  const bookParams = new URLSearchParams();
  if (dest.city !== 'YOUR CITY?') bookParams.set('city', dest.city);
  if (dest.country) bookParams.set('country', dest.country);
  if (dest.dates) bookParams.set('event', dest.dates);
  // Pass startDate/endDate if present in dest
  const d = dest as Destination & { startDate?: string; endDate?: string };
  if (d.startDate) bookParams.set('dateFrom', d.startDate);
  if (d.endDate) bookParams.set('dateTo', d.endDate);
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
        {/* Booked users avatars */}
        {bookings.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pl-10 flex-wrap">
            <span className="text-slate-600 text-[10px] tracking-wider uppercase mr-1">Booked:</span>
            {bookings.map((b) => {
              const isHighlighted = highlightBooking === b.id;
              const creator = creators.find(c => c.username.toLowerCase() === b.twitterUsername.toLowerCase());
              const profileUrl = creator ? `/creator/${creator.username}` : b.twitterUrl;
              return (
                <a
                  key={b.id}
                  href={profileUrl}
                  target={creator ? undefined : '_blank'}
                  rel={creator ? undefined : 'noopener noreferrer'}
                  title={`@${b.twitterUsername} — ${b.type}${creator?.claimed ? ' ✓' : ''}`}
                  className={`group relative transition-all ${isHighlighted ? 'scale-110' : 'hover:scale-110'}`}
                >
                  <img
                    src={b.twitterImage || creator?.image || `https://unavatar.io/twitter/${b.twitterUsername}`}
                    alt={`@${b.twitterUsername}`}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      isHighlighted
                        ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                        : creator?.claimed
                        ? 'border-emerald-400/40 group-hover:border-emerald-400'
                        : 'border-slate-700/60 group-hover:border-emerald-400/60'
                    }`}
                  />
                  {creator?.claimed && (
                    <span className="absolute -top-1 -right-1 text-[7px] bg-emerald-500 text-white rounded-full w-3 h-3 flex items-center justify-center">✓</span>
                  )}
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-emerald-300/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    @{b.twitterUsername}
                  </span>
                </a>
              );
            })}
          </div>
        )}
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
