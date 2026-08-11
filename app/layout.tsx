import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://me.onlymatt.ca'),
  title: 'ONLYMATT',
  description: 'CREATIVE MALE MODEL',
  openGraph: {
    type: 'profile',
    title: 'ONLYMATT',
    description: 'CREATIVE MALE MODEL',
    url: 'https://me.onlymatt.ca',
    siteName: 'ONLYMATT',
    images: [
      {
        url: 'https://onlymatt-public-zone.b-cdn.net/me/me-20260811-001-solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.jpeg',
        width: 1200,
        height: 630,
        alt: 'ONLYMATT',
      },
    ],
    locale: 'fr_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ONLYMATT',
    description: 'CREATIVE MALE MODEL',
    images: ['https://onlymatt-public-zone.b-cdn.net/me/me-20260811-001-solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.jpeg'],
  },
  authors: [{ name: 'ONLYMATT', url: 'https://onlymatt.ca' }],
  creator: 'ONLYMATT',
  keywords: ['Creative Male Model', 'Editorialist Creator', 'Content Creator'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
