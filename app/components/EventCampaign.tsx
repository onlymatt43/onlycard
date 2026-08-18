import React from 'react';
import config from '../../data/config.json';
import { formatDate } from '../lib/dates';

interface EventPitch {
  availability?: string;
  lookingFor?: string[];
  note?: string;
  contactLabels?: string[];
}

interface CampaignEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  location?: string;
  url?: string;
  pitch: EventPitch;
}

interface ConnectLink {
  label: string;
  url: string;
  audience?: string;
}

// Resolve the event's contact links from the single source of truth (config connect),
// preserving the order declared in pitch.contactLabels.
function resolveContacts(labels: string[] | undefined, eventTitle: string): ConnectLink[] {
  if (!labels || labels.length === 0) return [];
  const allLinks = config.groups.connect.links as ConnectLink[];
  return labels
    .map((wanted) => allLinks.find((l) => l.label === wanted))
    .filter((l): l is ConnectLink => Boolean(l))
    .map((l) =>
      l.url.startsWith('mailto:')
        ? { ...l, url: `${l.url}?subject=${encodeURIComponent(`${eventTitle} — Collab`)}` }
        : l
    );
}

export default function EventCampaign({ event }: { event: CampaignEvent }) {
  const contacts = resolveContacts(event.pitch.contactLabels, event.title);
  // Same date convention as EventCard (shared formatDate)
  const dates = event.endDate && event.endDate !== event.date
    ? `${formatDate(event.date)} → ${formatDate(event.endDate)}`
    : formatDate(event.date);

  return (
    <main className="min-h-screen bg-black text-slate-100 flex flex-col items-center px-6 py-10 relative overflow-hidden">
      {/* Background velvet effect (same palette as LinkTree) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_75%_25%,rgba(6,182,212,0.14),transparent_38%),radial-gradient(circle_at_65%_78%,rgba(45,212,191,0.12),transparent_40%),linear-gradient(160deg,#020406_0%,#02070a_35%,#030d11_70%,#010304_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(125deg,transparent_0%,rgba(255,255,255,0.22)_50%,transparent_100%)] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center gap-8 my-auto">
        {/* Brand header */}
        <header className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-black tracking-[0.3em]">
            <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-transparent">
              ONLYMATT
            </span>
          </h1>
          <div className="h-[2px] w-16 bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full" />
        </header>

        {/* Event block — the eye-catcher */}
        <section className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-5">
          {event.url ? (
            <a href={event.url} target="_blank" rel="noopener noreferrer" className="block hover:brightness-110 transition-all">
              <p className="text-emerald-200 uppercase tracking-[0.2em] text-xs mb-1">LIVE @</p>
              <h2 className="text-xl font-bold text-emerald-100 uppercase">{event.title}</h2>
            </a>
          ) : (
            <>
              <p className="text-emerald-200 uppercase tracking-[0.2em] text-xs mb-1">LIVE @</p>
              <h2 className="text-xl font-bold text-emerald-100 uppercase">{event.title}</h2>
            </>
          )}
          <p className="text-slate-300 tracking-widest text-sm mt-2">
            {dates}
            {event.location ? ` · ${event.location}` : ''}
          </p>
          {event.pitch.availability && (
            <p className="text-cyan-200 font-semibold mt-3 text-sm uppercase tracking-wide">
              {event.pitch.availability}
            </p>
          )}
        </section>

        {/* Looking for */}
        {event.pitch.lookingFor && event.pitch.lookingFor.length > 0 && (
          <section className="w-full">
            <h3 className="text-slate-400 uppercase tracking-[0.25em] text-xs mb-3">Looking for</h3>
            <ul className="flex flex-col gap-2">
              {event.pitch.lookingFor.map((item) => (
                <li key={item} className="rounded-xl border border-slate-700/60 bg-white/[0.03] px-4 py-3 text-slate-100 text-sm">
                  {item}
                </li>
              ))}
            </ul>
            {event.pitch.note && (
              <p className="text-emerald-300/90 italic mt-4 text-sm">{event.pitch.note}</p>
            )}
          </section>
        )}

        {/* Direct contacts */}
        {contacts.length > 0 && (
          <section className="w-full flex flex-col gap-3">
            {contacts.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="block rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold uppercase tracking-widest py-3 text-sm hover:brightness-110 hover:scale-[1.02] transition-all"
              >
                {link.label}
              </a>
            ))}
          </section>
        )}

        {/* Escape hatch to the full profile */}
        <a href="/" className="text-slate-400 hover:text-slate-200 uppercase tracking-[0.2em] text-xs transition-colors">
          Full profile →
        </a>
      </div>
    </main>
  );
}
