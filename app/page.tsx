import React from 'react';
import RandomImage from './components/RandomImage';
import SocialIcon from './components/SocialIcon';
import BackgroundVideo from './components/BackgroundVideo';
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
  // support modes: menu, popup, socials
  const activeLinks =
    mode === 'menu'
      ? menuLinks
      : mode === 'popup'
      ? popupLinks
      : mode === 'socials'
      ? socialsLinks
      : defaultLinks;

  const videoSrc =
    (searchParams?.video as string) ||
    'https://vz-72668a20-6b9.b-cdn.net/065342f8-2fa6-49e1-88f1-49dffcca1a37/play_1080p.mp4';

  // Liens temporaires — ajoute/retire des URLs ici, null = slot vide
  const tempLinks: { url: string; label?: string }[] = [
    { url: 'https://www.hustlaball.com/toronto-events' },
    { url: 'https://onlyfans.com/onlymatt-43', label: '50% OFF ONLYFANS' },
  ];

  return (
    <main className="h-screen bg-white text-slate-900 flex flex-col items-center px-6 py-0 relative overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BackgroundVideo
          src={videoSrc}
          className="w-full h-full object-cover"
        />
        {/* Light overlay to keep text readability and black & white vibe */}
        <div className="absolute inset-0 bg-white/70"></div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-cyan-100/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-100/20 to-orange-100/20 rounded-full blur-2xl"></div>
      </div>

      {/* Floating Meta Cards — liens temporaires */}
      <FloatingMetaCards links={tempLinks} />

      {/* Contenu centré dans le square */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[100vmin] h-[100vmin] flex flex-col items-center justify-between pointer-events-auto z-20 px-4 min-[900px]:px-0">
          {/* Header avec image aléatoire, fixé en haut sans effet de boîte */}
          <div className="flex flex-col items-center animate-fade-in-up"
        style={{
          position: 'sticky',
          top: 0,
          // transparent, pas d'arrière-plan ni de flou pour éviter l'effet boite
          background: 'transparent',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
        }}
      >
        <div className="relative mb-4 min-[900px]:mb-6 isolate scale-90 min-[900px]:scale-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-500 to-pink-500 rounded-full p-1 animate-pulse-slow z-0">
            <div className="bg-white rounded-full p-1 relative z-10">
              <RandomImage
                alt="ONLYMATT"
                className="transition-all duration-500 hover:scale-105 relative z-20"
                priority
              />
            </div>
          </div>
        </div>
        <h1 className="text-3xl min-[900px]:text-4xl font-extralight tracking-[0.16em] min-[900px]:tracking-[0.2em] uppercase text-slate-800 mb-2 relative z-20 isolate" style={{ textShadow: 'none', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent" style={{ display: 'inline-block' }}>
            ONLYMATT
          </span>
        </h1>
        <div className="h-[2px] w-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mb-4 relative z-10"></div>
        <p className="text-slate-600 text-[11px] min-[900px]:text-sm uppercase tracking-[0.25em] min-[900px]:tracking-widest font-medium relative z-10">
          creative male model
        </p>
      </div>

          {/* Liste des liens avec effet moderne, scrollable sur mobile et respect du cadre */}
          <div
            className="w-full max-w-[17rem] min-[520px]:max-w-[18rem] min-[900px]:max-w-md flex-1 space-y-3 sm:space-y-6 overflow-auto no-scrollbar scroll-snap-y px-1 min-[900px]:px-0"
            style={{
              WebkitOverflowScrolling: 'touch',
              maxHeight: 'calc(100vmin - 160px)',
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
                <span className="text-[13px] min-[900px]:text-sm font-semibold tracking-wide text-slate-700 group-hover:text-slate-900 transition-colors">
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
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg animate-pulse-slow">
                    <SocialIcon name={link.icon} className="text-white w-4 h-4" />
                  </div>
                </div>
                {/* Ligne subtile reliant le titre à l'icône */}
                <div
                  className="absolute top-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
          <footer className="text-slate-500 text-xs uppercase tracking-widest font-light text-center py-4">
            OM43 DIGITAL © {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </main>
  );
}
