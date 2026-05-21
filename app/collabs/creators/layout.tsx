import type { Metadata } from 'next';
import Providers from '../../components/Providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://collabs.onlymatt.ca'),
  title: 'COLLABS — ONLYMATT',
  description: 'Creators & upcoming events. Find your next collab.',
  icons: {
    icon: '/collabs-icon.png',
    apple: '/collabs-icon.png',
  },
  openGraph: {
    type: 'website',
    title: 'COLLABS — ONLYMATT',
    description: 'Creators & upcoming events. Find your next collab.',
    url: 'https://collabs.onlymatt.ca/creators',
    siteName: 'ONLYMATT COLLABS',
    images: [
      {
        url: '/collabs-icon.png',
        width: 1200,
        height: 1200,
        alt: 'COLLABS — ONLYMATT',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'COLLABS — ONLYMATT',
    description: 'Creators & upcoming events. Find your next collab.',
    images: ['/collabs-icon.png'],
  },
};

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
