import type { Metadata } from 'next';
import Providers from '../components/Providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://book.onlymatt.ca'),
  title: 'BOOK — ONLYMATT',
  description: 'Request a collab, shoot or booking with ONLYMATT. Fill the form and connect via WhatsApp or Telegram.',
  openGraph: {
    type: 'website',
    title: 'BOOK — ONLYMATT',
    description: 'Request a collab, shoot or booking with ONLYMATT.',
    url: 'https://book.onlymatt.ca',
    siteName: 'ONLYMATT',
    images: [
      {
        url: 'https://onlymatt-public-zone.b-cdn.net/card/solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.JPEG',
        width: 1200,
        height: 630,
        alt: 'BOOK ONLYMATT',
      },
    ],
    locale: 'fr_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOOK — ONLYMATT',
    description: 'Request a collab, shoot or booking with ONLYMATT.',
    images: ['https://onlymatt-public-zone.b-cdn.net/card/solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.JPEG'],
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
