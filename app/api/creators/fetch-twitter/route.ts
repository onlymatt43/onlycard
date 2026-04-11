import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  return !!ADMIN_PASSWORD && auth === ADMIN_PASSWORD;
}

// POST — admin: lookup Twitter user by username and create creator profile
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  let { username } = body;

  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 });
  }

  // Clean up: accept full URL or @username
  username = username.replace(/^https?:\/\/(x\.com|twitter\.com)\//, '').replace(/^@/, '').replace(/\/.*$/, '').trim();

  if (!username) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  if (!TWITTER_BEARER_TOKEN) {
    return NextResponse.json({ error: 'TWITTER_BEARER_TOKEN not configured — add it in Vercel env vars' }, { status: 500 });
  }

  // Lookup user via Twitter API v2
  const res = await fetch(
    `https://api.twitter.com/2/users/by/username/${encodeURIComponent(username)}?user.fields=name,profile_image_url,description`,
    {
      headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: 'Twitter lookup failed', details: err },
      { status: res.status === 404 ? 404 : 502 }
    );
  }

  const { data } = await res.json();
  if (!data) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const profile = {
    username: data.username,
    name: data.name || data.username,
    image: (data.profile_image_url || '').replace('_normal', '_400x400'),
    bio: data.description || '',
    twitterId: data.id,
  };

  // Save to creators via internal API
  const creatorsRes = await fetch(new URL('/api/creators', request.url).toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...profile, createdBy: 'admin' }),
  });

  if (!creatorsRes.ok) {
    return NextResponse.json({ error: 'Failed to save creator' }, { status: 500 });
  }

  const result = await creatorsRes.json();
  return NextResponse.json(result);
}
