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

export default function CreatorsPage() {
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

  // Build destination set from bookings
  const destinations = Array.from(new Set(bookings.map(b => b.city.trim()))).filter(Boolean).sort();

  // Map: username → list of cities booked
  const creatorCities: Record<string, string[]> = {};
  for (const b of bookings) {
    const u = b.twitterUsername?.toLowerCase();
    if (!u) continue;
    if (!creatorCities[u]) creatorCities[u] = [];
    const city = b.city.trim();
    if (city && !creatorCities[u].includes(city)) creatorCities[u].push(city);
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

  return (
    <main className="min-h-screen bg-black text-slate-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_75%_25%,rgba(6,182,212,0.14),transparent_38%),radial-gradient(circle_at_65%_78%,rgba(45,212,191,0.12),transparent_40%),linear-gradient(160deg,#020406_0%,#02070a_35%,#030d11_70%,#010304_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(125deg,transparent_0%,rgba(255,255,255,0.22)_50%,transparent_100%)] mix-blend-screen" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-44 -right-44 w-96 h-96 bg-gradient-to-br from-emerald-400/18 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-44 -left-44 w-96 h-96 bg-gradient-to-tr from-cyan-400/16 to-emerald-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Back */}
        <a
          href="https://collabs.onlymatt.ca"
          className="inline-block mb-8 text-slate-400 hover:text-emerald-300 transition-colors text-sm tracking-wider uppercase"
        >
          ← Collabs
        </a>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-extralight uppercase mb-3" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', letterSpacing: '0.18em' }}>
            <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-transparent">
              CREATORS
            </span>
          </h1>
          <div className="h-[2px] w-20 bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full mx-auto mb-4" />
          <p className="text-slate-400 text-sm tracking-wider uppercase">
            {creators.length} creator{creators.length !== 1 ? 's' : ''} in the network
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
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
          {destinations.map(city => (
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

        {/* Creator grid */}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-slate-600 text-sm tracking-wider">No creators found for this filter.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filtered.map(creator => {
            const cities = creatorCities[creator.username.toLowerCase()] || [];
            return (
              <a
                key={creator.username}
                href={`https://me.onlymatt.ca/creator/${creator.username}`}
                className="group border border-slate-800/60 hover:border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm bg-white/[0.02] transition-all hover:scale-[1.02] text-center block"
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

        {/* Footer */}
        <div className="mt-12 text-center space-y-3">
          <a
            href="https://book.onlymatt.ca"
            className="inline-block bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium hover:bg-emerald-600/30 transition-all"
          >
            Book a Collab →
          </a>
          <div>
            <a
              href="https://me.onlymatt.ca"
              className="text-slate-500 hover:text-emerald-300 text-xs tracking-[0.2em] uppercase transition-colors"
            >
              ← Back to ONLYMATT
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
