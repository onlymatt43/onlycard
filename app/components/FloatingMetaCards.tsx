'use client';

import { useEffect, useState, useMemo } from 'react';

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
];

const FLOAT_ANIMS = ['floatA', 'floatB', 'floatC', 'floatD', 'floatE'];

// Metadata hardcodée pour les plateformes qui bloquent le scraping
const PLATFORM_OVERRIDES: Record<string, MetaData> = {
  'onlyfans.com': {
    title: 'OnlyFans',
    description: 'Subscribe to see exclusive content',
    image: 'https://onlyfans.com/cdn-cgi/imagedelivery/PTqD570GUoXsFwZMoADVDQ/5f7f4a0a-3ac0-4b76-9a76-c9e8db5b3900/w=1200,h=630',
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
  position,
  floatAnim,
  delayS,
}: {
  url: string;
  label?: string;
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
    if (label) return; // label custom = pas besoin de fetch
    const override = getPlatformOverride(url);
    if (override) {
      setMeta(override);
      return;
    }
    fetch(`/api/fetch-meta?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((d) => { setMeta((d.title || d.image) ? d : fallback); })
      .catch(() => { setMeta(fallback); });
  }, [url, fallback]);

  const display = meta ?? fallback;

  const sideStyle = position.side === 'left' ? { left: '1.5%' } : { right: '1.5%' };

  return (
    <div
      className="absolute z-10"
      style={{
        top: position.top,
        ...sideStyle,
        transform: 'translateY(-50%)',
        animation: `fadeInOut 10s ease-in-out infinite ${delayS}s`,
        width: 'clamp(5.25rem, 18vmin, 13rem)',
      }}
    >
      <div
        style={{ animation: `${floatAnim} 6s ease-in-out infinite` }}
        className="cursor-pointer pointer-events-auto"
        onClick={() => window.open(url, '_blank')}
      >
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300">
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
              <h3
                className="font-bold leading-tight"
                style={{ color: '#ff2d78', fontSize: 'clamp(0.52rem, 1.35vmin, 0.9rem)' }}
              >
                {label}
              </h3>
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
}

export default function FloatingMetaCards({ links }: { links: TempLink[] }) {
  const activeLinks = links.slice(0, 5);
  const [positions, setPositions] = useState(POSITIONS);

  useEffect(() => {
    setPositions(shuffle(POSITIONS));
  }, []);

  if (activeLinks.length === 0) return null;

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
        @keyframes fadeInOut {
          0% { opacity: 0; }
          8% { opacity: 1; }
          72% { opacity: 1; }
          85% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
      {activeLinks.map(({ url, label }, i) => (
        <MetaCard
          key={url}
          url={url}
          label={label}
          position={positions[i] ?? POSITIONS[i]}
          floatAnim={FLOAT_ANIMS[i]}
          delayS={i * 2.5}
        />
      ))}
    </div>
  );
}
