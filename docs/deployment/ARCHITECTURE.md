# Production Deployment Architecture

```
                    ┌─────────────────────────────────┐
                    │             Vercel              │
                    │            apps/web             │
                    │      Next.js 16 (SSR/Edge)      │
                    │   https://app.yourdomain.com    │
                    └────────────────┬────────────────┘
                                     │ HTTPS (Internal Rewrite or Direct API)
                                     ▼
                    ┌─────────────────────────────────┐
                    │             Railway             │
                    │            apps/api             │
                    │     NestJS API (Node 22)        │
                    │   https://api.yourdomain.com    │
                    └────────┬───────────────┬────────┘
                             │               │
               ┌─────────────┘               └─────────────┐
               ▼                                           ▼
      ┌──────────────────────────────┐            ┌──────────────────────────────┐
      │     Supabase PostgreSQL      │            │   Supabase Object Storage    │
      │   Authoritative Relational   │            │   S3-compatible bucket       │
      │   Database (Port 6543 / 5432)│            │   `medora-documents`         │
      └──────────────────────────────┘            └──────────────────────────────┘
```

## System Responsibilities

| Component | Platform | Primary Role |
| :--- | :--- | :--- |
| **Frontend Web** | **Vercel** | Next.js 16 UI, public portal, SSR, responsive management interface. |
| **Backend API** | **Railway** | NestJS authoritative business logic, RBAC, domain validation, email dispatch, S3 upload coordination. |
| **Database** | **Supabase** | Cloud PostgreSQL with connection pooling and schema migrations. |
| **Object Storage**| **Supabase Storage** | S3-compatible private document storage with backend presigned URL authorization. |
| **CI/CD** | **GitHub Actions** | Automated typechecking, contracts check, linting, and unit/integration verification on every `git push`. |

---

## Security Boundaries & Rules

1. **Authoritative Backend**: The database is never accessed directly from the frontend or browser. All reads and mutations flow through `apps/api`.
2. **Zero Credentials in Browser**: No database credentials, S3 secret access keys, or SMTP passwords exist in the frontend bundle.
3. **No Wildcard CORS**: Cross-Origin requests are strictly restricted to the origins specified in `APP_ORIGIN`.
4. **Dynamic Port Binding**: Railway injects `PORT`; the API listens on `0.0.0.0:${PORT}`.
5. **Session Cookies**: Session cookies use `HttpOnly: true`, `Secure: true`, and `SameSite: none` (for cross-domain HTTPS) or `SameSite: lax` (for same-site custom domain).
6. **Demo Mode Disabled**: In production, `ENABLE_DEMO_LOGIN=false` and `DEMO_MODE=false`.
