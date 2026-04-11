import config from '../../../data/config.json';
import CreatorsDirectory from '../../components/CreatorsDirectory';

const DESTINATIONS = config.collabs.destinations as Array<{
  city: string; country: string; dates: string; status: string;
  description: string; emoji: string; link?: string;
  startDate?: string; endDate?: string;
}>;

export default function CreatorsPage() {
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
              CREATORS & EVENTS
            </span>
          </h1>
          <div className="h-[2px] w-20 bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full mx-auto mb-4" />
          <p className="text-slate-400 text-sm tracking-wider uppercase">
            Browse creators and upcoming events
          </p>
        </div>

        <CreatorsDirectory destinations={DESTINATIONS} />

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
