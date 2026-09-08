import { useState } from 'react';
import {
  ShieldCheck,
  Globe2,
  Award,
  Users,
  Ship,
  ArrowRight,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import heroImage from '@/img/frontImage.jpeg';
import heroVideo from '@/img/Video.mp4';

export function AboutPage() {
  const { navigate } = useRouter();
  const [videoReady, setVideoReady] = useState(false);

  const values = [
    {
      icon: ShieldCheck,
      title: 'Trust & Transparency',
      desc: 'Every transaction is fully documented with upfront pricing. No hidden fees, unexpected costs, or surprises along the way.',
    },
    {
      icon: Award,
      title: 'Quality First',
      desc: 'A rigorous multi-point inspection process ensures only verified, high-condition vehicles reach our global clients.',
    },
    {
      icon: Users,
      title: 'Client Focused',
      desc: 'Dedicated account managers provide personalized guidance and support throughout the entire purchasing and shipping process.',
    },
  ];

  const milestones = [
    {
      year: '2016',
      title: 'Founded in Yokohama',
      desc: 'BIKS established as a premium Japanese vehicle export trading company.',
    },
  ];

  return (
    <div className="animate-fade-in bg-white pt-16">
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="group relative isolate flex min-h-[500px] items-center overflow-hidden bg-navy-dark py-12">
        {/* Background Video & Image Crossfade */}
        <div className="absolute inset-0 -z-10 bg-navy-dark overflow-hidden">
          {/* Static image — visible until video is ready */}
          <img
            src={heroImage}
            alt="Japanese Vehicle Logistics"
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: videoReady ? 0 : 0.7 }}
          />

          {/* Video — fades in when buffered */}
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

          {/* Gradient Overlays for Text Readability - lighter on the right to show the video */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/70 to-navy-dark/10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-dark to-transparent" />
          <div className="absolute -right-40 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container-page relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
    <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
  <div className="group inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-slate-900/70 px-4 py-1.5 shadow-[0_0_20px_rgba(212,175,55,0.1)] backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)]">
    
    {/* Live Pulse Dot */}
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
    </span>

    {/* Primary Text */}
    <span className="bg-gradient-to-r from-gold via-amber-200 to-gold bg-clip-text text-[11px] font-black tracking-[0.2em] text-transparent">
      BIKS TRADING COMPANY
    </span>

    {/* Accent Divider */}
    <span className="h-3 w-[1px] bg-gold/30" />

    {/* Secondary Label */}
    
  </div>
</div>

            {/* Heading */}
            <h1
              className="mt-5 max-w-3xl animate-slide-up text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
              style={{ animationDelay: '200ms' }}
            >
              Quality Japanese Vehicles.{' '}
              <span className="block text-gold">Global Export Service.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="mt-4 max-w-2xl animate-slide-up text-base leading-relaxed text-white/80"
              style={{ animationDelay: '300ms' }}
            >
              BIKS connects international buyers with premium Japanese vehicles through transparent trading, rigorous inspections, and end-to-end export support.
            </p>

            {/* Action Buttons */}
            <div
              className="mt-8 flex animate-slide-up flex-wrap items-center gap-4"
              style={{ animationDelay: '400ms' }}
            >
              <button
                type="button"
                onClick={() => navigate('/')}
                className="group/btn inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gold px-6 text-sm font-bold text-navy-dark shadow-lg shadow-gold/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy-dark"
              >
                Browse Vehicles
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </button>

              <a
                href="tel:+819077144212"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy-dark"
              >
                <Phone className="h-4 w-4 text-gold" />
                <span>Contact Us</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div
              className="mt-8 flex animate-slide-up flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs font-medium text-white/70"
              style={{ animationDelay: '500ms' }}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" />
                Transparent Pricing
              </span>
              
              <span className="hidden text-white/20 sm:inline">•</span>
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gold" />
                Verified Inspections
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          VALUES SECTION (Single Column Redesign)
      ========================================================= */}
      <section className="section-padding bg-slate-50/50 py-14">
        <div className="container-page">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
                Our Foundation
              </span>
            </div>
            <h2
              className="mt-3 animate-slide-up text-3xl font-black tracking-tight text-navy sm:text-4xl"
              style={{ animationDelay: '200ms' }}
            >
              What Sets BIKS Apart
            </h2>
            <p
              className="mt-3 animate-slide-up text-sm leading-6 text-gray-600 sm:text-base"
              style={{ animationDelay: '300ms' }}
            >
              Our core principles define every vehicle transaction and client partnership.
            </p>
          </div>

          {/* Cards Stack */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-5">
            {values.map((v, index) => (
              <div
                key={v.title}
                className="group relative animate-slide-up overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-md"
                style={{ animationDelay: `${150 + index * 100}ms` }}
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
          TIMELINE SECTION
      ========================================================= */}
      <section className="section-padding bg-white py-5">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="animate-slide-up text-xs font-bold uppercase tracking-[0.2em] text-gold-dark"
              style={{ animationDelay: '100ms' }}
            >
              Our History
            </span>
            <h2
              className="mt-3 animate-slide-up text-3xl font-black tracking-tight text-navy sm:text-4xl"
              style={{ animationDelay: '200ms' }}
            >
              Milestones & Proven Track Record
            </h2>
            <p
              className="mt-3 animate-slide-up text-sm leading-6 text-gray-600"
              style={{ animationDelay: '300ms' }}
            >
              Growing from a local Yokohoma exporter to a trusted global partner.
            </p>
          </div>

          {/* Timeline List */}
          <div className="relative mx-auto mt-12 max-w-3xl space-y-4">
            {milestones.map((m, index) => (
              <div
                key={m.year}
                className="group relative flex animate-slide-up items-center gap-5 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gold/30 hover:shadow-md"
                style={{ animationDelay: `${200 + index * 100}ms` }}
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
          CALL TO ACTION SECTION
      ========================================================= */}
      <section className="relative overflow-hidden bg-navy-dark py-20">
        <div className="absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="container-page relative px-4 text-center sm:px-6 lg:px-8">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold shadow-inner"
          >
            <Ship className="h-7 w-7" />
          </div>

          <h2
            className="mx-auto mt-6 max-w-2xl animate-slide-up text-3xl font-black tracking-tight text-white sm:text-4xl"
            style={{ animationDelay: '150ms' }}
          >
            Ready to Build Your <span className="text-gold">Fleet Together?</span>
          </h2>

          <p
            className="mx-auto mt-4 max-w-lg animate-slide-up text-sm leading-relaxed text-white/80 sm:text-base"
            style={{ animationDelay: '300ms' }}
          >
            Whether you need a single vehicle or full container shipping, BIKS delivers end-to-end expertise.
          </p>

          <div
            className="mt-8 flex animate-slide-up justify-center"
            style={{ animationDelay: '400ms' }}
          >
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-navy-dark shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy-dark"
            >
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Trust Points */}
          <div
            className="mt-10 flex animate-slide-up flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/60"
            style={{ animationDelay: '500ms' }}
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Japanese Quality
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Global Export
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Transparent Service
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}