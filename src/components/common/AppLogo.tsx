import React from 'react';
import { Award } from 'lucide-react';

interface AppLogoProps {
  className?: string;
  showText?: boolean;
  compact?: boolean;
  textClassName?: string;
  imageClassName?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  showText = true,
  compact = false,
  textClassName = '',
  imageClassName = '',
}) => {
  const logoUrl = import.meta.env.VITE_APP_LOGO_URL || '/logo.svg';
  const imageSize = compact ? 'w-10 h-10' : 'w-12 h-12';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative">
        <img
          src={logoUrl}
          alt="Kingabwa Awards"
          className={`${imageSize} object-contain rounded-xl border border-gold-400/20 bg-dark-900/70 shadow-gold-glow p-1.5 ${imageClassName}`}
          onError={(event) => {
            const target = event.currentTarget;
            target.style.display = 'none';
            const fallback = target.parentElement?.querySelector('[data-logo-fallback]') as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          data-logo-fallback
          className="hidden absolute inset-0 items-center justify-center rounded-xl bg-gold-gradient text-dark-950 shadow-gold-glow"
          style={{ display: 'none' }}
        >
          <Award className="w-5 h-5 stroke-[2.5]" />
        </div>
      </div>

      {showText && (
        <div className="leading-none">
          <span className={`font-serif text-lg sm:text-xl font-extrabold tracking-wider text-gold-gradient uppercase block ${textClassName}`}>
            KINGABWA AWARDS
          </span>
          {!compact && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold block mt-1">
              ÉDITION 2026
            </span>
          )}
        </div>
      )}
    </div>
  );
};
