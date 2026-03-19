import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function extractMetaTags(html: string) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  return {
    title: ogTitle?.[1] || titleMatch?.[1] || '',
    description: ogDesc?.[1] || desc?.[1] || '',
    image: ogImage?.[1] || '',
  };
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch target' }, { status: 502 });
    }
    const html = await res.text();
    const meta = extractMetaTags(html);
    return NextResponse.json(meta);
  } catch (e) {
    return NextResponse.json({ error: 'Fetch error' }, { status: 500 });
  }
}
