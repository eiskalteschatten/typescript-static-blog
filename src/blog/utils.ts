import path from 'node:path';
import fs from 'node:fs';

import { BlogPost, BlogPostMetaData } from '@/interfaces/blog.interface';

const postsDirectory = path.resolve(process.cwd(), 'data', 'posts');

export async function getAllBlogPostMetaData(): Promise<BlogPostMetaData[] | null> {
  const postFolders = await fs.promises.readdir(postsDirectory);
  const allPostsData: BlogPostMetaData[] = [];

  for (const postFolder of postFolders) {
    const fullPathToFolder = path.resolve(postsDirectory, postFolder);
    const fullPathtoMetaFile = path.resolve(fullPathToFolder, 'meta.json');
    const fileContent = await fs.promises.readFile(fullPathtoMetaFile, 'utf8');

    try {
      const postData = JSON.parse(fileContent) as BlogPostMetaData;
      allPostsData.push(postData);
    }
    catch (error) {
      console.error(error);
    }
  }

  allPostsData.sort((a, b) => a.publishedDate > b.publishedDate ? -1 : 1);

  return allPostsData;
}

export async function getMetaDataForPost(postId: string): Promise<BlogPostMetaData | undefined> {
  try {
    const metaDataString = await fs.promises.readFile(`${postsDirectory}/${postId}/meta.json`, 'utf8');
    const metaData = JSON.parse(metaDataString);
    return metaData;
  }
  catch (error) {
    console.error(error);
  }
}

export async function getPost(postId: string): Promise<BlogPost | undefined> {
  try {
    const post = `${postsDirectory}/${postId}/index.md`;
    await fs.promises.access(post);
    const body = await fs.promises.readFile(post, 'utf8');

    const metaData = await getMetaDataForPost(postId);

    if (!metaData) {
      throw new Error(`No meta data found for ${postId}!`);
    }

    return {
      metaData,
      body,
      parsedBody: body,
    };
  }
  catch (error) {
    console.error(error);
  }
}

export async function getPostMetaDataForCategory(categoryId: string): Promise<BlogPostMetaData[] | null> {
  const posts = await getAllBlogPostMetaData();
  return posts ? posts.filter(post => post.categories.includes(categoryId)) : null;
}
