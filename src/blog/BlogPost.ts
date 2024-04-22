import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

import { BlogPostMetaData, BlogPostPublishData, BlogPost as IBlogPost } from '@/interfaces/blog.interface';
import { ItemTileItem } from '@/interfaces/itemTile.interface';
import { AuthorMetaData } from '@/interfaces/author.interface';
import logger from '@/lib/logger';

import Author from './Author';

export default class BlogPost implements IBlogPost {
  metaData: BlogPostMetaData;
  body: string;
  parsedBody: string;
  authors: AuthorMetaData[] = [];

  private postsDirectory = path.resolve(process.cwd(), 'data', 'posts');

  constructor(public postId: string) {}

  async getPost(): Promise<IBlogPost | undefined> {
    if (!this.exists()) {
      return;
    }

    await this.getMetaData();

    if (!BlogPost.blogPostCanBePublished(this.metaData)) {
      return;
    }

    await this.getPostBody();
    await this.getAuthors();

    return {
      metaData: this.metaData,
      body: this.body,
      parsedBody: this.parsedBody,
      authors: this.authors,
    };
  }

  async getPostBody(): Promise<string | undefined> {
    if (this.body) {
      return this.body;
    }

    try {
      const post = `${this.postsDirectory}/${this.postId}/index.md`;
      this.body = await fs.promises.readFile(post, 'utf8');
      this.parsedBody = await marked.parse(this.body);

      return this.body;
    }
    catch (error) {
      logger.error(error);
    }
  }

  async getMetaData(): Promise<BlogPostMetaData | undefined> {
    if (this.metaData) {
      return this.metaData;
    }

    try {
      const metaDataString = await fs.promises.readFile(`${this.postsDirectory}/${this.postId}/meta.json`, 'utf8');
      const metaData = JSON.parse(metaDataString);

      this.metaData = {
        ...metaData,
        scheduled: new Date(metaData.publishedDate) > new Date(),
      };

      return this.metaData;
    }
    catch (error) {
      logger.error(error);
    }
  }

  async getAuthors(): Promise<AuthorMetaData[]> {
    if (this.authors.length > 0) {
      return this.authors;
    }

    if (!this.metaData) {
      await this.getMetaData();
    }

    for (const authorId of this.metaData.authors) {
      const author = new Author(authorId);
      this.authors.push(author.metaData);
    }
  }

  exists(): boolean {
    const postDir = path.resolve(this.postsDirectory, this.postId);
    return fs.existsSync(postDir);
  }

  getPostAsItemTileItems(): ItemTileItem {
    return {
      id: this.metaData.id,
      title: this.metaData.title,
      description: this.metaData.excerpt,
      image: this.metaData.titleImage,
      link: `/post/${this.metaData.id}`,
      date: this.metaData.publishedDate,
      authors: this.authors,
      status: this.metaData.status,
      scheduled: this.metaData.scheduled,
    };
  }

  static blogPostCanBePublished(metaData: BlogPostPublishData): boolean {
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    return new Date(metaData.publishedDate) <= new Date() && metaData.status === 'published';
  }
}
