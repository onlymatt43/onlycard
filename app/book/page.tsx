'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

const COLLAB_TYPES = [
  'Photo Shoot',
  'Video Content',
  'Event / Appearance',
  'Brand Partnership',
  'Other',
];

export default function BookPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [dates, setDates] = useState('');
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState<'whatsapp' | 'telegram'>('whatsapp');

  const buildMessage = () => {
    const lines = [
      `Hey ONLYMATT! I'd like to book a collab.`,
      '',
      `Name: ${name}`,
      `Type: ${type}`,
      `City: ${city}`,
      `Dates: ${dates}`,
    ];
    if (message.trim()) {
      lines.push(`Details: ${message}`);
    }
    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = buildMessage();
    if (method === 'whatsapp') {
      window.open(`https://wa.me/15147120578?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      window.open(`https://t.me/OnlyMatt43?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const isValid = name.trim() && type && city.trim() && dates.trim();

  return (
    <main className="min-h-screen bg-black text-slate-100 relative overflow-hidden">
      {/* Background — same velvet */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_75%_25%,rgba(6,182,212,0.14),transparent_38%),radial-gradient(circle_at_65%_78%,rgba(45,212,191,0.12),transparent_40%),linear-gradient(160deg,#020406_0%,#02070a_35%,#030d11_70%,#010304_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(125deg,transparent_0%,rgba(255,255,255,0.22)_50%,transparent_100%)] mix-blend-screen" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-44 -right-44 w-96 h-96 bg-gradient-to-br from-emerald-400/18 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-44 -left-44 w-96 h-96 bg-gradient-to-tr from-cyan-400/16 to-emerald-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 py-12">
        {/* Back link */}
        <a
          href="https://me.onlymatt.ca"
          className="inline-block mb-8 text-slate-400 hover:text-emerald-300 transition-colors text-sm tracking-wider uppercase"
        >
          ← ONLYMATT
        </a>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-extralight uppercase mb-3" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', letterSpacing: '0.18em' }}>
            <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-transparent">
              BOOK
            </span>
          </h1>
          <div className="h-[2px] w-20 bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full mx-auto mb-4" />
          <p className="text-slate-400 text-sm tracking-wider uppercase">
            Request a collab or booking
          </p>
        </div>

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

          {/* City */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-emerald-300/70 mb-2 font-medium">
              City / Location
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Montréal, Toronto, NYC..."
              className="w-full bg-white/[0.04] border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Dates */}
          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-emerald-300/70 mb-2 font-medium">
              Preferred Dates
            </label>
            <input
              type="text"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              placeholder="May 15-18, Summer 2026, Flexible..."
              className="w-full bg-white/[0.04] border border-slate-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
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
              Send via
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMethod('whatsapp')}
                className={`flex-1 py-2.5 rounded-xl text-xs tracking-wider uppercase font-medium border transition-all ${
                  method === 'whatsapp'
                    ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/[0.02] border-slate-700/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setMethod('telegram')}
                className={`flex-1 py-2.5 rounded-xl text-xs tracking-wider uppercase font-medium border transition-all ${
                  method === 'telegram'
                    ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-white/[0.02] border-slate-700/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                Telegram
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3.5 rounded-xl text-sm tracking-[0.15em] uppercase font-semibold transition-all ${
              isValid
                ? 'bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 border border-emerald-500/40 text-emerald-200 hover:from-emerald-600/40 hover:to-cyan-600/40 cursor-pointer'
                : 'bg-white/[0.03] border border-slate-800/40 text-slate-600 cursor-not-allowed'
            }`}
          >
            {isValid
              ? method === 'whatsapp'
                ? 'Send via WhatsApp →'
                : 'Send via Telegram →'
              : 'Fill all fields to continue'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center space-y-2">
          <a href="https://collabs.onlymatt.ca" className="block text-slate-500 hover:text-emerald-300 transition-colors text-xs tracking-[0.2em] uppercase">
            View upcoming collabs →
          </a>
          <a href="https://me.onlymatt.ca" className="block text-slate-500 hover:text-emerald-300 transition-colors text-xs tracking-[0.2em] uppercase">
            ← Back to ONLYMATT
          </a>
        </div>
      </div>
    </main>
  );
}
