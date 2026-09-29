# ADR 001 — runnable local development before production integration

The supplied machine has Node but no available Docker/PostgreSQL CLI. The application uses PGlite for a real disk-backed PostgreSQL development store and the `pg` adapter for an optional server database. SQL is parameterized and constrained in reviewed migrations. This avoids replacing persistence with browser storage or JSON files.

The required Node server architecture is retained instead of converting it to a Cloudflare Sites application. No deployment was attempted. A fictional institutional identity and obvious synthetic data labels are used. Development identity selection is accepted only while production startup is blocked.

Official references checked: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [NestJS first steps](https://docs.nestjs.com/first-steps), [PGlite filesystems](https://pglite.dev/docs/filesystems). Installed Next.js documentation in `node_modules/next/dist/docs` was also read. Exact resolved dependency versions are in the lockfile.

The baseline uses native controls and custom CSS for the initial application. Adopting the specified component/table libraries, Prisma and pnpm remains a tracked architectural deviation. Production capabilities must not be enabled merely by changing an environment flag.
