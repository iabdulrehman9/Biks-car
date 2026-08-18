import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { useRouter } from '@/lib/router';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
];

export function Navbar() {
  const { route, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [route.path]);

  const isActive = (path: string) =>
    path === '/' ? route.path === '/' : route.path.startsWith(path);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-all duration-300 ${
        scrolled
          ? 'shadow-md'
          : 'border-b border-slate-100 shadow-sm'
      }`}
    >
      <nav className="container-page flex h-[76px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex h-16 shrink-0 items-center"
          aria-label="BIKS Car Trading Company Home"
        >
          <Logo />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.path);

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'text-gold-dark'
                    : 'text-slate-700 hover:text-navy'
                }`}
              >
                {link.label}

                {active && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gold" />
                )}
              </button>
            );
          })}
        </div>

        {/* Contact CTA */}
        <button
          type="button"
          onClick={() => {
            window.location.href = 'tel:+819077144212';
          }}
          aria-label="Call us"
          className="hidden btn-premium !px-4 !py-2 lg:inline-flex"
        >
          Contact Us
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-navy transition-colors hover:bg-slate-100 lg:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="animate-slide-down border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);

              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`rounded-md px-4 py-3 text-left text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gold/10 text-gold-dark'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-navy'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Contact CTA */}
            <button
              onClick={() => {
                window.location.href = 'tel:+819077144212';
              }}
              className="btn-premium mt-2 w-full"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
}