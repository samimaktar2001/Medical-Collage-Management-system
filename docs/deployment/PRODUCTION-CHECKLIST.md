# Production Readiness & Deployment Checklist

## Pre-Deployment Verification

- [x] TypeScript typechecking passes across all apps (`npm run typecheck` → Exit code 0).
- [x] ESLint validation passes (`npm run lint` → Exit code 0).
- [x] Contracts sync passes (`npm run contracts:check` → Exit code 0).
- [x] Frontend Next.js production build succeeds (`npm run build:web` → Exit code 0, 60 routes statically optimized).
- [x] Backend NestJS API build succeeds (`npm run build:api` → Exit code 0).
- [x] Dynamic PORT binding implemented (`process.env.PORT || process.env.API_PORT || 4000`).
- [x] Host set to `0.0.0.0` for container & cloud proxy routing.
- [x] Dedicated healthcheck endpoints implemented: `/health` and `/health/ready`.
- [x] Reverse proxy trust configured (`app.set('trust proxy', 1)`).
- [x] Configurable production CORS allowlist implemented via `APP_ORIGIN`.
- [x] Cookie SameSite/Secure configured for cross-domain and same-domain production topologies.
- [x] `railway.json` and `vercel.json` deployment manifests added to root.
- [x] Safe `.env.example` created with zero exposed secrets.
- [x] `.env` and `.env*.local` protected in `.gitignore`.

---

## Post-Deployment Verification (Smoke Tests)

Once Railway and Vercel services are running:

1. **API Health**: Hit `https://<railway-url>/health` → should return `{"status":"ok", ...}`.
2. **Database Connectivity**: Hit `https://<railway-url>/health/ready` → should return `{"status":"ok","database":"connected"}`.
3. **Frontend Rendering**: Visit `https://<vercel-url>` → should load homepage and public portal with 0 console errors.
4. **CORS & Authentication**: Visit `https://<vercel-url>/portal` and test signup or staff login.
5. **Session Cookies**: Verify in browser DevTools Network tab that `medora_session` cookie is sent with `HttpOnly; Secure; SameSite=None` or `Lax`.
