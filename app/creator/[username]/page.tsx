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
  availability?: { city: string; startDate: string; endDate: string }[];
  consentStatus?: 'pending' | 'signed';
  consentSignedAt?: string;
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
  collabWith?: string;
}

interface EventProfile {
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
  status: string;
  participants?: { username: string; name: string; image: string }[];
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
  const [myCollabs, setMyCollabs] = useState<Booking[]>([]);
  const [myEvents, setMyEvents] = useState<EventProfile[]>([]);
  const [copiedCollabId, setCopiedCollabId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [claiming, setClaiming] = useState(false);

  // Editable state (when claimed & logged in as owner)
  const [editBio, setEditBio] = useState('');
  const [editLinks, setEditLinks] = useState<{ label: string; url: string }[]>([]);
  const [editAvailability, setEditAvailability] = useState<{ city: string; startDate: string; endDate: string }[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const isOwner = sessionUser?.toLowerCase() === username?.toLowerCase();

  useEffect(() => {
    if (!username) return;
    Promise.all([
      fetch(`/api/creators/${encodeURIComponent(username)}`).then(r => r.ok ? r.json() : null),
      fetch('/api/bookings').then(r => r.ok ? r.json() : []),
      fetch('/api/creators').then(r => r.ok ? r.json() : []),
      fetch(`/api/events?participant=${encodeURIComponent(username)}`).then(r => r.ok ? r.json() : []),
    ]).then(([c, b, creators, eventsData]) => {
      if (!c || c.error) {
        setNotFound(true);
      } else {
        setCreator(c);
        setEditBio(c.bio || '');
        setEditLinks(c.links || []);
        setEditAvailability(c.availability || []);
      }
      const allB = Array.isArray(b) ? b : [];
      setAllBookings(allB);
      setAllCreators(Array.isArray(creators) ? creators : []);
      setBookings(allB.filter((bk: Booking) => bk.twitterUsername?.toLowerCase() === username.toLowerCase()));
      const evArr: EventProfile[] = Array.isArray(eventsData) ? eventsData : [];
      setMyEvents(evArr.filter((e: EventProfile) => e.status !== 'past'));
      const eventIds = new Set(evArr.map((e: EventProfile) => e.id.toLowerCase()));
      // Collabs: bookings where collabWith is a creator username (not an event)
      setMyCollabs(allB.filter((bk: Booking) =>
        bk.collabWith && !eventIds.has(bk.collabWith.toLowerCase()) && (
          bk.twitterUsername?.toLowerCase() === username.toLowerCase() ||
          bk.collabWith?.toLowerCase() === username.toLowerCase()
        )
      ));
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
      window.location.href = 'https://collabs.onlymatt.ca/creators';
    }
    setClaiming(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/creators/${encodeURIComponent(username)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: editBio, links: editLinks, availability: editAvailability }),
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
          <div className="w-full mb-6 rounded-2xl border border-slate-700/50 bg-white/[0.03] backdrop-blur-sm p-5 space-y-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-emerald-300/70 tracking-[0.2em] uppercase font-medium">Edit Profile</span>
              <button onClick={() => { setEditing(false); setEditBio(creator.bio); setEditLinks(creator.links); setEditAvailability(creator.availability || []); }} className="text-slate-500 hover:text-slate-300 transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-slate-400 tracking-wider uppercase">Bio</label>
                <span className="text-[10px] text-slate-600">{editBio.length}/160</span>
              </div>
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value.slice(0, 160))}
                rows={3}
                placeholder="Describe yourself…"
                className="w-full bg-black/40 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 resize-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 tracking-wider uppercase mb-3 block">Links</label>
              <div className="space-y-2.5">
                {editLinks.map((link, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={link.label}
                      onChange={e => { const l = [...editLinks]; l[i] = { ...l[i], label: e.target.value }; setEditLinks(l); }}
                      placeholder="Label"
                      className="w-24 bg-black/40 border border-slate-700/60 rounded-lg px-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
                    />
                    <input
                      value={link.url}
                      onChange={e => { const l = [...editLinks]; l[i] = { ...l[i], url: e.target.value }; setEditLinks(l); }}
                      placeholder="https://..."
                      className="flex-1 bg-black/40 border border-slate-700/60 rounded-lg px-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
                    />
                    <button
                      onClick={() => setEditLinks(editLinks.filter((_, j) => j !== i))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setEditLinks([...editLinks, { label: '', url: '' }])}
                className="mt-3 inline-flex items-center gap-1.5 text-emerald-300/50 hover:text-emerald-300 text-xs tracking-wider transition-colors"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Add link
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-400 tracking-wider uppercase">Disponibilités</label>
                <span className="text-[9px] text-slate-600 uppercase tracking-wider">Privé — jamais affiché</span>
              </div>
              <div className="space-y-2.5">
                {editAvailability.map((slot, i) => (
                  <div key={i} className="space-y-1.5 p-3 rounded-xl border border-slate-700/40 bg-black/20">
                    <div className="flex gap-2 items-center">
                      <input
                        value={slot.city}
                        onChange={e => { const a = [...editAvailability]; a[i] = { ...a[i], city: e.target.value }; setEditAvailability(a); }}
                        placeholder="City"
                        className="flex-1 bg-black/40 border border-slate-700/60 rounded-lg px-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
                      />
                      <button
                        onClick={() => setEditAvailability(editAvailability.filter((_, j) => j !== i))}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={slot.startDate}
                        onChange={e => { const a = [...editAvailability]; a[i] = { ...a[i], startDate: e.target.value }; setEditAvailability(a); }}
                        className="flex-1 bg-black/40 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/40 transition-colors"
                      />
                      <input
                        type="date"
                        value={slot.endDate}
                        onChange={e => { const a = [...editAvailability]; a[i] = { ...a[i], endDate: e.target.value }; setEditAvailability(a); }}
                        className="flex-1 bg-black/40 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/40 transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setEditAvailability([...editAvailability, { city: '', startDate: '', endDate: '' }])}
                className="mt-3 inline-flex items-center gap-1.5 text-emerald-300/50 hover:text-emerald-300 text-xs tracking-wider transition-colors"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Add availability
              </button>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs tracking-[0.15em] uppercase font-medium transition-colors"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditing(false); setEditBio(creator.bio); setEditLinks(creator.links); setEditAvailability(creator.availability || []); }}
                className="px-5 py-2.5 border border-slate-700/50 hover:border-slate-600 text-slate-400 hover:text-slate-200 rounded-xl text-xs tracking-wider uppercase transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit button (owner + claimed + not editing) */}
        {isOwner && creator?.claimed && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50 text-xs tracking-[0.15em] uppercase transition-all"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
            Edit Profile
          </button>
        )}

        {/* Book a Collab button — visible to logged-in visitors (not owner) */}
        {session && !isOwner && (
          <a
            href={`https://book.onlymatt.ca?with=${username}`}
            className="mb-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 text-xs tracking-[0.15em] uppercase transition-all"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
            Book a Collab
          </a>
        )}

        {/* Consent (private — owner only) */}
        {isOwner && (
          <div className="w-full mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] backdrop-blur-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-amber-300/70 tracking-[0.2em] uppercase font-medium">📄 Consent Letter</span>
              {creator?.consentStatus === 'signed'
                ? <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider">✓ Signé</span>
                : <span className="text-[9px] bg-amber-500/20 text-amber-300/70 px-2 py-0.5 rounded-full uppercase tracking-wider">⏳ En attente</span>
              }
            </div>
            {creator?.consentStatus !== 'signed' ? (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500">Signe ton entente de collaboration pour confirmer tes collabs avec ONLYMATT.</p>
                <div className="flex gap-3 items-start">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&color=d97706&bgcolor=0a0a0a&data=${encodeURIComponent(`https://release-onlymatt.vercel.app/consent/${username}`)}`}
                    alt="QR consent"
                    className="w-[90px] h-[90px] rounded-lg border border-amber-500/20 flex-shrink-0"
                  />
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-600 font-mono break-all">release-onlymatt.vercel.app/consent/{username}</p>
                    <a
                      href={`https://release-onlymatt.vercel.app/consent/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-400/40 text-amber-300 rounded-lg text-[10px] tracking-wider uppercase transition-all"
                    >
                      Signer maintenant →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-slate-600">
                {creator?.consentSignedAt ? `Signé le ${new Date(creator.consentSignedAt).toLocaleDateString('fr-CA')}` : 'Document signé.'}
              </p>
            )}
          </div>
        )}

        {/* Collabs (private — owner only) */}
        {isOwner && myCollabs.length > 0 && (
          <div className="w-full mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.03] backdrop-blur-sm p-4">
            <span className="text-xs text-cyan-300/70 tracking-[0.2em] uppercase font-medium mb-3 block">🤝 Mes Collabs</span>
            <div className="space-y-3">
              {myCollabs.map(collab => {
                const otherUsername = collab.twitterUsername.toLowerCase() === username.toLowerCase()
                  ? collab.collabWith!
                  : collab.twitterUsername;
                const otherCreator = allCreators.find(c => c.username.toLowerCase() === otherUsername.toLowerCase());
                return (
                  <div key={collab.id} className="rounded-xl border border-slate-700/30 bg-black/20 p-3 space-y-2.5">
                    <div className="flex items-center gap-2">
                      {otherCreator?.image ? (
                        <img src={otherCreator.image} alt={`@${otherUsername}`} className="w-7 h-7 rounded-full border border-slate-700/40 flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700/40 flex items-center justify-center text-[10px] text-slate-400 flex-shrink-0">
                          {otherUsername[0]?.toUpperCase()}
                        </div>
                      )}
                      <a href={`/creator/${otherUsername}`} className="text-slate-200 text-xs font-medium hover:text-cyan-300 transition-colors">@{otherUsername}</a>
                      {collab.city && <span className="text-slate-600 text-[10px]">{collab.city}</span>}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={`https://release-onlymatt.vercel.app/consent/${otherUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-400/40 text-amber-300/80 rounded-lg text-[10px] tracking-wider uppercase transition-all"
                      >
                        📄 Signer le consent de @{otherUsername}
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://release-onlymatt.vercel.app/consent/${username}`);
                          setCopiedCollabId(collab.id);
                          setTimeout(() => setCopiedCollabId(null), 2000);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-700/30 hover:border-slate-600/50 text-slate-400 hover:text-slate-200 rounded-lg text-[10px] tracking-wider uppercase transition-all"
                      >
                        {copiedCollabId === collab.id ? '✓ Copié' : '📋 Partager mon consent'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Events (private — owner only) */}
        {isOwner && myEvents.length > 0 && (
          <div className="w-full mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.03] backdrop-blur-sm p-4">
            <span className="text-xs text-cyan-300/70 tracking-[0.2em] uppercase font-medium mb-3 block">📅 Mes Événements</span>
            <div className="space-y-3">
              {myEvents.map(ev => {
                // Creator's own booking for this event (has their collab type)
                const myBooking = allBookings.find(
                  (b: Booking) => b.collabWith?.toLowerCase() === ev.id.toLowerCase() && b.twitterUsername?.toLowerCase() === username.toLowerCase()
                );
                // All participants at this event
                const eventBookings = allBookings.filter(
                  (b: Booking) => b.collabWith?.toLowerCase() === ev.id.toLowerCase() && b.twitterUsername?.toLowerCase() !== username.toLowerCase()
                );
                // Matches: same collab type as me
                const typeMatches = myBooking?.type
                  ? eventBookings.filter((b: Booking) => b.type === myBooking.type)
                  : [];
                // Other collab types breakdown
                const typeCounts: Record<string, number> = {};
                for (const b of eventBookings) {
                  if (b.type) typeCounts[b.type] = (typeCounts[b.type] || 0) + 1;
                }

                return (
                  <div key={ev.id} className="rounded-xl border border-cyan-700/20 bg-black/20 p-3">
                    <div className="flex items-start gap-2.5 mb-2">
                      {ev.image ? (
                        <img src={ev.image} alt={ev.title} className="w-8 h-8 rounded-lg object-cover border border-cyan-400/20 flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg border border-cyan-400/20 bg-cyan-500/10 flex items-center justify-center text-base flex-shrink-0">
                          {ev.emoji || '📅'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-200 text-xs font-medium">{ev.title}</p>
                        <p className="text-slate-500 text-[10px]">📍 {ev.location} · {ev.date}</p>
                        {myBooking?.type && (
                          <p className="text-cyan-400/50 text-[9px] mt-0.5 uppercase tracking-wider">🔒 ton type: {myBooking.type}</p>
                        )}
                      </div>
                    </div>

                    {/* Matching creators */}
                    {myBooking?.type && typeMatches.length > 0 && (
                      <div className="mb-2 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-lg px-2.5 py-2">
                        <p className="text-emerald-300/70 text-[9px] uppercase tracking-wider mb-1.5">
                          🎯 {typeMatches.length} créateur{typeMatches.length > 1 ? 's' : ''} veulent aussi un {myBooking.type.toLowerCase()}
                        </p>
                        <div className="flex items-center gap-1">
                          {typeMatches.map((b: Booking) => {
                            const c = allCreators.find(cr => cr.username.toLowerCase() === b.twitterUsername?.toLowerCase());
                            return c?.image ? (
                              <a key={b.twitterUsername} href={`/creator/${b.twitterUsername}`} title={`@${b.twitterUsername}`}>
                                <img src={c.image} alt={b.twitterUsername} className="w-6 h-6 rounded-full border border-black" />
                              </a>
                            ) : (
                              <a key={b.twitterUsername} href={`/creator/${b.twitterUsername}`} title={`@${b.twitterUsername}`} className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-[8px] text-slate-400">
                                {b.twitterUsername?.[0]?.toUpperCase()}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {myBooking?.type && typeMatches.length === 0 && (
                      <p className="text-slate-600 text-[9px] italic mb-2">Aucun match pour &quot;{myBooking.type}&quot; encore — tu seras le premier !</p>
                    )}

                    {/* Other types at this event */}
                    {Object.keys(typeCounts).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {Object.entries(typeCounts).map(([t, count]) => (
                          <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${myBooking?.type === t ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400/70' : 'bg-slate-800/60 border-slate-700/40 text-slate-500'}`}>
                            {count}× {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {ev.tags && ev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {ev.tags.map(tag => (
                          <span key={tag} className="text-[9px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400/60 px-1.5 py-0.5 rounded-full uppercase tracking-wider">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {ev.whatsapp && (
                        <a
                          href={ev.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-400/40 text-emerald-300/80 rounded-lg text-[10px] tracking-wider uppercase transition-all"
                        >
                          💬 Groupe WhatsApp
                        </a>
                      )}
                      {ev.telegram && (
                        <a
                          href={ev.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-400/40 text-cyan-300/80 rounded-lg text-[10px] tracking-wider uppercase transition-all"
                        >
                          ✈️ Groupe Telegram
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Links */}
        {creator?.links && creator.links.length > 0 && (
          <div className="w-full space-y-2.5 mb-8">
            {creator.links.filter(l => l.url).map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-3 px-4 border border-slate-700/40 hover:border-emerald-500/30 rounded-xl transition-all hover:scale-[1.01] hover:bg-white/[0.02] group"
              >
                <span className="text-slate-100 text-sm font-medium tracking-wider uppercase group-hover:text-emerald-100 transition-colors">
                  {link.label || (() => { try { return new URL(link.url).hostname.replace('www.', ''); } catch { return link.url; } })()}
                </span>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-300/60 transition-colors flex-shrink-0"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
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
            href="https://collabs.onlymatt.ca/creators"
            className="block text-slate-500 hover:text-emerald-300 text-xs tracking-[0.2em] uppercase transition-colors"
          >
            ← All Creators
          </a>
        </div>

        <footer className="text-slate-600 text-[10px] uppercase tracking-widest font-light text-center mt-10">
          OM43 DIGITAL © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}
