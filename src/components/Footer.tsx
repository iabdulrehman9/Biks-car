import { Mail, Phone, MapPin, Globe, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Logo } from './Logo';
import { useRouter } from '@/lib/router';

const footerLinks = {
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Our Services', path: '/services' },
    { label: 'Why BIKS', path: '/about' },
    { label: 'Contact', path: '/inquiry' },
  ],
  Marketplace: [
    { label: 'Browse Vehicles', path: '/marketplace' },
    { label: 'Featured Cars', path: '/marketplace?filter=featured' },
    { label: 'CIF Calculator', path: '/calculator' },
    { label: 'Request Quote', path: '/inquiry' },
  ],
  Portal: [
    { label: 'Customer Login', path: '/portal' },
    { label: 'Track Shipment', path: '/portal' },
    { label: 'My Orders', path: '/portal' },
    { label: 'Documents', path: '/portal' },
  ],
};

export function Footer() {
  const { navigate } = useRouter();
  return (
    <footer className="bg-navy-dark text-white/70">
      <div className="container-page px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              BIKS Car Trading Company is a premier Japanese vehicle export
              partner, delivering quality automobiles to clients worldwide with
              trust, transparency, and end-to-end logistics support.
            </p>
            <div className="mt-6 flex gap-3">
              {[Globe, Linkedin, Facebook, Instagram].map((Icon, i) => (
                <button
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-colors hover:bg-gold hover:text-navy-dark"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gold">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gold">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>1-2-3 Minato Mirai, Yokohama, Japan 220-0012</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span>+81 45 000 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <span>info@bikstrading.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} BIKS Car Trading Company. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/40">
            <button className="hover:text-white/70">Privacy Policy</button>
            <button className="hover:text-white/70">Terms of Service</button>
            <button className="hover:text-white/70">Shipping Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
