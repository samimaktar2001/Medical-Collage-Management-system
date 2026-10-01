# Render.com Free Deployment Guide (Backend API)

[Render](https://render.com) offers a **100% Free Web Service tier** (750 free hours/month, SSL included, zero credit card required).

---

## 1. Connect GitHub Repository to Render

1. Go to [render.com](https://render.com) and click **GET STARTED FOR FREE** (or Sign In with GitHub).
2. On your Render Dashboard, click **New +** (top right) → select **Web Service**.
3. Select **Build and deploy from a Git repository** → click **Next**.
4. Choose your repository: `samimaktar2001/Medical-Collage-Management-system`.

---

## 2. Configure Service Settings

Set the following parameters in the creation screen:

- **Name**: `medora-college-api` (or any name you prefer)
- **Region**: `Singapore` (closest to India/Bangladesh for fastest latency)
- **Branch**: `main`
- **Root Directory**: *(leave blank / default)*
- **Runtime**: `Node`
- **Build Command**: `npm run build:api`
- **Start Command**: `npm run start:api`
- **Instance Type**: Select **Free** ($0/month)

Under **Advanced**:
- **Health Check Path**: `/health`
- **Auto-Deploy**: `Yes` (Triggered on every `git push origin main`)

---

## 3. Environment Variables (in Render Dashboard)

Add these environment variables under the **Environment Variables** section:

| Key | Value | Note |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `HOST` | `0.0.0.0` | Listen on all interfaces |
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres` | Supabase pooler connection URI |
| `APP_ORIGIN` | `https://your-app.vercel.app` | Your Vercel frontend URL |
| `COOKIE_SAME_SITE` | `none` | Allows session cookies across domains |
| `ENABLE_DEMO_LOGIN`| `false` | Security requirement |
| `DEMO_MODE` | `false` | Security requirement |
| `S3_REGION` | `ap-south-1` | Supabase Storage region |
| `S3_ENDPOINT` | `https://[REF].supabase.co/storage/v1/s3` | Supabase Storage endpoint |
| `S3_BUCKET` | `medora-documents` | Bucket name |
| `S3_ACCESS_KEY_ID`| `your_supabase_s3_key` | From Supabase Storage settings |
| `S3_SECRET_ACCESS_KEY`| `your_supabase_s3_secret` | From Supabase Storage settings |
| `S3_FORCE_PATH_STYLE` | `true` | Required for Supabase |
| `SMTP_HOST` | `smtp.gmail.com` | Email host |
| `SMTP_PORT` | `587` | Email port |
| `SMTP_USER` | `your_email@gmail.com` | Email user |
| `SMTP_PASS` | `your_app_password` | Gmail 16-character App Password |
| `SMTP_FROM` | `"Medora Medical College" <noreply@medora.edu.in>` | Sender name |

> [!NOTE]
> Do NOT set `PORT` in Render. Render automatically assigns `PORT=10000` and forwards external traffic to it.

---

## 4. Deploy & Get Your Free Backend URL

1. Click **Create Web Service**.
2. Render will run `npm run build:api`, run database migrations, and launch your API.
3. You will get a free permanent URL:
   ```
   https://medora-college-api.onrender.com
   ```
4. Test the health endpoint in your browser or curl:
   ```
   https://medora-college-api.onrender.com/health
   # Returns: {"status":"ok","uptime":15,"timestamp":"..."}
   ```
5. Copy this URL and set it as `API_INTERNAL_URL` and `NEXT_PUBLIC_API_URL` in **Vercel**!
