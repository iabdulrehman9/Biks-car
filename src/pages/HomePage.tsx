import { useEffect, useState } from 'react';
import {
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Gauge,
  Fuel,
  Settings2,
  Calendar,
} from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { fetchVehicles, type Vehicle } from '@/lib/api';
import { useRouter } from '@/lib/router';
import { VehicleCard } from '@/components/VehicleCard';
import { formatKm } from '@/lib/format';

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
        const data = await fetchVehicles();

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
    COMPACT HERO VEHICLE SLIDER — 460PX
========================================================= */}

<section className="relative h-[460px] overflow-hidden bg-[#071525]">
  {loading ? (
    <div className="flex h-[460px] items-center justify-center bg-[#071525]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
    </div>
  ) : vehicles.length > 0 ? (
    <Swiper
      modules={[Pagination, Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      slidesPerView={1}
      loop={vehicles.length > 1}
      speed={700}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      pagination={{
        clickable: true,
      }}
      className="hero-vehicle-swiper h-full"
    >
      {vehicles.slice(0, 6).map((vehicle) => {
        const specs = [
          {
            icon: Calendar,
            value: vehicle.year?.toString() || '—',
          },
          {
            icon: Gauge,
            value: vehicle.mileage_km
              ? `${formatKm(vehicle.mileage_km)} km`
              : '—',
          },
          {
            icon: Fuel,
            value: vehicle.fuel_type || '—',
          },
          {
            icon: Settings2,
            value: vehicle.transmission || '—',
          },
        ];

        return (
          <SwiperSlide key={vehicle.id}>
            <div className="relative h-[460px]">

              {/* Background Image */}
              <div className="absolute inset-0">
                {vehicle.image_url ? (
                  <img
                    src={vehicle.image_url}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#071525]" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#071525] via-[#071525]/80 to-[#071525]/20" />

                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/70 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 container-page flex h-full items-center px-4 sm:px-6 lg:px-8">

                <div className="max-w-xl">

                  {/* Small Label */}
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-px w-7 bg-gold" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                      BIKS TRADING COMPANY
                    </span>
                  </div>

                  {/* Vehicle Name */}
                  <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                    <span className="text-white/60">
                      {vehicle.year}{' '}
                    </span>

                    <span className="text-gold">
                      {vehicle.make}
                    </span>

                    <span className="block">
                      {vehicle.model}
                    </span>
                  </h1>

                  {/* Compact Specs */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {specs.map((spec, index) => {
                      const Icon = spec.icon;

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-md border border-white/10 bg-[#071525]/70 px-3 py-2 backdrop-blur-sm"
                        >
                          <Icon className="h-3.5 w-3.5 text-gold" />

                          <span className="text-xs font-semibold text-white">
                            {spec.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Button */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                      className="group flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-bold text-navy-dark transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
                    >
                      View Vehicle

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  ) : (
    /* Fallback */
    <div className="relative flex h-[460px] items-center bg-[#071525]">
      <div className="container-page px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
            BIKS Trading Company
          </span>

          <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            Quality Japanese Vehicles.
          </h1>

          <button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="mt-6 rounded-lg bg-gold px-5 py-3 text-sm font-bold text-navy-dark"
          >
            Browse Vehicles
          </button>
        </div>
      </div>
    </div>
  )}
</section>      {/* =========================================================
          ALL VEHICLES INVENTORY
      ========================================================= */}

<section className="bg-[#f7f7f5] py-8 sm:py-6">
          <div className="container-page">

          {/* Section Header */}
         <div className="flex items-end justify-between gap-5">
  <div className="biks-reveal-left">
    <div className="mb-2 flex items-center gap-3">
      <span className="h-px w-7 bg-gold" />

      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark">
        Vehicle Showcase
      </span>
    </div>

    <h2 className="text-2xl font-black tracking-tight text-navy sm:text-3xl">
      All Vehicles
    </h2>
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
            <div className="biks-stagger mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      <a
        href="tel:+819077144212"
        className="btn-premium inline-flex items-center justify-center w-auto px-6 py-2.5 text-sm"
      >
        Contact Us
      </a>
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