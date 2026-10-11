// Checks data/links.json (no network)
// node scripts/validate-links.mjs [file]
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { loadLinks, validateLinks } from './lib/validate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = resolve(process.argv[2] ?? join(root, 'data', 'links.json'));
const publicDir = join(root, 'public'); // only the site repo has one. it is used to check internal pages

let data;
try {
  data = loadLinks(file);
} catch (err) {
  console.error(`Could not read ${file}\n  ${err.message}`);
  process.exit(1);
}

const { errors, warnings, count } = validateLinks(data, existsSync(publicDir) ? publicDir : undefined);
for (const w of warnings) console.log(`warning  ${w}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s) in ${file}:`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`\n${count} links in ${data.sections.length} sections look good${warnings.length ? ` (${warnings.length} warnings)` : ''}.`);
