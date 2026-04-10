import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'onlymatt43';
const GITHUB_REPO = process.env.GITHUB_REPO || 'onlycard';

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  return !!ADMIN_PASSWORD && auth === ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch latest config from GitHub (always up-to-date, even after manual commits)
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/config.json?ref=master`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch config from GitHub' }, { status: 500 });
  }

  const { content } = await res.json();
  const config = JSON.parse(Buffer.from(content, 'base64').toString('utf-8'));
  return NextResponse.json(config);
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });
  }

  const newConfig = await request.json();

  // Get current file SHA (required by GitHub API for updates)
  const getRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/config.json?ref=master`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!getRes.ok) {
    const err = await getRes.json();
    return NextResponse.json({ error: 'Failed to get file SHA', details: err }, { status: 500 });
  }

  const { sha } = await getRes.json();

  // Push updated config to GitHub → triggers Vercel auto-deploy
  const putRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/config.json`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update config via admin panel',
        content: Buffer.from(JSON.stringify(newConfig, null, 2) + '\n').toString('base64'),
        sha,
        branch: 'master',
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.json();
    return NextResponse.json({ error: 'Failed to push to GitHub', details: err }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Config updated — Vercel deploy triggered' });
}
