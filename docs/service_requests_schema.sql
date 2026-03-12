-- service_requests table schema for AirTax Financial

CREATE TABLE IF NOT EXISTS service_requests (
  id TEXT PRIMARY KEY,
  service_key TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  payment_status TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes to support lookups and ordering
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_requests_email ON service_requests (email);

