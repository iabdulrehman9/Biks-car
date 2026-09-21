// ============================================================================
// BIKS API Client — Replaces Supabase client
// ============================================================================

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE = (isLocal ? 'http://localhost:5000' : 'https://api.biks.online') + '/api';

// ============================================================================
// Types (unchanged from old supabase.ts)
// ============================================================================

export type VehicleStatus = 'Available' | 'Reserved' | 'Sold' | 'In Transit' | 'Delivered';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category?: string | null;
  body_type: string | null;
  transmission: string | null;
  fuel_type: string | null;
  engine_cc: number | null;
  mileage_km: number | null;
  color: string | null;
  price_fob_jpy: number | null;
  price_fob_usd: number | null;
  status: VehicleStatus;
  location: string | null;
  image_url: string | null;
  gallery: string[] | null;
  features: string[] | null;
  featured: boolean;
  description: string | null;
  chassis_no: string | null;
  stock_id: string | null;
  created_at: string;
  updated_at: string;
}

export type SellRequestStatus = 'Pending' | 'Contacted' | 'Completed' | 'Rejected';

export interface SellRequest {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  category?: string | null;
  description: string;
  images?: string[] | null;
  status: SellRequestStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSellRequestInput {
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  category?: string;
  description: string;
  images?: File[];
}

// ============================================================================
// Vehicle API
// ============================================================================

// ============================================================================
// In-Memory SWR Cache for Performance
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

let vehiclesCache: CacheEntry<Vehicle[]> | null = null;
let categoriesCache: CacheEntry<Category[]> | null = null;
const CACHE_TTL_MS = 60000; // 60s cache for lightning-fast loads

export function invalidateVehiclesCache(): void {
  vehiclesCache = null;
}

export function invalidateCategoriesCache(): void {
  categoriesCache = null;
}

function fixImageUrl(url: string | null): string | null {
  if (!url) return url;
  if (url.includes('hostingersite.com')) {
    return url.replace(/https?:\/\/[^/]+/, 'https://api.biks.online');
  }
  return url;
}

function normalizeVehicle(v: Vehicle): Vehicle {
  if (!v) return v;
  return {
    ...v,
    image_url: fixImageUrl(v.image_url),
    gallery: Array.isArray(v.gallery) ? v.gallery.map(fixImageUrl).filter(Boolean) as string[] : v.gallery,
  };
}

export async function fetchVehicles(forceFresh = false): Promise<Vehicle[]> {
  const now = Date.now();
  if (!forceFresh && vehiclesCache && (now - vehiclesCache.timestamp < CACHE_TTL_MS)) {
    // Return instant cached data and revalidate silently if older than 15s
    if (now - vehiclesCache.timestamp > 15000) {
      fetch(`${API_BASE}/vehicles`)
        .then(res => res.ok ? res.json() : null)
        .then(raw => { if (raw) vehiclesCache = { data: raw.map(normalizeVehicle), timestamp: Date.now() }; })
        .catch(() => {});
    }
    return vehiclesCache.data;
  }

  const res = await fetch(`${API_BASE}/vehicles`);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  const raw: Vehicle[] = await res.json();
  const data = raw.map(normalizeVehicle);
  vehiclesCache = { data, timestamp: Date.now() };
  return data;
}

export async function fetchVehicle(id: string): Promise<Vehicle | null> {
  // Quick check in cache first
  if (vehiclesCache) {
    const cached = vehiclesCache.data.find(v => v.id === id);
    if (cached) return cached;
  }
  const res = await fetch(`${API_BASE}/vehicles/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch vehicle');
  const raw = await res.json();
  return normalizeVehicle(raw);
}

export async function createVehicle(formData: FormData): Promise<Vehicle> {
  const res = await authFetch('/vehicles', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create vehicle' }));
    throw new Error(err.error || 'Failed to create vehicle');
  }
  invalidateVehiclesCache();
  const raw = await res.json();
  return normalizeVehicle(raw);
}

export async function updateVehicle(id: string, formData: FormData): Promise<Vehicle> {
  const res = await authFetch(`/vehicles/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update vehicle' }));
    throw new Error(err.error || 'Failed to update vehicle');
  }
  invalidateVehiclesCache();
  const raw = await res.json();
  return normalizeVehicle(raw);
}

export async function deleteVehicle(id: string): Promise<void> {
  const res = await authFetch(`/vehicles/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to delete vehicle' }));
    throw new Error(err.error || 'Failed to delete vehicle');
  }
  invalidateVehiclesCache();
}

// ============================================================================
// Categories API
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const now = Date.now();
  if (categoriesCache && (now - categoriesCache.timestamp < CACHE_TTL_MS)) {
    return categoriesCache.data;
  }

  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    categoriesCache = { data, timestamp: Date.now() };
    return data;
  } catch (err) {
    console.error('Error fetching categories from API, using fallback defaults:', err);
    return [
      { id: '1', name: 'Trucks', slug: 'trucks', order: 1 },
      { id: '2', name: 'Cars', slug: 'cars', order: 2 },
      { id: '3', name: 'Tyre Shover', slug: 'tyre-shover', order: 3 },
      { id: '4', name: 'Forklifts', slug: 'forklifts', order: 4 },
      { id: '5', name: 'Agricultural Machines', slug: 'agricultural-machines', order: 5 },
      { id: '6', name: 'Truck Fixtures', slug: 'truck-fixtures', order: 6 },
      { id: '7', name: 'Other Parts', slug: 'other-parts', order: 7 },
    ];
  }
}

export async function createCategory(name: string): Promise<Category> {
  const res = await authFetch('/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create category' }));
    throw new Error(err.error || 'Failed to create category');
  }
  invalidateCategoriesCache();
  return res.json();
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  const res = await authFetch(`/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update category' }));
    throw new Error(err.error || 'Failed to update category');
  }
  invalidateCategoriesCache();
  invalidateVehiclesCache();
  return res.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await authFetch(`/categories/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to delete category' }));
    throw new Error(err.error || 'Failed to delete category');
  }
  invalidateCategoriesCache();
  invalidateVehiclesCache();
}

// ============================================================================
// Auth & Token Management API
// ============================================================================

export function getToken(): string | null {
  return localStorage.getItem('biks_token');
}

export function getUser(): string | null {
  return localStorage.getItem('biks_user');
}

export function logout(): void {
  localStorage.removeItem('biks_token');
  localStorage.removeItem('biks_user');
  invalidateVehiclesCache();
  invalidateCategoriesCache();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Checks if a JWT token is expired or within margin of expiring.
 */
export function isTokenExpiredOrNearExp(token: string | null, marginSeconds = 300): boolean {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;
    const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(decodedJson);
    if (!payload.exp) return false;
    const nowSec = Math.floor(Date.now() / 1000);
    return (payload.exp - nowSec) < marginSeconds;
  } catch {
    return false;
  }
}

/**
 * Exchange current token for a fresh 30-day token.
 */
export async function refreshToken(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('biks_token', data.token);
      if (data.email) localStorage.setItem('biks_user', data.email);
      return data.token;
    }
    return null;
  } catch (err) {
    console.error('Failed to auto-refresh token:', err);
    return null;
  }
}

/**
 * Returns a guaranteed valid token, automatically refreshing if close to expiry.
 */
export async function getValidToken(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;
  if (isTokenExpiredOrNearExp(token)) {
    const refreshed = await refreshToken();
    if (refreshed) return refreshed;
  }
  return token;
}

/**
 * Authenticated fetch with automatic token injection, silent auto-refresh, and retry.
 */
export async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  let token = await getValidToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // If 401, attempt silent refresh once and retry transparently
  if (res.status === 401) {
    const freshToken = await refreshToken();
    if (freshToken) {
      headers.set('Authorization', `Bearer ${freshToken}`);
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
    }

    // If still 401, notify UI to show non-intrusive re-auth modal without losing form inputs
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('biks:session_expired'));
      }
    }
  }

  return res;
}

export async function login(email: string, password: string): Promise<{ token: string; email: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Invalid credentials' }));
    throw new Error(err.error || 'Login failed');
  }
  const data = await res.json();
  localStorage.setItem('biks_token', data.token);
  localStorage.setItem('biks_user', data.email);
  return data;
}

export async function getAdminProfile(): Promise<{ email: string }> {
  const res = await authFetch('/auth/profile');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch profile' }));
    throw new Error(err.error || 'Failed to fetch profile');
  }
  return res.json();
}

export async function updateAdminProfile(payload: {
  email?: string;
  password?: string;
}): Promise<{ message: string; email: string; token: string }> {
  const res = await authFetch('/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update credentials' }));
    throw new Error(err.error || 'Failed to update credentials');
  }
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('biks_token', data.token);
  }
  if (data.email) {
    localStorage.setItem('biks_user', data.email);
  }
  return data;
}

export async function verifyToken(): Promise<boolean> {
  const token = await getValidToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ============================================================================
// Sell Requests API
// ============================================================================

export async function submitSellRequest(input: CreateSellRequestInput): Promise<{ message: string; request: SellRequest }> {
  const formData = new FormData();
  formData.append('customer_name', input.customer_name);
  formData.append('email', input.email);
  formData.append('phone', input.phone);
  formData.append('address', input.address);
  if (input.category) formData.append('category', input.category);
  formData.append('description', input.description);

  if (input.images && input.images.length > 0) {
    input.images.forEach((file) => {
      formData.append('images', file);
    });
  }

  const res = await fetch(`${API_BASE}/sell-requests`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to submit request' }));
    throw new Error(err.error || 'Failed to submit request');
  }

  return res.json();
}

export async function fetchSellRequests(status?: string): Promise<SellRequest[]> {
  const url = status && status !== 'all'
    ? `/sell-requests?status=${encodeURIComponent(status)}`
    : '/sell-requests';
  const res = await authFetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch sell requests' }));
    throw new Error(err.error || 'Failed to fetch sell requests');
  }
  return res.json();
}

export async function updateSellRequest(
  id: string,
  updates: { status?: SellRequestStatus; admin_notes?: string }
): Promise<SellRequest> {
  const res = await authFetch(`/sell-requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update request' }));
    throw new Error(err.error || 'Failed to update request');
  }
  return res.json();
}

export async function deleteSellRequest(id: string): Promise<void> {
  const res = await authFetch(`/sell-requests/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to delete request' }));
    throw new Error(err.error || 'Failed to delete request');
  }
}
