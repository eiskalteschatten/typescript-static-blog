import path from 'node:path';
import fs from 'node:fs';

import { CachedTag } from '@/interfaces/tag.interface';

const cacheDirectory = path.resolve(process.cwd(), '.cache', 'tags');

export default class Tags {
  static async getAllTags(): Promise<CachedTag[]> {
    const cacheFile = path.resolve(cacheDirectory, 'allTags.json');
    const fileContent = await fs.promises.readFile(cacheFile, 'utf8');

    try {
      const tags = JSON.parse(fileContent) as CachedTag[];
      return tags;
    }
    catch (error) {
      console.error(error);
    }
  }
}