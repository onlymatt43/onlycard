import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'onlymatt43';
const GITHUB_REPO = process.env.GITHUB_REPO || 'onlycard';
const FILE_PATH = 'data/suggestions.json';

export interface Suggestion {
  id: string;
  type: 'event' | 'proposal' | 'group-event';
  message: string;
  url?: string;
  twitterUsername?: string;
  twitterImage?: string;
  city?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

async function getSuggestionsFile(): Promise<{ suggestions: Suggestion[]; sha: string } | null> {
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
  const suggestions = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
  return { suggestions, sha: data.sha };
}

async function saveSuggestions(suggestions: Suggestion[], sha?: string): Promise<boolean> {
  const body: Record<string, unknown> = {
    message: `Suggestion: ${suggestions[suggestions.length - 1]?.twitterUsername || 'anonymous'}`,
    content: Buffer.from(JSON.stringify(suggestions, null, 2) + '\n').toString('base64'),
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

// GET — return all suggestions
export async function GET() {
  const data = await getSuggestionsFile();
  if (!data) return NextResponse.json([]);
  return NextResponse.json(data.suggestions);
}

// POST — add a new suggestion
export async function POST(request: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { type, message, twitterUsername, twitterImage, city, url } = body;

  if (!type || !message) {
    return NextResponse.json({ error: 'Type and message are required' }, { status: 400 });
  }

  const validTypes = ['event', 'proposal', 'group-event'];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const data = await getSuggestionsFile();
  const suggestions = data?.suggestions || [];

  const newSuggestion: Suggestion = {
    id: `sug_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    message: message.slice(0, 1000),
    url: url || undefined,
    twitterUsername: twitterUsername || undefined,
    twitterImage: twitterImage || undefined,
    city: city || undefined,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  suggestions.push(newSuggestion);
  const saved = await saveSuggestions(suggestions, data?.sha);

  if (!saved) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  return NextResponse.json(newSuggestion, { status: 201 });
}

// PUT — update suggestion status (admin)
export async function PUT(request: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { id, status, adminPassword } = body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!id || !['pending', 'accepted', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const data = await getSuggestionsFile();
  if (!data) return NextResponse.json({ error: 'No data' }, { status: 404 });

  const idx = data.suggestions.findIndex((s: Suggestion) => s.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  data.suggestions[idx].status = status;
  const saved = await saveSuggestions(data.suggestions, data.sha);

  if (!saved) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  return NextResponse.json(data.suggestions[idx]);
}
