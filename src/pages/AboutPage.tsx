import { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  Ship,
  ArrowRight,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { useTranslation } from '@/lib/i18n';
import heroImage from '@/img/frontImage.jpeg';
import heroVideo from '@/img/Video.mp4';

export function AboutPage() {
  const { navigate } = useRouter();
  const { t } = useTranslation();
  const [videoReady, setVideoReady] = useState(false);

  const values = [
    {
      icon: ShieldCheck,
      title: t('about.val1Title', 'Trust & Transparency'),
      desc: t('about.val1Desc', 'Every transaction is fully documented with upfront pricing. No hidden fees, unexpected costs, or surprises along the way.'),
    },
    {
      icon: Award,
      title: t('about.val2Title', 'Quality First'),
      desc: t('about.val2Desc', 'A rigorous multi-point inspection process ensures only verified, high-condition vehicles reach our global clients.'),
    },
    {
      icon: Users,
      title: t('about.val3Title', 'Client Focused'),
      desc: t('about.val3Desc', 'Dedicated account managers provide personalized guidance and support throughout the entire purchasing and shipping process.'),
    },
  ];

  const milestones = [
    {
      year: t('about.milestone1Year', '2016'),
      title: t('about.milestone1Title', 'Founded in Yokohama'),
      desc: t('about.milestone1Desc', 'BIKS established as a premium Japanese vehicle export trading company.'),
    },
  ];

  return (
    <div className="animate-fade-in bg-white pt-16">
      {/* =========================================================
          HERO SECTION (Restored from older version)
      ========================================================= */}
      <section className="group relative isolate flex min-h-[500px] items-center overflow-hidden bg-navy-dark py-12">
        <div className="absolute inset-0 -z-10 bg-navy-dark overflow-hidden">
          <img
            src={heroImage}
            alt="Japanese Vehicle Logistics"
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: videoReady ? 0 : 0.7 }}
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
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: videoReady ? 0.7 : 0 }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/70 to-navy-dark/10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-dark to-transparent" />
          <div className="absolute -right-40 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </div>

        <div className="container-page relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              {t('about.badge', 'BIKS TRADING COMPANY')}
            </div>

            {/* Main Headline */}
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('about.heroTitle1', 'Quality Japanese Vehicles.')}{' '}
              <span className="text-gold block sm:inline">
                {t('about.heroTitle2', 'Global Export Service.')}
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              {t('about.heroDesc', 'BIKS connects international buyers with premium Japanese vehicles through transparent trading, rigorous inspections, and end-to-end export support.')}
            </p>

            {/* Dual CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/collection')}
                className="group flex items-center gap-2.5 rounded-xl bg-gold px-6 py-3.5 text-sm font-bold text-navy-dark shadow-lg shadow-gold/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-xl hover:shadow-gold/30"
              >
                {t('about.browseVehicles', 'Browse Vehicles')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="tel:+819077144212"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:bg-white/10 hover:text-gold"
              >
                <Phone className="h-4 w-4 text-gold" />
                {t('about.contactUs', 'Contact Us')}
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                {t('about.trustPricing', 'Transparent Pricing')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                {t('about.trustInspections', 'Verified Inspections')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          VALUES SECTION (OUR FOUNDATION)
      ========================================================= */}
      <section className="section-padding bg-slate-50/50 py-14">
        <div className="container-page">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
                {t('about.foundationEyebrow', 'Our Foundation')}
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-4xl">
              {t('about.foundationTitle', 'What Sets BIKS Apart')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              {t('about.foundationSubtitle', 'Our core principles define every vehicle transaction and client partnership.')}
            </p>
          </div>

          {/* Cards Stack */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                  {/* Icon Box */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-gold transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-navy-dark">
                    <v.icon className="h-6 w-6" />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-navy group-hover:text-navy-dark">
                      {v.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                      {v.desc}
                    </p>
                  </div>
                </div>

                {/* Subtle Hover Edge Accent */}
                <div className="absolute inset-y-0 left-0 w-1 bg-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          TIMELINE SECTION (OUR HISTORY)
      ========================================================= */}
      <section className="section-padding bg-white py-5">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
              {t('about.historyEyebrow', 'Our History')}
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-4xl">
              {t('about.historyTitle', 'Milestones & Proven Track Record')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {t('about.historySubtitle', 'Growing from a local Yokohama exporter to a trusted global partner.')}
            </p>
          </div>

          {/* Timeline List */}
          <div className="relative mx-auto mt-12 max-w-3xl space-y-4">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="group relative flex items-center gap-5 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gold/30 hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-navy text-white transition-all duration-300 group-hover:bg-gold group-hover:text-navy-dark">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold group-hover:text-navy-dark">
                    EST.
                  </span>
                  <span className="text-sm font-black">{m.year}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold text-navy">{m.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CALL TO ACTION SECTION (FLEET TOGETHER)
      ========================================================= */}
      <section className="relative overflow-hidden bg-navy-dark py-20">
        <div className="absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="container-page relative px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold shadow-inner">
            <Ship className="h-7 w-7" />
          </div>

          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
            {t('about.ctaTitle', 'Ready to Build Your')}{' '}
            <span className="text-gold">{t('about.ctaTitleHighlight', 'Fleet Together?')}</span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            {t('about.ctaDesc', 'Whether you need a single vehicle or full container shipping, BIKS delivers end-to-end expertise.')}
          </p>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/collection')}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-navy-dark shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy-dark"
            >
              {t('about.ctaButton', 'Get Started Now')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Trust Points */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/60">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> {t('about.ctaTrust1', 'Japanese Quality')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> {t('about.ctaTrust2', 'Global Export')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> {t('about.ctaTrust3', 'Transparent Service')}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
