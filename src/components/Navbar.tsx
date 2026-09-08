import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { useRouter } from '@/lib/router';

// Expanded links for realistic car trading UI context
const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
];

const COMPANY_PHONE = '+819077144212';

export function Navbar() {
  const { route, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Scroll handler */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [route.path]);

  const isActive = (path: string) => {
    if (path === '/') return route.path === '/';
    return route.path === path || route.path.startsWith(`${path}/`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/80 bg-white/95 shadow-md shadow-slate-900/5 backdrop-blur-md'
          : 'border-b border-slate-100 bg-white'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between gap-4 sm:h-20">
          
          {/* ================= LOGO ================= */}
          <div className="flex shrink-0 items-center">
            {/* Logo component already contains click handling; removed wrapper <button> to prevent nested button warnings */}
            <Logo onClick={() => navigate('/')} />
          </div>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.path);

              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => navigate(link.path)}
                  className={`relative px-4 py-2 text-sm font-bold tracking-wide transition-colors ${
                    active
                      ? 'text-[#001030]'
                      : 'text-slate-600 hover:text-[#001030]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#D0A030]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ================= DESKTOP CTA ================= */}
          <div className="hidden items-center lg:flex">
            <a
              href={`tel:${COMPANY_PHONE}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#D0A030] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#001030] shadow-sm transition-all duration-200 hover:bg-[#c09025] hover:shadow-md active:scale-95"
              aria-label="Call BIKS Car Trading Company"
            >
              <Phone className="h-4 w-4" />
              <span>Contact Us</span>
            </a>
          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200 lg:hidden ${
              mobileOpen
                ? 'border-[#D0A030] bg-[#D0A030] text-[#001030]'
                : 'border-slate-200 bg-white text-[#001030] hover:border-[#D0A030]/50'
            }`}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* ================= MOBILE NAVIGATION MENU ================= */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <div className="space-y-1.5 px-4 pb-6 pt-3 sm:px-6">
          {navLinks.map((link) => {
            const active = isActive(link.path);

            return (
              <button
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-bold tracking-wide transition-all ${
                  active
                    ? 'bg-[#001030] text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#001030]'
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <span className="h-2 w-2 rounded-full bg-[#D0A030]" />
                )}
              </button>
            );
          })}

          <a
            href={`tel:${COMPANY_PHONE}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#D0A030] px-5 py-3 text-sm font-bold uppercase tracking-wider text-[#001030] transition-all hover:bg-[#c09025] active:scale-[0.98]"
            aria-label="Call BIKS Car Trading Company"
          >
            <Phone className="h-4 w-4" />
            <span>Contact Us</span>
          </a>
        </div>
      </div>
    </header>
  );
}