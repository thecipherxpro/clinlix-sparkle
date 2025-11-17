/**
 * Migration script to replace all toast calls with banner calls
 * Run this with: npx tsx scripts/migrate-toast-to-banner.ts
 */

import fs from 'fs';
import path from 'path';

function replaceToastInFile(filePath: string): void {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace import statements
  if (content.includes('import { toast } from "sonner"') ||
      content.includes("import { toast } from 'sonner'")) {
    content = content.replace(/import { toast } from ['"]sonner['"]/g, 'import { banner } from "@/hooks/use-banner"');
    modified = true;
  }

  if (content.includes('import { toast } from "@/hooks/use-toast"') ||
      content.includes("import { toast } from '@/hooks/use-toast'")) {
    content = content.replace(/import { toast } from ['"]@\/hooks\/use-toast['"]/g, 'import { banner } from "@/hooks/use-banner"');
    modified = true;
  }

  // Replace toast method calls
  if (content.includes('toast.success(')) {
    content = content.replace(/toast\.success\(/g, 'banner.success(');
    modified = true;
  }

  if (content.includes('toast.error(')) {
    content = content.replace(/toast\.error\(/g, 'banner.error(');
    modified = true;
  }

  if (content.includes('toast.info(')) {
    content = content.replace(/toast\.info\(/g, 'banner.info(');
    modified = true;
  }

  if (content.includes('toast.warning(')) {
    content = content.replace(/toast\.warning\(/g, 'banner.warning(');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

function walkDirectory(dir: string): void {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      walkDirectory(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      replaceToastInFile(filePath);
    }
  }
}

// Start from src directory
const srcDir = path.join(process.cwd(), 'src');
console.log('🔄 Migrating toast to banner...\n');
walkDirectory(srcDir);
console.log('\n✨ Migration complete!');
