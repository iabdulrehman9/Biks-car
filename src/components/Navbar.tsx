import { useEffect, useState, useRef } from 'react';
import { Menu, X, Phone, Globe, ChevronDown, Check } from 'lucide-react';
import { Logo } from './Logo';
import { useRouter } from '@/lib/router';
import { useTranslation, type Language } from '@/lib/i18n';

const navLinks = [
  { key: 'nav.home', defaultLabel: 'Home', path: '/' },
  { key: 'nav.collection', defaultLabel: 'Collection', path: '/collection' },
  { key: 'nav.about', defaultLabel: 'About Us', path: '/about' },
];

const COMPANY_PHONE = '+819077144212';

export function Navbar() {
  const { route, navigate } = useRouter();
  const { language, setLanguage, t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  /* Scroll handler */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu and dropdown on route change */
  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
  }, [route.path]);

  /* Close language dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langOpen]);

  const isActive = (path: string) => {
    if (path === '/') return route.path === '/';
    return route.path === path || route.path.startsWith(`${path}/`);
  };

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangOpen(false);
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
                  {t(link.key, link.defaultLabel)}
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

          {/* ================= DESKTOP CTA & LANGUAGE SWITCHER ================= */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Language Switcher Dropdown (araiaa.jp style) */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#001030] shadow-sm transition-all duration-200 hover:border-[#001030] hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D0A030]"
                aria-label="Select Language"
                aria-expanded={langOpen}
                aria-haspopup="true"
              >
                <Globe className="h-4 w-4 text-[#001030]" />
                <span className="font-extrabold">{language.toUpperCase()}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <button
                    type="button"
                    onClick={() => handleSelectLanguage('ja')}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold transition-colors ${
                      language === 'ja'
                        ? 'bg-[#001030]/5 text-[#001030] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#001030]'
                    }`}
                  >
                    <span>日本語</span>
                    {language === 'ja' && <Check className="h-3.5 w-3.5 text-[#D0A030]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectLanguage('en')}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-semibold transition-colors ${
                      language === 'en'
                        ? 'bg-[#001030]/5 text-[#001030] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#001030]'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <Check className="h-3.5 w-3.5 text-[#D0A030]" />}
                  </button>
                </div>
              )}
            </div>

            <a
              href={`tel:${COMPANY_PHONE}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#D0A030] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#001030] shadow-sm transition-all duration-200 hover:bg-[#c09025] hover:shadow-md active:scale-95"
              aria-label="Call BIKS Trading Company"
            >
              <Phone className="h-4 w-4" />
              <span>{t('nav.contact', 'Contact Us')}</span>
            </a>
          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200 md:hidden ${
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
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 md:hidden ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <div className="space-y-1.5 px-4 pb-6 pt-3 sm:px-6">
          {/* Mobile Language Switcher */}
          <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Globe className="h-4 w-4 text-[#001030]" />
              <span>Language / 言語</span>
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#001030] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ja')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                  language === 'ja'
                    ? 'bg-[#001030] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                日本語
              </button>
            </div>
          </div>

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
                <span>{t(link.key, link.defaultLabel)}</span>
                {active && (
                  <span className="h-2 w-2 rounded-full bg-[#D0A030]" />
                )}
              </button>
            );
          })}

          <a
            href={`tel:${COMPANY_PHONE}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#D0A030] px-5 py-3 text-sm font-bold uppercase tracking-wider text-[#001030] transition-all hover:bg-[#c09025] active:scale-[0.98]"
            aria-label="Call BIKS Trading Company"
          >
            <Phone className="h-4 w-4" />
            <span>{t('nav.contact', 'Contact Us')}</span>
          </a>
        </div>
      </div>
    </header>
  );
}