import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { useRouter } from '@/lib/router';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
];

const COMPANY_PHONE = '+819077144212';

export function Navbar() {
  const { route, navigate } = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* =========================================================
     SCROLL STATE
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* =========================================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [route.path]);

  /* =========================================================
     ACTIVE LINK
  ========================================================= */

  const isActive = (path: string) => {
    if (path === '/') {
      return route.path === '/';
    }

    return route.path === path || route.path.startsWith(`${path}/`);
  };

  const handleCall = () => {
    window.location.href = `tel:${COMPANY_PHONE}`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/80 bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur-xl'
          : 'border-b border-slate-200/70 bg-white'
      }`}
    >
      <nav className="container-page flex h-[72px] items-center justify-between px-4 sm:h-[78px] sm:px-6 lg:px-8">

        {/* ================= LOGO ================= */}

        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex shrink-0 items-center transition-opacity hover:opacity-80"
          aria-label="BIKS Car Trading Company Home"
        >
          <Logo />
        </button>

        {/* ================= DESKTOP NAVIGATION ================= */}

        <div className="hidden items-center rounded-full border border-slate-200 bg-slate-50/70 p-1 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.path);

            return (
              <button
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
                className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-navy'
                }`}
              >
                {link.label}

                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ================= CONTACT / CALL BUTTON ================= */}

        <button
          type="button"
          onClick={handleCall}
          className="hidden items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy-dark shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20 lg:inline-flex"
          aria-label="Call BIKS Car Trading Company"
        >
          <Phone className="h-4 w-4" />

          Contact Us
        </button>

        {/* ================= MOBILE MENU BUTTON ================= */}

        <button
          type="button"
          onClick={() => setMobileOpen((previous) => !previous)}
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 lg:hidden ${
            mobileOpen
              ? 'border-gold bg-gold text-navy-dark'
              : 'border-slate-200 bg-white text-navy hover:border-gold/50 hover:bg-gold/5'
          }`}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

      </nav>

      {/* ================= MOBILE NAVIGATION ================= */}

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden ${
          mobileOpen
            ? 'max-h-[300px] opacity-100'
            : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <div className="container-page px-4 py-4 sm:px-6">

          <div className="flex flex-col gap-1">

            {/* Home + About */}

            {navLinks.map((link) => {
              const active = isActive(link.path);

              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => navigate(link.path)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition-all ${
                    active
                      ? 'bg-navy text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-navy'
                  }`}
                >
                  {link.label}

                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  )}
                </button>
              );
            })}

            {/* Contact Call Button */}

            <button
              type="button"
              onClick={handleCall}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3.5 text-sm font-bold text-navy-dark transition-all hover:shadow-lg"
              aria-label="Call BIKS Car Trading Company"
            >
              <Phone className="h-4 w-4" />

              Contact Us
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}