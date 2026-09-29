# Maintenance

Before real-data use, assign named owners and approve a calendar. The following is a proposed runbook, not an active automation.

- Daily: service health, backup status, failed events, provider reconciliation, storage and unresolved tickets.
- Weekly: access changes, data quality, failed reviews and support themes.
- Monthly: dependency/security advisory review, runtime support, capacity and cost review; update via reviewed changes and regression tests.
- Quarterly: isolated restore exercise, privileged access review and incident rehearsal.
- Before an academic cycle: approve versioned curriculum, attendance/assessment policies, seats/quotas, fee plans and public disclosures.
- Before a release: locked install, contracts drift, lint/typecheck/tests/build, security and migration review, documented rollback and staged UAT.

No recurring automation has been created. Do not silently upgrade major versions. Track provider secrets and credential expiry outside the repository. Data retention/deletion/legal-hold rules require institutional approval.
