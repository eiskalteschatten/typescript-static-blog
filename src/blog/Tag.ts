import path from 'node:path';
import fs from 'node:fs';

import { CachedTag } from '@/interfaces/tag.interface';

export default class Tag {
  private cacheDirectory = path.resolve(process.cwd(), '.cache', 'tags');

  metaData: CachedTag;

  constructor(private tagSlug: string) {}

  async getTagMetaData(): Promise<CachedTag> {
    const cacheFile = path.resolve(this.cacheDirectory, 'allTags.json');
    const fileContent = await fs.promises.readFile(cacheFile, 'utf8');

    try {
      const tags = JSON.parse(fileContent) as CachedTag[];
      this.metaData = tags.find(tag => tag.slug === this.tagSlug);
      return this.metaData;
    }
    catch (error) {
      console.error(error);
    }
  }
}
