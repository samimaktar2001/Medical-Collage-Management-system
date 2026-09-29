# API contract

Base: `/api/v1`. Backend authority remains mandatory. `GET /auth/me` returns scoped identity plus a CSRF token. The opaque session token lives only in an HttpOnly cookie; only its SHA-256 hash is stored. Mutations require exact `Origin` plus `X-CSRF-Token`. The development login also requires `X-Requested-With: medora`.

List endpoints use `q`, `status`, `page`, `limit` (core maximum 100). Responses contain `items,total,page,limit`; learning lists use fixed 20. Unsupported status/search fields are ignored by the core list, so filter capability is reflected in UI configuration. Backend sort is stable, predefined and not client SQL.

Actions: `POST /<resource>/<id>/<action>` with `{version,reason?,data?}`. `enroll`, `record-payment`, `approve-refund` also require an `Idempotency-Key`, scoped by institution/actor/operation and request hash. Conflicts return 409. The UI generates an operation key per attempt; persisted same-key retry is available at the API, while an uncertain browser retry can encounter a safe stale-version conflict and must reopen the record.

Actions include application start-review/verify/clarify/approve/enroll; session conduct/cancel/save-register/finalize; correction approve; assessment save-marks/submit/moderate/publish/revoke; logbook verify/return/reject/resubmit; invoice record-payment; refund approve-refund/complete; content edit/submit/publish/return/archive/revise; ticket assign/resolve; policy approve; learning extend; submission review; request approve/reject. UI forms and runtime schemas define action-specific payloads. Complete generated action contracts remain pending.

`POST /applications/import`: `{source_batch,rows}` up to 1,000 rows. Each row commits independently; rejected row outcomes are returned. `external_ref` uniqueness protects re-import. Imports never automatically approve/enrol candidates.

Errors: `{error:{code,message,correlation_id}}`. 401 session; 403 scope/CSRF; 404 hidden or absent record; 409 state/version/capacity/idempotency; 422 validation; 429 rate limit. SQL/stack details are not returned to clients.

`npm run contracts` generates OpenAPI creation schemas and input types from Zod; `npm run contracts:check` detects drift. The browser transport is presently generic and not a fully generated typed client. Learning/action/identity contracts are not fully included in OpenAPI yet.
