import { execSync } from 'node:child_process';

const isApiOnly = Boolean(
  process.env.RENDER ||
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.BUILD_TARGET === 'api' ||
  process.argv.includes('--api-only')
);

console.log('[Build] Compiling API (TypeScript)...');
execSync('node --max-old-space-size=1024 ./node_modules/typescript/bin/tsc -p apps/api/tsconfig.json', {
  stdio: 'inherit',
});

if (!isApiOnly) {
  console.log('[Build] Building Web (Next.js)...');
  execSync('node_modules/next/dist/bin/next build apps/web', { stdio: 'inherit' });
} else {
  console.log('[Build] Skipping Web build on cloud API host to conserve memory.');
}
