import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://me.onlymatt.ca'),
  title: 'ONLYMATT | Mathieu Courchesne',
  description: 'Editorial Creator • TES Creative • Digital Content Specialist',
  openGraph: {
    type: 'profile',
    title: 'ONLYMATT',
    description: 'Editorial Creator • TES Creative',
    url: 'https://me.onlymatt.ca',
    siteName: 'ONLYMATT',
    images: [
      {
        url: 'https://onlymatt-public-zone.b-cdn.net/Untitled-7.png',
        width: 1200,
        height: 630,
        alt: 'Mathieu Courchesne - ONLYMATT',
      },
    ],
    locale: 'fr_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ONLYMATT | Mathieu Courchesne',
    description: 'Editorial Creator • TES Creative',
    images: ['https://onlymatt-public-zone.b-cdn.net/Untitled-7.png'],
  },
  authors: [{ name: 'Mathieu Courchesne', url: 'https://onlymatt.ca' }],
  creator: 'Mathieu Courchesne',
  keywords: ['Editorial Creator', 'Content Creator', 'Digital Media', 'TES Creative'],
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
