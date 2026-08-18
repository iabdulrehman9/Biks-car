import { useEffect, useState } from 'react';
import {
  Star,
  CheckCircle2,
} from 'lucide-react';

import { supabase, type Vehicle } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import { VehicleCard } from '@/components/VehicleCard';

const HERO_TRUST_POINTS = ['Verified Vehicles'] as const;

export function HomePage() {
  const { navigate } = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD ALL VEHICLES
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const loadVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to load vehicles:', error);

          if (isMounted) {
            setVehicles([]);
          }

          return;
        }

        if (isMounted) {
          setVehicles(data ?? []);
        }
      } catch (error) {
        console.error('Unexpected error loading vehicles:', error);

        if (isMounted) {
          setVehicles([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVehicles();

    return () => {
      isMounted = false;
    };
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
      ].join(', ')
    );

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [loading, vehicles.length]);

  return (
    <div className="animate-fade-in bg-white">
{/* =========================================================
    HERO (WITH BACKGROUND VIDEO)
========================================================= */}

<section className="relative overflow-hidden bg-[#07111f] py-12 sm:py-16 lg:py-20">

  {/* Background Video & Overlays */}
  <div className="absolute inset-0 overflow-hidden">
    
    {/* HTML5 Video Element */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="h-full w-full object-cover object-center opacity-30"
    >
      <source
        src="https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-road-at-night-4125-large.mp4](https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-road-at-night-4125-large.mp4)"
      />
      {/* Fallback image in case video fails to load */}
      <img
        src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=2000&q=80"
        alt="Premium Japanese vehicle"
        className="h-full w-full object-cover object-center"
      />
    </video>

    {/* Linear Gradient Overlays for Text Legibility */}
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.98)_0%,rgba(7,17,31,0.85)_50%,rgba(7,17,31,0.5)_100%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,17,31,0.95)_0%,transparent_50%)]" />
  </div>

  {/* Glow Accents */}
  <div
    aria-hidden="true"
    className="biks-glow absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl pointer-events-none"
  />

  {/* Hero Content */}
  <div className="relative container-page px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl">

      {/* Heading */}
      <h1 className="biks-hero-title mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
        Your Trusted Source for{' '}
        <span className="text-gold">Japanese Vehicles.</span>
      </h1>

      {/* Description */}
      <p className="biks-hero-description mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-white/70">
        Connecting buyers worldwide with quality Japanese vehicles through trusted sourcing,
        transparent pricing, professional inspection, and reliable international shipping.
      </p>

      {/* Trust Points */}
      <div className="biks-hero-trust mt-5 flex flex-wrap gap-x-5 gap-y-2">
        {HERO_TRUST_POINTS.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white/80"
          >
            <CheckCircle2
              className="h-4 w-4 text-gold shrink-0"
              aria-hidden="true"
            />
            {item}
          </div>
        ))}
      </div>

    </div>
  </div>
</section>
      {/* =========================================================
    WHY BIKS
========================================================= */}

<section
  id="about"
  className="relative overflow-hidden border-y border-slate-100 bg-white py-14 sm:py-16 lg:py-20"
>
  {/* Subtle Background Accent */}
  <div
    aria-hidden="true"
    className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-gold/[0.04] to-transparent"
  />

  <div className="container-page relative px-4 sm:px-6 lg:px-8">
    <div className="grid items-end gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">

      {/* Left Content */}
      <div className="biks-reveal-left max-w-3xl">

        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-px w-8 bg-gold"
          />

          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark sm:text-[11px]">
            Why Choose BIKS
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-black leading-[1.12] tracking-tight text-navy sm:text-4xl lg:text-5xl">
          More Than Just
          <span className="block text-navy">
            Buying a Vehicle.
          </span>

          <span className="mt-1 block font-semibold text-gray-400">
            A Complete Trading Experience.
          </span>
        </h2>

      </div>

      {/* Right Content */}
      <div className="biks-reveal-right border-l-2 border-gold/70 pl-5 sm:pl-6">

        <p className="max-w-md text-sm leading-7 text-gray-500 sm:text-base">
          From Japanese auction sourcing to professional inspection,
          transparent pricing and international shipping, we manage
          every important step with precision and confidence.
        </p>

        {/* Small Trust Label */}
        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-navy">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Your trusted partner in Japanese vehicle exports
        </div>

      </div>

    </div>
  </div>
</section>

      {/* =========================================================
          ALL VEHICLES INVENTORY
      ========================================================= */}

      <section className="section-padding bg-[#f7f7f5]">
        <div className="container-page">

          {/* Section Header */}
          <div className="flex items-end justify-between gap-5">
            <div className="biks-reveal-left">

              <div className="mb-3 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-gold"
                />

                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-dark">
                  Available Inventory
                </span>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">
                All Vehicles
              </h2>

              <p className="mt-3 max-w-xl text-sm text-gray-500">
                Explore our entire catalog of quality Japanese vehicles ready for global export.
              </p>

            </div>
          </div>

          {/* Vehicle Content */}
          {loading ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl bg-gray-200"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : vehicles.length > 0 ? (
            <div className="biks-stagger mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {vehicles.map((vehicle) => (
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

              <div className="mx-auto h-1 w-10 rounded-full bg-gold" />

              <h3 className="mt-5 font-bold text-navy">
                No Vehicles Available Right Now
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Check back soon or contact our sales team to place a direct auction query.
              </p>

            </div>
          )}

        </div>
      </section>
{/* =========================================================
    FINAL CTA (COMPACT VERSION)
========================================================= */}

<section className="relative overflow-hidden bg-navy-dark py-12 sm:py-16">

  {/* CTA Background */}
  <div className="absolute inset-0">
    <img
      src="https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg?auto=compress&cs=tinysrgb&w=2000"
      alt=""
      className="h-full w-full object-cover opacity-10"
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/95 to-navy-dark/80" />
  </div>

  {/* Glow */}
  <div
    aria-hidden="true"
    className="biks-glow absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl pointer-events-none"
  />

  {/* CTA Content */}
  <div className="biks-reveal-scale relative container-page px-4 text-center sm:px-6 lg:px-8">

    {/* Icon */}
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
      <Star
        className="h-4 w-4 fill-gold text-gold"
        aria-hidden="true"
      />
    </div>

    {/* Heading */}
    <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
      Find Your Next Japanese Vehicle With{' '}
      <span className="block text-gold sm:inline sm:before:content-['\00a0']">
         BIKS Trading Company.
      </span>
    </h2>

    {/* Description */}
    <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
      Tell us what you're looking for and our team will help you
      find the right vehicle, calculate your landed cost, and
      arrange the export.
    </p>

    {/* CTA Button */}
    <div className="mt-6 flex justify-center">
      <button
        type="button"
        onClick={() => navigate('/contact')}
        className="btn-premium w-auto px-6 py-2.5 text-sm"
      >
        Contact Us
      </button>
    </div>

    {/* Trust Labels */}
    <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[11px] text-white/40 font-medium">
      <span>Japanese Auction Sourcing</span>
      <span aria-hidden="true">•</span>
      <span>Worldwide Export</span>
      <span aria-hidden="true">•</span>
      <span>Transparent Pricing</span>
    </div>

  </div>
</section>
    </div>
  );
}