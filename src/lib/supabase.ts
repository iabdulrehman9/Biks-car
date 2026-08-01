import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
