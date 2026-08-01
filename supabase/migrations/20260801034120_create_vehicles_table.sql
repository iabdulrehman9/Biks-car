/*
# Create vehicles table for BIKS Car Trading inventory

1. New Tables
- `vehicles`
  - `id` (uuid, primary key)
  - `make` (text, not null) — e.g. Toyota, Nissan
  - `model` (text, not null) — e.g. Land Cruiser, Skyline
  - `year` (integer, not null) — model year
  - `body_type` (text) — SUV, Sedan, Coupe, Hatchback, Van, Truck
  - `transmission` (text) — Automatic, Manual
  - `fuel_type` (text) — Petrol, Diesel, Hybrid, Electric
  - `engine_cc` (integer) — engine displacement
  - `mileage_km` (integer) — odometer reading
  - `color` (text) — exterior color
  - `price_fob_jpy` (bigint) — FOB price in Japanese Yen
  - `price_fob_usd` (numeric) — FOB price in USD
  - `status` (text, default 'Available') — Available, Reserved, Sold, In Transit, Delivered
  - `location` (text) — current location (e.g. Yokohama, Tokyo)
  - `image_url` (text) — main image URL
  - `gallery` (text[]) — array of additional image URLs
  - `features` (text[]) — array of feature names
  - `featured` (boolean, default false) — show on homepage
  - `description` (text) — marketing description
  - `chassis_no` (text) — chassis number
  - `stock_id` (text) — stock reference
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `vehicles`.
- Public read access (anon + authenticated) since this is a public marketplace.
- No public write — only service role can insert/update (admin managed).
*/

CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  body_type text,
  transmission text,
  fuel_type text,
  engine_cc integer,
  mileage_km integer,
  color text,
  price_fob_jpy bigint,
  price_fob_usd numeric(12,2),
  status text NOT NULL DEFAULT 'Available',
  location text,
  image_url text,
  gallery text[],
  features text[],
  featured boolean NOT NULL DEFAULT false,
  description text,
  chassis_no text,
  stock_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON vehicles(featured);
CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles(make);
CREATE INDEX IF NOT EXISTS idx_vehicles_body_type ON vehicles(body_type);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_vehicles" ON vehicles;
CREATE POLICY "public_read_vehicles" ON vehicles FOR SELECT
  TO anon, authenticated USING (true);
