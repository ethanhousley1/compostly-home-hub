import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

function run(cmd, cwd = ROOT) {
  console.log(`\n> ${cmd}  (cwd: ${cwd})\n`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

run('npx vite build');

console.log('\nBuild complete ✓');
