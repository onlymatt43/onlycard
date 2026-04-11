import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'onlymatt43';
const GITHUB_REPO = process.env.GITHUB_REPO || 'onlycard';
const FILE_PATH = 'data/creators.json';

export interface Creator {
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

export async function getCreatorsFile(): Promise<{ creators: Creator[]; sha: string } | null> {
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
  const creators = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
  return { creators, sha: data.sha };
}

export async function saveCreators(creators: Creator[], sha?: string, commitMsg?: string): Promise<boolean> {
  const body: Record<string, unknown> = {
    message: commitMsg || `Update creators`,
    content: Buffer.from(JSON.stringify(creators, null, 2) + '\n').toString('base64'),
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

// GET — public: return all creators
export async function GET() {
  const data = await getCreatorsFile();
  if (!data) return NextResponse.json([]);
  return NextResponse.json(data.creators);
}

// POST — add or update a creator (used by booking flow + admin)
export async function POST(request: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { username, name, image, bio, twitterId, links, createdBy } = body;

  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 });
  }

  const data = await getCreatorsFile();
  const creators = data?.creators || [];
  const sha = data?.sha;

  const existing = creators.find(c => c.username.toLowerCase() === username.toLowerCase());

  if (existing) {
    // Update non-empty fields (don't overwrite with blanks)
    if (name) existing.name = name;
    if (image) existing.image = image;
    if (bio && !existing.bio) existing.bio = bio;
    if (twitterId) existing.twitterId = twitterId;
    if (links && links.length > 0) existing.links = links;
  } else {
    creators.push({
      username,
      name: name || username,
      image: image || '',
      bio: bio || '',
      twitterId: twitterId || '',
      links: links || [],
      claimed: createdBy === 'self',
      createdAt: new Date().toISOString(),
      createdBy: createdBy || 'admin',
    });
  }

  const ok = await saveCreators(creators, sha, `Creator: ${username}`);
  if (!ok) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  const creator = creators.find(c => c.username.toLowerCase() === username.toLowerCase());
  return NextResponse.json({ creator });
}
