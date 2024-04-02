import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

import { BlogPostMetaData, BlogPost as IBlogPost } from '@/interfaces/blog.interface';

export default class BlogPost implements IBlogPost {
  metaData: BlogPostMetaData;
  body: string;
  parsedBody: string;

  private postsDirectory = path.resolve(process.cwd(), 'data', 'posts');

  constructor(public postId: string) {}

  async getPost(): Promise<IBlogPost | undefined> {
    await this.getMetaData();
    await this.getPostBody();

    return {
      metaData: this.metaData,
      body: this.body,
      parsedBody: this.parsedBody,
    };
  }

  async getPostBody(): Promise<string | undefined> {
    if (this.body) {
      return this.body;
    }

    try {
      const post = `${this.postsDirectory}/${this.postId}/index.md`;
      await fs.promises.access(post);

      this.body = await fs.promises.readFile(post, 'utf8');
      this.parsedBody = await marked.parse(this.body);

      return this.body;
    }
    catch (error) {
      console.error(error);
    }
  }

  async getMetaData(): Promise<BlogPostMetaData | undefined> {
    if (this.metaData) {
      return this.metaData;
    }

    try {
      const metaDataString = await fs.promises.readFile(`${this.postsDirectory}/${this.postId}/meta.json`, 'utf8');
      this.metaData = JSON.parse(metaDataString);
      return this.metaData;
    }
    catch (error) {
      console.error(error);
    }
  }
}