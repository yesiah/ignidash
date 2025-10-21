/**
 * 🔥 Demo Input Data
 *
 * This file contains prebuilt QuickPlanInputs demos for Ignidash.
 *
 * To add a new demo:
 * 1. Run your app and log a QuickPlanInputs object (e.g. `console.log(JSON.stringify(inputs, null, 2))`)
 * 2. Copy the JSON output into `demo-log.json` in the project root
 * 3. Run one of the following:
 *      npm run demo demoInputsX
 *         — or —
 *      npx tsx scripts/convert-demo-json-to-ts.ts demoInputsX
 *
 *    (replace `demoInputsX` with your desired export name)
 *
 * The script will append a new typed export to this file automatically.
 * Source script: /scripts/convert-demo-json-to-ts.ts
 */

import fs from 'fs';
import path from 'path';

const INPUT_PATH = path.resolve('./demo-log.json'); // your JSON dump
const OUTPUT_PATH = path.resolve('./src/lib/stores/demo-inputs-data.ts');
const demoName = process.argv[2] || 'demoInputsNew';

// Regex for valid TS identifiers (letters, numbers, _, $, but not starting with number)
const validIdentifierRegex = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function formatAsTsExport(obj: unknown, name: string): string {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Input JSON must be a non-null object.');
  }

  // Step 1. Serialize to JSON with indentation
  let json = JSON.stringify(obj, null, 2);

  // Step 2. Selectively unquote valid identifiers only
  json = json.replace(/"([^"]+)":/g, (_, key: string) => {
    return validIdentifierRegex.test(key) ? `${key}:` : `'${key}':`;
  });

  // Step 3. Convert all remaining double quotes to single quotes
  json = json.replace(/"/g, `'`);

  return `\n\nexport const ${name}: QuickPlanInputs = ${json};\n`;
}

function ensureImportHeader(content: string): string {
  const header = `import type { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';\n`;
  return content.includes('QuickPlanInputs') ? content : `${header}\n${content}`;
}

function run(): void {
  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`❌ Input file not found: ${INPUT_PATH}`);
    process.exit(1);
  }

  let parsed: unknown;
  try {
    const jsonText = fs.readFileSync(INPUT_PATH, 'utf8');
    parsed = JSON.parse(jsonText);
  } catch (err) {
    console.error('❌ Failed to parse JSON:', err);
    process.exit(1);
  }

  const newExport = formatAsTsExport(parsed, demoName);

  // Ensure the file exists, or initialize it
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.writeFileSync(OUTPUT_PATH, ensureImportHeader(`// Auto-generated demo inputs\n${newExport}`));
    console.log(`✅ Created new file and wrote ${demoName} to ${OUTPUT_PATH}`);
    return;
  }

  // Append safely to existing file
  const existing = fs.readFileSync(OUTPUT_PATH, 'utf8');
  const updated = ensureImportHeader(existing) + newExport;

  fs.writeFileSync(OUTPUT_PATH, updated);
  console.log(`✅ Appended ${demoName} to ${OUTPUT_PATH}`);
}

run();
