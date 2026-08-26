import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, LayoutGrid, LayoutList } from 'lucide-react';
import { fetchVehicles, type Vehicle } from '@/lib/api';
import { useRouter } from '@/lib/router';
import { VehicleCard } from '@/components/VehicleCard';

const bodyTypes = ['SUV', 'Sedan', 'Coupe', 'Van', 'Hatchback', 'Wagon'];
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const transmissions = ['Automatic', 'Manual'];
const statuses = ['Available', 'Reserved', 'Sold', 'In Transit', 'Delivered'];
const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Year: Newest', value: 'year-desc' },
  { label: 'Mileage: Lowest', value: 'mileage-asc' },
];

export function MarketplacePage() {
  const { route, navigate } = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(route.query.get('q') || '');
  const [selectedBody, setSelectedBody] = useState<string[]>(route.query.get('body_type') ? [route.query.get('body_type')!] : []);
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
  const [selectedTrans, setSelectedTrans] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(route.query.get('status') ? [route.query.get('status')!] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 70000]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchVehicles();
        setVehicles(data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const filtered = useMemo(() => {
    let result = [...vehicles];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.body_type?.toLowerCase().includes(q)
      );
    }
    if (selectedBody.length) result = result.filter((v) => v.body_type && selectedBody.includes(v.body_type));
    if (selectedFuel.length) result = result.filter((v) => v.fuel_type && selectedFuel.includes(v.fuel_type));
    if (selectedTrans.length) result = result.filter((v) => v.transmission && selectedTrans.includes(v.transmission));
    if (selectedStatus.length) result = result.filter((v) => selectedStatus.includes(v.status));
    result = result.filter((v) => (v.price_fob_usd ?? 0) >= priceRange[0] && (v.price_fob_usd ?? 0) <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => (a.price_fob_usd ?? 0) - (b.price_fob_usd ?? 0)); break;
      case 'price-desc': result.sort((a, b) => (b.price_fob_usd ?? 0) - (a.price_fob_usd ?? 0)); break;
      case 'year-desc': result.sort((a, b) => b.year - a.year); break;
      case 'mileage-asc': result.sort((a, b) => (a.mileage_km ?? 0) - (b.mileage_km ?? 0)); break;
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [vehicles, search, selectedBody, selectedFuel, selectedTrans, selectedStatus, priceRange, sortBy]);

  const activeFilterCount =
    selectedBody.length + selectedFuel.length + selectedTrans.length + selectedStatus.length;

  const clearAll = () => {
    setSelectedBody([]); setSelectedFuel([]); setSelectedTrans([]); setSelectedStatus([]);
    setPriceRange([0, 70000]); setSearch('');
    navigate('/marketplace');
  };

  const FilterGroup = ({ title, options, selected, onToggle }: {
    title: string; options: string[]; selected: string[]; onToggle: (v: string) => void;
  }) => (
    <div className="border-b border-gray-100 py-4">
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy">{title}</h4>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-sm">
            <button
              onClick={() => onToggle(opt)}
              className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                selected.includes(opt) ? 'border-navy bg-navy text-white' : 'border-gray-300 bg-white'
              }`}
            >
              {selected.includes(opt) && <span className="h-2 w-2 rounded-sm bg-gold" />}
            </button>
            <span className={selected.includes(opt) ? 'font-medium text-navy' : 'text-gray-600'}>
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in pt-16">
      {/* Page header */}
      <div className="bg-navy-dark py-12">
        <div className="container-page px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Vehicle Marketplace
          </h1>
          <p className="mt-2 text-white/60">
            Browse our curated inventory of premium Japanese vehicles ready for export.
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="sticky top-16 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="container-page px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by make, model, or body type..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="hidden rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-gold focus:outline-none sm:block"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-navy lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container-page px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-40 overflow-y-auto bg-white p-6' : 'hidden'} lg:sticky lg:top-32 lg:block lg:w-64 lg:shrink-0 lg:bg-transparent lg:p-0`}>
            {showFilters && (
              <div className="mb-4 flex items-center justify-between lg:hidden">
                <h3 className="text-lg font-bold text-navy">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
              </div>
            )}
            <div className="rounded-xl border border-gray-200 bg-white p-4 lg:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll} className="text-xs font-medium text-gold-dark hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              <FilterGroup title="Body Type" options={bodyTypes} selected={selectedBody} onToggle={(v) => toggle(selectedBody, setSelectedBody, v)} />
              <FilterGroup title="Fuel Type" options={fuelTypes} selected={selectedFuel} onToggle={(v) => toggle(selectedFuel, setSelectedFuel, v)} />
              <FilterGroup title="Transmission" options={transmissions} selected={selectedTrans} onToggle={(v) => toggle(selectedTrans, setSelectedTrans, v)} />
              <FilterGroup title="Status" options={statuses} selected={selectedStatus} onToggle={(v) => toggle(selectedStatus, setSelectedStatus, v)} />

              <div className="py-4">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-navy">Price Range (USD)</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm focus:border-gold focus:outline-none"
                    placeholder="Min"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm focus:border-gold focus:outline-none"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${filtered.length} vehicle${filtered.length !== 1 ? 's' : ''} found`}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-gold focus:outline-none sm:hidden"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
                <Search className="h-10 w-10 text-gray-300" />
                <p className="mt-4 text-lg font-semibold text-navy">No vehicles found</p>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                <button onClick={clearAll} className="btn-primary mt-6">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
