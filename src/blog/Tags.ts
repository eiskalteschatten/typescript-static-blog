import path from 'node:path';
import fs from 'node:fs';

import { CachedTag } from '@/interfaces/tag.interface';
import logger from '@/lib/logger';

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
      logger.error(error);
    }
  }

  static async getTagsByName(tagNames: string[]): Promise<CachedTag[] | undefined> {
    const allTags = await Tags.getAllTags();
    return allTags.filter(tag => tagNames.includes(tag.name));
  }
}
