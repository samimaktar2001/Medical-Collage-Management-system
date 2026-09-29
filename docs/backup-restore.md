# Backup and restore

Verified: an HTTP-created record and its server session survive termination and restart of the local API using the same disk-backed PostgreSQL data directory. This is **not a backup restore or disaster-recovery drill**.

For an embedded development snapshot, stop the API completely before copying `.data/postgres` to a separate protected directory. Never copy a live embedded database and assume consistency. Keep synthetic development backups separate from source archives and exclude session data from any public export.

For a future server PostgreSQL deployment, use managed continuous backups/PITR plus a controlled logical export where appropriate:

```sh
pg_dump --format=custom --file=academic-backup.dump "$DATABASE_URL"
# Restore only into a NEW disposable database, never a live target:
pg_restore --no-owner --dbname="$RESTORE_DATABASE_URL" academic-backup.dump
```

Protect credentials in the process environment/secret store, encrypt backups, restrict access, include private object versions and audit retention, and test the database/object-store reconciliation boundary. Do not restore authentication sessions into a publicly accessible recovery instance.

Still required: timed production-like restore, record/control-total reconciliation, pending outbox replay, duplicate financial-effect check and measured RPO/RTO against the PRD targets. No measured backup RPO/RTO is claimed.
