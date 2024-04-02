import path from 'node:path';
import fs from 'node:fs';

import { CachedTag } from '@/interfaces/tag.interface';

import Tags from './Tags';

export default class Tag {
  private cacheDirectory = path.resolve(process.cwd(), '.cache', 'tags');

  metaData: CachedTag;

  constructor(private tagSlug: string) {}

  async getTagMetaData(): Promise<CachedTag> {
    const tags = await Tags.getAllTags();
    this.metaData = tags.find(tag => tag.slug === this.tagSlug);
    return this.metaData;
  }
}
