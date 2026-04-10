import type { Metadata } from 'next';
import config from '../../data/config.json';

export const metadata: Metadata = {
  metadataBase: new URL('https://collabs.onlymatt.ca'),
  title: 'COLLABS — ONLYMATT',
  description: 'Upcoming destinations, events & collaboration opportunities with ONLYMATT. Book a shoot, plan a collab.',
  openGraph: {
    type: 'website',
    title: 'COLLABS — ONLYMATT',
    description: 'Upcoming destinations, events & collaboration opportunities. Book a shoot, plan a collab.',
    url: 'https://collabs.onlymatt.ca',
    siteName: 'ONLYMATT',
    images: [
      {
        url: 'https://onlymatt-public-zone.b-cdn.net/card/solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.JPEG',
        width: 1200,
        height: 630,
        alt: 'ONLYMATT COLLABS',
      },
    ],
    locale: 'fr_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'COLLABS — ONLYMATT',
    description: 'Upcoming destinations, events & collaboration opportunities.',
    images: ['https://onlymatt-public-zone.b-cdn.net/card/solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.JPEG'],
  },
};

// ──────────────────────────────────────────────
// Data loaded from centralized config (editable via admin panel)
// ──────────────────────────────────────────────
const DESTINATIONS = config.collabs.destinations;

const COLLAB_TYPES = config.collabs.collabTypes;

const STATUS_STYLES = {
  confirmed: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', label: 'CONFIRMED' },
  upcoming: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30', label: 'UPCOMING' },
  open: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', label: 'OPEN INVITE' },
  past: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30', label: 'PAST' },
};

export default function CollabsPage() {
  return (
    <main className="min-h-screen bg-black text-slate-100 relative overflow-hidden">
      {/* Background — same velvet as main page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_75%_25%,rgba(6,182,212,0.14),transparent_38%),radial-gradient(circle_at_65%_78%,rgba(45,212,191,0.12),transparent_40%),linear-gradient(160deg,#020406_0%,#02070a_35%,#030d11_70%,#010304_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(125deg,transparent_0%,rgba(255,255,255,0.22)_50%,transparent_100%)] mix-blend-screen" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-44 -right-44 w-96 h-96 bg-gradient-to-br from-emerald-400/18 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-44 -left-44 w-96 h-96 bg-gradient-to-tr from-cyan-400/16 to-emerald-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Back link */}
        <a
          href="https://me.onlymatt.ca"
          className="inline-block mb-8 text-slate-400 hover:text-emerald-300 transition-colors text-sm tracking-wider uppercase"
        >
          ← ONLYMATT
        </a>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-extralight uppercase mb-3" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', letterSpacing: '0.18em' }}>
            <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-transparent">
              COLLABS
            </span>
          </h1>
          <div className="h-[2px] w-20 bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full mx-auto mb-4" />
          <p className="text-slate-400 text-sm tracking-wider uppercase">
            Destinations & Collaboration Opportunities
          </p>
        </div>

        {/* Destinations */}
        <section className="mb-14">
          <h2 className="text-xs tracking-[0.25em] uppercase text-emerald-300/70 mb-6 font-medium">
            Upcoming Destinations
          </h2>
          <div className="space-y-4">
            {DESTINATIONS.map((dest) => {
              const style = STATUS_STYLES[dest.status as keyof typeof STATUS_STYLES];
              const inner = (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dest.emoji}</span>
                      <div>
                        <h3 className="font-semibold tracking-wider text-slate-100" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                          {dest.city}
                        </h3>
                        <p className="text-slate-500 text-xs tracking-wider uppercase">{dest.country} — {dest.dates}</p>
                      </div>
                    </div>
                    <span className={`${style.bg} ${style.text} text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-full border ${style.border}`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed pl-10">
                    {dest.description}
                  </p>
                  {dest.link && (
                    <p className="text-emerald-400/60 text-xs mt-2 pl-10 tracking-wider">
                      View event →
                    </p>
                  )}
                </>
              );
              const cardClass = `block border ${style.border} rounded-xl p-5 backdrop-blur-sm bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 ${dest.link ? 'cursor-pointer hover:scale-[1.01]' : ''}`;
              return dest.link ? (
                <a key={dest.city} href={dest.link} target="_blank" rel="noopener noreferrer" className={cardClass}>
                  {inner}
                </a>
              ) : (
                <div key={dest.city} className={cardClass}>
                  {inner}
                </div>
              );
            })}
          </div>
        </section>

        {/* Collab Types */}
        <section className="mb-14">
          <h2 className="text-xs tracking-[0.25em] uppercase text-emerald-300/70 mb-6 font-medium">
            What I&apos;m Open To
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {COLLAB_TYPES.map((collab) => (
              <div
                key={collab.type}
                className="border border-slate-800/60 rounded-xl p-4 backdrop-blur-sm bg-white/[0.02] text-center"
              >
                <div className="text-2xl mb-2">{collab.icon}</div>
                <h3 className="text-slate-200 text-xs tracking-wider uppercase font-semibold mb-1">{collab.type}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed">{collab.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center border border-emerald-500/20 rounded-xl p-8 backdrop-blur-sm bg-emerald-500/[0.03]">
          <h2 className="text-slate-100 font-semibold tracking-wider uppercase mb-2" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}>
            Let&apos;s Work Together
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Reach out via WhatsApp or Telegram to discuss a collab. Include your idea, location, and dates.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="https://wa.me/15147120578"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 px-5 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium hover:bg-emerald-600/30 transition-all"
            >
              WhatsApp
            </a>
            <a
              href="https://t.me/OnlyMatt43"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 px-5 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium hover:bg-cyan-600/30 transition-all"
            >
              Telegram
            </a>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a href="https://me.onlymatt.ca" className="text-slate-500 hover:text-emerald-300 transition-colors text-xs tracking-[0.2em] uppercase">
            ← Back to ONLYMATT
          </a>
        </div>
      </div>
    </main>
  );
}
