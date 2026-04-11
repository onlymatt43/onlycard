import { NextRequest, NextResponse } from 'next/server';
import { getCreatorsFile, saveCreators } from '../route';

// GET — public: get single creator by username
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const data = await getCreatorsFile();
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const creator = data.creators.find(
    c => c.username.toLowerCase() === username.toLowerCase()
  );
  if (!creator) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(creator);
}

// PUT — claim/update/delete profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const body = await request.json();
  const { name, bio, links, image, claimUsername, _delete } = body;

  const data = await getCreatorsFile();
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const idx = data.creators.findIndex(
    c => c.username.toLowerCase() === username.toLowerCase()
  );
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (_delete) {
    data.creators.splice(idx, 1);
    const ok = await saveCreators(data.creators, data.sha, `Delete creator: ${username}`);
    if (!ok) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  const creator = data.creators[idx];

  // If claiming, verify the authenticated username matches
  if (claimUsername) {
    if (claimUsername.toLowerCase() !== username.toLowerCase()) {
      return NextResponse.json({ error: 'Username mismatch' }, { status: 403 });
    }
    creator.claimed = true;
  }

  if (name) creator.name = name;
  if (bio !== undefined) creator.bio = bio;
  if (image) creator.image = image;
  if (links) creator.links = links;

  const ok = await saveCreators(data.creators, data.sha, `Update creator: ${username}`);
  if (!ok) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });

  return NextResponse.json({ creator });
}
