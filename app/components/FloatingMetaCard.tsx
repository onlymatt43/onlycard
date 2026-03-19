'use client';

import { useEffect, useState } from 'react';

interface FloatingMetaCardProps {
  url?: string;
  position?: 'left' | 'right';
}

interface MetaData {
  title: string;
  description: string;
  image: string;
}

export default function FloatingMetaCard({ url, position = 'right' }: FloatingMetaCardProps) {
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(!!url);

  useEffect(() => {
    if (!url) return;
    setIsLoading(true);
    fetch(`/api/fetch-meta?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.title || data.description) {
          setMeta(data);
        }
      })
      .catch(() => {
        console.error('Failed to fetch meta');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]);

  if (!isVisible || !meta) return null;

  const positionClass = position === 'left' ? 'left-0' : 'right-0';

  return (
    <div
      className={`fixed top-1/2 ${positionClass} transform -translate-y-1/2 w-64 animate-fade-in-up pointer-events-auto z-30`}
      style={{
        animation: 'fadeInScale 0.6s ease-out forwards',
      }}
    >
      <style>
        {`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: translateY(-50%) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(-50%) scale(1);
            }
          }
        `}
      </style>
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
        onClick={() => url && window.open(url, '_blank')}
      >
        {/* Image */}
        {meta.image && (
          <div className="relative h-32 bg-slate-100 overflow-hidden">
            <img
              src={meta.image}
              alt={meta.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-slate-900 transition-colors">
            {meta.title}
          </h3>
          {meta.description && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-3 group-hover:text-slate-700 transition-colors">
              {meta.description}
            </p>
          )}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs uppercase tracking-widest text-slate-500 group-hover:text-blue-600 transition-colors">
              Ouvrir →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
