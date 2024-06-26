import path from 'node:path';
import fs from 'node:fs';

import authors from '@data/authors.json';

import { BlogPostMetaData } from '@/interfaces/blog.interface';
import { ItemTileItem } from '@/interfaces/itemTile.interface';
import Sidebar from '@/components/Sidebar';
import logger from '@/lib/logger';

import BlogPost from './BlogPost';

export default class BlogPostIndex {
  private cacheDirectory = path.resolve(process.cwd(), '.cache');
  private postsDirectory = path.resolve(process.cwd(), 'data', 'posts');

  posts: BlogPostMetaData[] = [];
  totalPages = 1;

  constructor(
    public page = 1,
    private postsPerPage = 12
  ) {}

  getPostsAsItemTileItems(posts?: BlogPostMetaData[]): ItemTileItem[] {
    const _posts = posts ? posts : this.posts;

    return _posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.excerpt,
      image: post.titleImage,
      link: `/post/${post.id}`,
      date: post.publishedDate,
      authors: authors.filter(author => post.authors.includes(author.id)),
      status: post.status,
      scheduled: new Date(post.publishedDate) > new Date(),
    }));
  }

  async getAllPostIds(): Promise<string[]> {
    try {
      const cacheFile = path.resolve(this.cacheDirectory, 'allPosts.json');
      const fileContent = await fs.promises.readFile(cacheFile, 'utf8');
      return JSON.parse(fileContent).map((post: BlogPostMetaData) => post.id);
    }
    catch (error) {
      logger.error(error);
    }
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

  async getPostsByAuthor(authorId: string): Promise<BlogPostMetaData[]> {
    const cacheFile = path.resolve(this.cacheDirectory, 'authors', `${authorId}.json`);
    return await this.parsePostIdCacheFile(cacheFile);
  }

  private async parsePostIdCacheFile(cacheFile: string): Promise<BlogPostMetaData[]> {
    let posts = [];

    try {
      const fileContent = await fs.promises.readFile(cacheFile, 'utf8');
      posts = JSON.parse(fileContent);
    }
    catch (error) {
      logger.error(error);
    }

    const postsForPage = posts
      .filter(post => BlogPost.blogPostCanBePublished(post))
      .slice((this.page - 1) * this.postsPerPage, this.page * this.postsPerPage);

    this.totalPages = Math.ceil(posts.length / this.postsPerPage);

    for (const { id: postId } of postsForPage) {
      const fullPathToFolder = path.resolve(this.postsDirectory, postId);
      const fullPathtoMetaFile = path.resolve(fullPathToFolder, 'meta.json');
      const fileContent = await fs.promises.readFile(fullPathtoMetaFile, 'utf8');

      try {
        const postMetaData = JSON.parse(fileContent) as BlogPostMetaData;
        this.posts.push(postMetaData);
      }
      catch (error) {
        logger.error(error);
      }
    }

    return this.posts;
  }

  async getTemplateData(): Promise<any> {
    const sidebarData = await Sidebar.getGenericSidebarData();

    return {
      blogPosts: this.getPostsAsItemTileItems(),
      currentPage: this.page,
      totalPages: this.totalPages,
      ...sidebarData,
    };
  }
}
