import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  /** Height class for the logo (e.g., 'h-10', 'h-12 lg:h-14') */
  size?: string;
  showText?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Logo({
  variant = 'dark',
  size = 'h-10 sm:h-12 lg:h-14',
  onClick,
  className = '',
}: LogoProps) {
  const isLight = variant === 'light';

  const containerClasses = [
    'group inline-flex items-center select-none',
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
    <img
      src="/BIKS Trading Company.png"
      alt="BIKS Trading Company"
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
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="BIKS Trading Company - Go to homepage"
        className={containerClasses}
      >
        {content}
      </button>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}