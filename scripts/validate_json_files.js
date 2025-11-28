#!/usr/bin/env node
// Walk the repository and ensure every JSON file parses correctly.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const IGNORE_DIRS = new Set(['.git', 'node_modules', '__pycache__']);

function findJsonFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    JSON.parse(content);
    return null;
  } catch (error) {
    return `${filePath}: ${error.message}`;
  }
}

function main() {
  const targets = findJsonFiles(ROOT_DIR);
  const errors = [];
  for (const file of targets) {
    const failure = validateFile(file);
    if (failure) {
      errors.push(failure);
    }
  }

  if (errors.length > 0) {
    console.error(`JSON validation failed for ${errors.length} file(s):`);
    for (const message of errors) {
      console.error(` - ${message}`);
    }
    process.exit(1);
  }

  console.log(`Validated ${targets.length} JSON file(s) successfully.`);
}

main();
