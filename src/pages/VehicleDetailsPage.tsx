import { useEffect, useState } from 'react';
import {
  ArrowLeft, Calendar, Gauge, Fuel, Settings2, Cog, MapPin,
  Palette, Zap, FileText, ShieldCheck, Ship, CheckCircle2,
  ChevronRight, Phone, Mail, Printer,
} from 'lucide-react';
import { supabase, type Vehicle } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import { formatUSD, formatJPY, formatKm, statusStyles, statusDot } from '@/lib/format';

export function VehicleDetailsPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) console.error(error);
      setVehicle(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy border-t-transparent" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-16">
        <p className="text-lg font-semibold text-navy">Vehicle not found</p>
        <button onClick={() => navigate('/marketplace')} className="btn-primary mt-4">
          Back to Marketplace
        </button>
      </div>
    );
  }

  const gallery = vehicle.gallery?.length ? vehicle.gallery : [vehicle.image_url].filter(Boolean);
  const specs = [
    { icon: Calendar, label: 'Year', value: vehicle.year?.toString() },
    { icon: Cog, label: 'Body Type', value: vehicle.body_type },
    { icon: Gauge, label: 'Mileage', value: vehicle.mileage_km ? `${formatKm(vehicle.mileage_km)} km` : null },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuel_type },
    { icon: Settings2, label: 'Transmission', value: vehicle.transmission },
    { icon: Zap, label: 'Engine', value: vehicle.engine_cc ? `${vehicle.engine_cc} cc` : null },
    { icon: Palette, label: 'Color', value: vehicle.color },
    { icon: MapPin, label: 'Location', value: vehicle.location },
  ];

  return (
    <div className="animate-fade-in pt-16">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container-page flex items-center gap-2 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-navy">Home</button>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <button onClick={() => navigate('/marketplace')} className="text-gray-500 hover:text-navy">Marketplace</button>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <span className="font-medium text-navy">{vehicle.make} {vehicle.model}</span>
        </div>
      </div>

      <div className="container-page px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/marketplace')}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
              {gallery[activeImage] ? (
                <img
                  src={gallery[activeImage]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">No image</div>
              )}
              <span
                className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold ${
                  statusStyles[vehicle.status] || statusStyles.Available
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${statusDot[vehicle.status] || statusDot.Available}`} />
                {vehicle.status}
              </span>
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      activeImage === i ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img src={img ?? undefined} alt={`View ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-navy">Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {vehicle.description || 'No description available for this vehicle.'}
              </p>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-bold text-navy">Features & Options</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {vehicle.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-dark" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              {/* Title card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <span>Stock #{vehicle.stock_id}</span>
                  {vehicle.chassis_no && (
                    <>
                      <span>·</span>
                      <span>Chassis: {vehicle.chassis_no}</span>
                    </>
                  )}
                </div>
                <h1 className="mt-2 text-2xl font-extrabold text-navy">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <div className="mt-4 flex items-end gap-2 border-y border-gray-100 py-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">FOB Price</p>
                    <p className="text-3xl font-extrabold text-navy">${formatUSD(vehicle.price_fob_usd)}</p>
                  </div>
                  <div className="mb-1 text-sm text-gray-400">≈ ¥{formatJPY(vehicle.price_fob_jpy)}</div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button onClick={() => navigate(`/inquiry?vehicle=${vehicle.id}`)} className="btn-primary w-full">
                    Request Quote for This Vehicle
                  </button>
                  <button onClick={() => navigate('/calculator')} className="btn-outline w-full">
                    Calculate CIF Price
                  </button>
                  <button onClick={() => navigate(`/inquiry?vehicle=${vehicle.id}&type=reservation`)} className="btn-premium w-full">
                    Reserve This Vehicle
                  </button>
                </div>
              </div>

              {/* Specs */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-navy">Specifications</h2>
                <div className="grid grid-cols-2 gap-3">
                  {specs.map((spec, i) => (
                    <div key={i} className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <spec.icon className="h-3.5 w-3.5" />
                        {spec.label}
                      </div>
                      <p className="mt-1 text-sm font-semibold text-navy">{spec.value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assurance */}
              <div className="rounded-xl border border-navy/10 bg-navy p-6 text-white">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                  <ShieldCheck className="h-4 w-4" /> BIKS Assurance
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                  <li className="flex items-center gap-2"><FileText className="h-4 w-4 text-gold" /> Full inspection report provided</li>
                  <li className="flex items-center gap-2"><Ship className="h-4 w-4 text-gold" /> Complete export documentation</li>
                  <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Secure escrow payment options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
