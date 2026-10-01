# Supabase PostgreSQL & S3 Storage Configuration Guide

---

## 1. Supabase PostgreSQL Setup

1. In [supabase.com](https://supabase.com), navigate to your Project Dashboard.
2. Go to **Project Settings** → **Database**.
3. Under **Connection string**, select **URI**.
4. Choose **Connection pooling** (port `6543`) in **Transaction** or **Session** mode.
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
5. Set this URI as `DATABASE_URL` in Railway.

---

## 2. Supabase S3-Compatible Storage Setup

1. In Supabase Dashboard, go to **Storage** → Click **New bucket**.
2. Name the bucket `medora-documents`.
3. Set bucket to **Private** (documents must be authorized via backend presigned URLs).
4. Go to **Project Settings** → **Storage** → Look for **S3 Access Keys**.
5. Click **Generate new key**:
   - Copy **Access Key ID** → set as `S3_ACCESS_KEY_ID` in Railway.
   - Copy **Secret Access Key** → set as `S3_SECRET_ACCESS_KEY` in Railway.
   - Endpoint: `https://[PROJECT-REF].supabase.co/storage/v1/s3` → set as `S3_ENDPOINT` in Railway.
   - Region: Your project region (e.g. `ap-south-1` or `auto`) → set as `S3_REGION` in Railway.
   - `S3_FORCE_PATH_STYLE=true`.

---

## 3. Database Migrations

When `apps/api` boots on Railway, `db.migrate()` automatically executes all `.sql` files in `packages/database/migrations` in strict cryptographic checksum order.
Schema migrations are idempotent and tracked in the `schema_migrations` table.
