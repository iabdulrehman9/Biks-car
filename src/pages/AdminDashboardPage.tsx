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
  Tag,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
  Save,
  Clock,
  Sparkles,
  ExternalLink,
  ArrowRight,
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
  fetchSellRequests,
  updateSellRequest,
  deleteSellRequest,
  isAuthenticated,
  logout,
  getUser,
  getAdminProfile,
  updateAdminProfile,
  type Vehicle,
  type Category,
  type SellRequest,
  type SellRequestStatus,
} from '@/lib/api';
import { formatUSD, statusStyles, statusDot } from '@/lib/format';
import { useRouter } from '@/lib/router';
import { Logo } from '@/components/Logo';
import { VehicleForm } from '@/components/VehicleForm';
import { SessionExpiredModal } from '@/components/SessionExpiredModal';
import { useAdminTranslation } from '@/lib/i18n';

type ViewMode = 'list' | 'add' | 'edit';
type AdminTab = 'inventory' | 'inquiries';

const inquiryStatusStyles: Record<SellRequestStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-300',
  Contacted: 'bg-blue-100 text-blue-800 border-blue-300',
  Completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Rejected: 'bg-rose-100 text-rose-800 border-rose-300',
};

function VehicleTableThumbnail({ imageUrl, make }: { imageUrl?: string | null; make?: string }) {
  const [error, setError] = useState(false);
  return (
    <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 border border-gray-200/80">
      {imageUrl && !error ? (
        <img
          src={imageUrl}
          alt={make || ''}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <Car className="h-4 w-4 text-gray-400" />
      )}
    </div>
  );
}

export function AdminDashboardPage() {
  const { navigate } = useRouter();
  const { t, categoryLabel, adminLanguage, setAdminLanguage } = useAdminTranslation();

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');

  // Inventory State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [search, setSearch] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Inquiries State
  const [sellRequests, setSellRequests] = useState<SellRequest[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | SellRequestStatus>('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [noteDrafts, setNoteDrafts] = useState<{ [id: string]: string }>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  // Load inquiries
  const loadInquiries = useCallback(async () => {
    try {
      setInquiriesLoading(true);
      const data = await fetchSellRequests();
      setSellRequests(data || []);
      // Initialize note drafts
      const drafts: { [id: string]: string } = {};
      data.forEach((r) => {
        drafts[r.id] = r.admin_notes || '';
      });
      setNoteDrafts(drafts);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load inquiries');
    } finally {
      setInquiriesLoading(false);
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
      loadInquiries();
    }
  }, [loadVehicles, loadInquiries]);

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
      await loadVehicles();
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

  // Inquiry Actions
  const handleStatusChange = async (id: string, newStatus: SellRequestStatus) => {
    try {
      const updated = await updateSellRequest(id, { status: newStatus });
      setSellRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showToast('success', `Inquiry status changed to ${newStatus}`);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update inquiry status');
    }
  };

  const handleSaveNote = async (id: string) => {
    try {
      setSavingNoteId(id);
      const note = noteDrafts[id] || '';
      const updated = await updateSellRequest(id, { admin_notes: note });
      setSellRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showToast('success', 'Admin note saved successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save note');
    } finally {
      setSavingNoteId(null);
    }
  };

  const handleDeleteInquiry = async (id: string, customerName: string) => {
    if (!confirm(`Are you sure you want to delete the inquiry from "${customerName}"?`)) return;
    try {
      await deleteSellRequest(id);
      setSellRequests((prev) => prev.filter((r) => r.id !== id));
      showToast('success', 'Inquiry deleted successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete inquiry');
    }
  };

  const handleConvertInquiry = (inquiry: SellRequest) => {
    const prefilledDesc = `[Consignment Seller Details]\nOwner: ${inquiry.customer_name}\nPhone: ${inquiry.phone}\nEmail: ${inquiry.email}\nLocation: ${inquiry.address}\n\n[Item Description]\n${inquiry.description}`;
    const draftVehicle: any = {
      id: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      category: inquiry.category || 'Trucks',
      body_type: 'Truck',
      transmission: 'Manual',
      fuel_type: 'Diesel',
      engine_cc: null,
      mileage_km: null,
      color: '',
      price_fob_jpy: null,
      price_fob_usd: null,
      status: 'Available',
      location: inquiry.address,
      image_url: inquiry.images && inquiry.images.length > 0 ? inquiry.images[0] : null,
      gallery: inquiry.images || [],
      features: [],
      featured: false,
      description: prefilledDesc,
      chassis_no: '',
      stock_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEditingVehicle(draftVehicle);
    setViewMode('add');
    setActiveTab('inventory');
    showToast('success', `Inquiry converted! Complete the vehicle specs below.`);
  };

  // Vehicle Actions
  const handleCreateVehicle = async (formData: FormData) => {
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

  const handleUpdateVehicle = async (formData: FormData) => {
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

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
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

  const handleOpenSettings = async () => {
    setShowSettings(true);
    setSettingsError('');
    setSettingsSuccess('');
    try {
      const profile = await getAdminProfile();
      setSettingsEmail(profile.email);
    } catch {
      setSettingsEmail(currentAdminEmail);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError('');
    setSettingsSuccess('');
    try {
      const payload: { email?: string; password?: string } = {};
      if (settingsEmail && settingsEmail !== currentAdminEmail) {
        payload.email = settingsEmail;
      }
      if (settingsPassword) {
        if (settingsPassword.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        payload.password = settingsPassword;
      }
      if (Object.keys(payload).length === 0) {
        setSettingsError('No changes to save.');
        setSettingsLoading(false);
        return;
      }
      const res = await updateAdminProfile(payload);
      setSettingsSuccess(res.message || 'Settings updated successfully');
      setCurrentAdminEmail(res.email);
      setSettingsPassword('');
      setTimeout(() => setShowSettings(false), 2000);
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to update profile');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      (v.chassis_no && v.chassis_no.toLowerCase().includes(q)) ||
      (v.stock_id && v.stock_id.toLowerCase().includes(q)) ||
      (v.category && v.category.toLowerCase().includes(q))
    );
  });

  // Filtered inquiries
  const filteredInquiries = sellRequests.filter((r) => {
    if (inquiryFilter !== 'all' && r.status !== inquiryFilter) return false;
    if (inquirySearch.trim()) {
      const q = inquirySearch.toLowerCase();
      return (
        r.customer_name.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        (r.category && r.category.toLowerCase().includes(q)) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingInquiriesCount = sellRequests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SessionExpiredModal />

      {/* ========== Top Navigation Bar ========== */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-8xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Logo variant="dark" onClick={() => navigate('/')} />
            <span className="hidden sm:inline-block h-4 w-px bg-gray-200" />
            <span className="hidden sm:inline-block rounded-md bg-[#D0A030]/15 px-2.5 py-1 text-xs font-black tracking-wider text-[#9a751e] uppercase">
              {t('admin.portal', 'ADMIN PORTAL')}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAdminLanguage('en')}
                className={`rounded px-2.5 py-1 transition-all ${
                  adminLanguage === 'en'
                    ? 'bg-[#001030] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:text-navy'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setAdminLanguage('ja')}
                className={`rounded px-2.5 py-1 transition-all ${
                  adminLanguage === 'ja'
                    ? 'bg-[#001030] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:text-navy'
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

      {/* ========== Toast Alert ========== */}
      {toast && (
        <div
          className={`fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold shadow-xl transition-all animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-gray-700">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ========== Main Content ========== */}
      <main className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Tab Switcher: Inventory vs Seller Inquiries */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('inventory');
                setViewMode('list');
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'inventory'
                  ? 'bg-[#001030] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-navy'
              }`}
            >
              <Car className="h-4 w-4" />
              <span>{t('admin.tabInventory', 'Inventory Management')}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white">
                {vehicles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('inquiries');
                loadInquiries();
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-[#001030] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-navy'
              }`}
            >
              <Tag className="h-4 w-4 text-[#D0A030]" />
              <span>{t('admin.tabInquiries', 'Seller Inquiries')}</span>
              {pendingInquiriesCount > 0 ? (
                <span className="animate-pulse rounded-full bg-[#D0A030] px-2 py-0.5 text-xs font-black text-[#001030]">
                  {pendingInquiriesCount} new
                </span>
              ) : (
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-700">
                  {sellRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: INVENTORY MANAGEMENT */}
        {/* ================================================================= */}
        {activeTab === 'inventory' && (
          <>
            {viewMode === 'list' && (
              <>
                {/* Stats Bar */}
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: t('admin.totalVehicles', 'Total Vehicles'), value: vehicles.length, color: 'text-navy' },
                    {
                      label: t('admin.inStock', 'Available'),
                      value: vehicles.filter((v) => v.status === 'Available').length,
                      color: 'text-emerald-600',
                    },
                    {
                      label: t('admin.reserved', 'Reserved'),
                      value: vehicles.filter((v) => v.status === 'Reserved').length,
                      color: 'text-amber-600',
                    },
                    {
                      label: t('admin.sold', 'Sold'),
                      value: vehicles.filter((v) => v.status === 'Sold').length,
                      color: 'text-red-600',
                    },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{stat.label}</p>
                      <p className={`mt-1 text-2xl font-black ${stat.color}`}>{stat.value}</p>
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
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t('admin.searchPlaceholder', 'Search vehicles...')}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryModal(true);
                        loadCategoriesList();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-navy shadow-sm transition-all hover:border-[#D0A030] hover:text-[#D0A030]"
                    >
                      <Layers className="h-4 w-4 text-[#D0A030]" />
                      <span>{t('admin.manageCategories', 'Manage Categories')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('add');
                        setEditingVehicle(null);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#D0A030] px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-[#001030] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Plus className="h-4 w-4" />
                      {t('admin.addVehicle', 'Add Vehicle')}
                    </button>
                  </div>
                </div>

                {/* Vehicles Table */}
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gold" />
                  </div>
                ) : filteredVehicles.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                    <Car className="mx-auto h-10 w-10 text-gray-300" />
                    <p className="mt-3 text-sm font-bold text-navy">{t('collection.noResults', 'No vehicles found')}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {search ? 'Try a different search term.' : 'Click "Add Vehicle" to get started.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50/80">
                          <tr>
                            <th className="px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                              {t('admin.colVehicle', 'Vehicle')}
                            </th>
                            <th className="hidden px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-500 md:table-cell">
                              {t('admin.colYear', 'Year')}
                            </th>
                            <th className="hidden px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-500 sm:table-cell">
                              {t('admin.colStatus', 'Status')}
                            </th>
                            <th className="hidden px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-500 lg:table-cell">
                              {t('admin.colPrice', 'Price (USD)')}
                            </th>
                            <th className="hidden px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-500 lg:table-cell">
                              Stock ID
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-extrabold uppercase tracking-wider text-gray-500">
                              {t('admin.colActions', 'Actions')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredVehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="transition-colors hover:bg-gray-50/50">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <VehicleTableThumbnail imageUrl={vehicle.image_url} make={vehicle.make} />
                                  <div className="min-w-0">
                                    <p className="truncate font-bold text-navy">
                                      {vehicle.make} {vehicle.model}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {vehicle.category && (
                                        <span className="rounded bg-[#001030]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#001030]">
                                          {categoryLabel(vehicle.category)}
                                        </span>
                                      )}
                                      <span className="truncate text-xs text-gray-400">
                                        {vehicle.body_type || 'Vehicle'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{vehicle.year}</td>
                              <td className="hidden px-4 py-3 sm:table-cell">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    statusStyles[vehicle.status] || statusStyles.Available
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      statusDot[vehicle.status] || statusDot.Available
                                    }`}
                                  />
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
                                    onClick={() => {
                                      setEditingVehicle(vehicle);
                                      setViewMode('edit');
                                    }}
                                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy"
                                    title={t('admin.edit', 'Edit')}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteVehicle(vehicle.id, `${vehicle.make} ${vehicle.model}`)
                                    }
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

            {/* Form View (Add / Edit) */}
            {(viewMode === 'add' || viewMode === 'edit') && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                  <button
                    onClick={() => {
                      setViewMode('list');
                      setEditingVehicle(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-navy"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back to Inventory</span>
                  </button>
                  <h2 className="text-lg font-black text-navy">
                    {viewMode === 'edit'
                      ? t('form.editTitle', 'Edit Vehicle')
                      : t('form.addTitle', 'Add New Vehicle')}
                  </h2>
                  <div className="w-16" />
                </div>
                <VehicleForm
                  vehicle={editingVehicle}
                  onSubmit={viewMode === 'edit' ? handleUpdateVehicle : handleCreateVehicle}
                  onCancel={() => {
                    setViewMode('list');
                    setEditingVehicle(null);
                  }}
                  loading={formLoading}
                />
              </div>
            )}
          </>
        )}

        {/* ================================================================= */}
        {/* TAB 2: SELLER INQUIRIES & CONSIGNMENTS */}
        {/* ================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            {/* Filter pills and search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {(['all', 'Pending', 'Contacted', 'Completed', 'Rejected'] as const).map((st) => {
                  const count =
                    st === 'all'
                      ? sellRequests.length
                      : sellRequests.filter((r) => r.status === st).length;
                  const active = inquiryFilter === st;

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setInquiryFilter(st)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                        active
                          ? 'bg-[#001030] text-white shadow-sm'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span>{st === 'all' ? 'All Inquiries' : st}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                          active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Inquiry Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  placeholder="Search inquiries..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs font-medium focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            {/* Inquiries List */}
            {inquiriesLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gold" />
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                <Tag className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-bold text-navy">No Seller Inquiries Found</p>
                <p className="mt-1 text-xs text-gray-500">
                  {inquirySearch ? 'Try clearing your search query.' : 'New seller inquiries from the website will appear here.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredInquiries.map((inquiry) => {
                  const cleanPhone = inquiry.phone.replace(/[^0-9]/g, '');

                  return (
                    <div
                      key={inquiry.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        {/* Left: Customer Info & Description */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-base font-black text-navy">{inquiry.customer_name}</h3>
                            {inquiry.category && (
                              <span className="rounded-lg bg-[#001030]/10 px-2 py-0.5 text-xs font-extrabold text-[#001030]">
                                {categoryLabel(inquiry.category)}
                              </span>
                            )}
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${
                                inquiryStatusStyles[inquiry.status] || 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {inquiry.status}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(inquiry.created_at).toLocaleString()}
                            </span>
                          </div>

                          {/* Contact Details & Quick Action Buttons */}
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 text-gray-600 font-medium">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              <span>{inquiry.address}</span>
                            </div>

                            <a
                              href={`tel:${inquiry.phone}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                              title="Call customer"
                            >
                              <Phone className="h-3 w-3 text-emerald-600" />
                              <span>{inquiry.phone}</span>
                            </a>

                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title="Open WhatsApp chat"
                              >
                                <MessageSquare className="h-3 w-3 text-emerald-600" />
                                <span>WhatsApp</span>
                              </a>
                            )}

                            <a
                              href={`mailto:${inquiry.email}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                              title="Send email"
                            >
                              <Mail className="h-3 w-3 text-blue-600" />
                              <span>{inquiry.email}</span>
                            </a>
                          </div>

                          {/* Customer Description */}
                          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {inquiry.description}
                          </div>

                          {/* Image Gallery if provided */}
                          {inquiry.images && inquiry.images.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {inquiry.images.map((imgUrl, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setPreviewImage(imgUrl)}
                                  className="h-14 w-14 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 hover:opacity-80 transition-opacity"
                                >
                                  <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right: Status dropdown, Convert to Inventory & Notes */}
                        <div className="w-full lg:w-80 shrink-0 space-y-3 lg:border-l lg:border-gray-100 lg:pl-5">
                          {/* Status Selector */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              Status
                            </label>
                            <select
                              value={inquiry.status}
                              onChange={(e) =>
                                handleStatusChange(inquiry.id, e.target.value as SellRequestStatus)
                              }
                              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            >
                              <option value="Pending">Pending (New)</option>
                              <option value="Contacted">Contacted (In Discussion)</option>
                              <option value="Completed">Completed (Agreed / Listed)</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>

                          {/* Admin Note Textarea */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                              Admin Private Notes
                            </label>
                            <textarea
                              rows={2}
                              value={noteDrafts[inquiry.id] ?? (inquiry.admin_notes || '')}
                              onChange={(e) =>
                                setNoteDrafts((prev) => ({ ...prev, [inquiry.id]: e.target.value }))
                              }
                              placeholder="Add internal notes (e.g. offered $12k)..."
                              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-800 focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold"
                            />
                            <div className="mt-1 flex justify-end">
                              <button
                                type="button"
                                disabled={savingNoteId === inquiry.id}
                                onClick={() => handleSaveNote(inquiry.id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-200 active:scale-95 disabled:opacity-50"
                              >
                                <Save className="h-3 w-3" />
                                <span>{savingNoteId === inquiry.id ? 'Saving...' : 'Save Note'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Quick Actions: Convert to Inventory & Delete */}
                          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                            <button
                              type="button"
                              onClick={() => handleConvertInquiry(inquiry)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add to Inventory</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(inquiry.id, inquiry.customer_name)}
                              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete inquiry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal: Category Management */}
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
                            onClick={() => {
                              setEditingCatId(null);
                              setEditingCatName('');
                            }}
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

        {/* Modal: Settings */}
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
                    onChange={(e) => setSettingsEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-navy">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    value={settingsPassword}
                    onChange={(e) => setSettingsPassword(e.target.value)}
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

        {/* Modal: Full Image Preview */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-black">
              <img src={previewImage} alt="Preview" className="max-h-[85vh] w-auto object-contain" />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
