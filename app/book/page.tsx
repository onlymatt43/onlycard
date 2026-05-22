'use client';

import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

const COLLAB_TYPES = [
  'Photo Shoot',
  'Video Content',
  'Event / Appearance',
  'Brand Partnership',
  'Other',
];

interface CreatorProfile {
  username: string;
  name: string;
  image: string;
  bio: string;
  links: { label: string; url: string }[];
  claimed: boolean;
}

interface EventData {
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

export default function BookPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [event, setEvent] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState<'whatsapp' | 'telegram' | 'copy'>('copy');
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [collabWith, setCollabWith] = useState('');
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [isEvent, setIsEvent] = useState(false);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Parse creator's WhatsApp/Telegram from their links
  const getCreatorContacts = (c: CreatorProfile | null) => {
    if (!c?.links) return { whatsapp: '', telegram: '' };
    let whatsapp = '';
    let telegram = '';
    for (const link of c.links) {
      const url = link.url.toLowerCase();
      const label = link.label.toLowerCase();
      if (url.includes('wa.me') || url.includes('whatsapp') || label.includes('whatsapp')) {
        whatsapp = link.url;
      }
      if (url.includes('t.me') || url.includes('telegram') || label.includes('telegram')) {
        telegram = link.url;
      }
    }
    return { whatsapp, telegram };
  };

  // Pre-fill from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('city')) setCity(params.get('city')!);
    if (params.get('country')) setCountry(params.get('country')!);
    if (params.get('event')) setEvent(params.get('event')!);
    if (params.get('dateFrom')) setDateFrom(params.get('dateFrom')!);
    if (params.get('time')) setTime(params.get('time')!);
    if (params.get('duration')) setDuration(params.get('duration')!);
    if (params.get('with')) setCollabWith(params.get('with')!);
  }, []);

  // Fetch target creator profile, or event if creator not found
  useEffect(() => {
    if (!collabWith) {
      setCreatorLoading(false);
      return;
    }
    fetch(`/api/creators/${collabWith}`)
      .then(r => r.ok ? r.json() : null)
      .then(async (data) => {
        if (data) {
          setCreator(data);
          setIsEvent(false);
          const contacts = getCreatorContacts(data);
          if (contacts.whatsapp) setMethod('whatsapp');
          else if (contacts.telegram) setMethod('telegram');
          else setMethod('copy');
          setCreatorLoading(false);
        } else {
          // Fallback: check events
          try {
            const evRes = await fetch(`/api/events/${collabWith}`);
            if (evRes.ok) {
              const ev = await evRes.json();
              setEventData(ev);
              setIsEvent(true);
              if (ev.whatsapp) setMethod('whatsapp');
              else if (ev.telegram) setMethod('telegram');
              else setMethod('copy');
              if (ev.location && !city) setCity(ev.location);
            }
          } catch { /* silent */ }
          setCreatorLoading(false);
        }
      })
      .catch(() => setCreatorLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collabWith]);

  // Pre-fill name from Twitter session
  useEffect(() => {
    if (session?.user?.name && !name) {
      setName(session.user.name);
    }
  }, [session, name]);

  const user = session?.user as { name?: string | null; image?: string | null; username?: string } | undefined;
  const twitterUsername = user?.username || '';
  const twitterImage = user?.image || '';

  const contacts = isEvent
    ? { whatsapp: eventData?.whatsapp || '', telegram: eventData?.telegram || '' }
    : getCreatorContacts(creator);
  const hasWhatsApp = !!contacts.whatsapp;
  const hasTelegram = !!contacts.telegram;
  const hasDirectContact = hasWhatsApp || hasTelegram;

  // Format dates for display
  const formatDate = (d: string) => {
    if (!d) return '';
    try {
      return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return d; }
  };
  const datesDisplay = dateFrom
    ? `${formatDate(dateFrom)}${time ? ` at ${time}` : ''}${duration ? ` (${duration})` : ''}`
    : '';
  const locationDisplay = country ? `${city}, ${country}` : city;

  const creatorCardUrl = `https://me.onlymatt.ca/creator/${collabWith}`;

  const buildMessage = (id?: string) => {
    const targetName = creator?.name || collabWith;
    const lines = [
      `Hey ${targetName}! I'd like to book a collab with you.`,
      '',
      `X/Twitter: https://x.com/${twitterUsername}`,
      `Name: ${name}`,
      `Type: ${type}`,
      `📍 Location: ${locationDisplay}`,
    ];
    if (event) lines.push(`Event: ${event}`);
    lines.push(`📅 Date: ${datesDisplay}`);
    if (address.trim()) {
      lines.push(`🏠 Address: ${address}`);
      lines.push(`📍 Map: https://maps.google.com/?q=${encodeURIComponent(address)}`);
    }
    if (message.trim()) {
      lines.push(`Details: ${message}`);
    }
    lines.push('');
    lines.push(`View details on your card: ${creatorCardUrl}`);
    if (id) lines.push(`Booking: https://collabs.onlymatt.ca?booking=${id}`);
    return lines.join('\n');
  };

  const buildFallbackMessage = (id?: string) => {
    return [
      `Hey @${collabWith}! On te veut pour une collab 🤝`,
      `Connecte-toi à ta carte pour les détails:`,
      creatorCardUrl,
      '',
      `Type: ${type}`,
      `📍 ${locationDisplay}`,
      `📅 ${datesDisplay}`,
      message.trim() ? `Details: ${message}` : '',
      '',
      `— @${twitterUsername}`,
      id ? `https://collabs.onlymatt.ca?booking=${id}` : '',
    ].filter(Boolean).join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Save booking to API
    let id = '';
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          twitterUsername,
          twitterImage,
          name,
          type,
          city: locationDisplay,
          dates: datesDisplay,
          address,
          message,
          collabWith,
        }),
      });
      const data = await res.json();
      if (data.booking?.id) {
        id = data.booking.id;
        setBookingId(id);
      }
    } catch {
      // Still send message even if booking save fails
    }

    if (isEvent) {
      // For events: open group link directly (no personal message)
      if (method === 'whatsapp' && contacts.whatsapp) {
        window.open(contacts.whatsapp, '_blank');
      } else if (method === 'telegram' && contacts.telegram) {
        window.open(contacts.telegram, '_blank');
      }
    } else {
      if (method === 'whatsapp' && contacts.whatsapp) {
        const waUrl = contacts.whatsapp.includes('wa.me')
          ? `${contacts.whatsapp}${contacts.whatsapp.includes('?') ? '&' : '?'}text=${encodeURIComponent(buildMessage(id))}`
          : `https://wa.me/?text=${encodeURIComponent(buildMessage(id))}`;
        window.open(waUrl, '_blank');
      } else if (method === 'telegram' && contacts.telegram) {
        const tgMatch = contacts.telegram.match(/t\.me\/([^/?]+)/);
        const tgUser = tgMatch ? tgMatch[1] : '';
        if (tgUser) {
          window.open(`https://t.me/${tgUser}?text=${encodeURIComponent(buildMessage(id))}`, '_blank');
        }
      }
    }
    // For 'copy' method, the confirmation screen handles the copy

    setSaving(false);
    setSent(true);
  };

  const isValid = name.trim() && type && city.trim() && dateFrom;

  /* ── Background velvet ── */
  const velvetBg = (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_75%_25%,rgba(6,182,212,0.14),transparent_38%),radial-gradient(circle_at_65%_78%,rgba(45,212,191,0.12),transparent_40%),linear-gradient(160deg,#020406_0%,#02070a_35%,#030d11_70%,#010304_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(125deg,transparent_0%,rgba(255,255,255,0.22)_50%,transparent_100%)] mix-blend-screen" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-44 -right-44 w-96 h-96 bg-gradient-to-br from-emerald-400/18 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-44 -left-44 w-96 h-96 bg-gradient-to-tr from-cyan-400/16 to-emerald-300/10 rounded-full blur-3xl" />
      </div>
    </>
  );

  /* ── Loading ── */
  if (status === 'loading' || creatorLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-slate-400 relative">
        {velvetBg}
        <p className="text-sm tracking-wider uppercase relative z-10">Loading…</p>
      </main>
    );
  }

  /* ── No creator specified ── */
  if (!collabWith) {
    return (
      <main className="min-h-screen bg-black text-slate-100 relative overflow-hidden flex items-center justify-center">
        {velvetBg}
        <div className="relative z-10 text-center max-w-sm px-6">
          <h1 className="font-extralight uppercase mb-3 text-2xl tracking-wider">
            <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-transparent">
              BOOK A COLLAB
            </span>
          </h1>
          <div className="h-[2px] w-20 bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full mx-auto mb-6" />
          <p className="text-slate-400 text-sm mb-8">
            Browse creators and click &quot;Book a Collab&quot; on their profile to get started.
          </p>
          <a
            href="https://collabs.onlymatt.ca/creators"
            className="inline-block bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium hover:bg-emerald-600/30 transition-all"
          >
            Browse Creators →
          </a>
        </div>
      </main>
    );
  }

  /* ── Not logged in → Twitter login ── */
  if (!session) {
    return (
      <main className="min-h-screen bg-black text-slate-100 relative overflow-hidden flex items-center justify-center">
        {velvetBg}
        <div className="relative z-10 text-center max-w-sm px-6">
          <a
            href="https://collabs.onlymatt.ca/creators"
            className="inline-block mb-10 text-slate-400 hover:text-emerald-300 transition-colors text-sm tracking-wider uppercase"
          >
            ← Creators
          </a>
          {creator?.image && (
            <img src={creator.image} alt={creator.name} className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-emerald-400/40" />
          )}
          <h1 className="font-extralight uppercase mb-3" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', letterSpacing: '0.18em' }}>
            <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-transparent">
              BOOK
            </span>
          </h1>
          <div className="h-[2px] w-20 bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full mx-auto mb-4" />
          <p className="text-slate-400 text-sm tracking-wider mb-2">
            Book a collab with <span className="text-emerald-300">@{collabWith}</span>
          </p>
          {!creator?.claimed && (
            <p className="text-amber-400/70 text-xs mb-6">⚠️ This creator hasn&apos;t claimed their profile yet</p>
          )}
          <p className="text-slate-500 text-xs tracking-wider uppercase mb-10">
            Sign in with X to continue
          </p>
          <button
            onClick={() => {
              // Redirect to me.onlymatt.ca login page which triggers OAuth on the registered domain
              const callbackUrl = encodeURIComponent(window.location.href);
              window.location.href = `https://me.onlymatt.ca/auth/login?callbackUrl=${callbackUrl}`;
            }}
            className="w-full py-3.5 rounded-xl text-sm tracking-[0.15em] uppercase font-semibold bg-white text-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Sign in with X
          </button>
        </div>
      </main>
    );
  }

  /* ── Sent confirmation with floating card ── */
  if (sent) {
    const collabsUrl = bookingId
      ? `https://collabs.onlymatt.ca?booking=${bookingId}`
      : 'https://collabs.onlymatt.ca';
    const fallbackMsg = buildFallbackMessage(bookingId);
    return (
      <main className="min-h-screen bg-black text-slate-100 relative overflow-hidden flex items-center justify-center">
        {velvetBg}
        <div className="relative z-10 text-center max-w-sm px-6">
          {/* Floating card preview */}
          <div className="mb-8 inline-block">
            <div className="relative border border-emerald-500/30 rounded-2xl p-5 bg-white/[0.03] backdrop-blur-sm max-w-[280px] mx-auto" style={{ animation: 'floatCard 4s ease-in-out infinite' }}>
              <div className="flex items-center gap-3 mb-3">
                {twitterImage && (
                  <img src={twitterImage} alt={twitterUsername} className="w-12 h-12 rounded-full border-2 border-emerald-400/40" />
                )}
                <div className="text-left">
                  <p className="text-slate-100 text-sm font-semibold">{name}</p>
                  <p className="text-emerald-300/70 text-xs">@{twitterUsername}</p>
                </div>
              </div>
              <div className="space-y-1 text-left">
                <p className="text-slate-400 text-xs"><span className="text-slate-600">To:</span> @{collabWith}</p>
                <p className="text-slate-400 text-xs"><span className="text-slate-600">Type:</span> {type}</p>
                <p className="text-slate-400 text-xs"><span className="text-slate-600">City:</span> {locationDisplay}</p>
                <p className="text-slate-400 text-xs"><span className="text-slate-600">Date:</span> {datesDisplay}</p>
                {address && <p className="text-slate-400 text-xs"><span className="text-slate-600">Address:</span> {address}</p>}
              </div>
              <div className="absolute -top-2 -right-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full">
                PENDING
              </div>
            </div>
          </div>

          {isEvent && method !== 'copy' ? (
            <>
              <h1 className="font-extralight uppercase mb-3 text-2xl tracking-wider">
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  YOU&apos;RE IN ✓
                </span>
              </h1>
              <p className="text-slate-400 text-sm mb-2">
                Tu es inscrit·e à <span className="text-cyan-200">{eventData?.title || collabWith}</span>.
              </p>
              <div className="flex gap-3 justify-center mb-6">
                {contacts.whatsapp && (
                  <a
                    href={contacts.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs tracking-wider uppercase transition-all"
                  >
                    💬 Groupe WhatsApp
                  </a>
                )}
                {contacts.telegram && (
                  <a
                    href={contacts.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-xs tracking-wider uppercase transition-all"
                  >
                    ✈️ Groupe Telegram
                  </a>
                )}
              </div>
            </>
          ) : !isEvent && method !== 'copy' ? (
            <>
              <h1 className="font-extralight uppercase mb-3 text-2xl tracking-wider">
                <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  REQUEST SENT ✓
                </span>
              </h1>
              <p className="text-slate-400 text-sm mb-2">
                Your collab request has been sent to @{collabWith} via {method === 'whatsapp' ? 'WhatsApp' : 'Telegram'}.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-extralight uppercase mb-3 text-2xl tracking-wider">
                <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  BOOKING SAVED ✓
                </span>
              </h1>
              <p className="text-slate-400 text-sm mb-2">
                @{collabWith} doesn&apos;t have direct contact on their card yet.
              </p>
              <p className="text-slate-500 text-xs mb-4">
                Copy the message below and send it to them on X, Instagram, or however you can reach them:
              </p>
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 mb-4 text-left">
                <pre className="text-slate-300 text-xs whitespace-pre-wrap font-sans leading-relaxed">{fallbackMsg}</pre>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(fallbackMsg);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="mb-4 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 px-5 py-2 rounded-lg text-xs tracking-wider uppercase hover:bg-emerald-600/30 transition-all"
              >
                {copied ? '✓ Copied!' : '📋 Copy Message'}
              </button>
              <div className="flex gap-2 justify-center mb-4">
                <a
                  href={`https://x.com/messages/compose?recipient_id=&text=${encodeURIComponent(fallbackMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white text-xs border border-slate-700/50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Send on X →
                </a>
              </div>
            </>
          )}

          <p className="text-slate-500 text-xs mb-8">
            Your request will appear on the collabs page.
          </p>
          <div className="space-y-3">
            {/* Calendar sync buttons */}
            {dateFrom && (
              <>
                <button
                  onClick={() => {
                    const durationHours: Record<string, number> = { '1h': 1, '2h': 2, '3h': 3, 'Half day': 5, 'Full day': 10, 'Multiple days': 24 };
                    const hours = durationHours[duration] || 2;
                    const startDate = time ? new Date(`${dateFrom}T${time}:00`) : new Date(`${dateFrom}T12:00:00`);
                    const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);
                    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
                    const title = `ONLYMATT Collab — ${type || 'Shoot'}`;
                    const loc = [address, locationDisplay].filter(Boolean).join(', ');
                    const details = `Collab with @${collabWith}\\n${collabsUrl}`;
                    const ics = [
                      'BEGIN:VCALENDAR',
                      'VERSION:2.0',
                      'BEGIN:VEVENT',
                      `DTSTART:${fmt(startDate)}`,
                      `DTEND:${fmt(endDate)}`,
                      `SUMMARY:${title}`,
                      `LOCATION:${loc}`,
                      `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
                      'END:VEVENT',
                      'END:VCALENDAR',
                    ].join('\r\n');
                    const blob = new Blob([ics], { type: 'text/calendar' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `onlymatt-collab-${dateFrom}.ics`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="block w-full text-center text-emerald-300/70 hover:text-emerald-300 text-xs tracking-[0.2em] uppercase transition-colors border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl py-2.5"
                >
                  📅 Add to Calendar (.ics)
                </button>
                <a
                  href={(() => {
                    const durationHours: Record<string, number> = { '1h': 1, '2h': 2, '3h': 3, 'Half day': 5, 'Full day': 10, 'Multiple days': 24 };
                    const hours = durationHours[duration] || 2;
                    const startDate = time ? new Date(`${dateFrom}T${time}:00`) : new Date(`${dateFrom}T12:00:00`);
                    const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);
                    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
                    const title = encodeURIComponent(`ONLYMATT Collab — ${type || 'Shoot'}`);
                    const loc = encodeURIComponent([address, locationDisplay].filter(Boolean).join(', '));
                    const details = encodeURIComponent(`Collab with @${collabWith}\n${collabsUrl}`);
                    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(startDate)}/${fmt(endDate)}&location=${loc}&details=${details}`;
                  })()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center text-emerald-300/70 hover:text-emerald-300 text-xs tracking-[0.2em] uppercase transition-colors border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl py-2.5"
                >
                  📅 Add to Google Calendar
                </a>
              </>
            )}
            <a href={collabsUrl} className="block text-emerald-300/70 hover:text-emerald-300 text-xs tracking-[0.2em] uppercase transition-colors">
              View collabs →
            </a>
            <a href="https://collabs.onlymatt.ca/creators" className="block text-slate-500 hover:text-emerald-300 text-xs tracking-[0.2em] uppercase transition-colors">
              ← Back to Creators
            </a>
          </div>
        </div>

        <style jsx>{`
          @keyframes floatCard {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </main>
    );
  }

  /* ── Logged in → Booking form ── */
  return (
    <main className="min-h-screen bg-black text-slate-100 relative overflow-hidden">
      {velvetBg}

      <div className="relative z-10 max-w-lg mx-auto px-6 py-12">
        <a
          href="https://collabs.onlymatt.ca/creators"
          className="inline-block mb-8 text-slate-400 hover:text-emerald-300 transition-colors text-sm tracking-wider uppercase"
        >
          ← Creators
        </a>

        {/* Header with Twitter profile */}
        <div className="mb-10 text-center">
          {twitterImage && (
            <img src={twitterImage} alt={twitterUsername} className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-emerald-400/40" />
          )}
          <h1 className="font-extralight uppercase mb-1" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', letterSpacing: '0.18em' }}>
            <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-transparent">
              BOOK
            </span>
          </h1>
          <p className="text-emerald-300/70 text-xs tracking-wider mb-1">
            @{twitterUsername}
          </p>
          <button
            onClick={() => signOut()}
            className="text-slate-600 text-[10px] tracking-wider uppercase hover:text-slate-400 transition-colors"
          >
            Not you? Sign out
          </button>
          <div className="h-[2px] w-20 bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full mx-auto mt-4" />
        </div>

        {/* Event banner */}
        {isEvent && eventData && (
          <div className="mb-6 border border-cyan-500/30 rounded-xl px-4 py-3 bg-cyan-500/[0.06]">
            <div className="flex items-center gap-3">
              {eventData.image ? (
                <img src={eventData.image} alt={eventData.title} className="w-10 h-10 rounded-lg object-cover border border-cyan-400/30" />
              ) : (
                <div className="w-10 h-10 rounded-lg border border-cyan-400/30 bg-cyan-500/10 flex items-center justify-center text-xl">
                  {eventData.emoji || '📅'}
                </div>
              )}
              <div>
                <p className="text-cyan-300/90 text-xs tracking-[0.15em] uppercase">
                  📅 Rejoindre <span className="font-semibold text-cyan-200">{eventData.title}</span>
                </p>
                <p className="text-slate-500 text-[10px] mt-0.5">📍 {eventData.location}</p>
              </div>
            </div>
            {eventData.tags && eventData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {eventData.tags.map((tag: string) => (
                  <span key={tag} className="text-[9px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400/70 px-2 py-0.5 rounded-full uppercase tracking-wider">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Creator collab banner */}
        {!isEvent && creator && (
          <div className="mb-6 border border-emerald-500/30 rounded-xl px-4 py-3 bg-emerald-500/[0.06]">
            <div className="flex items-center gap-3">
              {creator.image && (
                <img src={creator.image} alt={creator.name} className="w-10 h-10 rounded-full border border-emerald-400/30" />
              )}
              <div>
                <p className="text-emerald-300/90 text-xs tracking-[0.15em] uppercase">
                  🤝 Booking a collab with <span className="font-semibold text-emerald-200">@{collabWith}</span>
                </p>
                {!creator.claimed && (
                  <p className="text-amber-400/60 text-[10px] mt-0.5">⚠️ Profile not yet claimed by creator</p>
                )}
                {!hasDirectContact && (
                  <p className="text-slate-500 text-[10px] mt-0.5">No direct contact — you&apos;ll get a copyable message</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-emerald-300/70 mb-2 font-medium">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-white/[0.04] border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Collab Type */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-emerald-300/70 mb-2 font-medium">
              Type of Collab
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COLLAB_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-2.5 rounded-xl text-xs tracking-wider uppercase font-medium border transition-all ${
                    type === t
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/[0.02] border-slate-700/40 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* City / Location */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-emerald-300/70 mb-2 font-medium">
              📍 City / Location
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Montréal, Toronto, NYC..."
              className="w-full bg-white/[0.04] border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {country && (
              <p className="text-emerald-300/50 text-xs mt-1.5 tracking-wide flex items-center gap-1">
                <span>📍</span> {city}, {country}{event ? ` — ${event}` : ''}
              </p>
            )}
          </div>

          {/* Date, Time & Duration */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-emerald-300/70 mb-2 font-medium">
              📅 Date
            </label>
            {event && (
              <p className="text-cyan-300/50 text-xs mb-2 tracking-wide">{event}</p>
            )}
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-white/[0.04] border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark] mb-3"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] tracking-wider uppercase text-slate-500 mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white/[0.04] border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] tracking-wider uppercase text-slate-500 mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white/[0.04] border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark] appearance-none"
                >
                  <option value="" className="bg-slate-900">Select…</option>
                  <option value="1h" className="bg-slate-900">1 hour</option>
                  <option value="2h" className="bg-slate-900">2 hours</option>
                  <option value="3h" className="bg-slate-900">3 hours</option>
                  <option value="Half day" className="bg-slate-900">Half day</option>
                  <option value="Full day" className="bg-slate-900">Full day</option>
                  <option value="Multiple days" className="bg-slate-900">Multiple days</option>
                </select>
              </div>
            </div>
            {datesDisplay && (
              <p className="text-emerald-300/50 text-xs mt-1.5 tracking-wide">📅 {datesDisplay}</p>
            )}
          </div>

          {/* Shoot Address */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-emerald-300/70 mb-2 font-medium">
              🏠 Shoot Address <span className="text-slate-600">(optional)</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Hotel, Airbnb, studio address..."
              className="w-full bg-white/[0.04] border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            {address.trim() && (
              <a
                href={`https://maps.apple.com/?q=${encodeURIComponent(address)}`}
                onClick={(e) => {
                  // Detect platform: Apple Maps on iOS/Mac, Google Maps otherwise
                  const isApple = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
                  if (!isApple) {
                    e.preventDefault();
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
                  }
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-300/50 hover:text-emerald-300 text-xs mt-1.5 tracking-wide transition-colors"
              >
                📍 Open in Maps →
              </a>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-emerald-300/70 mb-2 font-medium">
              Details <span className="text-slate-600">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Describe your project, vibe, budget..."
              className="w-full bg-white/[0.04] border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
            />
          </div>

          {/* Send via */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-emerald-300/70 mb-2 font-medium">
              {isEvent ? 'Rejoindre via' : 'Send via'}
            </label>
            <div className="flex gap-3">
              {hasWhatsApp && (
                <button
                  type="button"
                  onClick={() => setMethod('whatsapp')}
                  className={`flex-1 py-2.5 rounded-xl text-xs tracking-wider uppercase font-medium border transition-all ${
                    method === 'whatsapp'
                      ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/[0.02] border-slate-700/40 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {isEvent ? '💬 Groupe WA' : 'WhatsApp'}
                </button>
              )}
              {hasTelegram && (
                <button
                  type="button"
                  onClick={() => setMethod('telegram')}
                  className={`flex-1 py-2.5 rounded-xl text-xs tracking-wider uppercase font-medium border transition-all ${
                    method === 'telegram'
                      ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-white/[0.02] border-slate-700/40 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {isEvent ? '✈️ Groupe Tg' : 'Telegram'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setMethod('copy')}
                className={`flex-1 py-2.5 rounded-xl text-xs tracking-wider uppercase font-medium border transition-all ${
                  method === 'copy'
                    ? 'bg-slate-600/20 border-slate-500/40 text-slate-200'
                    : 'bg-white/[0.02] border-slate-700/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                📋 Copy
              </button>
            </div>
            {method === 'copy' && (
              <p className="text-slate-500 text-[10px] mt-2">
                A copyable message will be generated so you can send it to @{collabWith} yourself
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || saving}
            className={`w-full py-3.5 rounded-xl text-sm tracking-[0.15em] uppercase font-semibold transition-all ${
              isValid && !saving
                ? 'bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 border border-emerald-500/40 text-emerald-200 hover:from-emerald-600/40 hover:to-cyan-600/40 cursor-pointer'
                : 'bg-white/[0.03] border border-slate-800/40 text-slate-600 cursor-not-allowed'
            }`}
          >
            {saving
              ? 'Sending…'
              : isValid
                ? isEvent
                  ? method === 'whatsapp'
                    ? 'Rejoindre via WhatsApp →'
                    : method === 'telegram'
                      ? 'Rejoindre via Telegram →'
                      : 'Confirmer la participation →'
                  : method === 'whatsapp'
                    ? 'Send via WhatsApp →'
                    : method === 'telegram'
                      ? 'Send via Telegram →'
                      : 'Save & Get Message →'
                : 'Fill all fields to continue'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center space-y-2">
          <a href="https://collabs.onlymatt.ca/creators" className="block text-slate-500 hover:text-emerald-300 transition-colors text-xs tracking-[0.2em] uppercase">
            View upcoming collabs →
          </a>
          <a href="https://collabs.onlymatt.ca/creators" className="block text-slate-500 hover:text-emerald-300 transition-colors text-xs tracking-[0.2em] uppercase">
            ← Back to Creators
          </a>
        </div>
      </div>
    </main>
  );
}
