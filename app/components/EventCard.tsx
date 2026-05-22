'use client';

interface Participant {
  username: string;
  name: string;
  image: string;
}

interface Event {
  id: string;
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
  status: 'upcoming' | 'confirmed' | 'past' | 'open';
  participants?: Participant[];
}

interface EventCardProps {
  event: Event;
  showJoinButton?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  upcoming: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
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
  const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.upcoming;
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
        {event.image ? (
          <img
            src={event.image}
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
            {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Action buttons */}
      {showJoinButton && event.status !== 'past' && (
        <a
          href={`https://book.onlymatt.ca?with=${event.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 text-xs tracking-[0.12em] uppercase transition-all"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Rejoindre
        </a>
      )}

      {/* Group links */}
      {(event.whatsapp || event.telegram) && (
        <div className="flex gap-2 mt-2">
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
      )}
    </div>
  );
}
