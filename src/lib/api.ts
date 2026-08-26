// ============================================================================
// BIKS API Client — Replaces Supabase client
// ============================================================================

const API_BASE = 'http://localhost:5000/api';

// ============================================================================
// Types (unchanged from old supabase.ts)
// ============================================================================

export type VehicleStatus = 'Available' | 'Reserved' | 'Sold' | 'In Transit' | 'Delivered';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
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

// ============================================================================
// Vehicle API
// ============================================================================

export async function fetchVehicles(): Promise<Vehicle[]> {
  const res = await fetch(`${API_BASE}/vehicles`);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

export async function fetchVehicle(id: string): Promise<Vehicle | null> {
  const res = await fetch(`${API_BASE}/vehicles/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch vehicle');
  return res.json();
}

export async function createVehicle(formData: FormData): Promise<Vehicle> {
  const res = await fetch(`${API_BASE}/vehicles`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to create vehicle');
  }
  return res.json();
}

export async function updateVehicle(id: string, formData: FormData): Promise<Vehicle> {
  const res = await fetch(`${API_BASE}/vehicles/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to update vehicle');
  }
  return res.json();
}

export async function deleteVehicle(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/vehicles/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to delete vehicle');
  }
}

// ============================================================================
// Auth API
// ============================================================================

export async function login(username: string, password: string): Promise<{ token: string; username: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Invalid credentials' }));
    throw new Error(err.error || 'Login failed');
  }
  const data = await res.json();
  localStorage.setItem('biks_token', data.token);
  localStorage.setItem('biks_user', data.username);
  return data;
}

export function getToken(): string | null {
  return localStorage.getItem('biks_token');
}

export function getUser(): string | null {
  return localStorage.getItem('biks_user');
}

export function logout(): void {
  localStorage.removeItem('biks_token');
  localStorage.removeItem('biks_user');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function verifyToken(): Promise<boolean> {
  const token = getToken();
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
