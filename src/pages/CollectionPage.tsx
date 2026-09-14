import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  LayoutGrid,
  LayoutList,
  ArrowUpDown,
  Car,
  Truck,
  Tractor,
  Layers,
  Wrench,
  Cog,
  Check,
} from 'lucide-react';
import { fetchVehicles, fetchCategories, type Vehicle, type Category } from '@/lib/api';
import { useRouter } from '@/lib/router';
import { VehicleCard } from '@/components/VehicleCard';
import { useTranslation } from '@/lib/i18n';

// Fallback initial categories if API is loading
const defaultCategories = [
  'Trucks',
  'Cars',
  'Tyre Shover',
  'Forklifts',
  'Agricultural Machines',
  'Truck Fixtures',
  'Other Parts',
];

const statuses = ['Available', 'Reserved', 'Sold'];

export function CollectionPage() {
  const { route, navigate } = useRouter();
  const { t, categoryLabel, translateSt } = useTranslation();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter States: strictly Category, Status, and Search
  const [search, setSearch] = useState(route.query.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(route.query.get('category') || '');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch vehicles and categories on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const [vehiclesData, categoriesData] = await Promise.all([
          fetchVehicles(),
          fetchCategories().catch(() => []),
        ]);
        if (isMounted) {
          setVehicles(vehiclesData || []);
          setCategories(categoriesData || []);
        }
      } catch (err) {
        console.error('Error loading collection data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Update category from URL if query changes
  useEffect(() => {
    const catQuery = route.query.get('category');
    if (catQuery !== null) {
      setSelectedCategory(catQuery);
    }
  }, [route.query]);

  // Distinct category list: merge DB categories with defaults
  const allCategoryNames = useMemo(() => {
    const names = new Set<string>(defaultCategories);
    categories.forEach(c => names.add(c.name));
    vehicles.forEach(v => {
      if (v.category) names.add(v.category);
    });
    return Array.from(names);
  }, [categories, vehicles]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: vehicles.length };
    allCategoryNames.forEach((cat) => {
      counts[cat] = vehicles.filter((v) => {
        if (cat === 'Trucks') {
          return v.category === 'Trucks' || v.body_type?.toLowerCase() === 'truck' || v.make?.toLowerCase().includes('hino');
        }
        if (cat === 'Cars') {
          return v.category === 'Cars' || (!v.category && v.body_type?.toLowerCase() !== 'truck');
        }
        return v.category === cat;
      }).length;
    });
    return counts;
  }, [vehicles, allCategoryNames]);

  // Filtering logic
  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((v) =>
        v.make?.toLowerCase().includes(q) ||
        v.model?.toLowerCase().includes(q) ||
        v.category?.toLowerCase().includes(q) ||
        v.body_type?.toLowerCase().includes(q) ||
        v.chassis_no?.toLowerCase().includes(q) ||
        v.stock_id?.toLowerCase().includes(q) ||
        v.year?.toString().includes(q)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((v) => {
        if (selectedCategory === 'Trucks') {
          return v.category === 'Trucks' || v.body_type?.toLowerCase() === 'truck' || v.make?.toLowerCase().includes('hino');
        }
        if (selectedCategory === 'Cars') {
          return v.category === 'Cars' || (!v.category && v.body_type?.toLowerCase() !== 'truck');
        }
        return v.category === selectedCategory;
      });
    }

    // Status filter
    if (selectedStatus.length > 0) {
      result = result.filter((v) => selectedStatus.includes(v.status));
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price_fob_usd || 0) - (b.price_fob_usd || 0);
        case 'price-desc':
          return (b.price_fob_usd || 0) - (a.price_fob_usd || 0);
        case 'year-desc':
          return (b.year || 0) - (a.year || 0);
        case 'mileage-asc':
          return (a.mileage_km || 0) - (b.mileage_km || 0);
        case 'newest':
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

    return result;
  }, [vehicles, search, selectedCategory, selectedStatus, sortBy]);

  // Active filters count (Category + Status)
  const activeFiltersCount = (selectedCategory && selectedCategory !== 'all' ? 1 : 0) + selectedStatus.length;

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedStatus([]);
    setSearch('');
    navigate('/collection');
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  // Icon mapping for categories
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('truck') && !lower.includes('fixture')) return <Truck className="h-4 w-4" />;
    if (lower.includes('agri') || lower.includes('tractor')) return <Tractor className="h-4 w-4" />;
    if (lower.includes('forklift') || lower.includes('shover')) return <Cog className="h-4 w-4" />;
    if (lower.includes('part') || lower.includes('fixture')) return <Wrench className="h-4 w-4" />;
    return <Car className="h-4 w-4" />;
  };

  // Shared Sidebar Content (Category and Status filters only)
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Category Section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#001030]">
            {t('collection.categories', 'Categories')}
          </h3>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-[11px] font-semibold text-[#D0A030] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
              !selectedCategory || selectedCategory === 'all'
                ? 'bg-[#001030] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-[#001030]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>{t('collection.allCategories', 'All Categories')}</span>
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
              !selectedCategory || selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {categoryCounts.all || 0}
            </span>
          </button>

          {allCategoryNames.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#001030] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#001030]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {getCategoryIcon(cat)}
                  <span>{categoryLabel(cat)}</span>
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div className="border-t border-slate-200 pt-5">
        <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#001030]">
          {t('collection.status', 'Status')}
        </h3>
        <div className="space-y-1.5">
          {statuses.map((st) => {
            const checked = selectedStatus.includes(st);
            return (
              <label key={st} className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-100 text-xs">
                <span className="font-semibold text-slate-700">{translateSt(st)}</span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleStatus(st)}
                  className="h-4 w-4 rounded border-slate-300 text-[#001030] focus:ring-[#D0A030]"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      {activeFiltersCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{t('collection.clearAll', 'Clear All Filters')} ({activeFiltersCount})</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 sm:pt-24">
      {/* Top Hero Banner */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-[#D0A030]/15 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#9a751e]">
                BIKS GLOBAL EXPORT
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-[#001030] sm:text-3xl">
                {t('collection.title', 'Vehicle & Equipment Collection')}
              </h1>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm max-w-2xl">
                {t('collection.subtitle', 'Browse high-quality Japanese vehicles, trucks, heavy machinery, and parts available for global export.')}
              </p>
            </div>

            {/* Quick Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('collection.search', 'Search make, model, chassis...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-8 text-xs font-semibold text-[#001030] placeholder-slate-400 transition-all focus:border-[#001030] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#001030]/20"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          
          {/* ================= DESKTOP SIDEBAR ================= */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="flex items-center gap-2 text-sm font-black text-[#001030]">
                  <SlidersHorizontal className="h-4 w-4 text-[#D0A030]" />
                  <span>{t('collection.filters', 'Filters')}</span>
                </span>
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-[#D0A030] px-2 py-0.5 text-[10px] font-black text-[#001030]">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* ================= MAIN CONTENT ================= */}
          <main className="flex-1 min-w-0">
            {/* Top Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#001030] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 text-[#D0A030]" />
                  <span>{t('collection.filters', 'Filters')}</span>
                  {activeFiltersCount > 0 && (
                    <span className="rounded-full bg-[#D0A030] px-1.5 py-0.2 text-[10px] font-black text-[#001030]">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <p className="text-xs font-semibold text-slate-500">
                  Showing <span className="font-extrabold text-[#001030]">{filteredVehicles.length}</span> {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
                </p>
              </div>

              {/* Sort & View Mode Controls */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-xs font-bold text-[#001030] shadow-sm focus:border-[#001030] focus:outline-none"
                  >
                    <option value="newest">{t('collection.sort.newest', 'Newest First')}</option>
                    <option value="price-asc">{t('collection.sort.priceAsc', 'Price: Low to High')}</option>
                    <option value="price-desc">{t('collection.sort.priceDesc', 'Price: High to Low')}</option>
                    <option value="year-desc">{t('collection.sort.yearDesc', 'Year: Newest')}</option>
                    <option value="mileage-asc">{t('collection.sort.mileageAsc', 'Mileage: Lowest')}</option>
                  </select>
                  <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-100 p-1 sm:flex">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-lg p-1.5 transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-[#001030] shadow-sm' : 'text-slate-500 hover:text-[#001030]'
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`rounded-lg p-1.5 transition-colors ${
                      viewMode === 'list' ? 'bg-white text-[#001030] shadow-sm' : 'text-slate-500 hover:text-[#001030]'
                    }`}
                    aria-label="List view"
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {selectedCategory && selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#001030] px-3 py-1 text-xs font-bold text-white">
                    <span>{categoryLabel(selectedCategory)}</span>
                    <button onClick={() => setSelectedCategory('')}>
                      <X className="h-3 w-3 hover:text-[#D0A030]" />
                    </button>
                  </span>
                )}
                {selectedStatus.map((st) => (
                  <span key={st} className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-800">
                    <span>{translateSt(st)}</span>
                    <button onClick={() => toggleStatus(st)}>
                      <X className="h-3 w-3 hover:text-rose-600" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-[#D0A030] hover:underline"
                >
                  Reset all
                </button>
              </div>
            )}

            {/* Vehicles Grid / List */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="aspect-[16/10] w-full rounded-xl bg-slate-200" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
                    <div className="mt-4 flex justify-between">
                      <div className="h-5 w-20 rounded bg-slate-200" />
                      <div className="h-5 w-20 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
                <Car className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-base font-bold text-[#001030]">
                  {t('collection.noResults', 'No vehicles found')}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#001030] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-4"
              }>
                {filteredVehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================= MOBILE FILTER MODAL ================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-2xl overflow-y-auto">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="flex items-center gap-2 text-base font-black text-[#001030]">
                <SlidersHorizontal className="h-5 w-5 text-[#D0A030]" />
                <span>{t('collection.filters', 'Filters')}</span>
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SidebarContent />

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-[#001030] py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800"
              >
                Apply Filters ({filteredVehicles.length} results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
