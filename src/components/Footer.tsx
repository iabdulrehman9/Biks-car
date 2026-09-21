import type { MouseEvent } from 'react';
import { Smartphone, Phone, MapPin, Globe, ArrowUpRight, Mail, Printer } from 'lucide-react';
import { Logo } from './Logo';
import { LineIcon } from './LineIcon';
import qrCodeImg from '../img/line-qr-code.jpeg';
import { useRouter } from '@/lib/router';
import { useTranslation } from '@/lib/i18n';

const LINE_URL = 'https://line.me/ti/p/-etV1cs4Vf';

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

export function Footer() {
  const { navigate } = useRouter();
  const { t, categoryLabel } = useTranslation();

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!path.startsWith('/')) return;
    event.preventDefault();
    navigate(path);
  };

  const companyLinks = [
    { label: t('nav.home', 'Home'), path: '/' },
    { label: t('nav.collection', 'Collection'), path: '/collection' },
    { label: t('nav.about', 'About Us'), path: '/about' },
    { label: t('nav.sellWithUs', 'Sell With Us'), path: '/sell' },
  ];

  const popularCategories = [
    'Trucks',
    'Excavators',
    'Tyre Shover',
    'Forklifts',
    'Agriculture Machines',
    'Truck Fixtures',
    'Cars',
    'Other Parts',
  ];

  return (
    <footer className="border-t border-white/10 bg-[#001030] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        
        {/* Main Footer Section */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-12 md:gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="flex flex-col items-start sm:col-span-2 md:col-span-12 lg:col-span-4">
            <div className="inline-flex">
              <Logo 
                variant="light" 
                onClick={() => navigate('/')} 
              />
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/65 sm:mt-5 sm:leading-7">
              {t('footer.about', 'BIKS Trading Company is a trusted Japanese vehicle exporter, supplying high-quality used vehicles worldwide with reliable inspection, shipping, and export services.')}
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
          <nav className="md:col-span-3 lg:col-span-2" aria-label="Company navigation">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#D0A030] sm:mb-5">
              {t('footer.quickLinks', 'Quick Links')}
            </h2>

            <ul className="space-y-3">
              {companyLinks.map(({ label, path }) => (
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

          {/* Popular Categories */}
          <nav className="md:col-span-4 lg:col-span-3" aria-label="Popular Categories">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#D0A030] sm:mb-5">
              {t('footer.categories', 'Categories')}
            </h2>

            <ul className="space-y-2">
              {popularCategories.map((cat) => (
                <li key={cat}>
                  <a
                    href={`/#/collection?category=${encodeURIComponent(cat)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/collection?category=${encodeURIComponent(cat)}`);
                    }}
                    className="text-xs text-white/60 hover:text-[#D0A030] transition-colors"
                  >
                    {categoryLabel(cat)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Details */}
          <div className="md:col-span-5 lg:col-span-3">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#D0A030] sm:mb-5">
              {t('footer.contactInfo', 'Contact Information')}
            </h2>

            <address className="not-italic">
              <ul className="space-y-3">
                {CONTACT_DETAILS.map((item) => {
                  const Icon = item.icon;
                  const href = 'href' in item ? item.href : undefined;
                  return (
                    <li key={item.type}>
                      {href ? (
                        <a
                          href={href}
                          className="group flex items-start gap-2.5 text-xs text-white/65 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D0A030]"
                        >
                          <Icon
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D0A030]"
                            aria-hidden="true"
                          />
                          <span className="break-words">{item.content}</span>
                        </a>
                      ) : (
                        <div className="flex items-start gap-2.5 text-xs text-white/65">
                          <Icon
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D0A030]"
                            aria-hidden="true"
                          />
                          {item.type === 'address' ? (
                            <span className="break-words leading-relaxed">
                              {t('footer.addressLine1', '1315-15 Morokawa,')}
                              <br />
                              {t('footer.addressLine2', 'Koga, Ibaraki 306-0126,')}
                              <br />
                              {t('footer.addressLine3', 'Japan')}
                            </span>
                          ) : (
                            <span className="break-words">{item.content}</span>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </address>

            {/* LINE Official QR Code Scanner */}
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#D0A030]">
                <LineIcon className="h-3.5 w-3.5 text-[#06C755]" />
                <span>{t('footer.lineConnect', 'Connect on LINE')}</span>
              </p>
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex flex-col items-center rounded-xl bg-white p-2.5 shadow-md ring-1 ring-white/10 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:ring-2 hover:ring-[#06C755]"
                aria-label="Connect with BIKS on LINE"
              >
                <img
                  src={qrCodeImg}
                  alt="BIKS Official LINE QR Code"
                  className="h-28 w-28 rounded-lg object-contain"
                />
                <span className="mt-1.5 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#001030] transition-colors group-hover:text-[#06C755]">
                  <span>{t('footer.lineScan', 'Scan or Click to Chat')}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-7">
          <p className="text-left">
            © {new Date().getFullYear()} BIKS Trading Company. {t('footer.rights', 'All rights reserved.')}
          </p>
        </div>

      </div>
    </footer>
  );
}
