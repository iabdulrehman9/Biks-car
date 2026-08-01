import { Car } from 'lucide-react';

export function Logo({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const textColor = variant === 'light' ? 'text-white' : 'text-navy';
  const subColor = variant === 'light' ? 'text-gold-light' : 'text-gold-dark';
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy ring-1 ring-gold/30">
        <Car className="h-5 w-5 text-gold" strokeWidth={2.5} />
      </div>
      <div className="leading-none">
        <div className={`text-lg font-extrabold tracking-tight ${textColor}`}>BIKS</div>
        <div className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subColor}`}>
          Car Trading Co.
        </div>
      </div>
    </div>
  );
}
