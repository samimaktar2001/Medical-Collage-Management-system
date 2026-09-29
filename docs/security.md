# Security and release restrictions

This application is a synthetic development environment. `NODE_ENV=production` or `DEMO_MODE=false` causes backend startup to fail. Development identities must never be deployed as a production login. An OIDC/MFA/recovery implementation and security review are still required.

Implemented: random opaque sessions, server token hashing, HttpOnly/SameSite cookies, exact-origin and CSRF validation, session rotation/revocation, live role lookup, bounded request/file sizes, parameterized SQL, allowlisted table mappings, strict unknown-field rejection, optimistic versions, role/relationship scoping, HTML-escaped plain text and scoped file metadata/download checks. Tests include guessed IDs, spoofed role headers, another institution, confidential tickets, unauthorized supervisor and financial access.

Critical writes are audited. Restricted audit history payloads are not serialized through audit detail. Confidential ticket descriptions do not appear in admin search or ordinary ticket detail. Confidential review reasons are redacted in the shared audit entry and retained with the restricted record. The audit store is not yet WORM/tamper-resistant at the infrastructure layer.

File content signatures, type and size are checked; **none of these are malware scanning**. Every upload stays quarantined, with no download, until a future trusted scanner integration marks it clean. No product API can mark a file clean. Obvious patient identifiers are rejected in logbook text, but the heuristic is not a de-identification guarantee.

Outstanding security work: production identity/MFA, comprehensive person/grant/campus scope, distributed rate limits, all sensitive-read audits, CSP nonce rollout, storage encryption and key management, object-store signing, scanner integration, dependency/advisory review, retention/legal holds, penetration test and institutional privacy review. No compliance, accessibility or availability certification is claimed.
