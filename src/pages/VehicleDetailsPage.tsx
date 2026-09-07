import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Cog,
  Fuel,
  Gauge,
  MapPin,
  Palette,
  Settings2,
  ShieldCheck,
  Ship,
  FileText,
  Zap,
  Phone,
} from 'lucide-react';

import { fetchVehicle, type Vehicle } from '@/lib/api';
import { useRouter } from '@/lib/router';
import {
  formatJPY,
  formatKm,
  formatUSD,
  statusDot,
  statusStyles,
} from '@/lib/format';

const COMPANY_PHONE = '+819077144212';
const WHATSAPP_URL = 'https://wa.me/819077144212';

type VehicleSpec = {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
};

export function VehicleDetailsPage({ id }: { id: string }) {
  const { navigate } = useRouter();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------------
     Fetch Vehicle
  -------------------------------- */
  useEffect(() => {
    let mounted = true;

    const loadVehicle = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchVehicle(id);

        if (!mounted) return;

        if (!data) {
          setError('Vehicle not found.');
          setVehicle(null);
        } else {
          setVehicle(data);
        }
      } catch (err) {
        if (!mounted) return;
        setError('Failed to load vehicle details.');
        setVehicle(null);
      }

      if (mounted) setLoading(false);
    };

    loadVehicle();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* --------------------------------
     Reset Active Image
  -------------------------------- */
  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  /* --------------------------------
     Gallery
  -------------------------------- */
  const gallery = useMemo(() => {
    if (!vehicle) return [];

    const images = vehicle.gallery?.filter(Boolean) ?? [];

    if (images.length > 0) {
      return images;
    }

    return vehicle.image_url ? [vehicle.image_url] : [];
  }, [vehicle]);

  /* --------------------------------
     Vehicle Specifications
  -------------------------------- */
  const specs: VehicleSpec[] = useMemo(() => {
    if (!vehicle) return [];

    return [
      {
        icon: Calendar,
        label: 'Year',
        value: vehicle.year?.toString(),
      },
      {
        icon: Cog,
        label: 'Body Type',
        value: vehicle.body_type,
      },
      {
        icon: Gauge,
        label: 'Mileage',
        value: vehicle.mileage_km
          ? `${formatKm(vehicle.mileage_km)} km`
          : null,
      },
      {
        icon: Fuel,
        label: 'Fuel Type',
        value: vehicle.fuel_type,
      },
      {
        icon: Settings2,
        label: 'Transmission',
        value: vehicle.transmission,
      },
      {
        icon: Zap,
        label: 'Engine',
        value: vehicle.engine_cc
          ? `${vehicle.engine_cc} cc`
          : null,
      },
      {
        icon: Palette,
        label: 'Color',
        value: vehicle.color,
      },
      {
        icon: MapPin,
        label: 'Location',
        value: vehicle.location,
      },
    ];
  }, [vehicle]);

  /* --------------------------------
     Loading State
  -------------------------------- */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-navy" />
          <p className="text-sm text-gray-500">
            Loading vehicle details...
          </p>
        </div>
      </div>
    );
  }

  /* --------------------------------
     Error / Not Found
  -------------------------------- */
  if (error || !vehicle) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>

          <h1 className="mt-4 text-xl font-bold text-navy">
            Vehicle Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || 'This vehicle is no longer available.'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-primary mt-10"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  const currentStatusStyle =
    statusStyles[vehicle.status] || statusStyles.Available;

  const currentStatusDot =
    statusDot[vehicle.status] || statusDot.Available;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --------------------------------
          Breadcrumb
      -------------------------------- */}
      <div className="container-page px-4 pt-6 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm"
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-500 transition-colors hover:text-navy"
          >
            Home
          </button>

          <span className="text-gray-300">/</span>

          <button
            type="button"
            onClick={() => navigate('/stock')}
            className="text-gray-500 transition-colors hover:text-navy"
          >
            Stock List
          </button>

          <span className="text-gray-300">/</span>

          <span className="truncate font-medium text-navy">
            {vehicle.make} {vehicle.model}
          </span>
        </nav>
      </div>

      {/* --------------------------------
          Main Content
      -------------------------------- */}
      <div className="container-page px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ==================================
              LEFT COLUMN
          ================================== */}
          <div className="lg:col-span-7">
            {/* Gallery */}
            <div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                {gallery.length > 0 ? (
                  <img
                    src={gallery[activeImage]}
                    alt={vehicleName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm text-gray-400">
                      No image available
                    </span>
                  </div>
                )}

                {/* Status */}
                <span
                  className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold ${currentStatusStyle}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${currentStatusDot}`}
                  />
                  {vehicle.status}
                </span>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div
                  className="mt-3 flex gap-2 overflow-x-auto pb-1"
                  aria-label="Vehicle images"
                >
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-current={
                        activeImage === index ? 'true' : undefined
                      }
                      className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        activeImage === index
                          ? 'border-gold shadow-sm'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-navy">
                Description
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {vehicle.description ||
                  'No description available for this vehicle.'}
              </p>
            </section>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 ? (
              <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-bold text-navy">
                  Features & Options
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {vehicle.features.map((feature, index) => (
                    <div
                      key={`${feature}-${index}`}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-dark" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* ==================================
              RIGHT COLUMN
          ================================== */}
          <aside className="lg:col-span-5">
            <div className="space-y-4 lg:sticky lg:top-24">
              {/* Vehicle Title */}
              <section className="rounded-xl border border-gray-200 bg-white p-6">
                {/* Stock Information */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-400">
                  <span>Stock #{vehicle.stock_id}</span>

                  {vehicle.chassis_no && (
                    <>
                      <span>•</span>
                      <span>Chassis: {vehicle.chassis_no}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h1 className="mt-2 text-2xl font-extrabold leading-tight text-navy sm:text-3xl">
                  {vehicleName}
                </h1>

                

                {/* Inquiry CTAs */}
                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact BIKS on WhatsApp for vehicle inquiry"
                    className="btn-premium flex flex-1 items-center justify-center gap-2"
                  >
                    <span>WhatsApp Inquiry</span>
                  </a>
                  <a
                    href={`tel:${COMPANY_PHONE}`}
                    aria-label="Call BIKS for vehicle inquiry"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-navy/20 bg-white py-3 text-sm font-bold text-navy transition-all hover:bg-gray-50"
                  >
                    <Phone className="h-4 w-4 text-gold" />
                    <span>Call Us</span>
                  </a>
                </div>
              </section>

              {/* Specifications */}
              <section className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-navy">
                  Specifications
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  {specs.map((spec) => {
                    const Icon = spec.icon;

                    return (
                      <div
                        key={spec.label}
                        className="rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Icon className="h-3.5 w-3.5" />
                          <span>{spec.label}</span>
                        </div>

                        <p className="mt-1 text-sm font-semibold text-navy">
                          {spec.value || '—'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* BIKS Assurance */}
              <section className="rounded-xl border border-navy/10 bg-navy p-6 text-white">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                  <ShieldCheck className="h-4 w-4" />
                  BIKS Assurance
                </h2>

                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-gold" />
                    <span>Full inspection report provided</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Ship className="h-4 w-4 shrink-0 text-gold" />
                    <span>Complete export documentation</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-gold" />
                    <span>Secure payment options</span>
                  </li>
                </ul>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}