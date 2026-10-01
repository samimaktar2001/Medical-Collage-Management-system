import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');
const production = process.argv.includes('--production');
const environment = { ...process.env, ...(production ? { NODE_ENV: 'production' } : {}) };

const isCloud = Boolean(
  process.env.RENDER ||
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.PORT ||
  process.argv.includes('--api-only')
);

const children = [
  spawn(
    process.execPath,
    production
      ? ['--max-old-space-size=380', 'dist/api/main.js']
      : ['node_modules/tsx/dist/cli.mjs', 'watch', 'apps/api/src/main.ts'],
    { stdio: 'inherit', env: environment },
  ),
];

if (!isCloud) {
  children.push(
    spawn(
      process.execPath,
      [
        'node_modules/next/dist/bin/next',
        production ? 'start' : 'dev',
        'apps/web',
        '--hostname',
        '127.0.0.1',
      ],
      { stdio: 'inherit', env: environment },
    ),
  );
}
function stop() {
  for (const child of children) child.kill();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
children.forEach((child) =>
  child.on('exit', (code) => {
    if (code) {
      stop();
      process.exit(code);
    }
  }),
);
