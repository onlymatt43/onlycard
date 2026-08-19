import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Match a <meta> tag value regardless of attribute order
// (property before content, or content before property).
function metaContent(html: string, key: 'property' | 'name', value: string): string {
  const re1 = new RegExp(`<meta[^>]+${key}=["']${value}["'][^>]+content=["']([^"']+)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${key}=["']${value}["']`, 'i');
  return html.match(re1)?.[1] || html.match(re2)?.[1] || '';
}

// Find the best available site icon: apple-touch-icon (usually largest),
// then any <link rel*="icon">, then the conventional /favicon.ico.
function findIcon(html: string, baseUrl: string): string {
  const linkHref = (relPattern: string): string => {
    const re1 = new RegExp(`<link[^>]+rel=["'][^"']*${relPattern}[^"']*["'][^>]+href=["']([^"']+)["']`, 'i');
    const re2 = new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*${relPattern}[^"']*["']`, 'i');
    return html.match(re1)?.[1] || html.match(re2)?.[1] || '';
  };
  const href = linkHref('apple-touch-icon') || linkHref('icon');
  try {
    if (href) return new URL(href, baseUrl).toString();
    return new URL('/favicon.ico', baseUrl).toString();
  } catch {
    return '';
  }
}

function extractMetaTags(html: string, baseUrl: string) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const ogImage = metaContent(html, 'property', 'og:image');
  const icon = ogImage ? '' : findIcon(html, baseUrl);
  return {
    title: metaContent(html, 'property', 'og:title') || titleMatch?.[1] || '',
    description: metaContent(html, 'property', 'og:description') || metaContent(html, 'name', 'description') || '',
    image: ogImage || icon,
    // True when image is a site icon rather than a full OG banner,
    // so the card can render it small instead of stretched.
    isIcon: Boolean(!ogImage && icon),
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400, headers: CORS_HEADERS });
  }
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch target' }, { status: 502, headers: CORS_HEADERS });
    }
    const html = await res.text();
    const meta = extractMetaTags(html, url);
    return NextResponse.json(meta, { headers: CORS_HEADERS });
  } catch (e) {
    return NextResponse.json({ error: 'Fetch error' }, { status: 500, headers: CORS_HEADERS });
  }
}
