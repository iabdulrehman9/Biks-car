import { useEffect, useState } from 'react';
import {
  Search,
  ShieldCheck,
  Ship,
  FileText,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Globe2,
  Award,
  CheckCircle2,
  Sparkles,
  JapaneseYen,
} from 'lucide-react';

import { supabase, type Vehicle } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import { VehicleCard } from '@/components/VehicleCard';

export function HomePage() {
  const { navigate } = useRouter();

  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  /* =========================================================
     LOAD FEATURED VEHICLES
  ========================================================= */

  useEffect(() => {
    const loadFeaturedVehicles = async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('featured', true)
        .limit(6);

      if (error) {
        console.error('Failed to load featured vehicles:', error);
      }

      setFeatured(data || []);
      setLoading(false);
    };

    loadFeaturedVehicles();
  }, []);

  /* =========================================================
     SCROLL REVEAL ANIMATION
  ========================================================= */

  useEffect(() => {
    const elements = document.querySelectorAll(
      [
        '.biks-reveal',
        '.biks-reveal-left',
        '.biks-reveal-right',
        '.biks-reveal-scale',
        '.biks-stagger',
        '.biks-process-line',
      ].join(', ')
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [loading, featured]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = () => {
    navigate(
      `/marketplace${search ? `?q=${encodeURIComponent(search)}` : ''}`
    );
  };

  /* =========================================================
     STATS
  ========================================================= */

  const stats = [
    {
      icon: TrendingUp,
      value: '12,400+',
      label: 'Vehicles Exported',
    },
    {
      icon: Users,
      value: '3,800+',
      label: 'Global Clients',
    },
    {
      icon: Globe2,
      value: '45+',
      label: 'Countries Served',
    },
    {
      icon: Award,
      value: '15+',
      label: 'Years Experience',
    },
  ];

  /* =========================================================
     SERVICES
  ========================================================= */

  const services = [
    {
      number: '01',
      icon: Ship,
      title: 'Global Vehicle Export',
      desc: 'Reliable end-to-end export services from Japan to your destination port.',
    },
    {
      number: '02',
      icon: JapaneseYen,
      title: 'Transparent CIF Pricing',
      desc: 'Understand your complete landed cost with clear freight and insurance calculations.',
    },
    {
      number: '03',
      icon: ShieldCheck,
      title: 'Verified Quality',
      desc: 'Auction sheets, inspection records and vehicle condition details provided.',
    },
    {
      number: '04',
      icon: Search,
      title: 'Auction Sourcing',
      desc: 'Access Japanese auctions and source vehicles according to your exact requirements.',
    },
  ];

  /* =========================================================
     PROCESS
  ========================================================= */

  const process = [
    {
      step: '01',
      title: 'Choose Your Vehicle',
      desc: 'Browse available stock or tell us exactly what vehicle you are looking for.',
    },
    {
      step: '02',
      title: 'Receive Your Quote',
      desc: 'Get a transparent C&F or CIF quotation based on your destination.',
    },
    {
      step: '03',
      title: 'Reserve & Confirm',
      desc: 'Secure your vehicle while our team prepares documentation and export arrangements.',
    },
    {
      step: '04',
      title: 'Ship With Confidence',
      desc: 'Track the export process from Japan until your vehicle reaches its destination.',
    },
  ];

  return (
    <div className="animate-fade-in bg-white">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative min-h-[760px] overflow-hidden bg-[#07111f]">

        {/* Background */}
        <div className="absolute inset-0">

          <img
            src="https://images.pexels.com/photos/30731259/pexels-photo-30731259.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="Premium Japanese vehicle"
            className="h-full w-full object-cover object-center opacity-35"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.98)_0%,rgba(7,17,31,0.88)_42%,rgba(7,17,31,0.42)_100%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,17,31,0.95)_0%,transparent_35%,rgba(7,17,31,0.35)_100%)]" />

        </div>

        {/* Animated glow */}
        <div className="biks-glow absolute -right-32 top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

        <div className="biks-float absolute -bottom-40 left-[45%] h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />

        {/* Hero content */}
        <div className="relative container-page px-4 pb-28 pt-36 sm:px-6 lg:px-8">

          <div className="max-w-4xl">

            {/* Badge */}
            <div className="biks-hero-badge inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/[0.04] px-4 py-2 backdrop-blur-md">

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold">
                <Sparkles className="h-3 w-3 text-navy-dark" />
              </span>

              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-light">
                Japanese Automotive Excellence
              </span>

            </div>

            {/* Heading */}
            <h1 className="biks-hero-title mt-7 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl lg:text-7xl">

              Your Trusted Source for

              <span className="block text-gold">
                Japanese Vehicles.
              </span>

            </h1>

            {/* Description */}
            <p className="biks-hero-description mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              BIKS Car Trading Company connects buyers worldwide with
              quality Japanese vehicles through trusted sourcing,
              transparent pricing, professional inspection and reliable
              international shipping.
            </p>

            {/* Search */}
            <div className="biks-hero-search mt-9 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.07] p-2 shadow-2xl backdrop-blur-xl">

              <div className="flex flex-col gap-2 sm:flex-row">

                <div className="relative flex-1">

                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    placeholder="Search make, model, year..."
                    className="h-14 w-full rounded-xl border border-white/10 bg-white pl-12 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />

                </div>

                <button
                  onClick={handleSearch}
                  className="biks-shine btn-premium h-14 !rounded-xl !px-8"
                >
                  Search Vehicles

                  <ArrowRight className="h-4 w-4 transition-transform duration-300" />
                </button>

              </div>

            </div>

            {/* Popular searches */}
            <div className="biks-hero-popular mt-5 flex flex-wrap items-center gap-2">

              <span className="mr-1 text-xs font-medium text-white/40">
                Popular:
              </span>

              {[
                'Toyota',
                'Nissan',
                'Honda',
                'SUV',
                'Hybrid',
                'Electric',
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    navigate(`/marketplace?body_type=${tag}`)
                  }
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 hover:text-gold hover:-translate-y-0.5"
                >
                  {tag}
                </button>
              ))}

            </div>

            {/* Trust points */}
            <div className="biks-hero-trust mt-8 flex flex-wrap gap-x-6 gap-y-3">

              {[
                'Verified Vehicles',
                'Transparent Pricing',
                'Worldwide Shipping',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs font-medium text-white/60"
                >
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                  {item}
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* =====================================================
            HERO STATS
        ===================================================== */}

        <div className="biks-hero-stats absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#07111f]/80 backdrop-blur-xl">

          <div className="container-page grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">

            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group flex items-center gap-3 px-4 py-5 transition-all duration-300 hover:bg-white/[0.03] sm:px-6 lg:py-6"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold/20">
                  <stat.icon className="h-4 w-4 text-gold" />
                </div>

                <div>

                  <div className="text-lg font-black tracking-tight text-white sm:text-xl">
                    {stat.value}
                  </div>

                  <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
                    {stat.label}
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}

      <section className="section-padding bg-white">

        <div className="container-page">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div className="biks-reveal-left max-w-2xl">

              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-gold" />

                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-dark">
                  Why BIKS
                </span>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-navy sm:text-4xl lg:text-5xl">

                More Than a Vehicle.

                <span className="block text-gray-400">
                  A Complete Trading Experience.
                </span>

              </h2>

            </div>

            <p className="biks-reveal-right max-w-md text-sm leading-6 text-gray-500">
              From Japanese auction sourcing to international shipping,
              our team manages every important step with precision and
              transparency.
            </p>

          </div>

          <div className="biks-stagger mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4">

            {services.map((service) => (
              <div
                key={service.title}
                className="biks-hover-lift group relative bg-white p-7"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-navy-dark group-hover:scale-105">
                    <service.icon className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-bold tracking-widest text-gray-300">
                    {service.number}
                  </span>

                </div>

                <h3 className="mt-7 text-base font-bold text-navy">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {service.desc}
                </p>

                <div className="mt-6 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gold-dark opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  Learn More
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =========================================================
          FEATURED VEHICLES
      ========================================================= */}

      <section className="section-padding bg-[#f7f7f5]">

        <div className="container-page">

          <div className="flex items-end justify-between gap-5">

            <div className="biks-reveal-left">

              <div className="mb-3 flex items-center gap-3">

                <span className="h-px w-8 bg-gold" />

                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-dark">
                  Curated Inventory
                </span>

              </div>

              <h2 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">
                Featured Vehicles
              </h2>

              <p className="mt-3 max-w-xl text-sm text-gray-500">
                Carefully selected Japanese vehicles available for
                international buyers.
              </p>

            </div>

            <button
              onClick={() => navigate('/marketplace')}
              className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:text-gold-dark hover:shadow-md sm:flex"
            >
              Explore Inventory
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>

          {loading ? (

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl bg-gray-200"
                />
              ))}

            </div>

          ) : featured.length > 0 ? (

            <div className="biks-stagger mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {featured.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="transition-transform duration-300 hover:-translate-y-1"
                >
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}

            </div>

          ) : (

            <div className="biks-reveal-scale mt-10 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy/5">
                <Search className="h-5 w-5 text-navy" />
              </div>

              <h3 className="mt-4 font-bold text-navy">
                Explore Our Vehicle Marketplace
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Browse our latest Japanese vehicle inventory and find
                your next vehicle.
              </p>

              <button
                onClick={() => navigate('/marketplace')}
                className="biks-shine btn-primary mt-6"
              >
                Browse Vehicles
                <ArrowRight className="h-4 w-4" />
              </button>

            </div>

          )}

          <div className="mt-10 text-center sm:hidden">

            <button
              onClick={() => navigate('/marketplace')}
              className="btn-primary"
            >
              Explore Inventory
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>

        </div>

      </section>

      {/* =========================================================
          PROCESS
      ========================================================= */}

      <section className="section-padding bg-white">

        <div className="container-page">

          <div className="biks-reveal-scale mx-auto max-w-2xl text-center">

            <div className="mb-3 flex justify-center">

              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-dark">
                Simple & Transparent
              </span>

            </div>

            <h2 className="text-3xl font-black tracking-tight text-navy sm:text-4xl lg:text-5xl">
              From Japan to Your Port
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              We simplify international vehicle trading with a clear,
              professional process from selection to delivery.
            </p>

          </div>

          <div className="relative mt-14">

            {/* Animated line */}
            <div className="biks-process-line absolute left-[12%] right-[12%] top-7 hidden h-px bg-gray-200 md:block" />

            <div className="biks-stagger grid grid-cols-1 gap-6 md:grid-cols-4">

              {process.map((item) => (
                <div
                  key={item.step}
                  className="relative text-center"
                >

                  <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-navy text-sm font-black text-gold shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-navy/10">
                    {item.step}
                  </div>

                  <h3 className="mt-6 text-base font-bold text-navy">
                    {item.title}
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">
                    {item.desc}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          TRUST SECTION
      ========================================================= */}

      <section className="border-y border-gray-100 bg-[#f8f8f6] py-14">

        <div className="container-page px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            <div className="biks-reveal-left">

              <div className="flex items-center gap-2">

                <ShieldCheck className="h-5 w-5 text-gold-dark" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">
                  Built on Trust
                </span>

              </div>

              <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight text-navy sm:text-4xl">

                Japanese quality.

                <span className="block text-gray-400">
                  Global confidence.
                </span>

              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
                Every transaction is built around clear communication,
                accurate vehicle information and dependable export
                coordination.
              </p>

            </div>

            <div className="biks-stagger grid grid-cols-1 gap-3 sm:grid-cols-3">

              {[
                {
                  icon: FileText,
                  title: 'Full Documentation',
                  desc: 'Vehicle and export documents.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Verified Quality',
                  desc: 'Inspection and condition details.',
                },
                {
                  icon: Ship,
                  title: 'Global Logistics',
                  desc: 'Professional shipping coordination.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="biks-hover-lift rounded-xl border border-gray-200 bg-white p-5"
                >

                  <item.icon className="h-5 w-5 text-gold-dark" />

                  <h3 className="mt-4 text-sm font-bold text-navy">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-gray-500">
                    {item.desc}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="relative overflow-hidden bg-navy-dark py-24">

        {/* CTA Background */}
        <div className="absolute inset-0">

          <img
            src="https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="International vehicle shipping"
            className="h-full w-full object-cover opacity-10"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/95 to-navy-dark/80" />

        </div>

        {/* Glow */}
        <div className="biks-glow absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl" />

        <div className="biks-reveal-scale relative container-page px-4 text-center sm:px-6 lg:px-8">

          {/* Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10">

            <Star className="h-5 w-5 fill-gold text-gold" />

          </div>

          {/* Heading */}
          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">

            Find Your Next Japanese Vehicle

            <span className="block text-gold">
              With BIKS.
            </span>

          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/55">
            Tell us what you're looking for and our team will help you
            find the right vehicle, calculate your landed cost and
            arrange the export.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <button
  type="button"
  onClick={() => navigate('/marketplace')}
  className="btn-premium w-mid"
>
  Explore
</button>

          </div>

          {/* Trust labels */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-white/35">

            <span>Japanese Auction Sourcing</span>

            <span>•</span>

            <span>Worldwide Export</span>

            <span>•</span>

            <span>Transparent Pricing</span>

          </div>

        </div>

      </section>

    </div>
  );
}