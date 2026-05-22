import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'onlymatt43';
const GITHUB_REPO = process.env.GITHUB_REPO || 'onlycard';
const EVENTS_FILE = 'data/events.json';
const BOOKINGS_FILE = 'data/bookings.json';
const CREATORS_FILE = 'data/creators.json';

export interface EventProfile {
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
  consentShootId?: string;
  status: 'confirmed' | 'past' | 'open';
  createdAt: string;
}

interface Booking {
  twitterUsername: string;
  twitterImage: string;
  name: string;
  collabWith?: string;
}

interface Creator {
  username: string;
  name: string;
  image: string;
}

async function getGithubFile<T>(path: string): Promise<{ data: T; sha: string } | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=master`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    }
  );
  if (!res.ok) return null;
  const raw = await res.json();
  const data = JSON.parse(Buffer.from(raw.content, 'base64').toString('utf-8'));
  return { data, sha: raw.sha };
}

async function saveGithubFile(path: string, data: unknown, sha: string, message: string): Promise<boolean> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(JSON.stringify(data, null, 2) + '\n').toString('base64'),
        sha,
        branch: 'master',
      }),
    }
  );
  return res.ok;
}

// GET — list all events + computed participants
export async function GET(request: NextRequest) {
  const eventsFile = await getGithubFile<{ events: EventProfile[] }>(EVENTS_FILE);
  if (!eventsFile) return NextResponse.json([]);

  const participant = request.nextUrl.searchParams.get('participant')?.toLowerCase();

  // Load bookings to compute participants
  const bookingsFile = await getGithubFile<{ bookings: Booking[] }>(BOOKINGS_FILE);
  const bookings: Booking[] = bookingsFile?.data?.bookings ?? [];

  // Load creators for participant avatars
  const creatorsFile = await getGithubFile<Creator[]>(CREATORS_FILE);
  const creatorsArr: Creator[] = Array.isArray(creatorsFile?.data)
    ? creatorsFile!.data
    : [];
  const creatorsMap = new Map(creatorsArr.map(c => [c.username.toLowerCase(), c]));

  const events = eventsFile.data.events ?? [];

  const enriched = events.map(ev => {
    const participantBookings = bookings.filter(
      b => b.collabWith?.toLowerCase() === ev.id.toLowerCase()
    );
    const participants = participantBookings.map(b => {
      const creator = creatorsMap.get(b.twitterUsername?.toLowerCase());
      return {
        username: b.twitterUsername,
        name: creator?.name || b.name || b.twitterUsername,
        image: creator?.image || b.twitterImage || '',
      };
    });
    return { ...ev, participants };
  });

  if (participant) {
    return NextResponse.json(
      enriched.filter(ev =>
        ev.participants.some(p => p.username?.toLowerCase() === participant)
      )
    );
  }

  return NextResponse.json(enriched);
}

// POST — create event (admin only)
export async function POST(request: NextRequest) {
  if (!GITHUB_TOKEN) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const adminPassword = request.headers.get('Authorization');
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, description, emoji, date, endDate, location, tags, whatsapp, telegram, image, consentShootId, status } = body;

  if (!id || !title || !date || !location) {
    return NextResponse.json({ error: 'Missing required fields: id, title, date, location' }, { status: 400 });
  }

  // Validate slug
  if (!/^[a-z0-9-]+$/.test(id)) {
    return NextResponse.json({ error: 'id must be lowercase letters, numbers and hyphens only' }, { status: 400 });
  }

  const eventsFile = await getGithubFile<{ events: EventProfile[] }>(EVENTS_FILE);
  if (!eventsFile) return NextResponse.json({ error: 'Could not load events file' }, { status: 500 });

  const events = eventsFile.data.events ?? [];

  if (events.some(e => e.id === id)) {
    return NextResponse.json({ error: `Event with id "${id}" already exists` }, { status: 409 });
  }

  const newEvent: EventProfile = {
    id,
    title,
    ...(description ? { description } : {}),
    ...(emoji ? { emoji } : {}),
    date,
    ...(endDate ? { endDate } : {}),
    location,
    tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map((t: string) => t.trim()).filter(Boolean) : []),
    ...(whatsapp ? { whatsapp } : {}),
    ...(telegram ? { telegram } : {}),
    ...(image ? { image } : {}),
    ...(consentShootId ? { consentShootId } : {}),
    status: status || 'confirmed',
    createdAt: new Date().toISOString(),
  };

  events.unshift(newEvent);
  const saved = await saveGithubFile(EVENTS_FILE, { events }, eventsFile.sha, `Event: create ${id}`);

  if (!saved) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  return NextResponse.json({ event: newEvent }, { status: 201 });
}
