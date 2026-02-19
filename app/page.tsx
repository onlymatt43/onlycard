import React from 'react';
import RandomImage from './components/RandomImage';
import SocialIcon from './components/SocialIcon';

const links = [
  { title: 'SITE OFFICIEL', url: 'https://onlymatt.ca', icon: 'globe' },
  { title: 'X (TWITTER)', url: 'https://x.com/OnlyMatt43', icon: 'twitter' },
  { title: 'INSTAGRAM', url: 'https://www.instagram.com/onlymatt43', icon: 'instagram' },
  { title: 'INSTAGRAM PRO', url: 'https://www.instagram.com/onlymatt.43', icon: 'instagram' },
  { title: 'BLUESKY', url: 'https://bsky.app/profile/onlymatt.bsky.social', icon: 'bluesky' },
  { title: 'TELEGRAM', url: 'https://t.me/OnlyMatt43', icon: 'telegram' },
  { title: 'TIKTOK', url: 'https://www.tiktok.com/@its.only.matt', icon: 'tiktok' },
  { title: 'FACEBOOK', url: 'https://www.facebook.com/matt.matt.864685/', icon: 'facebook' },
  { title: 'YOUTUBE', url: 'https://www.youtube.com/@onlymatt43', icon: 'youtube' },
  { title: 'WHATSAPP', url: 'https://wa.me/15147120578', icon: 'whatsapp' },
  { title: 'JUSTFOR.FANS', url: 'https://justfor.fans/OnlyMatt43', icon: 'justforfans' },
  { title: 'ONLYFANS', url: 'https://onlyfans.com/onlymatt-43', icon: 'onlyfans' },
  { title: 'AMAZON', url: 'https://www.amazon.ca/gp/profile/amzn1.account.AGKXJLNXARH2FYTIX4ZHRC6B2K3Q', icon: 'amazon' },
  { title: 'PAYPAL', url: 'https://paypal.me/onlymatt43', icon: 'paypal' },
  { title: 'WISE', url: 'https://wise.com/pay/me/mathieuc571', icon: 'wise' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-16">
      {/* Header avec image aléatoire */}
      <div className="mb-10 flex flex-col items-center">
        <RandomImage
          alt="ONLYMATT"
          className="grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
          priority
        />
        <h1 className="text-xl font-light tracking-[0.3em] uppercase">ONLYMATT</h1>
        <div className="h-[1px] w-12 bg-zinc-700 my-4"></div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium">Editorialist Creator</p>
      </div>

      {/* Liste des liens avec effet doré */}
      <div className="w-full max-w-sm space-y-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full py-3 px-5 text-center border border-zinc-800 bg-zinc-950 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 rounded-sm"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <SocialIcon name={link.icon} className="text-amber-400 group-hover:text-amber-300 transition-colors" />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-300 group-hover:text-amber-100 transition-colors">{link.title}</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-16 text-zinc-700 text-[9px] uppercase tracking-[0.3em] font-light">
        OM43 DIGITAL © {new Date().getFullYear()}
      </footer>
    </main>
  );
}
