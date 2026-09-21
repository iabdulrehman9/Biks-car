import { useState } from 'react';
import {
  ShieldCheck,
  Ship,
  CheckCircle2,
  Building2,
  Calendar,
  Award,
  MapPin,
  User,
  Briefcase,
  Phone,
  Printer,
  ArrowRight,
  Globe,
  Gavel,
  ClipboardCheck,
  Cog,
  Sparkles,
  Smartphone,
  Car,
  Tractor,
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { useTranslation } from '@/lib/i18n';
import heroImage from '@/img/frontImage.jpeg';
import heroVideo from '@/img/Video.mp4';

export function AboutPage() {
  const { navigate } = useRouter();
  const { t } = useTranslation();
  const [videoReady, setVideoReady] = useState(false);

  const milestones = [
    {
      year: t('about.milestone1Year', '2016'),
      title: t('about.milestone1Title', 'Founded in Japan'),
      desc: t('about.milestone1Desc', 'BIKS. Trading Company established as a premium Japanese vehicle export trading company.'),
    },
  ];

  const businessServices = [
    {
      icon: Globe,
      title: 'Global Export & Logistics',
      desc: 'Worldwide shipping and customs clearance for all commercial vehicles.',
    },
    {
      icon: Gavel,
      title: 'Auction Site Operations',
      desc: 'Direct procurement and bidding access across major auction hubs in Japan.',
    },
    {
      icon: ClipboardCheck,
      title: 'Pre-Shipment Inspection',
      desc: 'Rigorously verified condition reports and multi-point technical audits.',
    },
    {
      icon: Cog,
      title: 'Machinery & Parts Trading',
      desc: 'Distribution of authentic Japanese auto parts and commercial equipment.',
    },
    {
      icon: Car,
      title: 'Used Cars Trading',
      desc: 'Sourcing and exporting high-quality pre-owned passenger vehicles.',
    },
    {
      icon: Tractor,
      title: 'Agriculture & Large Vehicles',
      desc: 'Specialized export of tractors, farm machinery, and heavy-duty vehicles.',
    },
  ];

  return (
    <div className="animate-fade-in bg-slate-50/50 pt-16">
      {/* HERO SECTION */}
      <section className="group relative isolate flex min-h-[520px] items-center justify-center overflow-hidden bg-navy-dark py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden bg-navy-dark">
          <img
            src={heroImage}
            alt="Japanese Vehicle Logistics"
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out"
            style={{ opacity: videoReady ? 0 : 0.6 }}
            loading="lazy"
            decoding="async"
          />

          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            onCanPlayThrough={() => setVideoReady(true)}
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out"
            style={{ opacity: videoReady ? 0.6 : 0 }}
          />

          {/* Overlays for enhanced readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/90 via-navy-dark/75 to-slate-900" />
          <div className="absolute -right-40 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-40 bottom-0 h-[300px] w-[300px] rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Hero Content Header */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-400/20 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            {t('about.badge', 'COMPANY PROFILE')}
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
            {t('about.heroTitle1', 'BIKS. Trading Company')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            {t('about.heroSubtitle', 'Your trusted global partner for premium Japanese vehicles, heavy machinery, agricultural equipment, and seamless international export logistics.')}
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/collection')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98]"
            >
              {t('about.browseVehicles', 'View Available Inventory')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* MAIN COMPANY DETAILS GRID */}
      <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Key Quick Info & Contact Cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Core Info</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Company Name</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{t('about.companyName', 'BIKS. Trading Company')}</p>
                  </div>
                </div>

                

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Representative</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-bold text-slate-900">Ahmed</span>
                      <span className="rounded-md bg-emerald-100/70 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Managing Director
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Secondhand License</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-relaxed">
                      {t('about.license', 'No. 401250001818')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Contact Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Location & Contact</h3>
              
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Head Office</p>
                  <p className="text-xs font-semibold text-slate-800 mt-1 leading-relaxed">
                    〒306-0126<br />
                    1315-15 Morokawa, Koga, Ibaraki 306-0126, Japan<br />
                    <span className="text-slate-500 font-normal">(1-15 Morokawa)</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-1 text-xs font-semibold">
                <a href="tel:0280-23-4474" className="flex items-center gap-2.5 text-slate-700 hover:text-sky-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
                  <Phone className="h-4 w-4 text-sky-500" />
                  <span>TEL: 0280-23-4474</span>
                </a>
                <a href="tel:090-7714-4212" className="flex items-center gap-2.5 text-slate-700 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
                  <Smartphone className="h-4 w-4 text-emerald-500" />
                  <span>MOBILE: 090-7714-4212</span>
                </a>
                <div className="flex items-center gap-2.5 text-slate-600 p-2">
                  <Printer className="h-4 w-4 text-slate-400" />
                  <span>FAX: 0280-23-4464</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Scope Card (Takes 2 Columns) */}
          <div className="lg:col-span-2">
            <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Business Scope</h3>
                    <p className="text-xs text-slate-500">Core operational domains and global services</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {businessServices.map((service, idx) => {
                    const Icon = service.icon;
                    return (
                      <div 
                        key={idx} 
                        className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-md"
                      >
                        <div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm border border-slate-200/60 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h4 className="mt-4 font-bold text-slate-900 text-sm">{service.title}</h4>
                          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{service.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-slate-900 p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Verified Official Exporter</p>
                    <p className="text-[11px] text-slate-400">Strict adherence to Japanese export standards and quality checks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
              {t('about.historyEyebrow', 'Our Journey')}
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {t('about.historyTitle', 'Milestones & Track Record')}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t('about.historySubtitle', 'Growing to a trusted global partner for vehicles and heavy machinery.')}
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {milestones.map((m) => (
              <div
                
                className="group flex items-center gap-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all duration-300 hover:border-amber-400/40 hover:bg-white hover:shadow-lg"
              >
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-900 text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-slate-950">
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                    EST.
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
        <div className="absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400 shadow-inner">
            <Ship className="h-7 w-7" />
          </div>

          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            {t('about.ctaTitle', 'Ready to Build Your')}{' '}
            <span className="text-amber-400">{t('about.ctaTitleHighlight', 'Fleet Together?')}</span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
            {t('about.ctaDesc', 'Whether you need a single vehicle or full container shipping, BIKS delivers end-to-end expertise.')}
          </p>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/collection')}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-300 active:translate-y-0"
            >
              {t('about.ctaButton', 'Get Started Now')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-400 border-t border-slate-800/80 pt-8">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" /> {t('about.ctaTrust1', 'Japanese Quality')}
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" /> {t('about.ctaTrust2', 'Global Export')}
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400" /> {t('about.ctaTrust3', 'Transparent Service')}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}