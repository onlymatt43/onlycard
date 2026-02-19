import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://me.onlymatt.ca'),
  title: 'ONLYMATT',
  description: 'Editorialist Creator • Digital Content Specialist',
  openGraph: {
    type: 'profile',
    title: 'ONLYMATT',
    description: 'Editorialist Creator',
    url: 'https://me.onlymatt.ca',
    siteName: 'ONLYMATT',
    images: [
      {
        url: 'https://onlymatt-public-zone.b-cdn.net/card/solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.JPEG',
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
    description: 'Editorialist Creator',
    images: ['https://onlymatt-public-zone.b-cdn.net/card/solo-pics14728a1b-b8ad-41b0-beac-e8f6b24202a8.JPEG'],
  },
  authors: [{ name: 'ONLYMATT', url: 'https://onlymatt.ca' }],
  creator: 'ONLYMATT',
  keywords: ['Editorialist Creator', 'Content Creator', 'Digital Media'],
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
