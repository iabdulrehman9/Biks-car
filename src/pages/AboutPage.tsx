import { ShieldCheck, Globe2, Award, Users, Ship, TrendingUp, ArrowRight } from 'lucide-react';
import { useRouter } from '@/lib/router';

export function AboutPage() {
  const { navigate } = useRouter();

  const values = [
    { icon: ShieldCheck, title: 'Trust & Transparency', desc: 'Every transaction is documented. No hidden fees, no surprises.' },
    { icon: Globe2, title: 'Global Reach', desc: 'We export to over 45 countries with established logistics networks.' },
    { icon: Award, title: 'Quality First', desc: 'Rigorous inspection process ensures only the best vehicles reach our clients.' },
    { icon: Users, title: 'Client Focused', desc: 'Dedicated account managers guide you through every step of the process.' },
  ];

  const milestones = [
    { year: '2010', title: 'Founded in Yokohama', desc: 'BIKS established as a Japanese vehicle export company.' },
    { year: '2014', title: '10,000 Vehicles Exported', desc: 'Reached our first major milestone serving African markets.' },
    { year: '2018', title: 'Global Expansion', desc: 'Expanded operations to serve 45+ countries across 5 continents.' },
    { year: '2024', title: 'Digital Platform Launch', desc: 'Launched our integrated online marketplace and customer portal.' },
  ];

  return (
    <div className="animate-fade-in pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-dark py-20">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/21234960/pexels-photo-21234960.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Container port"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/90 to-navy/60" />
        </div>
        <div className="relative container-page px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">About BIKS</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Japan's Trusted <span className="text-gold">Vehicle Export Partner</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              For over 15 years, BIKS Car Trading Company has connected buyers
              worldwide with premium Japanese vehicles — built on a foundation of
              trust, quality, and end-to-end service.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container-page grid grid-cols-2 gap-4 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: TrendingUp, value: '12,400+', label: 'Vehicles Sold' },
            { icon: Users, value: '3,800+', label: 'Happy Clients' },
            { icon: Globe2, value: '45+', label: 'Countries Served' },
            { icon: Award, value: '15+', label: 'Years Experience' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-navy/5 text-navy">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-navy">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Our Values</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              What Sets BIKS Apart
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-gold">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-offwhite section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">Our Journey</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              15 Years of Excellence
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-navy text-white">
                  <span className="text-[10px] font-medium uppercase text-gold">Year</span>
                  <span className="text-sm font-extrabold">{m.year}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy">{m.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-dark py-16">
        <div className="container-page px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Let's Build Your <span className="text-gold">Fleet Together</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/60">
            Whether you need a single vehicle or a full container, BIKS is ready to deliver.
          </p>
          <button onClick={() => navigate('/inquiry')} className="btn-premium mt-6">
            Get Started <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
