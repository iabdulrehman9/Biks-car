import { Gauge, Fuel, Settings2, Calendar, MapPin } from 'lucide-react';
import type { Vehicle } from '@/lib/supabase';
import { formatUSD, formatKm, statusStyles, statusDot } from '@/lib/format';
import { useRouter } from '@/lib/router';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { navigate } = useRouter();

  const specs = [
    { icon: Calendar, label: vehicle.year?.toString() },
    { icon: Gauge, label: vehicle.mileage_km ? `${formatKm(vehicle.mileage_km)} km` : '—' },
    { icon: Fuel, label: vehicle.fuel_type },
    { icon: Settings2, label: vehicle.transmission },
  ];

  return (
    <div
      onClick={() => navigate(`/vehicle/${vehicle.id}`)}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-navy/20"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            No image
          </div>
        )}
        {vehicle.featured && (
          <span className="absolute left-3 top-3 rounded-md bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-dark shadow-sm">
            Featured
          </span>
        )}
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-semibold ${
            statusStyles[vehicle.status] || statusStyles.Available
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot[vehicle.status] || statusDot.Available}`} />
          {vehicle.status}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-navy">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {vehicle.year} · {vehicle.body_type} · Stock #{vehicle.stock_id}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1 border-y border-gray-100 py-3">
          {specs.map((spec, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <spec.icon className="h-4 w-4 text-gray-400" />
              <span className="text-[10px] font-medium text-gray-600">
                {spec.label || '—'}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3.5 w-3.5" />
            {vehicle.location || 'Japan'}
          </div>
        </div>

        <button className="mt-4 w-full rounded-lg bg-navy py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-gold group-hover:text-navy-dark">
          View Details
        </button>
      </div>
    </div>
  );
}
