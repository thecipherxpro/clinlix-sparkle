#!/usr/bin/env node

/**
 * Translation extraction script
 * This script scans the codebase for translation keys and updates translation files
 * 
 * Usage: node scripts/extract-translations.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const LANGUAGES = ['en', 'es', 'fr', 'pt-PT', 'ar'];

// Regular expressions to find translation keys
const T_FUNCTION_REGEX = /t\(['"`]([^'"`]+)['"`]/g;
const USE_TRANSLATION_REGEX = /useTranslation\(\[?['"`]([^'"`]+)['"`]\]?\)/g;

let foundKeys = new Set();

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find all t() function calls
  let match;
  while ((match = T_FUNCTION_REGEX.exec(content)) !== null) {
    foundKeys.add(match[1]);
  }
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

function analyzeTranslations() {
  console.log('🔍 Scanning source files for translation keys...\n');
  scanDirectory(SRC_DIR);
  
  console.log(`✅ Found ${foundKeys.size} unique translation keys\n`);
  
  // Group keys by namespace
  const keysByNamespace = {};
  foundKeys.forEach(key => {
    const [namespace, ...rest] = key.split(':');
    const actualKey = rest.length > 0 ? rest.join(':') : key;
    const ns = rest.length > 0 ? namespace : 'common';
    
    if (!keysByNamespace[ns]) {
      keysByNamespace[ns] = new Set();
    }
    keysByNamespace[ns].add(actualKey);
  });
  
  console.log('📊 Keys by namespace:');
  Object.entries(keysByNamespace).forEach(([ns, keys]) => {
    console.log(`  ${ns}: ${keys.size} keys`);
  });
  
  console.log('\n📝 Sample keys found:');
  Array.from(foundKeys).slice(0, 10).forEach(key => {
    console.log(`  - ${key}`);
  });
  
  if (foundKeys.size > 10) {
    console.log(`  ... and ${foundKeys.size - 10} more`);
  }
  
  console.log('\n💡 To add missing keys to translation files:');
  console.log('   1. Update public/locales/en/*.json with new keys');
  console.log('   2. Copy the structure to other language files');
  console.log('   3. Translate the values appropriately\n');
}

// Run the script
analyzeTranslations();
