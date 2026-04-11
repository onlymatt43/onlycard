'use client';

import { useState, FormEvent } from 'react';

/* ──────────────── Types ──────────────── */

interface LinkItem { label: string; url: string }
interface GroupConfig { label: string; links: LinkItem[] }
interface MainLink { title: string; url: string; icon: string; iconPosition: { top: string; left: string } }
interface FloatingCard { url: string; label?: string }
interface Destination {
  city: string; country: string; dates: string;
  status: 'confirmed' | 'upcoming' | 'open' | 'past';
  description: string; emoji: string; link?: string; image?: string;
}
interface CollabType { type: string; icon: string; description: string }

interface Config {
  groups: { payment: GroupConfig; social: GroupConfig; adult: GroupConfig; connect: GroupConfig; affiliates: GroupConfig };
  mainLinks: MainLink[];
  floatingCards: FloatingCard[];
  collabs: { destinations: Destination[]; collabTypes: CollabType[] };
}

type GroupKey = keyof Config['groups'];

/* ──────────────── Sections ──────────────── */

const SECTIONS = [
  { id: 'payment', label: '💳 Payment' },
  { id: 'social', label: '📱 Social Media' },
  { id: 'adult', label: '🔞 Adult Content' },
  { id: 'connect', label: '💬 Connect' },
  { id: 'affiliates', label: '🤝 Affiliates' },
  { id: 'mainLinks', label: '🔗 Main Links' },
  { id: 'floatingCards', label: '🃏 Floating Cards' },
  { id: 'destinations', label: '✈️ Destinations' },
  { id: 'collabTypes', label: '📸 Collab Types' },
  { id: 'creators', label: '👤 Creators' },
];

interface CreatorProfile {
  username: string;
  name: string;
  image: string;
  bio: string;
  twitterId: string;
  links: { label: string; url: string }[];
  claimed: boolean;
  createdAt: string;
  createdBy: 'admin' | 'booking' | 'self';
}

const GROUP_KEYS: GroupKey[] = ['payment', 'social', 'adult', 'connect', 'affiliates'];

/* ──────────────── Styles ──────────────── */

const inputCls = 'bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-400';

/* ──────────────── Chat message ──────────────── */

interface ChatMsg { role: 'user' | 'system'; text: string }

/* ──────────────── Component ──────────────── */

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [authError, setAuthError] = useState('');

  const [config, setConfig] = useState<Config | null>(null);
  const [activeSection, setActiveSection] = useState('payment');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { role: 'system', text: 'Bienvenue! Tapez "aide" pour les commandes.' },
  ]);

  // Creators state
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [creatorsLoaded, setCreatorsLoaded] = useState(false);
  const [newTwitterInput, setNewTwitterInput] = useState('');
  const [fetchingTwitter, setFetchingTwitter] = useState(false);
  const [creatorStatus, setCreatorStatus] = useState('');

  const fetchCreators = async () => {
    try {
      const res = await fetch('/api/creators');
      if (res.ok) {
        setCreators(await res.json());
        setCreatorsLoaded(true);
      }
    } catch {}
  };

  const addCreatorFromTwitter = async () => {
    if (!newTwitterInput.trim()) return;
    setFetchingTwitter(true);
    setCreatorStatus('');
    try {
      const res = await fetch('/api/creators/fetch-twitter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: pwd },
        body: JSON.stringify({ username: newTwitterInput.trim() }),
      });
      if (res.ok) {
        const { creator } = await res.json();
        setCreatorStatus(`✅ ${creator.username} ajouté`);
        setNewTwitterInput('');
        fetchCreators();
      } else {
        const err = await res.json();
        setCreatorStatus(`❌ ${err.error || 'Erreur'}`);
      }
    } catch {
      setCreatorStatus('❌ Erreur réseau');
    }
    setFetchingTwitter(false);
  };

  const removeCreator = async (username: string) => {
    const updated = creators.filter(c => c.username !== username);
    try {
      // Direct save via GitHub API (same pattern as bookings)
      const getRes = await fetch(`/api/creators`);
      if (!getRes.ok) return;
      // We need to save via a dedicated endpoint, but for now just refetch after delete
      const res = await fetch(`/api/creators/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _delete: true }),
      });
      if (res.ok) {
        setCreators(updated);
        setCreatorStatus(`✅ ${username} supprimé`);
      }
    } catch {
      setCreatorStatus('❌ Erreur');
    }
  };

  /* ── Auth ── */

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/config', { headers: { Authorization: pwd } });
      if (res.ok) {
        setAuthed(true);
        setConfig(await res.json());
      } else {
        setAuthError('Mot de passe incorrect');
      }
    } catch {
      setAuthError('Erreur réseau');
    }
  };

  /* ── Save ── */

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setStatus('');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: pwd },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setStatus('✅ Sauvegardé! Déploiement Vercel en cours…');
        setHasChanges(false);
      } else {
        const err = await res.json();
        setStatus(`❌ ${err.error || 'Erreur inconnue'}`);
      }
    } catch {
      setStatus('❌ Erreur réseau');
    }
    setSaving(false);
  };

  /* ── Config updater (immutable) ── */

  const updateConfig = (updater: (c: Config) => Config) => {
    if (!config) return;
    setConfig(updater(structuredClone(config)));
    setHasChanges(true);
  };

  /* ── Chat command processor ── */

  const findSection = (name: string) => {
    const l = name.trim().toLowerCase();
    return SECTIONS.find(s => s.id.toLowerCase() === l || s.label.toLowerCase().includes(l));
  };

  const findDest = (name: string) => {
    const l = name.trim().toLowerCase();
    return config?.collabs.destinations.findIndex(d => d.city.toLowerCase().includes(l)) ?? -1;
  };

  const processCommand = (input: string): string => {
    const lower = input.toLowerCase().trim();
    const original = input.trim();

    if (lower === 'aide' || lower === 'help') {
      return [
        'Commandes:',
        '',
        '── Liens ──',
        '• ajoute LABEL URL dans SECTION',
        '• supprime LABEL de SECTION',
        '',
        '── Destinations ──',
        '• dates VILLE = NOUVELLES DATES',
        '• description VILLE = NOUVEAU TEXTE',
        '• image VILLE = URL_IMAGE',
        '• lien VILLE = URL',
        '• status VILLE = confirmed|upcoming|open|past',
        '• emoji VILLE = 🏠',
        '• nouvelle destination VILLE, PAYS',
        '• supprime destination VILLE',
        '',
        '── Navigation ──',
        '• montre SECTION',
        '• sections',
        '• liste destinations',
        '',
        'Sections: payment, social, adult, connect, affiliates, mainLinks, floatingCards, destinations, collabTypes',
      ].join('\n');
    }

    if (lower === 'sections') {
      return SECTIONS.map(s => `• ${s.id}: ${s.label}`).join('\n');
    }

    // List destinations
    if (lower === 'liste destinations' || lower === 'list destinations' || lower === 'destinations') {
      if (!config) return 'Config non chargée';
      return config.collabs.destinations.map((d, i) => `${i + 1}. ${d.emoji} ${d.city} (${d.country}) — ${d.dates} [${d.status}]`).join('\n');
    }

    // Show / navigate
    const showMatch = lower.match(/^(?:montre|show|go|va)\s+(.+)$/);
    if (showMatch) {
      const sec = findSection(showMatch[1]);
      if (sec) { setActiveSection(sec.id); return `→ ${sec.label}`; }
      return `Section non trouvée: "${showMatch[1]}"`;
    }

    // ── Destination modifiers: "dates VILLE = VALUE" ──
    const destFieldMatch = original.match(/^(dates?|description|desc|image|lien|link|status|emoji)\s+(.+?)\s*=\s*(.+)$/i);
    if (destFieldMatch) {
      const [, rawField, cityName, rawValue] = destFieldMatch;
      const value = rawValue.trim();
      const field = rawField.toLowerCase();
      const idx = findDest(cityName);
      if (idx < 0) return `Destination non trouvée: "${cityName}"`;
      const dest = config!.collabs.destinations[idx];

      if (field === 'dates' || field === 'date') {
        updateConfig(c => { c.collabs.destinations[idx].dates = value; return c; });
        return `✅ Dates de ${dest.city} → "${value}"`;
      }
      if (field === 'description' || field === 'desc') {
        updateConfig(c => { c.collabs.destinations[idx].description = value; return c; });
        return `✅ Description de ${dest.city} mise à jour`;
      }
      if (field === 'image') {
        updateConfig(c => { c.collabs.destinations[idx].image = value || undefined; return c; });
        return `✅ Image de ${dest.city} → ${value}`;
      }
      if (field === 'lien' || field === 'link') {
        updateConfig(c => { c.collabs.destinations[idx].link = value || undefined; return c; });
        return `✅ Lien de ${dest.city} → ${value}`;
      }
      if (field === 'status') {
        const valid = ['confirmed', 'upcoming', 'open', 'past'];
        if (!valid.includes(value.toLowerCase())) return `Status invalide. Choix: ${valid.join(', ')}`;
        updateConfig(c => { c.collabs.destinations[idx].status = value.toLowerCase() as Destination['status']; return c; });
        return `✅ Status de ${dest.city} → ${value}`;
      }
      if (field === 'emoji') {
        updateConfig(c => { c.collabs.destinations[idx].emoji = value; return c; });
        return `✅ Emoji de ${dest.city} → ${value}`;
      }
    }

    // New destination: "nouvelle destination VILLE, PAYS"
    const newDestMatch = original.match(/^(?:nouvelle? destination|new destination|ajoute destination)\s+(.+?),\s*(.+)$/i);
    if (newDestMatch) {
      const [, city, country] = newDestMatch;
      updateConfig(c => {
        c.collabs.destinations.push({ city: city.toUpperCase(), country: country.toUpperCase(), dates: '', status: 'upcoming', description: '', emoji: '📍' });
        return c;
      });
      setActiveSection('destinations');
      return `✅ Destination "${city.toUpperCase()}" ajoutée`;
    }

    // Remove destination: "supprime destination VILLE"
    const rmDestMatch = lower.match(/^(?:supprime|remove|delete)\s+destination\s+(.+)$/);
    if (rmDestMatch) {
      const idx = findDest(rmDestMatch[1]);
      if (idx < 0) return `Destination non trouvée: "${rmDestMatch[1]}"`;
      const name = config!.collabs.destinations[idx].city;
      updateConfig(c => { c.collabs.destinations.splice(idx, 1); return c; });
      return `✅ Destination "${name}" supprimée`;
    }

    // Add link to group
    const addMatch = lower.match(/^(?:ajoute|add)\s+(\S+)\s+(https?:\/\/\S+)\s+(?:dans|to|in)\s+(.+)$/);
    if (addMatch) {
      const [, label, url, secName] = addMatch;
      const sec = findSection(secName);
      if (!sec) return `Section non trouvée: "${secName}"`;
      if (GROUP_KEYS.includes(sec.id as GroupKey)) {
        updateConfig(c => { c.groups[sec.id as GroupKey].links.push({ label: label.toUpperCase(), url }); return c; });
        return `✅ "${label.toUpperCase()}" ajouté dans ${sec.label}`;
      }
      if (sec.id === 'floatingCards') {
        updateConfig(c => { c.floatingCards.push({ url, label: label.toUpperCase() }); return c; });
        return `✅ Floating card ajoutée: ${url}`;
      }
      return `Utilisez les formulaires pour ${sec.label}.`;
    }

    // Remove link from group
    const rmMatch = lower.match(/^(?:supprime|remove|delete)\s+(\S+)\s+(?:de|from)\s+(.+)$/);
    if (rmMatch) {
      const [, label, secName] = rmMatch;
      const sec = findSection(secName);
      if (!sec) return `Section non trouvée: "${secName}"`;
      if (GROUP_KEYS.includes(sec.id as GroupKey)) {
        const key = sec.id as GroupKey;
        const idx = config?.groups[key].links.findIndex(l => l.label.toLowerCase() === label.toLowerCase());
        if (idx !== undefined && idx >= 0) {
          updateConfig(c => { c.groups[key].links.splice(idx, 1); return c; });
          return `✅ "${label}" supprimé de ${sec.label}`;
        }
        return `"${label}" non trouvé dans ${sec.label}`;
      }
      return `Utilisez les formulaires pour ${sec.label}.`;
    }

    return 'Commande non reconnue. Tapez "aide".';
  };

  const handleChat = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const response = processCommand(chatInput);
    setChatMsgs(prev => [...prev, { role: 'user', text: chatInput }, { role: 'system', text: response }]);
    setChatInput('');
  };

  /* ──────────────── Login Screen ──────────────── */

  if (!authed) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-8 w-full max-w-sm">
          <h1 className="text-xl font-light tracking-wider text-slate-100 text-center mb-6">
            ONLYMATT <span className="text-emerald-400">ADMIN</span>
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              placeholder="Mot de passe"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 mb-4"
            />
            {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg tracking-wider uppercase text-sm transition-colors">
              Connexion
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (!config) {
    return <main className="min-h-screen bg-black flex items-center justify-center text-slate-400">Chargement…</main>;
  }

  /* ──────────────── Section Renderers ──────────────── */

  function renderGroupSection(key: GroupKey) {
    const group = config!.groups[key];
    return (
      <div>
        <h2 className="text-lg font-light tracking-wider mb-1">{group.label}</h2>
        <p className="text-slate-500 text-xs mb-6">Liens du groupe — hover expand, click copie</p>

        <div className="mb-6">
          <label className="text-xs text-slate-400 uppercase tracking-wider">Nom du groupe</label>
          <input
            value={group.label}
            onChange={e => updateConfig(c => { c.groups[key].label = e.target.value; return c; })}
            className={`w-full mt-1 ${inputCls}`}
          />
        </div>

        <div className="space-y-3">
          {group.links.map((link, i) => (
            <div key={i} className="flex gap-3 items-center bg-slate-900/50 border border-slate-700/30 rounded-lg p-3">
              <input value={link.label} onChange={e => updateConfig(c => { c.groups[key].links[i].label = e.target.value; return c; })} placeholder="Label" className={`w-40 ${inputCls}`} />
              <input value={link.url} onChange={e => updateConfig(c => { c.groups[key].links[i].url = e.target.value; return c; })} placeholder="URL" className={`flex-1 ${inputCls}`} />
              <button onClick={() => updateConfig(c => { c.groups[key].links.splice(i, 1); return c; })} className="text-red-400 hover:text-red-300 px-2 text-sm">✕</button>
            </div>
          ))}
        </div>

        <button onClick={() => updateConfig(c => { c.groups[key].links.push({ label: '', url: '' }); return c; })} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-emerald-300 transition-colors">
          + Ajouter un lien
        </button>
      </div>
    );
  }

  function renderMainLinks() {
    return (
      <div>
        <h2 className="text-lg font-light tracking-wider mb-1">Main Links</h2>
        <p className="text-slate-500 text-xs mb-6">Liens principaux avec icônes</p>
        <div className="space-y-3">
          {config!.mainLinks.map((link, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-4 space-y-3">
              <div className="flex gap-3">
                <input value={link.title} onChange={e => updateConfig(c => { c.mainLinks[i].title = e.target.value; return c; })} placeholder="Titre" className={`w-40 ${inputCls}`} />
                <input value={link.url} onChange={e => updateConfig(c => { c.mainLinks[i].url = e.target.value; return c; })} placeholder="URL" className={`flex-1 ${inputCls}`} />
                <button onClick={() => updateConfig(c => { c.mainLinks.splice(i, 1); return c; })} className="text-red-400 hover:text-red-300 px-2 text-sm">✕</button>
              </div>
              <div className="flex gap-3">
                <input value={link.icon} onChange={e => updateConfig(c => { c.mainLinks[i].icon = e.target.value; return c; })} placeholder="Icon" className={`w-32 ${inputCls}`} />
                <input value={link.iconPosition.top} onChange={e => updateConfig(c => { c.mainLinks[i].iconPosition.top = e.target.value; return c; })} placeholder="Top" className={`w-24 ${inputCls}`} />
                <input value={link.iconPosition.left} onChange={e => updateConfig(c => { c.mainLinks[i].iconPosition.left = e.target.value; return c; })} placeholder="Left" className={`w-24 ${inputCls}`} />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => updateConfig(c => { c.mainLinks.push({ title: '', url: '', icon: '', iconPosition: { top: '50%', left: '30%' } }); return c; })} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-emerald-300 transition-colors">
          + Ajouter un lien
        </button>
      </div>
    );
  }

  function renderFloatingCards() {
    return (
      <div>
        <h2 className="text-lg font-light tracking-wider mb-1">Floating Cards</h2>
        <p className="text-slate-500 text-xs mb-6">Cards OG flottantes (max 6)</p>
        <div className="space-y-3">
          {config!.floatingCards.map((card, i) => (
            <div key={i} className="flex gap-3 items-center bg-slate-900/50 border border-slate-700/30 rounded-lg p-3">
              <input value={card.url} onChange={e => updateConfig(c => { c.floatingCards[i].url = e.target.value; return c; })} placeholder="URL" className={`flex-1 ${inputCls}`} />
              <input value={card.label || ''} onChange={e => updateConfig(c => { c.floatingCards[i].label = e.target.value || undefined; return c; })} placeholder="Label (optionnel)" className={`w-36 ${inputCls}`} />
              <button onClick={() => updateConfig(c => { c.floatingCards.splice(i, 1); return c; })} className="text-red-400 hover:text-red-300 px-2 text-sm">✕</button>
            </div>
          ))}
        </div>
        {config!.floatingCards.length < 6 && (
          <button onClick={() => updateConfig(c => { c.floatingCards.push({ url: '' }); return c; })} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-emerald-300 transition-colors">
            + Ajouter une card
          </button>
        )}
      </div>
    );
  }

  function renderDestinations() {
    return (
      <div>
        <h2 className="text-lg font-light tracking-wider mb-1">Destinations</h2>
        <p className="text-slate-500 text-xs mb-6">Villes sur la page collabs</p>
        <div className="space-y-4">
          {config!.collabs.destinations.map((dest, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-4 space-y-3">
              <div className="flex gap-3 items-center">
                <input value={dest.emoji} onChange={e => updateConfig(c => { c.collabs.destinations[i].emoji = e.target.value; return c; })} className={`w-12 text-center ${inputCls}`} />
                <input value={dest.city} onChange={e => updateConfig(c => { c.collabs.destinations[i].city = e.target.value; return c; })} placeholder="Ville" className={`w-36 ${inputCls}`} />
                <input value={dest.country} onChange={e => updateConfig(c => { c.collabs.destinations[i].country = e.target.value; return c; })} placeholder="Pays" className={`w-28 ${inputCls}`} />
                <select value={dest.status} onChange={e => updateConfig(c => { c.collabs.destinations[i].status = e.target.value as Destination['status']; return c; })} className={inputCls}>
                  <option value="confirmed">Confirmed</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="open">Open</option>
                  <option value="past">Past</option>
                </select>
                <button onClick={() => updateConfig(c => { c.collabs.destinations.splice(i, 1); return c; })} className="text-red-400 hover:text-red-300 px-2 text-sm ml-auto">✕</button>
              </div>
              <input value={dest.dates} onChange={e => updateConfig(c => { c.collabs.destinations[i].dates = e.target.value; return c; })} placeholder="Dates" className={`w-full ${inputCls}`} />
              <textarea value={dest.description} onChange={e => updateConfig(c => { c.collabs.destinations[i].description = e.target.value; return c; })} placeholder="Description" rows={2} className={`w-full resize-none ${inputCls}`} />
              <input value={dest.link || ''} onChange={e => updateConfig(c => { c.collabs.destinations[i].link = e.target.value || undefined; return c; })} placeholder="Lien (optionnel)" className={`w-full ${inputCls}`} />
              <input value={dest.image || ''} onChange={e => updateConfig(c => { c.collabs.destinations[i].image = e.target.value || undefined; return c; })} placeholder="Image URL background (optionnel)" className={`w-full ${inputCls}`} />
            </div>
          ))}
        </div>
        <button onClick={() => updateConfig(c => { c.collabs.destinations.push({ city: '', country: '', dates: '', status: 'upcoming', description: '', emoji: '📍' }); return c; })} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-emerald-300 transition-colors">
          + Ajouter une destination
        </button>
      </div>
    );
  }

  function renderCollabTypes() {
    return (
      <div>
        <h2 className="text-lg font-light tracking-wider mb-1">Collab Types</h2>
        <p className="text-slate-500 text-xs mb-6">Types de collaboration sur la page collabs</p>
        <div className="space-y-3">
          {config!.collabs.collabTypes.map((ct, i) => (
            <div key={i} className="flex gap-3 items-center bg-slate-900/50 border border-slate-700/30 rounded-lg p-3">
              <input value={ct.icon} onChange={e => updateConfig(c => { c.collabs.collabTypes[i].icon = e.target.value; return c; })} className={`w-12 text-center ${inputCls}`} />
              <input value={ct.type} onChange={e => updateConfig(c => { c.collabs.collabTypes[i].type = e.target.value; return c; })} placeholder="Type" className={`w-44 ${inputCls}`} />
              <input value={ct.description} onChange={e => updateConfig(c => { c.collabs.collabTypes[i].description = e.target.value; return c; })} placeholder="Description" className={`flex-1 ${inputCls}`} />
              <button onClick={() => updateConfig(c => { c.collabs.collabTypes.splice(i, 1); return c; })} className="text-red-400 hover:text-red-300 px-2 text-sm">✕</button>
            </div>
          ))}
        </div>
        <button onClick={() => updateConfig(c => { c.collabs.collabTypes.push({ type: '', icon: '📌', description: '' }); return c; })} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-emerald-300 transition-colors">
          + Ajouter un type
        </button>
      </div>
    );
  }

  function renderSection() {
    if (GROUP_KEYS.includes(activeSection as GroupKey)) return renderGroupSection(activeSection as GroupKey);
    if (activeSection === 'mainLinks') return renderMainLinks();
    if (activeSection === 'floatingCards') return renderFloatingCards();
    if (activeSection === 'destinations') return renderDestinations();
    if (activeSection === 'collabTypes') return renderCollabTypes();
    if (activeSection === 'creators') return renderCreators();
    return null;
  }

  function renderCreators() {
    if (!creatorsLoaded) {
      fetchCreators();
      return <p className="text-slate-400">Chargement des créateurs…</p>;
    }
    return (
      <div>
        <h2 className="text-lg font-light tracking-wider mb-1">Creator Profiles</h2>
        <p className="text-slate-500 text-xs mb-6">Profils auto-générés — ajoutez des créateurs via leur Twitter/X</p>

        {/* Add from Twitter */}
        <div className="mb-8 bg-slate-900/50 border border-slate-700/40 rounded-xl p-4">
          <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Ajouter un créateur depuis X/Twitter</label>
          <div className="flex gap-2">
            <input
              value={newTwitterInput}
              onChange={e => setNewTwitterInput(e.target.value)}
              placeholder="@username ou https://x.com/username"
              className={`flex-1 ${inputCls}`}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCreatorFromTwitter())}
            />
            <button
              onClick={addCreatorFromTwitter}
              disabled={fetchingTwitter}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm tracking-wider uppercase transition-colors disabled:opacity-50"
            >
              {fetchingTwitter ? '…' : '+ Ajouter'}
            </button>
          </div>
          {creatorStatus && <p className="text-sm mt-2">{creatorStatus}</p>}
        </div>

        {/* Creators list */}
        <div className="space-y-3">
          {creators.length === 0 && <p className="text-slate-500 text-sm">Aucun créateur encore.</p>}
          {creators.map((c) => (
            <div key={c.username} className="flex gap-4 items-center bg-slate-900/50 border border-slate-700/30 rounded-lg p-4">
              {c.image && (
                <img src={c.image} alt={c.username} className="w-12 h-12 rounded-full border-2 border-emerald-400/30" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-slate-100 font-medium text-sm">{c.name}</span>
                  <span className="text-emerald-300/70 text-xs">@{c.username}</span>
                  {c.claimed && <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full uppercase tracking-wider">claimed</span>}
                </div>
                {c.bio && <p className="text-slate-500 text-xs truncate">{c.bio}</p>}
                <div className="flex gap-3 mt-1">
                  <span className="text-slate-600 text-[10px] uppercase">{c.createdBy}</span>
                  <a href={`/creator/${c.username}`} target="_blank" rel="noopener noreferrer" className="text-emerald-300/50 hover:text-emerald-300 text-[10px] uppercase transition-colors">voir profil →</a>
                </div>
              </div>
              <button onClick={() => removeCreator(c.username)} className="text-red-400 hover:text-red-300 px-2 text-sm">✕</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────── Main UI ──────────────── */

  return (
    <main className="min-h-screen bg-black text-slate-100">
      {/* Header */}
      <header className="bg-slate-900/60 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-lg font-light tracking-wider">ONLYMATT <span className="text-emerald-400">ADMIN</span></h1>
        <div className="flex items-center gap-4">
          {status && <span className="text-sm">{status}</span>}
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`px-6 py-2 rounded-lg text-sm tracking-wider uppercase transition-colors ${
              hasChanges ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {saving ? 'Saving…' : hasChanges ? 'Save & Deploy' : 'No Changes'}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-56 bg-slate-900/40 border-r border-slate-700/30 min-h-[calc(100vh-65px)] p-4 sticky top-[65px] shrink-0">
          <div className="space-y-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === s.id
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-700/30">
            <a href="https://me.onlymatt.ca" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-emerald-300 transition-colors tracking-wider">
              ← VOIR LE SITE
            </a>
          </div>
        </nav>

        {/* Main content */}
        <div className="flex-1 p-8 max-w-4xl">
          {/* Command bar */}
          <div className="mb-8 bg-slate-900/50 border border-slate-700/40 rounded-xl p-4">
            <div className="max-h-32 overflow-y-auto mb-3 space-y-1">
              {chatMsgs.map((msg, i) => (
                <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-cyan-300' : 'text-slate-400'}`}>
                  <span className="font-mono text-xs mr-2">{msg.role === 'user' ? '>' : '•'}</span>
                  <span className="whitespace-pre-line">{msg.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleChat} className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder='Commande rapide… (ex: "aide")'
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button type="submit" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">→</button>
            </form>
          </div>

          {/* Active section */}
          {renderSection()}
        </div>
      </div>
    </main>
  );
}
