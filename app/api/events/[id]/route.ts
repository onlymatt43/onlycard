import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'onlymatt43';
const GITHUB_REPO = process.env.GITHUB_REPO || 'onlycard';
const EVENTS_FILE = 'data/events.json';
const BOOKINGS_FILE = 'data/bookings.json';
const CREATORS_FILE = 'data/creators.json';

interface EventProfile {
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

// GET — single event + participants
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [eventsFile, bookingsFile, creatorsFile] = await Promise.all([
    getGithubFile<{ events: EventProfile[] }>(EVENTS_FILE),
    getGithubFile<{ bookings: Booking[] }>(BOOKINGS_FILE),
    getGithubFile<Creator[]>(CREATORS_FILE),
  ]);

  if (!eventsFile) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const events = eventsFile.data.events ?? [];
  const event = events.find(e => e.id.toLowerCase() === id.toLowerCase());
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const bookings: Booking[] = bookingsFile?.data?.bookings ?? [];
  const creatorsArr: Creator[] = Array.isArray(creatorsFile?.data) ? creatorsFile!.data : [];
  const creatorsMap = new Map(creatorsArr.map(c => [c.username.toLowerCase(), c]));

  const participantBookings = bookings.filter(
    b => b.collabWith?.toLowerCase() === event.id.toLowerCase()
  );
  const participants = participantBookings.map(b => {
    const creator = creatorsMap.get(b.twitterUsername?.toLowerCase());
    return {
      username: b.twitterUsername,
      name: creator?.name || b.name || b.twitterUsername,
      image: creator?.image || b.twitterImage || '',
    };
  });

  return NextResponse.json({ ...event, participants });
}

// PUT — update event (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!GITHUB_TOKEN) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const adminPassword = request.headers.get('Authorization');
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const eventsFile = await getGithubFile<{ events: EventProfile[] }>(EVENTS_FILE);
  if (!eventsFile) return NextResponse.json({ error: 'Could not load events file' }, { status: 500 });

  const events = eventsFile.data.events ?? [];
  const idx = events.findIndex(e => e.id.toLowerCase() === id.toLowerCase());
  if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated: EventProfile = {
    ...events[idx],
    ...body,
    id: events[idx].id, // id is immutable
    createdAt: events[idx].createdAt, // preserve createdAt
  };

  // Normalize tags
  if (body.tags !== undefined) {
    updated.tags = Array.isArray(body.tags)
      ? body.tags
      : String(body.tags).split(',').map((t: string) => t.trim()).filter(Boolean);
  }

  events[idx] = updated;
  const saved = await saveGithubFile(EVENTS_FILE, { events }, eventsFile.sha, `Event: update ${id}`);

  if (!saved) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  return NextResponse.json({ event: updated });
}

// DELETE — delete event (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!GITHUB_TOKEN) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const adminPassword = request.headers.get('Authorization');
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const eventsFile = await getGithubFile<{ events: EventProfile[] }>(EVENTS_FILE);
  if (!eventsFile) return NextResponse.json({ error: 'Could not load events file' }, { status: 500 });

  const events = eventsFile.data.events ?? [];
  const idx = events.findIndex(e => e.id.toLowerCase() === id.toLowerCase());
  if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  events.splice(idx, 1);
  const saved = await saveGithubFile(EVENTS_FILE, { events }, eventsFile.sha, `Event: delete ${id}`);

  if (!saved) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  return NextResponse.json({ success: true });
}
