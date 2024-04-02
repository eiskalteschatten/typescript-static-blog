import path from 'node:path';
import fs from 'node:fs';

import { slugify } from './utils.mjs';

import categories from '../data/categories.json' assert { type: 'json' };

console.log('Building post caches...');

const postsDirectory = path.resolve(process.cwd(), 'data', 'posts');
const allPostsData = [];
const cacheDirectory = path.resolve(process.cwd(), '.cache');

fs.rmSync(cacheDirectory, { recursive: true, force: true });

if (!fs.existsSync(cacheDirectory)) {
  fs.mkdirSync(cacheDirectory);
}

async function setup() {
  const postFolders = await fs.promises.readdir(postsDirectory);

  for (const postFolder of postFolders) {
    const fullPathToFolder = path.resolve(postsDirectory, postFolder);
    const fullPathtoMetaFile = path.resolve(fullPathToFolder, 'meta.json');
    const fileContent = await fs.promises.readFile(fullPathtoMetaFile, 'utf8');

    try {
      const postData = JSON.parse(fileContent);
      allPostsData.push(postData);
    }
    catch (error) {
      console.error(error);
    }
  }

  allPostsData.sort((a, b) => a.publishedDate > b.publishedDate ? -1 : 1);
}

function buildAllPostsCache() {
  console.log('Building all posts cache...');

  const cacheFile = path.resolve(cacheDirectory, 'allPosts.json');
  const sortedPostFolders = allPostsData.map(post => post.id);
  fs.writeFileSync(cacheFile, JSON.stringify(sortedPostFolders, null, 2));
}

function buildCategoryCache() {
  console.log('Building category cache...');

  const categoryCacheDirectory = path.resolve(cacheDirectory, 'categories');

  if (!fs.existsSync(categoryCacheDirectory)) {
    fs.mkdirSync(categoryCacheDirectory);
  }

  for (const category of categories) {
    const postsInCategory = allPostsData.filter(post => post.categories.includes(category.id));
    const cacheFile = path.resolve(categoryCacheDirectory, `${category.id}.json`);
    const sortedPostFolders = postsInCategory.map(post => post.id);
    fs.writeFileSync(cacheFile, JSON.stringify(sortedPostFolders, null, 2));
  }
}

function buildTagCache() {
  console.log('Building tag cache...');

  const tagCacheDirectory = path.resolve(cacheDirectory, 'tags');

  if (!fs.existsSync(tagCacheDirectory)) {
    fs.mkdirSync(tagCacheDirectory);
  }

  const tagData = {};

  for (const post of allPostsData) {
    for (const tag of post.tags) {
      if (!tagData[tag]) {
        tagData[tag] = [];
      }

      tagData[tag].push(post.id);
    }
  }

  for (const tag in tagData) {
    const slug = slugify(tag);
    const cacheFile = path.resolve(tagCacheDirectory, `${slug}.json`);

    const cacheContents = {
      name: tag,
      posts: tagData[tag],
    };

    fs.writeFileSync(cacheFile, JSON.stringify(cacheContents, null, 2));
  }
}

function buildArchiveCache() {
  console.log('Building archive cache...');

  const archiveCacheDirectory = path.resolve(cacheDirectory, 'archives');

  if (!fs.existsSync(archiveCacheDirectory)) {
    fs.mkdirSync(archiveCacheDirectory);
  }

  const archiveData = {};

  for (const post of allPostsData) {
    const publishedDate = new Date(post.publishedDate);
    const year = publishedDate.getFullYear();
    let month = publishedDate.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;

    const key = `${year}-${month}`;

    if (!archiveData[key]) {
      archiveData[key] = [];
    }

    archiveData[key].push(post.id);
  }

  for (const key in archiveData) {
    const cacheFile = path.resolve(archiveCacheDirectory, `${key}.json`);
    fs.writeFileSync(cacheFile, JSON.stringify(archiveData[key], null, 2));
  }
}

await setup();
buildAllPostsCache();
buildCategoryCache();
buildTagCache();
buildArchiveCache();

console.log('All post caches have been successfully built.');
