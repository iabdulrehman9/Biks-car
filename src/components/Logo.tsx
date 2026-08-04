import biks from '../img/biks.png';

export function Logo({
  variant = 'dark',
  size = 'h-16 w-auto max-w-[160px]',
}: {
  variant?: 'dark' | 'light';
  size?: string;
}) {
  return (
    <div className="flex items-center">
      <img
        src={biks}
        alt="BIKS Car Trading Company"
        className={`${size} object-contain`}
      />
    </div>
  );
}