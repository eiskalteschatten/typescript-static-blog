import fs from 'node:fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

export function slugify(string) {
  return string
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function downloadImage(imageUrl, destination) {
  const response = await fetch(imageUrl);
  const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
  await finished(Readable.fromWeb(response.body).pipe(fileStream));
}
