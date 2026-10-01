-- 006_clinical_regulatory.sql
-- Database tables for NMC Audit, CRMI Internship, Insurance, Birth/Death, Biomedical Waste, Notifications & Messaging

CREATE TABLE IF NOT EXISTS crmi_internship_logs (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  intern_name text NOT NULL,
  roll_no text NOT NULL,
  department text NOT NULL,
  procedure_code text NOT NULL,
  procedure_name text NOT NULL,
  patient_details text NOT NULL,
  role text NOT NULL CHECK(role IN ('Performed', 'Assisted', 'Observed')),
  date text NOT NULL,
  supervisor text NOT NULL,
  status text NOT NULL DEFAULT 'Pending Sign-off' CHECK(status IN ('Verified', 'Pending Sign-off')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crmi_rotations (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  dept text NOT NULL,
  duration text NOT NULL,
  status text NOT NULL,
  progress integer NOT NULL DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
  color text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS nmc_department_audits (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  dept text NOT NULL,
  opd integer NOT NULL DEFAULT 0,
  ipd_bed text NOT NULL,
  major_ot text NOT NULL DEFAULT '-',
  minor_ot integer NOT NULL DEFAULT 0,
  lab_tests integer NOT NULL DEFAULT 0,
  faculty_aebas text NOT NULL,
  status text NOT NULL DEFAULT 'Compliant',
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS insurance_claims (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  patient_name text NOT NULL,
  scheme text NOT NULL,
  pre_auth_no text NOT NULL,
  abha_id text NOT NULL,
  procedure_package text NOT NULL,
  package_cost text NOT NULL,
  ward_bed text NOT NULL,
  pre_auth_status text NOT NULL DEFAULT 'Under Review' CHECK(pre_auth_status IN ('Approved', 'Under Review', 'Settled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS birth_registry (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  crs_no text NOT NULL,
  baby_details text NOT NULL,
  mother_name text NOT NULL,
  father_name text NOT NULL,
  delivery_type text NOT NULL,
  attending_obgyn text NOT NULL,
  crs_status text NOT NULL DEFAULT 'CRS Registered',
  date_time text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS death_registry (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  patient_name text NOT NULL,
  age_gender text NOT NULL,
  ward_bed text NOT NULL,
  immediate_cause text NOT NULL,
  underlying_cause text NOT NULL,
  icd10 text NOT NULL,
  doctor text NOT NULL,
  audit_status text NOT NULL DEFAULT 'M&M Audited',
  date_time text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mlc_registry (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  mlc_no text NOT NULL,
  patient_name text NOT NULL,
  age_gender text NOT NULL,
  incident_type text NOT NULL,
  police_station text NOT NULL,
  brought_by text NOT NULL,
  examining_cmo text NOT NULL,
  status text NOT NULL DEFAULT 'Police Acknowledged',
  date_time text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS biomedical_waste_logs (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  barcode text NOT NULL,
  category text NOT NULL CHECK(category IN ('Yellow', 'Red', 'White', 'Blue')),
  ward text NOT NULL,
  weight_kg numeric(6, 2) NOT NULL,
  handler text NOT NULL,
  cbwtf_manifest_no text NOT NULL,
  status text NOT NULL DEFAULT 'Logged' CHECK(status IN ('Logged', 'Dispatched', 'Incinerated', 'Autoclaved')),
  logged_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinical_notifications (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  title text NOT NULL,
  message text NOT NULL,
  category text NOT NULL,
  priority text NOT NULL CHECK(priority IN ('high', 'medium', 'low')),
  time text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  icon_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinical_threads (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  name text NOT NULL,
  role text NOT NULL,
  department text NOT NULL,
  unread integer NOT NULL DEFAULT 0,
  avatar text NOT NULL,
  status text NOT NULL DEFAULT 'online'
);

CREATE TABLE IF NOT EXISTS clinical_messages (
  id text PRIMARY KEY,
  institution_id text NOT NULL REFERENCES institutions(id),
  thread_id text NOT NULL REFERENCES clinical_threads(id),
  sender text NOT NULL,
  text text NOT NULL,
  time text NOT NULL,
  priority text NOT NULL DEFAULT 'normal' CHECK(priority IN ('normal', 'urgent', 'stat')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS crmi_log_inst_idx ON crmi_internship_logs(institution_id, status);
CREATE INDEX IF NOT EXISTS insurance_inst_idx ON insurance_claims(institution_id, pre_auth_status);
CREATE INDEX IF NOT EXISTS bmw_inst_idx ON biomedical_waste_logs(institution_id, category);
CREATE INDEX IF NOT EXISTS notif_inst_idx ON clinical_notifications(institution_id, read);
CREATE INDEX IF NOT EXISTS msg_thread_idx ON clinical_messages(thread_id, created_at);
