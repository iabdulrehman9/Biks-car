import { useEffect, useState } from 'react';
import {
  Search, ShieldCheck, Ship, FileText, ArrowRight, Star,
  TrendingUp, Users, Globe2, Award, ChevronRight,
} from 'lucide-react';
import { supabase, type Vehicle } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import { VehicleCard } from '@/components/VehicleCard';

export function HomePage() {
  const { navigate } = useRouter();
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('featured', true)
        .limit(6);
      setFeatured(data || []);
      setLoading(false);
    })();
  }, []);

  const handleSearch = () => {
    navigate(`/marketplace${search ? `?q=${encodeURIComponent(search)}` : ''}`);
  };

  const stats = [
    { icon: TrendingUp, label: 'Vehicles Sold', value: '12,400+' },
    { icon: Users, label: 'Happy Clients', value: '3,800+' },
    { icon: Globe2, label: 'Countries Served', value: '45+' },
    { icon: Award, label: 'Years Experience', value: '15+' },
  ];

  const services = [
    {
      icon: Ship,
      title: 'Global Vehicle Export',
      desc: 'End-to-end export of quality Japanese vehicles to over 45 countries with full logistics support.',
    },
    {
      icon: FileText,
      title: 'C&F / CIF Pricing',
      desc: 'Transparent landed cost calculations including freight and insurance — no hidden charges.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Assurance',
      desc: 'Every vehicle undergoes rigorous inspection. Auction sheets and condition reports provided.',
    },
    {
      icon: Search,
      title: 'Auction Sourcing',
      desc: 'Direct access to major Japanese auto auctions. Source any vehicle to your specifications.',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[680px] overflow-hidden bg-navy-dark">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/30731259/pexels-photo-30731259.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Japanese vehicle showroom"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy-dark/85 to-navy/70" />
        </div>

        <div className="relative container-page px-4 pt-32 pb-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold-light">
              <Star className="h-3.5 w-3.5 fill-gold" />
              Trusted Japanese Vehicle Exporter Since 2010
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Premium <span className="text-gold">Japanese Vehicles</span>
              <br />
              Trusted Global Trading
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              BIKS Car Trading Company sources, inspects, and exports the finest
              Japanese automobiles worldwide — with transparent pricing, full
              documentation, and reliable shipping.
            </p>

            {/* Search bar */}
            <div className="mt-8 flex max-w-2xl gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search make, model, or body type..."
                  className="w-full rounded-lg border border-white/20 bg-white/95 py-3.5 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              <button onClick={handleSearch} className="btn-premium !px-6">
                Search
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {['SUV', 'Sedan', 'Coupe', 'Van', 'Hybrid', 'Electric'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/marketplace?body_type=${tag}`)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-white/10 bg-navy-dark/80 backdrop-blur-sm">
          <div className="container-page grid grid-cols-2 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
              What We Do
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Complete Automotive Trading Solutions
            </h2>
            <p className="mt-4 text-gray-500">
              From sourcing at Japanese auctions to delivery at your destination
              port, BIKS handles every step with professionalism.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-gold transition-colors group-hover:bg-gold group-hover:text-navy-dark">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="bg-offwhite section-padding">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
                Handpicked Selection
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                Featured Vehicles
              </h2>
            </div>
            <button
              onClick={() => navigate('/marketplace')}
              className="hidden items-center gap-1 text-sm font-semibold text-navy hover:text-gold-dark sm:flex"
            >
              View All Vehicles
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {loading ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <button onClick={() => navigate('/marketplace')} className="btn-primary">
              View All Vehicles <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
              How It Works
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Your Trading Journey
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { step: '01', title: 'Browse & Select', desc: 'Explore our inventory or request a specific vehicle from Japanese auctions.' },
              { step: '02', title: 'Get a Quote', desc: 'Receive a transparent C&F or CIF quote including all costs to your port.' },
              { step: '03', title: 'Reserve & Pay', desc: 'Secure your vehicle with a deposit. We handle documentation and export prep.' },
              { step: '04', title: 'Ship & Deliver', desc: 'Track your shipment in real-time until it arrives at your destination.' },
            ].map((item) => (
              <div key={item.step} className="relative rounded-xl border border-gray-200 bg-white p-6">
                <span className="text-3xl font-extrabold text-gold/40">{item.step}</span>
                <h3 className="mt-3 text-base font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
                {item.step !== '04' && (
                  <ChevronRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-gold/40 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-navy-dark py-20">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Cargo ship"
            className="h-full w-full object-cover opacity-15"
          />
        </div>
        <div className="relative container-page px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to Find Your <span className="text-gold">Next Vehicle?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Get a personalized quote today. Our team responds within 24 hours with
            transparent pricing and full vehicle details.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate('/inquiry')} className="btn-premium">
              Request a Quote <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/calculator')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Calculate CIF Price
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
