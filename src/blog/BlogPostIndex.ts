import path from 'node:path';
import fs from 'node:fs';

import { BlogPostMetaData } from '@/interfaces/blog.interface';
import { ItemTileItem } from '@/interfaces/itemTile.interface';

import Tags from './Tags';
import Categories from './Categories';

type BlogPostIndexType = 'allPosts' | 'category' | 'tag' | 'archive' | 'search';

export default class BlogPostIndex {
  private cacheDirectory = path.resolve(process.cwd(), '.cache');
  private postsDirectory = path.resolve(process.cwd(), 'data', 'posts');
  private postsPerPage = 12;

  posts: BlogPostMetaData[] = [];
  page = 1;
  totalPages = 1;

  constructor(
    private type: BlogPostIndexType,
    private typeId?: string
  ) {}

  async getPosts(page = 1): Promise<BlogPostMetaData[]> {
    this.page = page;

    switch (this.type) {
      case 'allPosts':
        return await this.getAllPosts();
      case 'category':
        return await this.getPostsByCategory();
      // case 'tag':
      //   return await this.getPostsByTag();
      // case 'archive':
      //   return await this.getPostsByArchive();
      // case 'search':
      //   return await this.getPostsBySearch();
      default:
        return [];
    }
  }

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

  private async getAllPosts(): Promise<BlogPostMetaData[]> {
    const cacheFile = path.resolve(this.cacheDirectory, 'allPosts.json');
    return await this.parsePostIdCacheFile(cacheFile);
  }

  private async getPostsByCategory(): Promise<BlogPostMetaData[]> {
    if (!this.typeId) {
      throw new Error('No category ID provided!');
    }

    const cacheFile = path.resolve(this.cacheDirectory, 'categories', `${this.typeId}.json`);
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

  async getAdditionalTemplateData(): Promise<any> {
    const tags = await Tags.getAllTags();

    return {
      categories: Categories.getSorted(),
      tags,
      currentPage: this.page,
      totalPages: this.totalPages,
    };
  }
}
