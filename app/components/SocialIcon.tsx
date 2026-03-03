import React from 'react';

interface SocialIconProps {
  name: string;
  className?: string;
}

export default function SocialIcon({ name, className = '' }: SocialIconProps) {
  const icons: Record<string, React.ReactElement> = {
    globe: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#4facfe" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#globeGrad)" opacity="0.2" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="url(#globeGrad)" />
      </svg>
    ),
    twitter: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="twitterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1DA1F2" />
            <stop offset="100%" stopColor="#1991DB" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#twitterGrad)" opacity="0.2" />
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="url(#twitterGrad)" />
      </svg>
    ),
    instagram: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <radialGradient id="instaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </radialGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#instaGrad)" opacity="0.2" />
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="url(#instaGrad)" strokeWidth="2" opacity="0.8" />
        <circle cx="9" cy="9" r="1.5" fill="url(#instaGrad)" />
        <path d="M15.5 7.5c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9z" fill="url(#instaGrad)" />
        <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="url(#instaGrad)" />
      </svg>
    ),
    bluesky: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="blueskyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0085FF" />
            <stop offset="100%" stopColor="#0A7CFF" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#blueskyGrad)" opacity="0.2" />
        <path d="M12 3c-1.5 2-4 5-6 7 2 2 4.5 5 6 7 1.5-2 4-5 6-7-2-2-4.5-5-6-7z" fill="url(#blueskyGrad)" />
      </svg>
    ),
    telegram: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="telegramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0088CC" />
            <stop offset="100%" stopColor="#29B6F6" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#telegramGrad)" opacity="0.2" />
        <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" fill="url(#telegramGrad)" />
      </svg>
    ),
    tiktok: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="tiktokGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="100%" stopColor="#333333" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#tiktokGrad)" opacity="0.2" />
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="url(#tiktokGrad)" />
      </svg>
    ),
    facebook: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="facebookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1877F2" />
            <stop offset="100%" stopColor="#42A5F5" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#facebookGrad)" opacity="0.2" />
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z" fill="url(#facebookGrad)" />
      </svg>
    ),
    youtube: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="youtubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF0000" />
            <stop offset="100%" stopColor="#FF4444" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#youtubeGrad)" opacity="0.2" />
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="url(#youtubeGrad)" />
      </svg>
    ),
    whatsapp: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="whatsappGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#25D366" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#whatsappGrad)" opacity="0.2" />
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="url(#whatsappGrad)" />
      </svg>
    ),
    justforfans: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <radialGradient id="jffGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B9D" />
            <stop offset="50%" stopColor="#C44569" />
            <stop offset="100%" stopColor="#FF1493" />
          </radialGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#jffGrad)" opacity="0.2" />
        <rect x="4" y="4" width="16" height="16" rx="8" ry="8" fill="url(#jffGrad)" />
        <text x="12" y="13" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">JF</text>
      </svg>
    ),
    onlyfans: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="ofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="50%" stopColor="#1e90ff" />
            <stop offset="100%" stopColor="#FF0080" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#ofGrad)" opacity="0.2" />
        <rect x="4" y="4" width="16" height="16" rx="8" ry="8" fill="url(#ofGrad)" />
        <text x="12" y="13" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">OF</text>
      </svg>
    ),
    amazon: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="amazonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9900" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#amazonGrad)" opacity="0.2" />
        <path d="M14.465 11.813c-1.768.781-4.133 1.205-6.24 1.205-2.956 0-5.618-.675-7.633-1.801-.157-.083-.315.083-.157.241 1.986 1.728 4.615 2.771 7.256 2.771 1.781 0 3.744-.366 5.545-1.128.272-.105.487.18.229.312zM15.199 10.978c-.226-.315-1.499-.148-2.074-.074-.157.023-.18-.117-.038-.214 1.013-.712 2.674-.506 2.868-.267.194.24-.051 1.896-.995 2.688-.145.121-.283.058-.219-.104.215-.532.695-1.714.469-2.029zM13.667 2.494V1.494c0-.149.111-.248.248-.248h4.387c.141 0 .252.102.252.248v.857c-.004.141-.121.327-.332.62L14.784 8.15c.816-.02 1.677.101 2.417.506.167.091.212.226.226.359v1.069c0 .146-.162.318-.332.229-1.395-.732-3.248-.811-4.794.012-.154.081-.317-.086-.317-.232v-1.014c0-.16.002-.432.164-.674l3.425-4.912H13.92c-.141 0-.252-.101-.252-.248zM5.063 11.465H3.612c-.135-.009-.243-.11-.252-.243V1.499c0-.148.124-.268.276-.268h1.355c.137.008.247.112.258.246v1.312h.028c.344-.984 1.271-1.761 2.365-1.761 1.108 0 1.802.777 2.3 1.761.344-.984 1.397-1.761 2.477-1.761 1.094 0 2.143.482 2.641 1.557.414.776.344 2.135.344 3.246v6.388c0 .149-.124.268-.276.268h-1.451c-.141-.009-.254-.117-.254-.268V6.577c0-.44.042-1.537-.056-1.963-.154-.716-.617-.919-1.265-.919-.522 0-1.067.35-1.287.907-.221.558-.198 1.491-.198 2.046v5.12c0 .149-.124.268-.276.268H8.633c-.141-.009-.254-.117-.254-.268l-.001-5.12c0-1.078.178-2.664-1.321-2.664-1.513 0-1.455 1.731-1.455 2.664v5.12c0 .149-.124.268-.276.268z" fill="url(#amazonGrad)" />
      </svg>
    ),
    paypal: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <linearGradient id="paypalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#003087" />
            <stop offset="100%" stopColor="#009CDE" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#paypalGrad)" opacity="0.2" />
        <path d="M8.32 21.97a.546.546 0 0 1-.26-.32c-.03-.15-.06-.3-.06-.45l.3-1.87c.06-.3.3-.54.6-.66.3-.12.63-.18.96-.18h2.1c.45 0 .9-.06 1.32-.21 2.73-.84 4.05-3.21 3.3-5.94-.45-1.59-1.65-2.88-3.18-3.42-.3-.09-.63-.15-.96-.18h-4.2c-.54 0-1.02.36-1.17.87L5.04 18.6c-.03.12-.06.27-.06.39 0 .48.39.87.87.87h2.1c.18 0 .33-.06.48-.15l.3-.24c.12-.12.21-.24.24-.39l.21-1.32c.03-.15.12-.3.21-.42.15-.15.33-.24.54-.27.09 0 .15-.03.24-.03h.69c.45 0 .87-.06 1.29-.18 3.15-.96 4.98-3.54 4.59-6.45v-.03c-.42-2.85-2.67-5.1-5.52-5.52h-.06c-.3-.03-.57-.06-.87-.06H5.76c-.63 0-1.17.42-1.32 1.02L2.01 16.2c-.06.27-.09.54-.09.81 0 1.47 1.2 2.67 2.67 2.67h3.48c.09 0 .15 0 .24-.03l.06-.27-.06.27z" fill="url(#paypalGrad)" />
      </svg>
    ),
    wise: (
      <svg className={className} viewBox="0 0 24 24" width="20" height="20">
        <defs>
          <radialGradient id="wiseGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="50%" stopColor="#5B9BD5" />
            <stop offset="100%" stopColor="#2E86AB" />
          </radialGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#wiseGrad)" opacity="0.2" />
        <circle cx="12" cy="12" r="8" fill="none" stroke="url(#wiseGrad)" strokeWidth="1.5" opacity="0.8" />
        <path d="M12 6v6l4 2" stroke="url(#wiseGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  };

  return icons[name] || icons.globe;
}
