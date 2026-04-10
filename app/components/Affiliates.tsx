'use client';

import { useState } from 'react';

const AFFILIATE_LINKS = [
  { label: 'INTIMALY', url: 'https://intimaly.com/products/feel-onlymatt' },
  { label: 'JOCKTRIBE', url: 'https://affiliate.onlymatt.ca/JockTribe' },
  { label: 'COCKBLOCK', url: 'https://affiliate.onlymatt.ca/COCKBLOCK' },
  { label: 'BEISAR', url: 'https://beisar.com/super-o-anal-toys/beisar-petalwish-2-thrusting-prostate-massager' },
  { label: 'AMAZON', url: 'https://www.amazon.ca/gp/profile/amzn1.account.AGKXJLNXARH2FYTIX4ZHRC6B2K3Q' },
];

export default function Affiliates() {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const allLinks = AFFILIATE_LINKS.map((l) => l.url).join('\n');

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
            {copied ? '✓ LINKS COPIED' : 'AFFILIATES'}
          </span>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          showOptions ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-2 pt-2 pb-1">
          {AFFILIATE_LINKS.map((link) => (
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
