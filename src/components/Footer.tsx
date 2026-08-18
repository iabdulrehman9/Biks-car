import type { MouseEvent } from 'react';
import {Smartphone, Phone, MapPin, Globe, ArrowUpRight, Mail, Printer } from 'lucide-react';
import { Logo } from './Logo';
import { useRouter } from '@/lib/router';

// ============================================================================
// Constants
// ============================================================================

const COMPANY_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  
] as const;

const CONTACT_DETAILS = [
  {
    type: 'address',
    icon: MapPin,
    content: (
      <>
        1315-15 Morokawa,
        <br />
        Koga, Ibaraki 306-0126,
        <br />
        Japan
      </>
    ),
  },
  {
    type: 'mobile',
    icon: Smartphone,
    content: '090-7714-4212',
    href: 'tel:09077144212',
  },
  {
    type: 'phone',
    icon: Phone,
    content: 'Tel: 0280-23-4474',
    href: 'tel:0280234474',
  },
  {
    type: 'fax',
    icon: Printer,
    content: 'FAX: 0280-23-4464',
  },
  {
    type: 'email',
    icon: Mail,
    content: 'biksss@gmail.com',
    href: 'mailto:biksss@gmail.com',
  },
] as const;

const SOCIAL_LINKS = [
  {
    icon: Globe,
    label: 'BIKS Website',
    href: '/',
  },
] as const;

const DEVELOPER_LINK = 'https://www.linkedin.com/in/abdul-rehman-526332214/';

// ============================================================================
// Component
// ============================================================================

export function Footer() {
  const { navigate } = useRouter();

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!path.startsWith('/')) return;

    event.preventDefault();
    navigate(path);
  };

  return (
    <footer className="border-t border-white/10 bg-[#001030] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        
        {/* Main Footer Section */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-12 md:gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="flex flex-col items-start sm:col-span-2 md:col-span-12 lg:col-span-5">
            <div className="inline-flex">
              <Logo 
                variant="light" 
                onClick={() => navigate('/')} 
              />
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/65 sm:mt-5 sm:leading-7">
              BIKS Car Trading Company is a trusted Japanese vehicle exporter, supplying high-quality
              new and used vehicles worldwide with reliable inspection, shipping, and export services.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:-translate-y-1 hover:border-[#D0A030] hover:bg-[#D0A030] hover:text-[#001030] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D0A030]"
                >
                  <Icon
                    className="h-4 w-4 transition-transform duration-200 group-hover:scale-105"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="md:col-span-5 lg:col-span-3" aria-label="Company navigation">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#D0A030] sm:mb-5">
              Company
            </h2>

            <ul className="space-y-3">
              {COMPANY_LINKS.map(({ label, path }) => (
                <li key={path}>
                  <a
                    href={path}
                    onClick={(e) => handleNavigation(e, path)}
                    className="group inline-flex items-center gap-1 text-sm text-white/65 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D0A030]"
                  >
                    <span>{label}</span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Details */}
          <div className="md:col-span-7 lg:col-span-4">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#D0A030] sm:mb-5">
              Contact Us
            </h2>

            <address className="not-italic">
              <ul className="space-y-4">
                {CONTACT_DETAILS.map(({ type, icon: Icon, content, href }) => (
                  <li key={type}>
                    {href ? (
                      <a
                        href={href}
                        className="group flex items-start gap-3 text-sm text-white/65 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D0A030]"
                      >
                        <Icon
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#D0A030]"
                          aria-hidden="true"
                        />
                        <span className="break-words">{content}</span>
                      </a>
                    ) : (
                      <div className="flex items-start gap-3 text-sm text-white/65">
                        <Icon
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#D0A030]"
                          aria-hidden="true"
                        />
                        <span className="break-words">{content}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-7">
          <p className="text-left">
            © {new Date().getFullYear()} BIKS Car Trading Company. All rights reserved.
          </p>

          <p className="text-left sm:text-right">
            Designed &amp; Developed by{' '}
            <a
              href={DEVELOPER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/60 transition-colors hover:text-[#D0A030] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D0A030]"
            >
              AIWA Logic
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}