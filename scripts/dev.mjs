import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');
const production = process.argv.includes('--production');
const environment = { ...process.env, ...(production ? { NODE_ENV: 'production' } : {}) };
const children = [
  spawn(
    process.execPath,
    production ? ['dist/api/main.js'] : ['node_modules/tsx/dist/cli.mjs', 'apps/api/src/main.ts'],
    { stdio: 'inherit', env: environment },
  ),
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
];
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
