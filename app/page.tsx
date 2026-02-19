import React from 'react';
import RandomImage from './components/RandomImage';

const links = [
  { title: '🌐 SITE OFFICIEL', url: 'https://onlymatt.ca' },
  { title: '🛒 PROFIL AMAZON', url: 'https://www.amazon.ca/gp/profile/amzn1.account.AGKXJLNXARH2FYTIX4ZHRC6B2K3Q' },
  { title: '💬 WHATSAPP', url: 'https://wa.me/15147120578' },
  { title: '💳 PAYPAL', url: 'https://paypal.me/onlymatt43' },
  { title: '💸 WISE', url: 'https://wise.com/pay/me/mathieuc571' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-16">
      {/* Header avec image aléatoire */}
      <div className="mb-10 flex flex-col items-center">
        <RandomImage
          alt="Mathieu Courchesne"
          className="grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
          fallbackSrc="https://onlymatt-media.b-cdn.net/Untitled-7.png"
          priority
        />
        <h1 className="text-xl font-light tracking-[0.3em] uppercase">Mathieu Courchesne</h1>
        <div className="h-[1px] w-12 bg-zinc-700 my-4"></div>
        <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium">TES • Creative</p>
      </div>

      {/* Liste des liens */}
      <div className="w-full max-w-sm space-y-3">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full py-4 px-6 text-center border border-zinc-800 bg-zinc-950 hover:border-zinc-500 transition-all duration-300 rounded-sm text-[11px] font-bold tracking-[0.15em] uppercase"
          >
            <span className="relative z-10">{link.title}</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
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
