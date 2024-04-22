import path from 'node:path';
import fs from 'node:fs';

import categories from '@data/categories.json';

import { CategoryMetaData } from '@/interfaces/category.interface';
import logger from '@/lib/logger';
import { BlogPostPublishData } from '@/interfaces/blog.interface';

export default class Category {
  metaData: CategoryMetaData;

  constructor(private categoryId: string) {
    this.metaData = categories.find(category => category.id === this.categoryId);
  }

  async getFirstThreePosts(): Promise<BlogPostPublishData[]> {
    const cacheFile = path.resolve(process.cwd(), '.cache', 'categories', `${this.categoryId}.json`);
    const fileContent = await fs.promises.readFile(cacheFile, 'utf8');

    try {
      const postIds = JSON.parse(fileContent);
      return postIds.slice(0,3);
    }
    catch (error) {
      logger.error(error);
    }
  }

  exists(): boolean {
    return !!this.metaData;
  }
}
