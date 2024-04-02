import path from 'node:path';
import fs from 'node:fs';

import { BlogPostMetaData } from '@/interfaces/blog.interface';
import { ItemTileItem } from '@/interfaces/itemTile.interface';

import Tags from './Tags';
import Categories from './Categories';

export default class BlogPostIndex {
  private cacheDirectory = path.resolve(process.cwd(), '.cache');
  private postsDirectory = path.resolve(process.cwd(), 'data', 'posts');
  private postsPerPage = 12;

  posts: BlogPostMetaData[] = [];
  totalPages = 1;

  constructor(public page = 1) {}

  getPostsAsItemTileItems(): ItemTileItem[] {
    return this.posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.excerpt,
      image: post.titleImage,
      link: `/post/${post.id}`,
      date: post.publishedDate,
    }));
  }

  async getAllPosts(): Promise<BlogPostMetaData[]> {
    const cacheFile = path.resolve(this.cacheDirectory, 'allPosts.json');
    return await this.parsePostIdCacheFile(cacheFile);
  }

  async getPostsByCategory(categoryId: string): Promise<BlogPostMetaData[]> {
    const cacheFile = path.resolve(this.cacheDirectory, 'categories', `${categoryId}.json`);
    return await this.parsePostIdCacheFile(cacheFile);
  }

  async getPostsByTag(tagSlug: string): Promise<BlogPostMetaData[]> {
    const cacheFile = path.resolve(this.cacheDirectory, 'tags', `${tagSlug}.json`);
    return await this.parsePostIdCacheFile(cacheFile);
  }

  private async parsePostIdCacheFile(cacheFile: string): Promise<BlogPostMetaData[]> {
    let postIds = [];

    try {
      const fileContent = await fs.promises.readFile(cacheFile, 'utf8');
      postIds = JSON.parse(fileContent);
    }
    catch (error) {
      console.error(error);
    }

    const postIdsForPage = postIds.slice((this.page - 1) * this.postsPerPage, this.page * this.postsPerPage);

    this.totalPages = Math.ceil(postIds.length / this.postsPerPage);

    for (const postId of postIdsForPage) {
      const fullPathToFolder = path.resolve(this.postsDirectory, postId);
      const fullPathtoMetaFile = path.resolve(fullPathToFolder, 'meta.json');
      const fileContent = await fs.promises.readFile(fullPathtoMetaFile, 'utf8');

      try {
        const postMetaData = JSON.parse(fileContent) as BlogPostMetaData;
        this.posts.push(postMetaData);
      }
      catch (error) {
        console.error(error);
      }
    }

    return this.posts;
  }

  async getTemplateData(): Promise<any> {
    const tags = await Tags.getAllTags();

    return {
      blogPosts: this.getPostsAsItemTileItems(),
      categories: Categories.getSorted(),
      tags,
      currentPage: this.page,
      totalPages: this.totalPages,
    };
  }
}
