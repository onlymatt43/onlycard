'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';

const TYPES = [
  { id: 'event', label: '📅 Nouvel événement', desc: 'Proposer un événement ou une destination' },
  { id: 'group-event', label: '👥 Événement de groupe', desc: 'Organiser un event avec plusieurs créateurs' },
  { id: 'proposal', label: '💡 Proposition', desc: 'Idée, feedback ou autre suggestion' },
] as const;

export default function SuggestToPapa() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>('event');
  const [message, setMessage] = useState('');
  const [city, setCity] = useState('');
  const [url, setUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSending(true);

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message: message.trim(),
          city: city.trim() || undefined,
          url: url.trim() || undefined,
          twitterUsername: (session?.user as { username?: string })?.username || session?.user?.name || undefined,
          twitterImage: session?.user?.image || undefined,
        }),
      });

      if (res.ok) {
        setSent(true);
        setMessage('');
        setCity('');
        setUrl('');
      }
    } catch {
      // silent fail
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-2">
        <div className="inline-block bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 px-6 py-3 rounded-xl text-sm tracking-wider">
          ✓ Suggestion envoyée à PAPA
        </div>
        <p className="text-slate-500 text-xs">L&apos;admin va examiner ta proposition</p>
        <button
          onClick={() => { setSent(false); setOpen(false); }}
          className="text-slate-500 hover:text-emerald-300 text-xs tracking-wider uppercase transition-colors mt-2"
        >
          Envoyer une autre →
        </button>
      </div>
    );
  }

  // Not logged in — show login button
  if (status !== 'loading' && !session) {
    return (
      <button
        onClick={() => signIn('twitter')}
        className="inline-block bg-slate-800/60 border border-slate-700/50 text-slate-300 px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium hover:bg-slate-800 hover:text-emerald-300 transition-all"
      >
        🔐 Login with X to suggest →
      </button>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-block bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 px-6 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium hover:bg-emerald-600/30 transition-all"
      >
        💡 Suggest to PAPA →
      </button>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 max-w-md mx-auto space-y-4">
      <h3 className="text-sm font-light tracking-wider text-slate-200 text-center uppercase">
        Suggestion pour <span className="text-emerald-400">PAPA</span>
      </h3>

      {/* Type selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
              type === t.id
                ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-slate-500 text-[10px] text-center">
        {TYPES.find(t => t.id === type)?.desc}
      </p>

      {/* City (optional) */}
      {(type === 'event' || type === 'group-event') && (
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Ville / Destination (optionnel)"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400/50"
        />
      )}

      {/* URL (optional) */}
      <input
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="URL de l'événement (optionnel)"
        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400/50"
      />

      {/* Message */}
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Décris ta suggestion..."
        rows={3}
        maxLength={1000}
        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 resize-none"
      />

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => { setOpen(false); setMessage(''); setCity(''); setUrl(''); }}
          className="text-slate-500 hover:text-slate-300 text-xs tracking-wider uppercase transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || sending}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs px-5 py-2 rounded-lg tracking-wider uppercase transition-colors"
        >
          {sending ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>
    </div>
  );
}
