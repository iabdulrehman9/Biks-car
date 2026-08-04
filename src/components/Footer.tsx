import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Facebook,
  Instagram,
} from 'lucide-react';
import { Logo } from './Logo';
import { useRouter } from '@/lib/router';

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Why BIKS', path: '/about#why-us' },
    { label: 'Marketplace', path: '/marketplace' },
  ],
  Marketplace: [
    { label: 'Browse Vehicles', path: '/marketplace' },
    { label: 'Featured Cars', path: '/marketplace?filter=featured' },
  ],
  Resources: [
    { label: 'Admin ERP', path: '/admin' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Shipping Policy', path: '/shipping' },
  ],
} as const;

const SOCIAL_LINKS = [
  { icon: Globe, label: 'Website', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
];

export function Footer() {
  const { navigate } = useRouter();

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    if (path.startsWith('/')) {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <footer className="bg-navy border-t border-white/10 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Company Info */}
          <div className="lg:col-span-4">
            <a
              href="/"
              onClick={(e) => handleNavigation(e, '/')}
              className="inline-block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Logo />
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              BIKS Car Trading Company is a trusted Japanese vehicle exporter,
              supplying high-quality new and used vehicles worldwide with
              complete shipping, inspection, and export services.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2 lg:col-span-5"
            aria-label="Footer Navigation"
          >
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold">
                  {title}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.path}
                        onClick={(e) => handleNavigation(e, link.path)}
                        className="inline-block text-sm text-white/70 transition-all duration-150 hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Contact Details */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold">
              Contact Us
            </h3>
            <address className="not-italic">
              <ul className="space-y-3.5 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    Yokohama, Kanagawa<br />
                    Japan
                  </span>
                </li>
                <li>
                  <a
                    href="tel:+819077144212"
                    className="flex items-center gap-3 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>+81 90 7714 4212</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@bikstrading.com"
                    className="flex items-center gap-3 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>info@bikstrading.com</span>
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} BIKS Car Trading Company. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="/privacy"
              onClick={(e) => handleNavigation(e, '/privacy')}
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleNavigation(e, '/terms')}
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Terms of Service
            </a>
            <a
              href="/shipping"
              onClick={(e) => handleNavigation(e, '/shipping')}
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Shipping Policy
            </a>

            {/* LinkedIn Credit Badge in Corner */}
            <span className="border-l border-white/10 pl-6 text-white/40">
              Designed &amp; Developed by{' '}
              <a
                href="https://www.linkedin.com/in/abdul-rehman-526332214/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/60 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                AR
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}