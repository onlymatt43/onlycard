'use client';

import { useEffect, useState, useMemo } from 'react';
import eventsData from '../../data/events.json';
import { formatDate } from '../lib/dates';

interface MetaData {
  title: string;
  description: string;
  image: string;
}

const POSITIONS = [
  { side: 'left' as const, top: '20%' },
  { side: 'left' as const, top: '50%' },
  { side: 'left' as const, top: '76%' },
  { side: 'right' as const, top: '30%' },
  { side: 'right' as const, top: '64%' },
  { side: 'right' as const, top: '82%' },
];

const FLOAT_ANIMS = ['floatA', 'floatB', 'floatC', 'floatD', 'floatE', 'floatF'];

// Dedicated slot for the featured event card (kept out of the shuffled pool)
const FEATURED_POSITION: { side: 'left' | 'right'; top: string } = { side: 'right', top: '30%' };

interface EventEntry {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location?: string;
  status: string;
}

// Nearest upcoming confirmed event, or null. ISO string comparison — no timezone lib needed.
function getFeaturedEvent(): EventEntry | null {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (eventsData.events as EventEntry[])
    .filter((e) => e.status === 'confirmed' && (e.endDate ?? e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] ?? null;
}

// Metadata hardcodée pour les plateformes qui bloquent le scraping
const PLATFORM_OVERRIDES: Record<string, MetaData> = {
  'onlyfans.com': {
    title: 'OnlyFans — ONLYMATT',
    description: 'Subscribe to see exclusive content',
    image: 'https://onlymatt-public-zone.b-cdn.net/brand/og/og-B-blurbg-1200x630.jpg',
  },
  'justfor.fans': {
    title: 'JustFor.Fans',
    description: 'Exclusive content from OnlyMatt43',
    image: 'https://justfor.fans/assets/images/og-image.jpg',
  },
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getPlatformOverride(url: string): MetaData | null {
  try {
    const host = new URL(url).hostname.replace('www.', '');
    return PLATFORM_OVERRIDES[host] ?? null;
  } catch {
    return null;
  }
}

function MetaCard({
  url,
  label,
  sublabel,
  featured = false,
  position,
  floatAnim,
  delayS,
}: {
  url: string;
  label?: string;
  sublabel?: string;
  featured?: boolean;
  position: { side: 'left' | 'right'; top: string };
  floatAnim: string;
  delayS: number;
}) {
  const [meta, setMeta] = useState<MetaData | null>(null);

  const fallback = useMemo(() => {
    try {
      const host = new URL(url).hostname.replace('www.', '');
      return { title: host, description: '', image: '' };
    } catch {
      return { title: url, description: '', image: '' };
    }
  }, [url]);

  useEffect(() => {
    // Featured cards keep their custom label but still fetch the page's OG image
    if (label && !featured) return;
    const override = getPlatformOverride(url);
    if (override) {
      setMeta(override);
      return;
    }
    // Internal routes need an absolute URL for the meta fetcher
    const target = url.startsWith('/') ? `${window.location.origin}${url}` : url;
    fetch(`/api/fetch-meta?url=${encodeURIComponent(target)}`)
      .then((r) => r.json())
      .then((d) => { setMeta((d.title || d.image) ? d : fallback); })
      .catch(() => { setMeta(fallback); });
  }, [url, label, featured, fallback]);

  const display = meta ?? fallback;

  const sideStyle = position.side === 'left' ? { left: '1.5%' } : { right: '1.5%' };

  return (
    <div
      className="absolute z-10"
      style={{
        top: position.top,
        ...sideStyle,
        transform: 'translateY(-50%)',
        opacity: 1,
        width: featured ? 'clamp(8rem, 28vmin, 19rem)' : 'clamp(5.25rem, 18vmin, 13rem)',
      }}
    >
      <div
        style={{ animation: `${floatAnim} 6s ease-in-out infinite` }}
        className="cursor-pointer pointer-events-auto"
        onClick={() => {
          // Internal routes navigate in the same tab; external links open a new one
          if (url.startsWith('/')) window.location.assign(url);
          else window.open(url, '_blank');
        }}
      >
        <div
          className={
            featured
              ? 'bg-emerald-950/90 backdrop-blur-sm border-2 border-emerald-400/60 rounded-xl shadow-lg shadow-emerald-400/20 overflow-hidden hover:shadow-xl hover:scale-105 hover:brightness-110 transition-all duration-300'
              : 'bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 hover:brightness-110 transition-all duration-300'
          }
        >
          {display.image && (
            <div
              className="w-full overflow-hidden"
              style={{ height: 'clamp(2.75rem, 8vmin, 6rem)' }}
            >
              <img
                src={display.image}
                alt={display.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div style={{ padding: 'clamp(0.4rem, 1vmin, 0.75rem)' }}>
            {label ? (
              <>
                <h3
                  className={featured ? 'font-bold leading-tight text-emerald-100 uppercase' : 'font-bold leading-tight'}
                  style={featured
                    ? { fontSize: 'clamp(0.62rem, 1.6vmin, 1.05rem)' }
                    : { color: '#ff2d78', fontSize: 'clamp(0.52rem, 1.35vmin, 0.9rem)' }}
                >
                  {label}
                </h3>
                {sublabel && (
                  <p
                    className="text-slate-300 mt-1 leading-tight"
                    style={{ fontSize: 'clamp(0.5rem, 1.15vmin, 0.75rem)', letterSpacing: '0.08em' }}
                  >
                    {sublabel}
                  </p>
                )}
              </>
            ) : (
              <>
                <h3
                  className="font-semibold text-slate-800 line-clamp-2 leading-tight"
                  style={{ fontSize: 'clamp(0.5rem, 1.2vmin, 0.75rem)' }}
                >
                  {display.title}
                </h3>
                {display.description && (
                  <p
                    className="text-slate-500 mt-1 line-clamp-2 leading-tight"
                    style={{ fontSize: 'clamp(0.45rem, 1.05vmin, 0.7rem)' }}
                  >
                    {display.description}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface TempLink {
  url: string;
  label?: string;
  sublabel?: string;
  featured?: boolean;
}

export default function FloatingMetaCards({ links }: { links: TempLink[] }) {
  // Featured event resolved after mount to avoid a server/client date mismatch,
  // same pattern as the shuffled positions below.
  const [featuredLink, setFeaturedLink] = useState<TempLink | null>(null);
  const [positions, setPositions] = useState(POSITIONS);

  useEffect(() => {
    const ev = getFeaturedEvent();
    if (ev) {
      const dates = ev.endDate && ev.endDate !== ev.date
        ? `${formatDate(ev.date)} → ${formatDate(ev.endDate)}`
        : formatDate(ev.date);
      setFeaturedLink({
        url: `/e/${ev.id}`,
        label: `LIVE @ ${ev.title}`,
        sublabel: ev.location ? `${dates} · ${ev.location}` : dates,
        featured: true,
      });
    }
    setPositions(shuffle(POSITIONS));
  }, []);

  // The featured card occupies its own slot: drop that slot from the pool
  // and keep one less regular card so nothing overlaps.
  const availablePositions = featuredLink
    ? positions.filter((p) => !(p.side === FEATURED_POSITION.side && p.top === FEATURED_POSITION.top))
    : positions;
  const activeLinks = links.slice(0, availablePositions.length);

  if (activeLinks.length === 0 && !featuredLink) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(4px, -6px); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.5deg); }
        }
        @keyframes floatD {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-4px, -5px); }
        }
        @keyframes floatE {
          0%, 100% { transform: translateY(0); }
          33% { transform: translateY(-7px); }
          66% { transform: translateY(-3px); }
        }
        @keyframes floatF {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(3px, -8px) rotate(-0.4deg); }
        }

      `}</style>
      {featuredLink && (
        <MetaCard
          key={featuredLink.url}
          url={featuredLink.url}
          label={featuredLink.label}
          sublabel={featuredLink.sublabel}
          featured
          position={FEATURED_POSITION}
          floatAnim="floatC"
          delayS={0}
        />
      )}
      {activeLinks.map(({ url, label }, i) => (
        <MetaCard
          key={url}
          url={url}
          label={label}
          position={availablePositions[i] ?? POSITIONS[i]}
          floatAnim={FLOAT_ANIMS[i]}
          delayS={i * 2.5}
        />
      ))}
    </div>
  );
}
