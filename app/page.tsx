import React from 'react';
import RandomImage from './components/RandomImage';
import SocialIcon from './components/SocialIcon';
import FloatingMetaCards from './components/FloatingMetaCards';

const links = [
  { title: 'ONLYFANS', url: 'https://onlyfans.com/onlymatt-43', icon: 'onlyfans', iconPosition: { top: '50%', left: '35%' } },
  { title: 'ONLYFANS PRO', url: 'https://onlyfans.com/onlymatt-43', icon: 'onlyfans', iconPosition: { top: '50%', left: '40%' } },
  { title: 'PAYPAL', url: 'https://paypal.me/onlymatt43', icon: 'paypal', iconPosition: { top: '50%', left: '45%' } },
  { title: 'WISE', url: 'https://wise.com/pay/me/mathieuc571', icon: 'wise', iconPosition: { top: '50%', left: '25%' } },
  { title: 'AMAZON', url: 'https://www.amazon.ca/gp/profile/amzn1.account.AGKXJLNXARH2FYTIX4ZHRC6B2K3Q', icon: 'amazon', iconPosition: { top: '50%', left: '30%' } },
  { title: 'SITE OFFICIEL', url: 'https://onlymatt.ca', icon: 'globe', iconPosition: { top: '50%', left: '35%' } },
  { title: 'X (TWITTER)', url: 'https://x.com/OnlyMatt43', icon: 'twitter', iconPosition: { top: '50%', left: '25%' } },
  { title: 'INSTAGRAM', url: 'https://www.instagram.com/onlymatt43', icon: 'instagram', iconPosition: { top: '50%', left: '45%' } },
  { title: 'INSTAGRAM PRO', url: 'https://www.instagram.com/onlymatt.43', icon: 'instagram', iconPosition: { top: '50%', left: '50%' } },
  { title: 'BLUESKY', url: 'https://bsky.app/profile/onlymatt.bsky.social', icon: 'bluesky', iconPosition: { top: '50%', left: '30%' } },
  { title: 'TELEGRAM', url: 'https://t.me/OnlyMatt43', icon: 'telegram', iconPosition: { top: '50%', left: '35%' } },
  { title: 'TIKTOK', url: 'https://www.tiktok.com/@its.only.matt', icon: 'tiktok', iconPosition: { top: '50%', left: '25%' } },
  { title: 'FACEBOOK', url: 'https://www.facebook.com/matt.matt.864685/', icon: 'facebook', iconPosition: { top: '50%', left: '40%' } },
  { title: 'YOUTUBE', url: 'https://www.youtube.com/@onlymatt43', icon: 'youtube', iconPosition: { top: '50%', left: '30%' } },
  { title: 'WHATSAPP', url: 'https://wa.me/15147120578', icon: 'whatsapp', iconPosition: { top: '50%', left: '45%' } },
  { title: 'JUSTFOR.FANS', url: 'https://justfor.fans/OnlyMatt43', icon: 'justforfans', iconPosition: { top: '50%', left: '55%' } },
];

export default function HomePage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  // lift constants outside render to avoid recreation
  const defaultLinks = links;
  const menuLinks = [
    // full site menu, could reorder or filter
    ...links,
  ];
  const popupLinks = [
    // popup might be a shorter set
    ...links.slice(0, 6),
  ];
  const socialsLinks = [
    // example network-only menu
    links.find((l) => l.title === 'X (TWITTER)')!,
    links.find((l) => l.title === 'INSTAGRAM')!,
    links.find((l) => l.title === 'TIKTOK')!,
    links.find((l) => l.title === 'FACEBOOK')!,
    links.find((l) => l.title === 'WHATSAPP')!,
  ];

  const mode = searchParams?.mode as string | undefined;
  const layout = searchParams?.layout as string | undefined;
  const isSquareLayout = layout === 'square';
  // support modes: menu, popup, socials
  const activeLinks =
    mode === 'menu'
      ? menuLinks
      : mode === 'popup'
      ? popupLinks
      : mode === 'socials'
      ? socialsLinks
      : defaultLinks;

  // Liens temporaires — ajoute/retire des URLs ici, null = slot vide
  const tempLinks: { url: string; label?: string }[] = [
    { url: 'https://www.hustlaball.com/toronto-events' },
    { url: 'https://onlymatt.ca' },
    { url: 'https://rentmasseur.com/OnlyMatt' },
    { url: 'https://rent.men/OnlyMatt' },
    { url: 'https://onlymatt.ca/random' },
    { url: 'https://onlyfans.com/onlymatt-43' },
  ];

  return (
    <main className="h-screen bg-black text-slate-100 flex flex-col items-center px-6 py-0 relative overflow-hidden">
      {/* Background velvet effect (black + blue/green tones) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_75%_25%,rgba(6,182,212,0.14),transparent_38%),radial-gradient(circle_at_65%_78%,rgba(45,212,191,0.12),transparent_40%),linear-gradient(160deg,#020406_0%,#02070a_35%,#030d11_70%,#010304_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(125deg,transparent_0%,rgba(255,255,255,0.22)_50%,transparent_100%)] mix-blend-screen" />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-44 -right-44 w-96 h-96 bg-gradient-to-br from-emerald-400/18 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-44 -left-44 w-96 h-96 bg-gradient-to-tr from-cyan-400/16 to-emerald-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Contenu centré dans le square */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative w-[100vmin] h-[100vmin] flex flex-col items-center justify-between pointer-events-auto z-20"
          style={{
            paddingInline: isSquareLayout ? 'clamp(0.5rem, 2vmin, 1.25rem)' : 'clamp(0.75rem, 2.5vmin, 1.5rem)',
          }}
        >
          {/* Floating Meta Cards — positionnees dans le carre */}
          <FloatingMetaCards links={tempLinks} />

          {/* Header avec image aléatoire, fixé en haut sans effet de boîte */}
          <div className="flex flex-col items-center animate-fade-in-up"
        style={{
          position: 'sticky',
          top: 0,
          // transparent, pas d'arrière-plan ni de flou pour éviter l'effet boite
          background: 'transparent',
          paddingTop: isSquareLayout ? '1rem' : '1.5rem',
          paddingBottom: isSquareLayout ? '1rem' : '1.5rem',
        }}
      >
        <div className="mb-4 isolate inline-block" style={{ transform: isSquareLayout ? 'scale(clamp(0.76, 0.7 + 0.45vw, 0.94))' : 'scale(clamp(0.82, 0.78 + 0.35vw, 1))' }}>
          <div className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-emerald-300 rounded-full p-[3px] animate-pulse-slow">
            <div className="bg-white rounded-full p-1">
              <RandomImage
                alt="ONLYMATT"
                className="transition-all duration-500 hover:scale-105 relative z-20"
                priority
              />
            </div>
          </div>
        </div>
        <h1 className="font-extralight uppercase text-slate-100 mb-2 relative z-20 isolate" style={{ fontSize: isSquareLayout ? 'clamp(1.15rem, 3.1vmin, 2rem)' : 'clamp(1.4rem, 3.8vmin, 2.25rem)', letterSpacing: 'clamp(0.12em, 0.16em, 0.2em)', textShadow: 'none', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
          <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-100 bg-clip-text text-transparent" style={{ display: 'inline-block' }}>
            ONLYMATT
          </span>
        </h1>
        <div className="h-[2px] w-16 bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full mb-4 relative z-10"></div>
        <p className="text-slate-300 uppercase font-medium relative z-10" style={{ fontSize: isSquareLayout ? 'clamp(0.56rem, 1.25vmin, 0.8rem)' : 'clamp(0.62rem, 1.5vmin, 0.875rem)', letterSpacing: 'clamp(0.18em, 0.24em, 0.3em)' }}>
          creative male model
        </p>
      </div>

          {/* Liste des liens avec effet moderne, scrollable sur mobile et respect du cadre */}
          <div
            className="w-full flex-1 space-y-3 sm:space-y-6 overflow-auto no-scrollbar scroll-snap-y"
            style={{
              WebkitOverflowScrolling: 'touch',
              maxHeight: isSquareLayout ? 'calc(100vmin - 145px)' : 'calc(100vmin - 160px)',
              maxWidth: isSquareLayout ? 'clamp(12rem, 40vmin, 22rem)' : 'clamp(13rem, 46vmin, 28rem)',
            }}
          >
        {activeLinks.map((link, index) => (
          <div
            key={index}
            className="relative animate-fade-in-up group scroll-snap-align-start"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center transition-all duration-300 hover:scale-105"
            >
              <div className="relative py-2">
                <span className="font-semibold tracking-wide text-slate-100 group-hover:text-white transition-colors" style={{ fontSize: 'clamp(0.74rem, 1.65vmin, 0.875rem)' }}>
                  {link.title}
                </span>
                <div
                  className="absolute opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform group-hover:scale-110"
                  style={{
                    top: link.iconPosition.top,
                    left: link.iconPosition.left,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                    <div className="p-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full shadow-lg animate-pulse-slow">
                    <SocialIcon name={link.icon} className="text-white w-4 h-4" />
                  </div>
                </div>
                {/* Ligne subtile reliant le titre à l'icône */}
                <div
                  className="absolute top-1/2 h-px bg-gradient-to-r from-transparent via-slate-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    left: '20%',
                    right: '20%',
                  }}
                ></div>
              </div>
            </a>
          </div>
        ))}
      </div>

          {/* Footer */}
          <footer className="text-slate-300 text-xs uppercase tracking-widest font-light text-center py-4">
            OM43 DIGITAL © {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </main>
  );
}
