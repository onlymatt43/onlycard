'use client';

import { useState, useEffect } from 'react';
import EventCard from './EventCard';

interface Participant {
  username: string;
  name: string;
  image: string;
}

interface Event {
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
  status: 'confirmed' | 'past' | 'open';
  participants?: Participant[];
}

export default function CollabEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeEvents = events.filter(e => e.status !== 'past');
  const pastEvents = events.filter(e => e.status === 'past');

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-4 h-4 border border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs tracking-[0.25em] uppercase text-cyan-300/70 font-medium">
          Events & Group Collabs
        </h2>
        {events.length > 3 && (
          <span className="text-xs text-slate-600">{activeEvents.length} active</span>
        )}
      </div>

      <div className="space-y-4">
        {activeEvents.map(ev => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>

      {pastEvents.length > 0 && (
        <div className="mt-6 opacity-60">
          <p className="text-[10px] tracking-widest uppercase text-slate-600 mb-3">Past</p>
          <div className="space-y-3">
            {pastEvents.map(ev => (
              <EventCard key={ev.id} event={ev} showJoinButton={false} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
