import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'onlymatt43';
const GITHUB_REPO = process.env.GITHUB_REPO || 'onlycard';
const FILE_PATH = 'data/bookings.json';

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

async function getBookingsFile(): Promise<{ bookings: Booking[]; sha: string } | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}?ref=master`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const bookings = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
  return { bookings, sha: data.sha };
}

async function saveBookings(bookings: Booking[], sha?: string): Promise<boolean> {
  const body: Record<string, unknown> = {
    message: `Booking: ${bookings[bookings.length - 1]?.twitterUsername || 'update'}`,
    content: Buffer.from(JSON.stringify(bookings, null, 2) + '\n').toString('base64'),
    branch: 'master',
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  return res.ok;
}

// GET — public: return list of bookings (for floating cards)
export async function GET() {
  const data = await getBookingsFile();
  if (!data) return NextResponse.json([]);
  return NextResponse.json(data.bookings);
}

// POST — authenticated: add a new booking
export async function POST(request: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { twitterUsername, twitterImage, name, type, city, dates, message } = body;

  if (!twitterUsername || !name || !type || !city || !dates) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const booking: Booking = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    twitterUsername,
    twitterImage: twitterImage || '',
    twitterUrl: `https://x.com/${twitterUsername}`,
    name,
    type,
    city,
    dates,
    message: message || '',
    createdAt: new Date().toISOString(),
  };

  const existing = await getBookingsFile();
  const bookings = existing ? existing.bookings : [];
  bookings.push(booking);

  const saved = await saveBookings(bookings, existing?.sha);
  if (!saved) {
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }

  return NextResponse.json({ success: true, booking });
}
