import { useEffect, useState } from 'react';
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
  KeyRound,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  isAuthenticated,
  logout,
  getUser,
  getAdminProfile,
  updateAdminProfile,
  type Vehicle,
} from '@/lib/api';
import { useRouter } from '@/lib/router';
import { Logo } from '@/components/Logo';
import { VehicleForm } from '@/components/VehicleForm';
import { formatUSD, statusStyles, statusDot } from '@/lib/format';

type ViewMode = 'list' | 'add' | 'edit';

export function AdminDashboardPage() {
  const { navigate } = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Settings modal states
  const [showSettings, setShowSettings] = useState(false);
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsPassword, setSettingsPassword] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [showSettingsPassword, setShowSettingsPassword] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState(getUser() || '');

  // Auth check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Load vehicles
  useEffect(() => {
    loadVehicles();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await fetchVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load vehicles.');
    }
    setLoading(false);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleOpenSettings = async () => {
    setShowSettings(true);
    setSettingsError('');
    setSettingsPassword('');
    setShowSettingsPassword(false);
    try {
      const profile = await getAdminProfile();
      setSettingsEmail(profile.email);
      setCurrentAdminEmail(profile.email);
    } catch {
      setSettingsEmail(getUser() || '');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsLoading(true);

    try {
      const payload: { email?: string; password?: string } = {};
      if (settingsEmail && settingsEmail.trim() !== currentAdminEmail) {
        payload.email = settingsEmail.trim();
      }
      if (settingsPassword && settingsPassword.trim()) {
        if (settingsPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long.');
        }
        payload.password = settingsPassword.trim();
      }

      if (!payload.email && !payload.password) {
        setShowSettings(false);
        return;
      }

      const res = await updateAdminProfile(payload);
      if (res.email) {
        setCurrentAdminEmail(res.email);
      }
      showToast('success', 'Admin credentials updated successfully.');
      setShowSettings(false);
      setSettingsPassword('');
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to update credentials.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleAdd = async (formData: FormData) => {
    setFormLoading(true);
    try {
      await createVehicle(formData);
      showToast('success', 'Vehicle added successfully!');
      setViewMode('list');
      await loadVehicles();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to add vehicle.');
    }
    setFormLoading(false);
  };

  const handleEdit = async (formData: FormData) => {
    if (!editingVehicle) return;
    setFormLoading(true);
    try {
      await updateVehicle(editingVehicle.id, formData);
      showToast('success', 'Vehicle updated successfully!');
      setViewMode('list');
      setEditingVehicle(null);
      await loadVehicles();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update vehicle.');
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id);
      showToast('success', 'Vehicle deleted successfully!');
      setDeleteConfirm(null);
      await loadVehicles();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete vehicle.');
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.stock_id?.toLowerCase().includes(q) ||
      v.body_type?.toLowerCase().includes(q) ||
      v.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* ========== Header ========== */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Logo onClick={() => navigate('/')} />
            <div className="hidden h-6 w-px bg-gray-200 sm:block" />
            <span className="hidden text-sm font-bold text-navy sm:block">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-gray-500 sm:block">
              Logged in as <strong className="text-navy">{currentAdminEmail}</strong>
            </span>
            <button
              onClick={handleOpenSettings}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:border-[#D0A030] hover:text-[#D0A030]"
              title="Account Settings"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
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
                { label: 'Total Vehicles', value: vehicles.length, color: 'text-navy' },
                { label: 'Available', value: vehicles.filter(v => v.status === 'Available').length, color: 'text-status-success' },
                { label: 'Reserved', value: vehicles.filter(v => v.status === 'Reserved').length, color: 'text-status-warning' },
                { label: 'Sold', value: vehicles.filter(v => v.status === 'Sold').length, color: 'text-status-danger' },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4">
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
                  placeholder="Search vehicles..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              <button
                onClick={() => { setViewMode('add'); setEditingVehicle(null); }}
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy-dark shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Add Vehicle
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gold" />
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
                <Car className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-semibold text-navy">No vehicles found</p>
                <p className="mt-1 text-xs text-gray-500">
                  {search ? 'Try a different search term.' : 'Click "Add Vehicle" to get started.'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Vehicle</th>
                        <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 md:table-cell">Year</th>
                        <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 sm:table-cell">Status</th>
                        <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">Price (USD)</th>
                        <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 lg:table-cell">Stock ID</th>
                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredVehicles.map(vehicle => (
                        <tr key={vehicle.id} className="transition-colors hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                {vehicle.image_url ? (
                                  <img src={vehicle.image_url} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-gray-300">
                                    <Car className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-navy">{vehicle.make} {vehicle.model}</p>
                                <p className="truncate text-xs text-gray-400">{vehicle.body_type || 'Vehicle'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{vehicle.year}</td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-semibold ${statusStyles[vehicle.status] || statusStyles.Available}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${statusDot[vehicle.status] || statusDot.Available}`} />
                              {vehicle.status}
                            </span>
                          </td>
                          <td className="hidden px-4 py-3 font-semibold text-navy lg:table-cell">
                            {vehicle.price_fob_usd ? `$${formatUSD(vehicle.price_fob_usd)}` : '—'}
                          </td>
                          <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">{vehicle.stock_id || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setEditingVehicle(vehicle); setViewMode('edit'); }}
                                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(vehicle.id)}
                                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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

            {/* Delete confirmation modal */}
            {deleteConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-center text-lg font-bold text-navy">Delete Vehicle?</h3>
                  <p className="mt-2 text-center text-sm text-gray-500">
                    This action cannot be undone. The vehicle and its images will be permanently removed.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ---- ADD / EDIT VIEW ---- */}
        {(viewMode === 'add' || viewMode === 'edit') && (
          <div>
            <button
              onClick={() => { setViewMode('list'); setEditingVehicle(null); }}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-navy"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to list
            </button>

            <h2 className="mb-6 text-2xl font-extrabold text-navy">
              {viewMode === 'add' ? 'Add New Vehicle' : `Edit: ${editingVehicle?.make} ${editingVehicle?.model}`}
            </h2>

            <VehicleForm
              vehicle={viewMode === 'edit' ? editingVehicle : null}
              onSubmit={viewMode === 'add' ? handleAdd : handleEdit}
              onCancel={() => { setViewMode('list'); setEditingVehicle(null); }}
              loading={formLoading}
            />
          </div>
        )}

        {/* ========== Account Settings Modal ========== */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/5 text-navy">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy">Account Settings</h3>
                    <p className="text-xs text-gray-500">Directly update your admin email & password</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {settingsError && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Login Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      placeholder="admin@biks.jp"
                      className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-900 transition-colors focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      New Password
                    </label>
                    <span className="text-[11px] text-gray-400">Leave blank to keep current</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showSettingsPassword ? 'text' : 'password'}
                      value={settingsPassword}
                      onChange={(e) => setSettingsPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-10 text-sm text-gray-900 transition-colors focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSettingsPassword(!showSettingsPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSettingsPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={settingsLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#D0A030] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#001030] shadow-sm transition-all hover:bg-[#c09025] disabled:opacity-60"
                  >
                    {settingsLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
