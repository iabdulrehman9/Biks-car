import React from 'react';
import biks from '../img/biks.png';

interface LogoProps {
  variant?: 'dark' | 'light';
  /** Height class for the logo mark (e.g., 'h-10', 'h-12') */
  size?: string;
  showText?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Logo({
  variant = 'dark',
  size = 'h-10 sm:h-12 lg:h-14',
  showText = true,
  onClick,
  className = '',
}: LogoProps) {
  const isLight = variant === 'light';

  const containerClasses = [
    'group inline-flex items-center gap-3 select-none',
    'rounded-lg p-1 -m-1',
    'text-left transition-all duration-200 ease-in-out',
    'outline-none focus-visible:ring-2 focus-visible:ring-[#D0A030]',
    isLight ? 'focus-visible:ring-offset-[#001030]' : 'focus-visible:ring-offset-white',
    onClick ? 'cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {/* Logo Mark */}
      <div className="flex shrink-0 items-center justify-center">
        <img
          src={biks}
          alt=""
          aria-hidden="true"
          className={`
            ${size}
            w-auto
            object-contain
            transition-transform
            duration-300
            ease-out
            group-hover:scale-105
          `}
        />
      </div>

      {showText && (
        <>
          {/* Divider */}
          <div
            aria-hidden="true"
            className={`
              h-8 w-px shrink-0 transition-colors duration-200
              ${isLight ? 'bg-white/20' : 'bg-[#001030]/15'}
            `}
          />

          {/* Brand Text */}
          <div className="flex min-w-0 flex-col justify-center">
            {/* B.I.K.S. Header */}
            <span
              className={`
                font-logo
                whitespace-nowrap
                text-lg font-black uppercase tracking-wider
                sm:text-xl lg:text-2xl
                leading-none
                ${isLight ? 'text-white' : 'text-[#001030]'}
              `}
            >
              B.I.<span className="font-black text-[#D0A030]">K</span>.S.
            </span>

            {/* Trading Company Sub-text */}
            <span
              className={`
                mt-1 whitespace-nowrap
                font-trading
                text-[10px] font-black uppercase tracking-[0.22em]
                leading-none text-[#D0A030]
                sm:text-[11px]
              `}
            >
              Trading Company
            </span>
          </div>
        </>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="B.I.K.S. Car Trading Company - Go to homepage"
        className={containerClasses}
      >
        {content}
      </button>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}