import path from 'node:path';
import fs from 'node:fs';

import categories from '../data/categories.json' assert { type: 'json' };

console.log('Building post caches...');

const postsDirectory = path.resolve(process.cwd(), 'data', 'posts');
const allPostsData = [];
const cacheDirectory = path.resolve(process.cwd(), '.cache');

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
}

function buildArchiveCache() {
  console.log('Building archive cache...');
}

await setup();
buildAllPostsCache();
buildCategoryCache();
buildTagCache();
buildArchiveCache();

console.log('All post caches have been successfully built.');
