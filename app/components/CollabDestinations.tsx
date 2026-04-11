'use client';

import { useEffect, useState } from 'react';
import DestinationCard from './DestinationCard';

interface Booking {
  id: string;
  twitterUsername: string;
  twitterImage: string;
  twitterUrl: string;
  name: string;
  type: string;
  city: string;
  dates: string;
  message: string;
  createdAt: string;
}

interface Creator {
  username: string;
  name: string;
  image: string;
  bio: string;
  claimed: boolean;
}

interface Destination {
  city: string;
  country: string;
  dates: string;
  status: string;
  description: string;
  emoji: string;
  link?: string;
  image?: string;
}

interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
}

const STATUS_STYLES: Record<string, StatusStyle> = {
  confirmed: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', label: 'CONFIRMED' },
  upcoming: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30', label: 'UPCOMING' },
  open: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', label: 'OPEN INVITE' },
  past: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30', label: 'PAST' },
};

export default function CollabDestinations({ destinations }: { destinations: Destination[] }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [highlightBooking, setHighlightBooking] = useState<string | null>(null);

  useEffect(() => {
    // Check for ?booking=ID in URL
    const params = new URLSearchParams(window.location.search);
    const bid = params.get('booking');
    if (bid) setHighlightBooking(bid);

    // Fetch bookings + creators in parallel
    Promise.all([
      fetch('/api/bookings').then(r => r.ok ? r.json() : []),
      fetch('/api/creators').then(r => r.ok ? r.json() : []),
    ]).then(([b, c]) => {
      setBookings(Array.isArray(b) ? b : []);
      setCreators(Array.isArray(c) ? c : []);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      {destinations.map((dest) => {
        const style = STATUS_STYLES[dest.status] || STATUS_STYLES.open;
        // Match bookings to this destination (case-insensitive city match)
        const cityBookings = bookings.filter(
          b => b.city.toLowerCase().trim() === dest.city.toLowerCase().trim()
        );
        return (
          <DestinationCard
            key={dest.city}
            dest={dest}
            style={style}
            bookings={cityBookings}
            creators={creators}
            highlightBooking={highlightBooking}
          />
        );
      })}
    </div>
  );
}
