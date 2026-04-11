'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

interface Creator {
  username: string;
  name: string;
  image: string;
  bio: string;
  twitterId: string;
  links: { label: string; url: string }[];
  claimed: boolean;
  createdAt: string;
  createdBy: string;
}

interface Booking {
  id: string;
  twitterUsername: string;
  city: string;
  dates: string;
  type: string;
}

export default function CreatorPage() {
  const params = useParams();
  const username = params.username as string;
  const { data: session } = useSession();
  const sessionUser = (session?.user as { username?: string })?.username;

  const [creator, setCreator] = useState<Creator | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allCreators, setAllCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [claiming, setClaiming] = useState(false);

  // Editable state (when claimed & logged in as owner)
  const [editBio, setEditBio] = useState('');
  const [editLinks, setEditLinks] = useState<{ label: string; url: string }[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const isOwner = sessionUser?.toLowerCase() === username?.toLowerCase();

  useEffect(() => {
    if (!username) return;
    Promise.all([
      fetch(`/api/creators/${encodeURIComponent(username)}`).then(r => r.ok ? r.json() : null),
      fetch('/api/bookings').then(r => r.ok ? r.json() : []),
      fetch('/api/creators').then(r => r.ok ? r.json() : []),
    ]).then(([c, b, creators]) => {
      if (!c || c.error) {
        setNotFound(true);
      } else {
        setCreator(c);
        setEditBio(c.bio || '');
        setEditLinks(c.links || []);
      }
      const allB = Array.isArray(b) ? b : [];
      setAllBookings(allB);
      setAllCreators(Array.isArray(creators) ? creators : []);
      setBookings(allB.filter((bk: Booking) => bk.twitterUsername?.toLowerCase() === username.toLowerCase()));
      setLoading(false);
    });
  }, [username]);

  const handleClaim = async () => {
    if (!isOwner || !creator) return;
    setClaiming(true);
    const res = await fetch(`/api/creators/${encodeURIComponent(username)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimUsername: sessionUser }),
    });
    if (res.ok) {
      const { creator: updated } = await res.json();
      setCreator(updated);
    }
    setClaiming(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/creators/${encodeURIComponent(username)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: editBio, links: editLinks }),
    });
    if (res.ok) {
      const { creator: updated } = await res.json();
      setCreator(updated);
      setEditing(false);
    }
    setSaving(false);
  };

  const velvetBg = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_75%_25%,rgba(6,182,212,0.14),transparent_38%),radial-gradient(circle_at_65%_78%,rgba(45,212,191,0.12),transparent_40%),linear-gradient(160deg,#020406_0%,#02070a_35%,#030d11_70%,#010304_100%)]" />
      <div className="absolute -top-44 -right-44 w-96 h-96 bg-gradient-to-br from-emerald-400/18 to-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-44 -left-44 w-96 h-96 bg-gradient-to-tr from-cyan-400/16 to-emerald-300/10 rounded-full blur-3xl" />
    </div>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center relative overflow-hidden">
        {velvetBg}
        <p className="relative z-10 text-slate-500 text-sm tracking-wider animate-pulse">Loading…</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center relative overflow-hidden">
        {velvetBg}
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-extralight tracking-wider mb-4">
            <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-transparent">@{username}</span>
          </h1>
          <p className="text-slate-500 text-sm mb-8">Creator profile not found</p>
          <a href="https://me.onlymatt.ca" className="text-emerald-300/70 hover:text-emerald-300 text-xs tracking-[0.2em] uppercase transition-colors">← ONLYMATT</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-slate-100 relative overflow-hidden">
      {velvetBg}

      <div className="relative z-10 flex flex-col items-center px-6 pt-16 pb-12 max-w-md mx-auto">
        {/* Avatar */}
        <div className="mb-5">
          <div className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-emerald-300 rounded-full p-[3px]">
            <div className="bg-white rounded-full p-1">
              {creator?.image ? (
                <img src={creator.image} alt={creator.name} className="w-28 h-28 rounded-full object-cover" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-3xl text-slate-400">
                  {(creator?.name || username)[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <h1 className="font-extralight uppercase mb-1 tracking-[0.2em]" style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)' }}>
          <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-transparent">
            {creator?.name}
          </span>
        </h1>

        {/* Username */}
        <a
          href={`https://x.com/${creator?.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-300/70 hover:text-emerald-300 text-sm tracking-wider transition-colors mb-1"
        >
          @{creator?.username}
        </a>

        <div className="h-[2px] w-16 bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full my-4" />

        {/* Bio */}
        {creator?.bio && !editing && (
          <p className="text-slate-400 text-sm text-center max-w-xs mb-6 leading-relaxed">{creator.bio}</p>
        )}

        {/* Claimed badge */}
        {creator?.claimed && (
          <span className="inline-block text-[9px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full uppercase tracking-[0.2em] mb-6 border border-emerald-500/20">
            ✓ Verified Creator
          </span>
        )}

        {/* Claim prompt — visible to the creator themselves when not claimed */}
        {!creator?.claimed && isOwner && (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="mb-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs tracking-[0.15em] uppercase transition-colors disabled:opacity-50"
          >
            {claiming ? 'Claiming…' : '✓ Claim This Profile'}
          </button>
        )}

        {/* Claim prompt — visitor not logged in */}
        {!creator?.claimed && !session && (
          <div className="mb-6 text-center">
            <p className="text-slate-600 text-xs mb-2 tracking-wider">Is this you?</p>
            <button
              onClick={() => {
                const callbackUrl = encodeURIComponent(window.location.href);
                window.location.href = `https://me.onlymatt.ca/auth/login?callbackUrl=${callbackUrl}`;
              }}
              className="px-5 py-2 bg-white/10 hover:bg-white/15 border border-slate-700/50 rounded-xl text-xs tracking-[0.15em] uppercase transition-colors flex items-center gap-2 mx-auto"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Sign in to claim
            </button>
          </div>
        )}

        {/* Edit mode (owner + claimed) */}
        {isOwner && creator?.claimed && editing && (
          <div className="w-full mb-6 space-y-4">
            <div>
              <label className="text-xs text-emerald-300/70 tracking-wider uppercase mb-1 block">Bio</label>
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                rows={3}
                className="w-full bg-white/[0.04] border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-emerald-300/70 tracking-wider uppercase mb-2 block">Links</label>
              <div className="space-y-2">
                {editLinks.map((link, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={link.label}
                      onChange={e => { const l = [...editLinks]; l[i] = { ...l[i], label: e.target.value }; setEditLinks(l); }}
                      placeholder="Label"
                      className="w-28 bg-white/[0.04] border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50"
                    />
                    <input
                      value={link.url}
                      onChange={e => { const l = [...editLinks]; l[i] = { ...l[i], url: e.target.value }; setEditLinks(l); }}
                      placeholder="https://..."
                      className="flex-1 bg-white/[0.04] border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50"
                    />
                    <button onClick={() => setEditLinks(editLinks.filter((_, j) => j !== i))} className="text-red-400/70 hover:text-red-400 text-sm px-1">✕</button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setEditLinks([...editLinks, { label: '', url: '' }])}
                className="mt-2 text-emerald-300/50 hover:text-emerald-300 text-xs tracking-wider transition-colors"
              >
                + Add link
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs tracking-wider uppercase transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => { setEditing(false); setEditBio(creator.bio); setEditLinks(creator.links); }} className="px-5 py-2 text-slate-400 hover:text-slate-200 text-xs tracking-wider uppercase transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit button (owner + claimed + not editing) */}
        {isOwner && creator?.claimed && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="mb-6 text-emerald-300/40 hover:text-emerald-300 text-xs tracking-[0.2em] uppercase transition-colors"
          >
            ✎ Edit Profile
          </button>
        )}

        {/* Links */}
        {creator?.links && creator.links.length > 0 && (
          <div className="w-full space-y-3 mb-8">
            {creator.links.filter(l => l.url).map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 border border-slate-700/40 hover:border-emerald-500/30 rounded-xl transition-all hover:scale-[1.02] group"
              >
                <span className="text-slate-100 text-sm font-medium tracking-wider uppercase group-hover:text-emerald-100 transition-colors">
                  {link.label || new URL(link.url).hostname.replace('www.', '')}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Upcoming collabs */}
        {bookings.length > 0 && (
          <div className="w-full mb-8">
            <h2 className="text-xs tracking-[0.2em] uppercase text-emerald-300/50 mb-3 text-center">Upcoming Collabs</h2>
            <div className="space-y-2">
              {bookings.map(b => {
                // Find other creators going to same city
                const sameCity = allBookings.filter(
                  ob => ob.city.toLowerCase().trim() === b.city.toLowerCase().trim()
                    && ob.twitterUsername.toLowerCase() !== username.toLowerCase()
                );
                const matchedCreators = sameCity
                  .map(ob => allCreators.find(c => c.username.toLowerCase() === ob.twitterUsername.toLowerCase()))
                  .filter((c): c is Creator => !!c);
                // Dedupe by username
                const uniqueMatches = matchedCreators.filter((c, i, arr) => arr.findIndex(x => x.username === c.username) === i);

                return (
                  <div key={b.id} className="border border-slate-700/30 rounded-xl px-4 py-3 bg-white/[0.02]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 text-xs font-medium">{b.city}</span>
                      <span className="text-emerald-300/50 text-[10px] uppercase tracking-wider">{b.type}</span>
                    </div>
                    <p className="text-slate-500 text-[10px] mt-0.5">{b.dates}</p>
                    {uniqueMatches.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-700/20">
                        <span className="text-cyan-300/50 text-[9px] tracking-wider uppercase">Also going:</span>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {uniqueMatches.map(mc => (
                            <a
                              key={mc.username}
                              href={`/creator/${mc.username}`}
                              title={`@${mc.username}${mc.claimed ? ' ✓' : ''}`}
                              className="group relative"
                            >
                              <img
                                src={mc.image || `https://unavatar.io/twitter/${mc.username}`}
                                alt={`@${mc.username}`}
                                className={`w-6 h-6 rounded-full border transition-all group-hover:scale-110 ${
                                  mc.claimed ? 'border-emerald-400/40' : 'border-slate-700/40'
                                }`}
                              />
                              {mc.claimed && (
                                <span className="absolute -top-0.5 -right-0.5 text-[6px] bg-emerald-500 text-white rounded-full w-2.5 h-2.5 flex items-center justify-center">✓</span>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer links */}
        <div className="space-y-3 text-center mt-auto">
          <a
            href={`https://book.onlymatt.ca?with=${creator?.username}`}
            className="block text-emerald-300/70 hover:text-emerald-300 text-xs tracking-[0.2em] uppercase transition-colors"
          >
            Collab with @{creator?.username} →
          </a>
          <a
            href="https://collabs.onlymatt.ca"
            className="block text-slate-500 hover:text-emerald-300 text-xs tracking-[0.2em] uppercase transition-colors"
          >
            View Collabs →
          </a>
          <a
            href="https://me.onlymatt.ca"
            className="block text-slate-600 hover:text-slate-400 text-xs tracking-[0.2em] uppercase transition-colors"
          >
            ← ONLYMATT
          </a>
        </div>

        <footer className="text-slate-600 text-[10px] uppercase tracking-widest font-light text-center mt-10">
          OM43 DIGITAL © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}
