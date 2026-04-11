'use client';

import { useEffect, useState } from 'react';

interface Creator {
  username: string;
  name: string;
  image: string;
  bio: string;
  claimed: boolean;
  links: { label: string; url: string }[];
}

interface Booking {
  twitterUsername: string;
  city: string;
}

interface Destination {
  city: string;
  country: string;
  dates: string;
  status: string;
  description: string;
  emoji: string;
  link?: string;
  startDate?: string;
  endDate?: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  confirmed: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', label: 'CONFIRMED' },
  upcoming: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30', label: 'UPCOMING' },
  open: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', label: 'OPEN INVITE' },
  past: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30', label: 'PAST' },
};

export default function CreatorsDirectory({ destinations }: { destinations: Destination[] }) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/creators').then(r => r.ok ? r.json() : []),
      fetch('/api/bookings').then(r => r.ok ? r.json() : []),
    ]).then(([c, b]) => {
      setCreators(Array.isArray(c) ? c : []);
      setBookings(Array.isArray(b) ? b : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Build city list from bookings for filters
  const bookedCities = Array.from(new Set(bookings.map(b => b.city.trim()))).filter(Boolean).sort();

  // Map: username → list of cities booked
  const creatorCities: Record<string, string[]> = {};
  for (const b of bookings) {
    const u = b.twitterUsername?.toLowerCase();
    if (!u) continue;
    if (!creatorCities[u]) creatorCities[u] = [];
    const city = b.city.trim();
    if (city && !creatorCities[u].includes(city)) creatorCities[u].push(city);
  }

  // Map: city (lowercase) → list of creators going there
  const cityCreators: Record<string, Creator[]> = {};
  for (const b of bookings) {
    const u = b.twitterUsername?.toLowerCase();
    const city = b.city.trim().toLowerCase();
    if (!u || !city) continue;
    const creator = creators.find(c => c.username.toLowerCase() === u);
    if (!creator) continue;
    if (!cityCreators[city]) cityCreators[city] = [];
    if (!cityCreators[city].find(c => c.username === creator.username)) {
      cityCreators[city].push(creator);
    }
  }

  // Filter creators
  const filtered = filter === 'all'
    ? creators
    : filter === 'claimed'
      ? creators.filter(c => c.claimed)
      : creators.filter(c => {
          const cities = creatorCities[c.username.toLowerCase()] || [];
          return cities.some(city => city.toLowerCase() === filter.toLowerCase());
        });

  // Card style shared by both events and creators
  const cardBase = 'group border border-slate-800/60 hover:border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm bg-white/[0.02] transition-all hover:scale-[1.02] text-center block';

  return (
    <>
      {/* Events section */}
      {destinations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs tracking-[0.25em] uppercase text-emerald-300/70 mb-4 font-medium">
            Events & Destinations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {destinations.map(dest => {
              const style = STATUS_STYLES[dest.status] || STATUS_STYLES.open;
              const going = cityCreators[dest.city.toLowerCase()] || [];
              return (
                <div
                  key={`${dest.city}-${dest.dates}`}
                  className={cardBase}
                >
                  {/* Emoji */}
                  <div className="text-3xl mb-2">{dest.emoji || '📍'}</div>

                  {/* City + Country */}
                  <p className="text-slate-100 text-sm font-semibold tracking-wider truncate">
                    {dest.city}
                  </p>
                  <p className="text-slate-500 text-[10px] tracking-wider uppercase mb-1">
                    {dest.country}
                  </p>

                  {/* Event name / dates */}
                  <p className="text-cyan-300/70 text-[11px] tracking-wide font-medium mb-1">
                    {dest.dates}
                  </p>

                  {/* Status badge */}
                  <span className={`inline-block text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text} ${style.border} border mb-2`}>
                    {style.label}
                  </span>

                  {/* Description */}
                  {dest.description && (
                    <p className="text-slate-500 text-[10px] leading-relaxed mb-2">{dest.description}</p>
                  )}

                  {/* Start/End dates */}
                  {dest.startDate && (
                    <p className="text-slate-600 text-[9px] tracking-wide mb-2">
                      {dest.startDate}{dest.endDate ? ` → ${dest.endDate}` : ''}
                    </p>
                  )}

                  {/* Creators going (avatars) */}
                  {going.length > 0 && (
                    <div className="flex justify-center -space-x-2 mt-1">
                      {going.slice(0, 5).map(c => (
                        <a
                          key={c.username}
                          href={`https://me.onlymatt.ca/creator/${c.username}`}
                          className="relative"
                          title={c.name || c.username}
                        >
                          <img
                            src={c.image}
                            alt={c.username}
                            className="w-7 h-7 rounded-full border-2 border-black object-cover hover:border-emerald-500/50 transition-colors"
                          />
                        </a>
                      ))}
                      {going.length > 5 && (
                        <span className="w-7 h-7 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-[9px] text-slate-400 font-medium">
                          +{going.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Link */}
                  {dest.link && (
                    <a
                      href={dest.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-emerald-300/50 hover:text-emerald-300 text-[10px] tracking-wider transition-colors"
                    >
                      Details →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Creators section */}
      <section>
        <h2 className="text-xs tracking-[0.25em] uppercase text-emerald-300/70 mb-4 font-medium">
          Creators
        </h2>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all border ${
              filter === 'all'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'border-slate-700/40 text-slate-500 hover:text-slate-300 hover:border-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('claimed')}
            className={`px-4 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all border ${
              filter === 'claimed'
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'border-slate-700/40 text-slate-500 hover:text-slate-300 hover:border-slate-600'
            }`}
          >
            ✓ Claimed
          </button>
          {bookedCities.map(city => (
            <button
              key={city}
              onClick={() => setFilter(city)}
              className={`px-4 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all border ${
                filter === city
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'border-slate-700/40 text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              📍 {city}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-slate-500 text-sm tracking-wider uppercase">Loading…</p>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-slate-600 text-sm tracking-wider">No creators found for this filter.</p>
        )}

        {/* Creator grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filtered.map(creator => {
            const cities = creatorCities[creator.username.toLowerCase()] || [];
            return (
              <a
                key={creator.username}
                href={`https://me.onlymatt.ca/creator/${creator.username}`}
                className={cardBase}
              >
                {/* Avatar */}
                <div className="relative mx-auto mb-3 w-16 h-16">
                  {creator.image ? (
                    <img
                      src={creator.image}
                      alt={creator.name || creator.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-700/60 group-hover:border-emerald-500/40 transition-colors"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700/60 flex items-center justify-center text-slate-500 text-lg font-bold">
                      {(creator.name || creator.username)[0]?.toUpperCase()}
                    </div>
                  )}
                  {creator.claimed && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  )}
                </div>

                {/* Name */}
                <p className="text-slate-100 text-sm font-semibold tracking-wider group-hover:text-emerald-100 transition-colors truncate">
                  {creator.name || creator.username}
                </p>
                <p className="text-emerald-300/50 text-[11px] tracking-wide mb-2">
                  @{creator.username}
                </p>

                {/* Destinations */}
                {cities.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mt-1">
                    {cities.map(city => (
                      <span key={city} className="text-[9px] tracking-wider uppercase text-amber-300/60 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                        📍 {city}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links count */}
                {creator.links?.filter(l => l.url).length > 0 && (
                  <p className="text-slate-600 text-[10px] tracking-wider mt-2">
                    {creator.links.filter(l => l.url).length} link{creator.links.filter(l => l.url).length !== 1 ? 's' : ''}
                  </p>
                )}
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
