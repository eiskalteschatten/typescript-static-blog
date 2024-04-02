import path from 'node:path';
import fs from 'node:fs';

import { BlogPostMetaData } from '@/interfaces/blog.interface';
import { ItemTileItem } from '@/interfaces/itemTile.interface';

type BlogPostIndexType = 'allPosts' | 'category' | 'tag' | 'archive' | 'search';

export default class BlogPostIndex {
  private cacheDirectory = path.resolve(process.cwd(), '.cache');
  private postsDirectory = path.resolve(process.cwd(), 'data', 'posts');
  posts: BlogPostMetaData[] = [];

  constructor(private type: BlogPostIndexType) {}

  async getPosts(): Promise<BlogPostMetaData[]> {
    switch (this.type) {
      case 'allPosts':
        return await this.getAllPosts();
      // case 'category':
      //   return await this.getPostsByCategory();
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
    }));
  }

  private async getAllPosts(): Promise<BlogPostMetaData[]> {
    const cacheFile = path.resolve(this.cacheDirectory, 'allPosts.json');
    const postIds = await this.parseCacheFile<string[]>(cacheFile);

    for (const postId of postIds) {
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

  private async parseCacheFile<T>(cacheFile: string): Promise<T> {
    try {
      const fileContent = await fs.promises.readFile(cacheFile, 'utf8');
      return JSON.parse(fileContent);
    }
    catch (error) {
      console.error(error);
    }
  }
}
