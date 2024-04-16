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
  if (fs.existsSync(destination)) {
    console.error('File already exists:', destination);
    return;
  }

  try {
    const response = await fetch(imageUrl);

    if (response.ok) {
      const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
      await finished(Readable.fromWeb(response.body).pipe(fileStream));
    }
    else {
      console.error('Failed to download image:', imageUrl);
    }
  }
  catch (error) {
    console.error('Failed to download image:', imageUrl, error);
  }
}

export function convertEscapedAscii(string) {
  return string.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
}
