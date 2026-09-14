import { useEffect, useState } from 'react';
import {
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  ArrowRight,
  Star,
  MapPin,
  Car,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

import { VehicleCard } from '@/components/VehicleCard';
import { RedBannerSlider } from '@/components/RedBannerSlider';
import { fetchVehicles, type Vehicle } from '@/lib/api';
import { useRouter } from '@/lib/router';
import { useTranslation } from '@/lib/i18n';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export function HomePage() {
  const { navigate } = useRouter();
  const { t, translateTrans, translateF } = useTranslation();

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
    if (loading) return;

    const elements = document.querySelectorAll(
      [
        '.biks-reveal',
        '.biks-reveal-left',
        '.biks-reveal-right',
        '.biks-reveal-scale',
        '.biks-stagger',
      ].join(',')
    );

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

  const featuredVehicles = vehicles.filter((v) => Boolean(v.featured));
  const heroVehicles =
    featuredVehicles.length > 0
      ? [...featuredVehicles, ...vehicles.filter((v) => !v.featured)].slice(0, 6)
      : vehicles.slice(0, 6);

  return (
    <div className="animate-fade-in bg-white pt-16 sm:pt-20">
      {/* 3D Animated Red Banner Slider between Navbar and Hero */}
      <RedBannerSlider />

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
            {heroVehicles.map((vehicle) => {
              const specs = [
                {
                  icon: Calendar,
                  value: vehicle.year?.toString() || '—',
                },
                {
                  icon: Gauge,
                  value: vehicle.mileage_km
                    ? `${vehicle.mileage_km.toLocaleString()} km`
                    : '—',
                },
                {
                  icon: Fuel,
                  value: translateF(vehicle.fuel_type) || '—',
                },
                {
                  icon: Settings2,
                  value: translateTrans(vehicle.transmission) || '—',
                },
              ];

              return (
                <SwiperSlide key={vehicle.id} className="relative h-full">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={vehicle.image_url || undefined}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071525] via-[#071525]/55 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#071525]/90 via-[#071525]/40 to-transparent" />
                  </div>

                  {/* Slide Content */}
                  <div className="relative flex h-full items-end pb-10">
                    <div className="container-page px-4 sm:px-6 lg:px-8">
                      <div className="max-w-xl">
                        {/* Eyebrow Badge */}
                        <div className="flex items-center gap-2.5">
                          <span className="h-px w-5 bg-gold" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                            {t('home.heroBadge', 'BIKS TRADING COMPANY')}
                          </span>
                        </div>

                        {/* Title */}
                        <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                          {vehicle.year}{' '}
                          <span className="text-gold">{vehicle.make}</span>{' '}
                          {vehicle.model}
                        </h1>

                        {/* Spec Pills */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {specs.map(({ icon: Icon, value }) => (
                            <span
                              key={value}
                              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm"
                            >
                              <Icon className="h-3.5 w-3.5 text-gold" />
                              {value}
                            </span>
                          ))}
                        </div>

                        {/* Button */}
                        <div className="mt-6 flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                            className="group flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-bold text-navy-dark transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
                          >
                            {t('home.viewVehicle', 'View Vehicle')}
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
                  {t('home.heroBadge', 'BIKS TRADING COMPANY')}
                </span>

                <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  {t('home.heroTitle', 'Quality Japanese Vehicles.')}
                </h1>

                <button
                  type="button"
                  onClick={() => navigate('/collection')}
                  className="mt-6 rounded-lg bg-gold px-5 py-3 text-sm font-bold text-navy-dark"
                >
                  {t('home.browseVehicles', 'Browse Vehicles')}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================
          FEATURED VEHICLES SHOWCASE (STRICTLY FEATURED ONLY)
      ========================================================= */}

      <section className="bg-[#f7f7f5] py-10 sm:py-14">
        <div className="container-page">
          {/* Section Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="biks-reveal-left">
              <div className="mb-2 flex items-center gap-3">
                <span className="h-px w-7 bg-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark">
                  {t('home.showcaseEyebrow', 'Featured Collection')}
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-navy sm:text-3xl">
                {t('home.showcaseTitle', 'Featured Vehicles')}
              </h2>
            </div>

            {/* "See All Collections" Button in Header */}
            <div className="biks-reveal-right">
              <button
                type="button"
                onClick={() => navigate('/collection')}
                className="group inline-flex items-center gap-2 rounded-lg bg-[#001030] px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm transition-all duration-300 hover:bg-gold hover:text-[#001030] active:scale-95 sm:text-sm"
              >
                <span>{t('home.seeAllCollections', 'See All Collections')}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Vehicle Content - Strictly Featured Vehicles */}
          {loading ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl bg-gray-200"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : featuredVehicles.length > 0 ? (
            <>
              <div className="biks-stagger mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featuredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="transition-transform duration-300 hover:-translate-y-1"
                  >
                    <VehicleCard vehicle={vehicle} />
                  </div>
                ))}
              </div>

              {/* Bottom "See All Collections" Button */}
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/collection')}
                  className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-[#001030] bg-[#001030] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:border-gold hover:bg-gold hover:text-[#001030] hover:shadow-lg active:scale-95"
                >
                  <span>{t('home.seeAllCollections', 'See All Collections')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </>
          ) : (
            <div className="biks-reveal-scale mt-10 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto h-1 w-10 rounded-full bg-gold" />
              <h3 className="mt-5 font-bold text-navy">
                {t('home.noVehiclesTitle', 'No Featured Vehicles Right Now')}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                {t('home.noVehiclesDesc', 'Explore our full collection to view all available vehicles, heavy machinery, and parts.')}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/collection')}
                  className="group inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-xs font-bold text-[#001030] shadow-md transition-all hover:bg-gold-light sm:text-sm"
                >
                  <span>{t('home.seeAllCollections', 'See All Collections')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          WHY BIKS (RESTORED + 'Buying and Selling a Vehicle')
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
                <span aria-hidden="true" className="h-px w-8 bg-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark sm:text-[11px]">
                  {t('home.whyEyebrow', 'Why Choose BIKS')}
                </span>
              </div>

              {/* Heading: More Than Just Buying and Selling a Vehicle. */}
              <h2 className="text-3xl font-black leading-[1.12] tracking-tight text-navy sm:text-4xl lg:text-5xl">
                {t('home.whyHeading1', 'More Than Just')}
                <span className="block text-navy">
                  {t('home.whyHeading2', 'Buying and Selling a Vehicle.')}
                </span>
                <span className="mt-1 block font-semibold text-gray-400">
                  {t('home.whyHeading3', 'A Complete Trading Experience.')}
                </span>
              </h2>
            </div>

            {/* Right Content */}
            <div className="biks-reveal-right border-l-2 border-gold/70 pl-5 sm:pl-6">
              <p className="max-w-md text-sm leading-7 text-gray-500 sm:text-base">
                {t('home.whyDesc', 'From Japanese auction sourcing to professional inspection, transparent pricing and international shipping, we manage every important step with precision and confidence.')}
              </p>

              {/* Small Trust Label */}
              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-navy">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {t('home.whyTrustLabel', 'Your trusted partner in Japanese vehicle exports')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA (COMPACT VERSION — STRICTLY 'BIKS Trading Company')
      ========================================================= */}

      <section className="relative overflow-hidden bg-navy-dark py-12 sm:py-16">
        {/* CTA Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt=""
            className="h-full w-full object-cover opacity-10"
            aria-hidden="true"
            loading="lazy"
            decoding="async"
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
            <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
          </div>

          {/* Heading */}
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
            {t('home.ctaHeading', 'Find Your Next Japanese Vehicle With')}{' '}
            <span className="block text-gold sm:inline sm:before:content-['\00a0']">
              {t('home.ctaCompany', 'BIKS Trading Company.')}
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/60">
            {t('home.ctaDesc', "Tell us what you're looking for and our team will help you find the right vehicle, calculate your landed cost, and arrange the export.")}
          </p>

          {/* CTA Button */}
          <div className="mt-6 flex justify-center">
            <a
              href="tel:+819077144212"
              className="btn-premium inline-flex items-center justify-center w-auto px-6 py-2.5 text-sm"
            >
              {t('home.ctaButton', 'Contact Us')}
            </a>
          </div>

          {/* Trust Labels */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[11px] text-white/40 font-medium">
            <span>{t('home.ctaTrust1', 'Japanese Auction Sourcing')}</span>
            <span aria-hidden="true">•</span>
            <span>{t('home.ctaTrust2', 'Worldwide Export')}</span>
            <span aria-hidden="true">•</span>
            <span>{t('home.ctaTrust3', 'Transparent Pricing')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
