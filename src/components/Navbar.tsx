import { useState, useEffect } from 'react';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { useRouter } from '@/lib/router';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'CIF Calculator', path: '/calculator' },
  { label: 'Inquiry', path: '/inquiry' },
  { label: 'About', path: '/about' },
];

export function Navbar() {
  const { route, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [route.path]);

  const isActive = (path: string) =>
    path === '/' ? route.path === '/' : route.path.startsWith(path);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy/95 shadow-lg backdrop-blur-md'
          : 'bg-gradient-to-b from-navy-dark/80 to-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/')} className="shrink-0">
          <Logo variant="light" />
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-gold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gold" />
              )}
            </button>
          ))}
          <div className="mx-2 h-6 w-px bg-white/20" />
          <button
            onClick={() => navigate('/portal')}
            className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            Customer Portal
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-gold"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => navigate('/inquiry')}
          className="hidden btn-premium !py-2 !px-4 lg:inline-flex"
        >
          Get a Quote
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-white lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="animate-slide-down border-t border-white/10 bg-navy-dark px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`rounded-md px-4 py-3 text-left text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-gold/10 text-gold'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => navigate('/portal')}
              className="rounded-md px-4 py-3 text-left text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
            >
              Customer Portal
            </button>
            <button
              onClick={() => navigate('/inquiry')}
              className="btn-premium mt-2 w-full"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
