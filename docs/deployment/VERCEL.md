# Vercel Deployment Guide (Frontend Web App)

This guide details how to deploy `apps/web` on [Vercel](https://vercel.com) connected to GitHub for automatic continuous deployment on push.

---

## 1. Import Repository in Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** → **Project**.
3. Import your repository: `samimaktar2001/Medical-Collage-Management-system`.

---

## 2. Project Build Configuration

In the **Configure Project** screen:

- **Framework Preset**: `Next.js`
- **Root Directory**: `./` (leave as root, since root `package.json` contains dependencies)
- **Build Command**: `npm run build:web`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `npm install`

*(Note: `vercel.json` in the root repository already configures these defaults automatically).*

---

## 3. Environment Variables (in Vercel Project Settings)

Add the following environment variables:

| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `API_INTERNAL_URL` | `https://your-api.up.railway.app` | Destination for Next.js server-side `/api/v1/:path*` rewrites. |
| `NEXT_PUBLIC_API_URL` | `https://your-api.up.railway.app` | Client-side CSP & fallback direct API endpoint. |
| `NODE_ENV` | `production` | Optimizes Next.js bundle for production. |

---

## 4. Deploy & Verify

1. Click **Deploy**.
2. Vercel will install dependencies, compile TypeScript, build static pages, and assign your public production URL (e.g., `https://medical-college-samim.vercel.app`).
3. Copy your Vercel URL and add it to Railway's `APP_ORIGIN` variable so that CORS requests are permitted!

---

## 5. Automatic CI/CD Workflow

Once connected:
- Every time you run `git push origin main`, both **Vercel** and **Railway** trigger instant automated builds.
- Vercel deploys the frontend; Railway builds and boots the backend with database migrations.
