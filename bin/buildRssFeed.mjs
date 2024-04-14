import fs from 'node:fs';
import path from 'node:path';
import RSS from 'rss';

import categories from '../data/categories.json' assert { type: 'json' };
import authors from '../data/authors.json' assert { type: 'json' };

console.log('Building the RSS feed...');

const url = 'http://localhost:4000';

const feed = new RSS({
  title: 'TypeScript Static Blog',
  description: 'A simple blog written in TypeScript that is generated statically.',
  'feed_url': `${url}/feed.xml`,
  'site_url': `${url}`,
  copyright: 'Copyright (c) Alex Seifert',
  language: 'en-US',
  pubDate: new Date().toISOString(),
});

const cacheFile = path.resolve(this.cacheDirectory, 'allPosts.json');

if (!fs.existsSync(cacheFile)) {
  throw new Error('Please run npm run post:cache before building the RSS feed!');
}

const fileContent = await fs.promises.readFile(cacheFile, 'utf8');
const postIds = JSON.parse(fileContent);

const postIdsForPage = postIds.slice((this.page - 1) * this.postsPerPage, this.page * this.postsPerPage);

for (const postId of postIdsForPage) {
  const fullPathToFolder = path.resolve(this.postsDirectory, postId);
  const fullPathtoMetaFile = path.resolve(fullPathToFolder, 'meta.json');
  const fileContent = await fs.promises.readFile(fullPathtoMetaFile, 'utf8');
  const postMetaData = JSON.parse(fileContent);

  if (new Date(postMetaData.publishedDate) <= new Date() && postMetaData.status === 'published') {
    const postCategories = categories.filter(category => postMetaData.categories.includes(category.id));

    feed.item({
      title: postMetaData.title,
      description: contentHtml,
      url: `${url}/post/${postMetaData.id}`,
      categories: postCategories.map(category => category.name),
      author: authors.find(author => author.id === postMetaData.authors[0])?.name ?? '',
      date: postMetaData.publishedDate,
    });
  }
}

const xml = feed.xml();
const writeFile = path.resolve(process.cwd(), 'public', 'feed.xml');

fs.writeFileSync(writeFile, xml);

console.log('The RSS feed has been successfully built.');
