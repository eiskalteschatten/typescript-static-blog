import path from 'node:path';
import fs from 'node:fs';

console.log('Building post cache...');

const cacheDirectory = path.resolve(process.cwd(), '.cache');
const postsDirectory = path.resolve(process.cwd(), 'data', 'posts');
const postFolders = await fs.promises.readdir(postsDirectory);
const allPostsData = [];

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
const sortedPostFolders = allPostsData.map(post => post.id);

if (!fs.existsSync(cacheDirectory)) {
  fs.mkdirSync(cacheDirectory);
}

const cacheFile = path.resolve(cacheDirectory, 'allPosts.json');
fs.writeFileSync(cacheFile, JSON.stringify(sortedPostFolders, null, 2));

console.log('Post cache built.');
