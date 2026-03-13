/**
 * Unified build script — produces both the Vite SPA and the Astro docs
 * in a single `dist/` output directory.
 *
 * 1. Builds the root Vite app → dist/
 * 2. Installs docs dependencies (if needed)
 * 3. Builds the Astro docs → docs/dist/
 * 4. Copies docs/dist/ → dist/docs/
 *
 * Uses only Node built-ins so it works on macOS, Linux, Windows, and Vercel.
 */

import { execSync } from 'node:child_process';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DOCS_DIR = resolve(ROOT, 'docs');
const DIST_DIR = resolve(ROOT, 'dist');
const DOCS_DIST = resolve(DOCS_DIR, 'dist');
const DOCS_OUT = resolve(DIST_DIR, 'docs');

function run(cmd, cwd = ROOT) {
  console.log(`\n> ${cmd}  (cwd: ${cwd})\n`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

// 1. Build the Vite SPA
run('npx vite build');

// 2. Install docs dependencies if node_modules is missing
if (!existsSync(resolve(DOCS_DIR, 'node_modules'))) {
  console.log('\nInstalling docs dependencies...');
  run('npm install', DOCS_DIR);
}

// 3. Build the Astro docs
run('npx astro build', DOCS_DIR);

// 4. Copy docs output into dist/docs
console.log(`\nCopying docs build → ${DOCS_OUT}`);
cpSync(DOCS_DIST, DOCS_OUT, { recursive: true });

console.log('\nBuild complete ✓');
