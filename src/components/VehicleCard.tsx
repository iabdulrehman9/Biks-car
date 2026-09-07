import {
  Gauge,
  Fuel,
  Settings2,
  Calendar,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';

import type { Vehicle } from '@/lib/api';
import { formatKm, statusStyles, statusDot } from '@/lib/format';
import { useRouter } from '@/lib/router';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { navigate } = useRouter();

  const COMPANY_PHONE = '+819077144212';

  const specs = [
    {
      icon: Calendar,
      label: vehicle.year?.toString() || '—',
      title: 'Year',
    },
    {
      icon: Gauge,
      label: vehicle.mileage_km
        ? `${formatKm(vehicle.mileage_km)} km`
        : '—',
      title: 'Mileage',
    },
    {
      icon: Fuel,
      label: vehicle.fuel_type || '—',
      title: 'Fuel',
    },
    {
      icon: Settings2,
      label: vehicle.transmission || '—',
      title: 'Transmission',
    },
  ];

  const handleCardClick = () => {
    navigate(`/vehicle/${vehicle.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      className="
        group relative cursor-pointer overflow-hidden rounded-2xl
        border border-gray-200 bg-white
        shadow-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1.5
        hover:border-navy/20
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]
        focus:outline-none
        focus:ring-2
        focus:ring-gold
        focus:ring-offset-2
      "
    >
      {/* =========================================================
          IMAGE
      ========================================================= */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="
              h-full w-full object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-[1.06]
            "
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-sm font-medium text-gray-400">
            No image available
          </div>
        )}

        {/* Image overlay */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-t
            from-black/35
            via-transparent
            to-black/5
            opacity-70
          "
        />

        {/* Featured */}
        {vehicle.featured && (
          <span
            className="
              absolute left-3 top-3
              rounded-md
              bg-gold
              px-2.5 py-1
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-navy-dark
              shadow-sm
            "
          >
            Featured
          </span>
        )}

        {/* Status */}
        <span
          className={`
            absolute right-3 top-3
            inline-flex items-center gap-1.5
            rounded-md
            border
            px-2.5 py-1
            text-[10px]
            font-semibold
            backdrop-blur-sm
            ${
              statusStyles[vehicle.status] ||
              statusStyles.Available
            }
          `}
        >
          <span
            className={`
              h-1.5 w-1.5 rounded-full
              ${
                statusDot[vehicle.status] ||
                statusDot.Available
              }
            `}
          />

          {vehicle.status}
        </span>

        {/* View details hover indicator */}
        <div
          className="
            pointer-events-none absolute
            bottom-3 right-3
            flex h-9 w-9
            translate-y-2
            items-center justify-center
            rounded-full
            bg-white/95
            text-navy
            opacity-0
            shadow-md
            transition-all duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}
      <div className="p-4">
        {/* Vehicle title */}
        <div className="min-w-0">
          <h3
            className="
              truncate
              text-base
              font-bold
              text-navy
              transition-colors
              group-hover:text-navy-dark
            "
          >
            {vehicle.make} {vehicle.model}
          </h3>

          <p className="mt-1 truncate text-xs text-gray-500">
            {vehicle.year} · {vehicle.body_type || 'Vehicle'} · Stock #
            {vehicle.stock_id || '—'}
          </p>
        </div>

        {/* =======================================================
            SPECS
        ======================================================= */}
        <div className="mt-4 grid grid-cols-4 divide-x divide-gray-100 border-y border-gray-100 py-3">
          {specs.map((spec, index) => {
            const Icon = spec.icon;

            return (
              <div
                key={index}
                title={spec.title}
                className="flex min-w-0 flex-col items-center gap-1 px-1 text-center"
              >
                <Icon className="h-4 w-4 text-gray-400 transition-colors duration-300 group-hover:text-navy/60" />

                <span className="w-full truncate text-[10px] font-medium text-gray-600">
                  {spec.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* =======================================================
            LOCATION
        ======================================================= */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />

          <span className="truncate">
            {vehicle.location || 'Japan'}
          </span>
        </div>

        {/* =======================================================
            ACTIONS
        ======================================================= */}
        <div className="mt-4 flex gap-2">
          {/* Call */}
          <a
            href={`tel:${COMPANY_PHONE}`}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Call BIKS about ${vehicle.make} ${vehicle.model}`}
            className="
              flex flex-1
              items-center justify-center gap-2
              rounded-lg
              border border-gray-200
              bg-white
              px-3 py-2.5
              text-sm
              font-semibold
              text-navy
              transition-all duration-200
              hover:border-navy
              hover:bg-navy
              hover:text-white
              active:scale-[0.98]
              focus:outline-none
              focus:ring-2
              focus:ring-navy
              focus:ring-offset-2
            "
          >
            <Phone className="h-4 w-4" />

            <span>Call</span>
          </a>

          {/* View Details */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/vehicle/${vehicle.id}`);
            }}
            className="
              flex flex-[1.35]
              items-center justify-center gap-2
              rounded-lg
              bg-navy
              px-3 py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all duration-200
              hover:bg-gold
              hover:text-navy-dark
              hover:shadow-md
              active:scale-[0.98]
              focus:outline-none
              focus:ring-2
              focus:ring-gold
              focus:ring-offset-2
            "
          >
            <span>View Details</span>

            <ArrowRight
              className="
                h-4 w-4
                transition-transform duration-200
                group-hover:translate-x-0.5
              "
            />
          </button>
        </div>
      </div>
    </article>
  );
}