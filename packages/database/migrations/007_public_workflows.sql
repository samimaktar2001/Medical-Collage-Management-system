-- ============================================================================
-- Migration 007: Public Workflows (Appointments & Official Inquiries)
-- Live PostgreSQL database support for public portal & hospital OPD queue
-- ============================================================================

CREATE TABLE IF NOT EXISTS opd_appointments (
  id text PRIMARY KEY,
  token_number text NOT NULL,
  opd_slip_id text NOT NULL UNIQUE,
  department text NOT NULL,
  doctor_name text NOT NULL,
  patient_name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  phone text NOT NULL,
  uhid text,
  slot text NOT NULL,
  appointment_date date NOT NULL,
  symptoms text,
  status text NOT NULL DEFAULT 'Waiting',
  reporting_time text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_opd_appointments_date ON opd_appointments (appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_opd_appointments_phone ON opd_appointments (phone);
CREATE INDEX IF NOT EXISTS idx_opd_appointments_slip ON opd_appointments (opd_slip_id);

CREATE TABLE IF NOT EXISTS public_inquiries (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('contact', 'admission', 'emergency')),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  category text,
  neet_score text,
  subject text,
  message text,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Resolved')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_public_inquiries_type ON public_inquiries (type, status);
CREATE INDEX IF NOT EXISTS idx_public_inquiries_email ON public_inquiries (email);
