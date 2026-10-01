import { PGlite } from '@electric-sql/pglite';
import { Pool, PoolClient } from 'pg';
import { readFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
export interface SQL {
  query<T = Record<string, any>>(sql: string, args?: unknown[]): Promise<{ rows: T[] }>;
}
export class Database implements SQL {
  private engine: PGlite | Pool;
  constructor(path = process.env.DATA_DIR || '.data/postgres') {
    if (!process.env.DATABASE_URL && existsSync('.env')) {
      try {
        (process as any).loadEnvFile?.('.env');
      } catch { }
    }
    if (!process.env.DATABASE_URL && path !== 'memory://')
      mkdirSync(dirname(path), { recursive: true });
    this.engine = process.env.DATABASE_URL
      ? new Pool({ connectionString: process.env.DATABASE_URL })
      : new PGlite(path);
  }
  async query<T = Record<string, any>>(sql: string, args: unknown[] = []): Promise<{ rows: T[] }> {
    if (this.engine instanceof PGlite) return (await this.engine.query(sql, args)) as { rows: T[] };
    return (await this.engine.query(sql, args)) as unknown as { rows: T[] };
  }
  async transaction<T>(fn: (tx: SQL) => Promise<T>): Promise<T> {
    if (this.engine instanceof PGlite) return this.engine.transaction((tx) => fn(tx as SQL));
    const client: PoolClient = await this.engine.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
  async migrate() {
    await this.query(
      'CREATE TABLE IF NOT EXISTS schema_migrations(name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())',
    );
    await this.transaction(async (tx) => {
      await tx.query('LOCK TABLE schema_migrations IN EXCLUSIVE MODE');
      for (const file of readdirSync('packages/database/migrations')
        .filter((f) => f.endsWith('.sql'))
        .sort()) {
        const sql = readFileSync('packages/database/migrations/' + file, 'utf8'),
          checksum = createHash('sha256').update(sql).digest('hex');
        const previous = (
          await tx.query('SELECT checksum FROM schema_migrations WHERE name=$1', [file])
        ).rows[0];
        if (previous) {
          if (previous.checksum !== checksum) throw new Error('Applied migration changed: ' + file);
          continue;
        }
        for (const statement of sql
          .split(';')
          .map((s) => s.trim())
          .filter(Boolean))
          await tx.query(statement);
        await tx.query('INSERT INTO schema_migrations(name,checksum) VALUES ($1,$2)', [
          file,
          checksum,
        ]);
      }
    });
  }
  async close() {
    if (this.engine instanceof PGlite) await this.engine.close();
    else await this.engine.end();
  }
}
