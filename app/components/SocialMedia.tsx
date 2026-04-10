'use client';

import { useState } from 'react';

const SOCIAL_LINKS = [
  { label: 'X (TWITTER)', url: 'https://x.com/OnlyMatt43' },
  { label: 'INSTAGRAM', url: 'https://www.instagram.com/onlymatt43' },
  { label: 'INSTAGRAM PRO', url: 'https://www.instagram.com/onlymatt.43' },
  { label: 'BLUESKY', url: 'https://bsky.app/profile/onlymatt.bsky.social' },
  { label: 'TIKTOK', url: 'https://www.tiktok.com/@its.only.matt' },
  { label: 'FACEBOOK', url: 'https://www.facebook.com/matt.matt.864685/' },
];

export default function SocialMedia() {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const allLinks = SOCIAL_LINKS.map((l) => l.url).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(allLinks).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <button
        onClick={handleCopy}
        className="block w-full text-center transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        <div className="relative py-2">
          <span
            className="font-semibold tracking-wide text-slate-100 hover:text-white transition-colors"
            style={{ fontSize: 'clamp(0.74rem, 1.65vmin, 0.875rem)' }}
          >
            {copied ? '✓ LINKS COPIED' : 'SOCIAL MEDIA'}
          </span>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          showOptions ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-2 pt-2 pb-1">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center transition-all duration-200 hover:scale-105 hover:brightness-125"
            >
              <span
                className="font-medium tracking-wider text-emerald-300/80 hover:text-emerald-200 transition-colors uppercase"
                style={{ fontSize: 'clamp(0.58rem, 1.3vmin, 0.72rem)' }}
              >
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
