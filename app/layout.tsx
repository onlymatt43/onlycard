import type { Metadata } from "next";
import "./globals.css";
import { DEFAULT_OG_IMAGE } from "./lib/og";

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
    images: [DEFAULT_OG_IMAGE],
    locale: 'fr_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ONLYMATT',
    description: 'CREATIVE MALE MODEL',
    images: [DEFAULT_OG_IMAGE.url],
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
