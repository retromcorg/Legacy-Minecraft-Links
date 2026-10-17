// Checks the link data files (no network)
//   node scripts/validate-links.mjs [file]    default: links.json, mod_links.json and plugin_links.json
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { loadLinks, validateLinks } from './lib/validate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = process.argv[2] ? [resolve(process.argv[2])] : ['links.json', 'mod_links.json', 'plugin_links.json'].map((f) => join(root, 'data', f));
const publicDir = join(root, 'public'); // only the site repo has one. it is used to check internal pages

let failed = false;
for (const file of files) {
  let data;
  try {
    data = loadLinks(file);
  } catch (err) {
    console.error(`Could not read ${file}
  ${err.message}`);
    failed = true;
    continue;
  }

  const { errors, warnings, count } = validateLinks(data, existsSync(publicDir) ? publicDir : undefined);
  for (const w of warnings) console.log(`warning  ${w}`);
  if (errors.length) {
    console.error(`
${errors.length} problem(s) in ${file}:`);
    for (const e of errors) console.error(`  ${e}`);
    failed = true;
    continue;
  }
  console.log(`
${count} links in ${data.sections.length} sections look good in ${file}${warnings.length ? ` (${warnings.length} warnings)` : ''}.`);
}
if (failed) process.exit(1);
