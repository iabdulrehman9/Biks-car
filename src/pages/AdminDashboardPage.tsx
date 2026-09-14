import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Search,
  Car,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronLeft,
  Settings,
  Layers,
  Check,
} from 'lucide-react';
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  isAuthenticated,
  logout,
  getUser,
  getAdminProfile,
  updateAdminProfile,
  type Vehicle,
  type Category,
} from '@/lib/api';
import { formatUSD, statusStyles, statusDot } from '@/lib/format';
import { useRouter } from '@/lib/router';
import { Logo } from '@/components/Logo';
import { VehicleForm } from '@/components/VehicleForm';
import { SessionExpiredModal } from '@/components/SessionExpiredModal';
import { useAdminTranslation } from '@/lib/i18n';

type ViewMode = 'list' | 'add' | 'edit';

export function AdminDashboardPage() {
  const { navigate } = useRouter();
  const { t, categoryLabel, adminLanguage, setAdminLanguage } = useAdminTranslation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [search, setSearch] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Category Management Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Settings modal state
  const [showSettings, setShowSettings] = useState(false);
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsPassword, setSettingsPassword] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [currentAdminEmail, setCurrentAdminEmail] = useState(getUser() || 'biksss@gmail.com');

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Load vehicles
  const loadVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchVehicles(true);
      setVehicles(data || []);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Load categories
  const loadCategoriesList = useCallback(async () => {
    try {
      setCategoryLoading(true);
      const data = await fetchCategories();
      setCategoriesList(data || []);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load categories');
    } finally {
      setCategoryLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isAuthenticated()) {
      loadVehicles();
    }
  }, [loadVehicles]);

  // Category Actions
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setCategoryLoading(true);
      await createCategory(newCatName.trim());
      setNewCatName('');
      await loadCategoriesList();
      showToast('success', 'Category added successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
  };

  const handleSaveEditCategory = async (catId: string) => {
    if (!editingCatName.trim()) return;
    try {
      setCategoryLoading(true);
      await updateCategory(catId, editingCatName.trim());
      setEditingCatId(null);
      setEditingCatName('');
      await loadCategoriesList();
      await loadVehicles(); // refresh vehicles in case category renamed
      showToast('success', 'Category updated successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      setCategoryLoading(true);
      await deleteCategory(catId);
      await loadCategoriesList();
      showToast('success', `Category "${catName}" deleted successfully!`);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete category');
    } finally {
      setCategoryLoading(false);
    }
  };

  // Open settings modal
  const handleOpenSettings = async () => {
    setSettingsError('');
    setSettingsSuccess('');
    setSettingsPassword('');
    setShowSettings(true);
    try {
      const profile = await getAdminProfile();
      setSettingsEmail(profile.email);
      setCurrentAdminEmail(profile.email);
    } catch {
      setSettingsEmail(currentAdminEmail);
    }
  };

  // Save settings (email / password)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');
    setSettingsLoading(true);

    try {
      const payload: { email?: string; password?: string } = {};
      if (settingsEmail && settingsEmail.trim() !== currentAdminEmail) {
        payload.email = settingsEmail.trim();
      }
      if (settingsPassword && settingsPassword.trim()) {
        payload.password = settingsPassword.trim();
      }

      if (!payload.email && !payload.password) {
        setSettingsError('Please provide a new email or password to update.');
        setSettingsLoading(false);
        return;
      }

      const res = await updateAdminProfile(payload);
      setSettingsSuccess('Credentials updated successfully!');
      setCurrentAdminEmail(res.email);
      setSettingsPassword('');
      setTimeout(() => {
        setShowSettings(false);
        setSettingsSuccess('');
      }, 1500);
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to update credentials.');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Handle create vehicle
  const handleCreate = async (formData: FormData) => {
    try {
      setFormLoading(true);
      await createVehicle(formData);
      showToast('success', 'Vehicle added successfully!');
      setViewMode('list');
      await loadVehicles();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create vehicle');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle update vehicle
  const handleUpdate = async (formData: FormData) => {
    if (!editingVehicle) return;
    try {
      setFormLoading(true);
      await updateVehicle(editingVehicle.id, formData);
      showToast('success', 'Vehicle updated successfully!');
      setViewMode('list');
      setEditingVehicle(null);
      await loadVehicles();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update vehicle');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete vehicle
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${t('admin.confirmDelete', 'Are you sure you want to delete this vehicle?')}`)) return;
    try {
      await deleteVehicle(id);
      showToast('success', `${name} deleted successfully!`);
      await loadVehicles();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete vehicle');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(v => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      v.make?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q) ||
      v.category?.toLowerCase().includes(q) ||
      v.stock_id?.toLowerCase().includes(q) ||
      v.body_type?.toLowerCase().includes(q) ||
      v.status?.toLowerCase().includes(q)
    );
  });

  if (!isAuthenticated()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* ========== Header ========== */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Logo onClick={() => navigate('/')} />
            <div className="hidden h-6 w-px bg-gray-200 sm:block" />
            <span className="hidden text-sm font-bold text-navy sm:block">
              {t('nav.admin', 'Admin Panel')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-gray-500 sm:block">
              Logged in as <strong className="text-navy">{currentAdminEmail}</strong>
            </span>

            {/* Admin-specific Language Toggle */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              <button
                type="button"
                onClick={() => setAdminLanguage('en')}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                  adminLanguage === 'en'
                    ? 'bg-white text-[#001030] shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setAdminLanguage('ja')}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                  adminLanguage === 'ja'
                    ? 'bg-[#001030] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                日本語
              </button>
            </div>

            <button
              onClick={handleOpenSettings}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:border-[#D0A030] hover:text-[#D0A030]"
              title={t('admin.settings', 'Account Settings')}
            >
              <Settings className="h-3.5 w-3.5" />
              <span>{t('admin.settings', 'Settings')}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t('admin.logout', 'Logout')}
            </button>
          </div>
        </div>
      </header>

      {/* ========== Toast ========== */}
      {toast && (
        <div className={`fixed right-4 top-20 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg transition-all ${
          toast.type === 'success'
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-red-200 bg-red-50 text-red-700'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ========== Content ========== */}
      <main className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ---- LIST VIEW ---- */}
        {viewMode === 'list' && (
          <>
            {/* Stats bar */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: t('admin.totalVehicles', 'Total Vehicles'), value: vehicles.length, color: 'text-navy' },
                { label: t('admin.inStock', 'Available'), value: vehicles.filter(v => v.status === 'Available').length, color: 'text-emerald-600' },
                { label: t('admin.reserved', 'Reserved'), value: vehicles.filter(v => v.status === 'Reserved').length, color: 'text-amber-600' },
                { label: t('admin.sold', 'Sold'), value: vehicles.filter(v => v.status === 'Sold').length, color: 'text-red-600' },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                  <p className={`mt-1 text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('admin.searchPlaceholder', 'Search vehicles...')}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Action Buttons: Manage Categories & Add Vehicle */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => { setShowCategoryModal(true); loadCategoriesList(); }}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-navy shadow-sm transition-all hover:border-[#D0A030] hover:text-[#D0A030]"
                >
                  <Layers className="h-4 w-4 text-[#D0A030]" />
                  <span>{t('admin.manageCategories', 'Manage Categories')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setViewMode('add'); setEditingVehicle(null); }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D0A030] px-5 py-2.5 text-sm font-bold text-[#001030] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  {t('admin.addVehicle', 'Add Vehicle')}
                </button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gold" />
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
                <Car className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-semibold text-navy">{t('collection.noResults', 'No vehicles found')}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {search ? 'Try a different search term.' : 'Click "Add Vehicle" to get started.'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                          {t('admin.colVehicle', 'Vehicle')}
                        </th>
                        <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">
                          {t('admin.colYear', 'Year')}
                        </th>
                        <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:table-cell">
                          {t('admin.colStatus', 'Status')}
                        </th>
                        <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">
                          {t('admin.colPrice', 'Price (USD)')}
                        </th>
                        <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">
                          Stock ID
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                          {t('admin.colActions', 'Actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredVehicles.map(vehicle => (
                        <tr key={vehicle.id} className="transition-colors hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                {vehicle.image_url ? (
                                  <img 
                                    src={vehicle.image_url} 
                                    alt="" 
                                    className="h-full w-full object-cover" 
                                    loading="lazy" 
                                    decoding="async" 
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-gray-300">
                                    <Car className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-navy">{vehicle.make} {vehicle.model}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {vehicle.category && (
                                    <span className="rounded bg-[#001030]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#001030]">
                                      {categoryLabel(vehicle.category)}
                                    </span>
                                  )}
                                  <span className="truncate text-xs text-gray-400">{vehicle.body_type || 'Vehicle'}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{vehicle.year}</td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[vehicle.status] || statusStyles.Available}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${statusDot[vehicle.status] || statusDot.Available}`} />
                              {t(`status.${vehicle.status}`, vehicle.status)}
                            </span>
                          </td>
                          <td className="hidden px-4 py-3 font-semibold text-navy lg:table-cell">
                            {formatUSD(vehicle.price_fob_usd)}
                          </td>
                          <td className="hidden px-4 py-3 text-xs text-gray-500 lg:table-cell">
                            {vehicle.stock_id || '—'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => { setEditingVehicle(vehicle); setViewMode('edit'); }}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy"
                                title={t('admin.edit', 'Edit')}
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(vehicle.id, `${vehicle.make} ${vehicle.model}`)}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                title={t('admin.delete', 'Delete')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ---- ADD / EDIT FORM VIEW ---- */}
        {(viewMode === 'add' || viewMode === 'edit') && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <button
                onClick={() => { setViewMode('list'); setEditingVehicle(null); }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-navy"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Inventory</span>
              </button>
              <h2 className="text-lg font-bold text-navy">
                {viewMode === 'edit' ? t('form.editTitle', 'Edit Vehicle') : t('form.addTitle', 'Add New Vehicle')}
              </h2>
              <div className="w-16" />
            </div>

            <VehicleForm
              vehicle={editingVehicle}
              onSubmit={viewMode === 'edit' ? handleUpdate : handleCreate}
              onCancel={() => { setViewMode('list'); setEditingVehicle(null); }}
              loading={formLoading}
            />
          </div>
        )}

        {/* ========== Category Management Modal ========== */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#D0A030]" />
                  <h3 className="text-base font-bold text-navy">
                    {t('admin.manageCategories', 'Category Management')}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Add Category Form */}
              <form onSubmit={handleCreateCategory} className="mb-5 flex gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="New category name (e.g. Cranes)..."
                  className="flex-1 rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <button
                  type="submit"
                  disabled={categoryLoading || !newCatName.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#D0A030] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#001030] transition-colors hover:bg-[#c09025] disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </form>

              {/* Category List */}
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {categoryLoading && categoriesList.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500">Loading categories...</div>
                ) : categoriesList.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500">No categories found.</div>
                ) : (
                  categoriesList.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 transition-colors hover:bg-gray-100/70"
                    >
                      {editingCatId === cat.id ? (
                        <div className="flex flex-1 items-center gap-2">
                          <input
                            type="text"
                            value={editingCatName}
                            onChange={(e) => setEditingCatName(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-bold text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditCategory(cat.id)}
                            className="rounded-md bg-green-600 p-1.5 text-white hover:bg-green-700"
                            title="Save"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEditingCatId(null); setEditingCatName(''); }}
                            className="rounded-md bg-gray-200 p-1.5 text-gray-600 hover:bg-gray-300"
                            title="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-navy text-xs">{cat.name}</span>
                            <span className="rounded bg-[#001030]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#001030]">
                              {categoryLabel(cat.name)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEditCategory(cat)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-navy"
                              title="Rename Category"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                              title="Delete Category"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="mt-5 border-t border-gray-100 pt-3 text-right">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========== Settings Modal ========== */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-navy">{t('admin.settings', 'Admin Settings')}</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {settingsError && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              {settingsSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-xs font-semibold text-green-700 border border-green-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-navy">Admin Email</label>
                  <input
                    type="email"
                    value={settingsEmail}
                    onChange={e => setSettingsEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-navy">New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    value={settingsPassword}
                    onChange={e => setSettingsPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={settingsLoading}
                    className="rounded-lg bg-[#D0A030] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#001030] hover:bg-[#c09025] disabled:opacity-50"
                  >
                    {settingsLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Non-destructive Session Expired Modal */}
        <SessionExpiredModal onSuccess={loadVehicles} />
      </main>
    </div>
  );
}
