import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LinkTree from '../../components/LinkTree';
import { DEFAULT_OG_IMAGE } from '../../lib/og';
import eventsData from '../../../data/events.json';

interface EventProfile {
  id: string;
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

function findEvent(id: string): EventProfile | undefined {
  return (eventsData.events as EventProfile[]).find(
    e => e.id.toLowerCase() === id.toLowerCase()
  );
}

export function generateStaticParams() {
  return (eventsData.events as EventProfile[]).map(e => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = findEvent(id);
  if (!event) return {};

  const title = `${event.title} — ONLYMATT`;
  const description = event.description || 'CREATIVE MALE MODEL';
  const image = event.image
    ? { url: event.image, width: 1200, height: 630, alt: event.title }
    : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      type: 'profile',
      title,
      description,
      url: `https://me.onlymatt.ca/e/${event.id}`,
      siteName: 'ONLYMATT',
      images: [image],
      locale: 'fr_CA',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function EventLinkTreePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = findEvent(id);
  if (!event) notFound();

  return <LinkTree eventTitle={event.title} eventUrl={event.url} />;
}
