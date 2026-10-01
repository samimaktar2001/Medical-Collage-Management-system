# Railway Deployment Guide (Backend API)

This guide details how to deploy `apps/api` on [Railway](https://railway.app) connected to GitHub for automatic zero-downtime deployment on push.

---

## 1. Project Creation in Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your repository: `samimaktar2001/Medical-Collage-Management-system`.
4. Railway will automatically detect the repo and read `railway.json`.

---

## 2. Service Build & Deploy Settings

If customizing the service in Railway dashboard (**Settings** tab):

- **Build Command**: `npm run build:api`
- **Start Command**: `npm run start:api`
- **Healthcheck Path**: `/health`
- **Healthcheck Timeout**: `120` seconds
- **Restart Policy**: `ON_FAILURE` (Max retries: 10)

---

## 3. Environment Variables (Variables tab)

Add the following environment variables in Railway:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Production environment flag | `production` |
| `HOST` | Host to bind | `0.0.0.0` |
| `APP_ORIGIN` | Frontend URL allowed for CORS | `https://your-app.vercel.app` |
| `DATABASE_URL` | Supabase PostgreSQL Connection String (Pooler) | `postgresql://postgres.xxx:pass@aws-0-ap-south-1.pooler.supabase.com:6543/postgres` |
| `S3_REGION` | Supabase S3 region | `ap-south-1` |
| `S3_ENDPOINT` | Supabase S3 endpoint | `https://xxx.supabase.co/storage/v1/s3` |
| `S3_BUCKET` | S3 bucket name | `medora-documents` |
| `S3_ACCESS_KEY_ID` | Supabase Storage S3 access key | *(From Supabase Storage settings)* |
| `S3_SECRET_ACCESS_KEY` | Supabase Storage S3 secret key | *(From Supabase Storage settings)* |
| `S3_FORCE_PATH_STYLE` | Force path style for Supabase/MinIO | `true` |
| `SMTP_HOST` | Email SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP App password | `your-app-password` |
| `SMTP_FROM` | Sender address | `"Medora Medical College" <noreply@medora.edu.in>` |
| `ENABLE_DEMO_LOGIN` | Disable demo quick sign-in in production | `false` |
| `DEMO_MODE` | Disable demo flags | `false` |
| `COOKIE_SAME_SITE` | Cookie policy across domains | `none` |

> [!NOTE]
> Do NOT set `PORT` in Railway. Railway automatically injects the `PORT` variable and forwards traffic to it.

---

## 4. Public Domain Generation

1. Go to **Settings** → **Networking** → Click **Generate Domain**.
2. Railway gives you a public domain like `medical-college-api-production.up.railway.app`.
3. Test your health endpoint:
   ```bash
   curl https://your-service.up.railway.app/health
   # Returns: {"status":"ok","uptime":12,"timestamp":"..."}
   ```
4. Copy this Railway domain—you will need it for Vercel's `API_INTERNAL_URL` and `NEXT_PUBLIC_API_URL`!
