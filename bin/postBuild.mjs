import fs from 'node:fs';
import path from 'node:path';

const cacheDir = path.resolve('.cache');
const buildDateFile = path.resolve(cacheDir, 'buildDate.txt');
const buildDate = new Date().toISOString();

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

fs.writeFileSync(buildDateFile, buildDate);

console.log(`Build date: ${buildDate}`);
