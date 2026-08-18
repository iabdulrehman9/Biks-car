import {
  ShieldCheck,
  Globe2,
  Award,
  Users,
  Ship,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from '@/lib/router';

export function AboutPage() {
  const { navigate } = useRouter();

  const values = [
    {
      icon: ShieldCheck,
      title: 'Trust & Transparency',
      desc: 'Every transaction is documented. No hidden fees, no surprises.',
    },
    {
      icon: Globe2,
      title: 'Global Reach',
      desc: 'We export to over 45 countries with established logistics networks.',
    },
    {
      icon: Award,
      title: 'Quality First',
      desc: 'Rigorous inspection process ensures only the best vehicles reach our clients.',
    },
    {
      icon: Users,
      title: 'Client Focused',
      desc: 'Dedicated account managers guide you through every step of the process.',
    },
  ];

  const milestones = [
    {
      year: '2016',
      title: 'Founded in Yokohama',
      desc: 'BIKS established as a Japanese vehicle export company.',
    },
  ];


  return (
    <div className="animate-fade-in bg-white pt-16">
{/* =========================================================
    HERO
========================================================= */}
<section
  className="
    group
    relative
    isolate
    flex
    h-[460px]
    overflow-hidden
    bg-navy-dark
  "
>
  {/* =======================================================
      BACKGROUND IMAGE
  ======================================================= */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <img
      src="https://images.pexels.com/photos/21234960/pexels-photo-21234960.jpeg?auto=compress&cs=tinysrgb&w=1600"
      alt=""
      aria-hidden="true"
      className="
        h-full
        w-full
        object-cover
        object-center
        opacity-30
        transition-transform
        duration-[12000ms]
        ease-out
        group-hover:scale-[1.04]
        motion-reduce:transition-none
        motion-reduce:group-hover:scale-100
      "
    />

    {/* Main overlay */}
    <div
      className="
        absolute
        inset-0
        bg-gradient-to-r
        from-navy-dark
        via-navy-dark/95
        to-navy-dark/60
      "
    />

    {/* Bottom fade */}
    <div
      className="
        absolute
        inset-x-0
        bottom-0
        h-32
        bg-gradient-to-t
        from-navy-dark/40
        to-transparent
      "
    />

    {/* Gold glow */}
    <div
      className="
        absolute
        -right-40
        top-1/2
        h-[420px]
        w-[420px]
        -translate-y-1/2
        rounded-full
        bg-gold/10
        blur-3xl
      "
    />

    {/* Decorative line */}
    <div
      className="
        absolute
        bottom-0
        left-0
        h-px
        w-full
        bg-gradient-to-r
        from-transparent
        via-gold/40
        to-transparent
      "
    />
  </div>

  {/* =======================================================
      CONTENT
  ======================================================= */}
  <div
    className="
      container-page
      relative
      flex
      w-full
      items-center
      px-4
      py-8
      sm:px-6
      lg:px-8
    "
  >
    <div className="max-w-3xl">

      {/* ===================================================
          EYEBROW
      =================================================== */}
      <div
        className="animate-slide-up"
        style={{ animationDelay: '100ms' }}
      >
        <div
          className="
            inline-flex
            items-center
            gap-2.5
            rounded-full
            border
            border-gold/25
            bg-white/[0.04]
            px-3.5
            py-1.5
            backdrop-blur-md
          "
        >
          <span className="h-px w-6 bg-gold" />

          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-gold
            "
          >
            About BIKS Trading Company
          </span>
        </div>
      </div>

      {/* ===================================================
          HEADING
      =================================================== */}
      <h1
        className="
          mt-4
          max-w-3xl
          animate-slide-up
          text-3xl
          font-black
          leading-[1.08]
          tracking-tight
          text-white
          sm:text-4xl
          lg:text-5xl
          xl:text-[52px]
        "
        style={{ animationDelay: '200ms' }}
      >
        Quality Japanese Vehicles.
        <span className="block text-gold">
          Global Export Service.
        </span>
      </h1>

      {/* ===================================================
          DESCRIPTION
      =================================================== */}
      <p
        className="
          mt-4
          max-w-2xl
          animate-slide-up
          text-sm
          leading-6
          text-white/70
          sm:text-base
        "
        style={{ animationDelay: '300ms' }}
      >
        BIKS connects buyers worldwide with quality Japanese vehicles,
        transparent trading, and professional export support from Japan
        to your destination.
      </p>

      {/* ===================================================
          ACTIONS
      =================================================== */}
      <div
        className="
          mt-6
          flex
          animate-slide-up
          flex-wrap
          gap-3
        "
        style={{ animationDelay: '400ms' }}
      >
        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="
            group/btn
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-gold
            px-5
            text-sm
            font-bold
            text-navy-dark
            shadow-lg
            shadow-black/10
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-gold/90
            hover:shadow-xl
            active:translate-y-0
            focus:outline-none
            focus:ring-2
            focus:ring-gold
            focus:ring-offset-2
            focus:ring-offset-navy-dark
          "
        >
          View Vehicles

          <ArrowRight
            className="
              h-4 w-4
              transition-transform
              duration-200
              group-hover/btn:translate-x-0.5
            "
          />
        </button>

        {/* Phone CTA */}
        <a
          href="tel:+923369829829"
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-white/20
            bg-white/[0.04]
            px-5
            text-sm
            font-semibold
            text-white
            backdrop-blur-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-gold/50
            hover:bg-white/10
            focus:outline-none
            focus:ring-2
            focus:ring-gold
            focus:ring-offset-2
            focus:ring-offset-navy-dark
          "
        >
          <span>Contact Us</span>
        </a>
      </div>

      {/* ===================================================
          TRUST INDICATORS
      =================================================== */}
      <div
        className="
          mt-7
          flex
          animate-slide-up
          flex-wrap
          items-center
          gap-x-5
          gap-y-2
          text-[11px]
          font-medium
          text-white/55
        "
        style={{ animationDelay: '500ms' }}
      >
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-gold" />
          Trusted Trading
        </span>

        <span className="hidden text-white/20 sm:inline">
          •
        </span>

        <span className="flex items-center gap-1.5">
          <Globe2 className="h-3.5 w-3.5 text-gold" />
          Global Export
        </span>

        <span className="hidden text-white/20 sm:inline">
          •
        </span>

        <span className="flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-gold" />
          Japanese Quality
        </span>
      </div>
    </div>
  </div>
</section>
      {/* =========================================================
          VALUES
      ========================================================= */}
      <section className="section-padding bg-white">
        <div className="container-page">

          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">

            <div
              className="animate-slide-up"
              style={{ animationDelay: '100ms' }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
                Our Values
              </p>
            </div>

            <h2
              className="
                mt-3
                animate-slide-up
                text-3xl
                font-black
                tracking-tight
                text-navy
                sm:text-4xl
              "
              style={{ animationDelay: '200ms' }}
            >
              What Sets BIKS Apart
            </h2>

            <p
              className="
                mt-4
                animate-slide-up
                text-sm
                leading-6
                text-gray-500
              "
              style={{ animationDelay: '300ms' }}
            >
              A commitment to quality, transparency and dependable
              service in every vehicle transaction.
            </p>
          </div>

          {/* Value Cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {values.map((v, index) => (
              <div
                key={v.title}
                className="
                  group
                  animate-slide-up
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-6
                  shadow-sm
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-gold/30
                  hover:shadow-xl
                "
                style={{
                  animationDelay: `${150 + index * 120}ms`,
                }}
              >

                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-navy
                    text-gold
                    transition-all
                    duration-500
                    group-hover:rotate-3
                    group-hover:scale-110
                    group-hover:bg-gold
                    group-hover:text-navy-dark
                  "
                >
                  <v.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-base font-bold text-navy">
                  {v.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {v.desc}
                </p>

                {/* Bottom accent */}
                <div
                  className="
                    mt-5
                    h-0.5
                    w-0
                    rounded-full
                    bg-gold
                    transition-all
                    duration-500
                    group-hover:w-10
                  "
                />
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          TIMELINE
      ========================================================= */}
      <section className="section-padding bg-offwhite">
        <div className="container-page">

          <div className="mx-auto max-w-2xl text-center">

            <p
              className="animate-slide-up text-xs font-bold uppercase tracking-[0.2em] text-gold-dark"
              style={{ animationDelay: '100ms' }}
            >
              Our Journey
            </p>

            <h2
              className="
                mt-3
                animate-slide-up
                text-3xl
                font-black
                tracking-tight
                text-navy
                sm:text-4xl
              "
              style={{ animationDelay: '200ms' }}
            >
              10 Years of Excellence
            </h2>

            <p
              className="
                mt-4
                animate-slide-up
                text-sm
                leading-6
                text-gray-500
              "
              style={{ animationDelay: '300ms' }}
            >
              From a Japanese vehicle exporter to a global automotive
              trading partner.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative mx-auto mt-14 max-w-3xl space-y-5">

            {/* Vertical line */}
            <div className="absolute bottom-8 left-7 top-8 hidden w-px bg-gradient-to-b from-gold/50 via-gray-200 to-transparent sm:block" />

            {milestones.map((m, index) => (
              <div
                key={m.year}
                className="
                  group
                  relative
                  flex
                  animate-slide-up
                  gap-5
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:border-gold/30
                  hover:shadow-lg
                "
                style={{
                  animationDelay: `${200 + index * 150}ms`,
                }}
              >

                {/* Year */}
                <div
                  className="
                    relative
                    z-10
                    flex
                    h-14
                    w-14
                    shrink-0
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    bg-navy
                    text-white
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:bg-gold
                    group-hover:text-navy-dark
                  "
                >
                  <span className="text-[9px] font-medium uppercase tracking-wider text-gold group-hover:text-navy-dark">
                    Year
                  </span>

                  <span className="text-sm font-black">
                    {m.year}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-0.5">
                  <h3 className="text-base font-bold text-navy">
                    {m.title}
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-gray-500">
                    {m.desc}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight
                  className="
                    ml-auto
                    hidden
                    h-4
                    w-4
                    shrink-0
                    self-center
                    text-gold
                    opacity-0
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:opacity-100
                    sm:block
                  "
                />
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-navy-dark py-20">

        {/* Decorative glow */}
        <div className="absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />

        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative container-page px-4 text-center sm:px-6 lg:px-8">

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              animate-bounce
              items-center
              justify-center
              rounded-full
              border
              border-gold/30
              bg-gold/10
              text-gold
            "
            style={{
              animationDuration: '3s',
            }}
          >
            <Ship className="h-6 w-6" />
          </div>

          <h2
            className="
              mx-auto
              mt-6
              max-w-3xl
              animate-slide-up
              text-3xl
              font-black
              tracking-tight
              text-white
              sm:text-4xl
            "
            style={{ animationDelay: '150ms' }}
          >
            Let's Build Your{' '}
            <span className="text-gold">
              Fleet Together
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-lg
              animate-slide-up
              text-sm
              leading-6
              text-white
            "
            style={{ animationDelay: '300ms' }}
          >
            Whether you need a single vehicle or a full container,
            BIKS is ready to deliver.
          </p>

          

          {/* Trust points */}
          <div
            className="
              mt-8
              flex
              animate-slide-up
              flex-wrap
              justify-center
              gap-x-6
              gap-y-2
              text-[11px]
              text-white
            "
            style={{ animationDelay: '550ms' }}
          >
            <span>Japanese Quality</span>
            <span>•</span>
            <span>Global Export</span>
            <span>•</span>
            <span>Trusted Service</span>
          </div>

        </div>
      </section>

    </div>
  );
}