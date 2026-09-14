import React from 'react';
import biksLogo from '../img/biks-logo.png';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: string;
  showText?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Logo({
  size = 'h-10 sm:h-12',
  onClick,
  className = '',
}: LogoProps) {
  const containerClasses = [
    'group inline-flex items-center select-none',
    'rounded-lg transition-all duration-200 ease-in-out',
    'outline-none focus-visible:ring-2 focus-visible:ring-[#D0A030]',
    onClick ? 'cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <img
      src={biksLogo}
      alt="BIKS Trading Company"
      className={`${size} w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105`}
    />
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="BIKS Trading Company — Go to homepage"
        className={containerClasses}
      >
        {content}
      </button>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}