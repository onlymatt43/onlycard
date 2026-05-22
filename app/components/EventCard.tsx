'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Participant {
  username: string;
  name: string;
  image: string;
}

interface Event {
  id: string;
  url?: string;
  title: string;
  description?: string;
  emoji?: string;
  date: string;
  endDate?: string;
  location: string;
  tags: string[];
  whatsapp?: string;
  telegram?: string;
  image?: string;
  status: 'confirmed' | 'past' | 'open';
  participants?: Participant[];
}

interface EventCardProps {
  event: Event;
  showJoinButton?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  open: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  past: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

function formatDate(d: string) {
  if (!d) return '';
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch { return d; }
}

export default function EventCard({ event, showJoinButton = true }: EventCardProps) {
  const { data: session } = useSession();
  const user = session?.user as { username?: string; image?: string } | undefined;
  const username = user?.username || '';

  const [ogImage, setOgImage] = useState<string | null>(null);
  const [attending, setAttending] = useState(
    !!username && !!event.participants?.some(
      p => p.username?.toLowerCase() === username.toLowerCase()
    )
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!event.url) return;
    fetch(`/api/fetch-meta?url=${encodeURIComponent(event.url)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.image) setOgImage(data.image); })
      .catch(() => {});
  }, [event.url]);

  const handleAttend = async () => {
    if (!username) {
      window.location.href = `https://me.onlymatt.ca/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`;
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          twitterUsername: username,
          twitterImage: user?.image || '',
          collabWith: event.id,
          city: event.location,
          dates: dateDisplay,
        }),
      });
      setAttending(true);
    } catch { /* silent */ }
    setLoading(false);
  };

  const displayImage = ogImage || event.image || null;
  const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.confirmed;
  const dateDisplay = event.endDate
    ? `${formatDate(event.date)} → ${formatDate(event.endDate)}`
    : formatDate(event.date);

  return (
    <div className="relative border border-cyan-500/20 rounded-2xl p-5 bg-white/[0.02] backdrop-blur-sm hover:border-cyan-500/40 transition-all group">
      {/* Status badge */}
      <span className={`absolute top-4 right-4 text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full border ${statusStyle}`}>
        {event.status}
      </span>

      {/* Header */}
      <div className="flex items-start gap-3 mb-3 pr-20">
        {displayImage ? (
          <img
            src={displayImage}
            alt={event.title}
            className="w-12 h-12 rounded-xl object-cover border border-cyan-400/20 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl border border-cyan-400/20 bg-cyan-500/[0.08] flex items-center justify-center text-2xl flex-shrink-0">
            {event.emoji || '📅'}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-slate-100 font-medium text-sm tracking-wide leading-tight">{event.title}</h3>
          <p className="text-cyan-300/60 text-[11px] mt-0.5">📍 {event.location}</p>
          <p className="text-slate-500 text-[11px]">📅 {dateDisplay}</p>
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-slate-400 text-xs leading-relaxed mb-3">{event.description}</p>
      )}

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {event.tags.map(tag => (
            <span
              key={tag}
              className="text-[9px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400/70 px-2 py-0.5 rounded-full uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Participants */}
      {event.participants && event.participants.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {event.participants.slice(0, 6).map((p, i) => (
              p.image ? (
                <img
                  key={i}
                  src={p.image}
                  alt={p.name}
                  title={`@${p.username}`}
                  className="w-6 h-6 rounded-full border-2 border-black object-cover"
                />
              ) : (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-black bg-slate-700 flex items-center justify-center text-[8px] text-slate-300"
                  title={`@${p.username}`}
                >
                  {p.username?.[0]?.toUpperCase()}
                </div>
              )
            ))}
          </div>
          <span className="text-slate-500 text-[11px]">
            {event.participants.length} going
          </span>
        </div>
      )}

      {/* Footer: I'll Be There + group links */}
      <div className="flex items-center gap-2 flex-wrap">
        {showJoinButton && event.status !== 'past' && (
          attending ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs tracking-wider">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              I&apos;ll Be There
            </span>
          ) : (
            <button
              onClick={handleAttend}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 text-xs tracking-wider transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="w-3 h-3 border border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin inline-block" />
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              )}
              I&apos;ll Be There
            </button>
          )
        )}

        {event.whatsapp && (
          <a
            href={event.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-emerald-300/50 hover:text-emerald-300 transition-colors border border-emerald-500/20 hover:border-emerald-500/40 px-2.5 py-1 rounded-full"
          >
            💬 WhatsApp
          </a>
        )}
        {event.telegram && (
          <a
            href={event.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-cyan-300/50 hover:text-cyan-300 transition-colors border border-cyan-500/20 hover:border-cyan-500/40 px-2.5 py-1 rounded-full"
          >
            ✈️ Telegram
          </a>
        )}
      </div>
    </div>
  );
}
