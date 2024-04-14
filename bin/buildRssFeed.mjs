import fs from 'node:fs';
import path from 'node:path';
import RSS from 'rss';

import authors from '../data/authors.json' assert { type: 'json' };

console.log('Building the RSS feed...');

const postsDirectory = path.resolve(process.cwd(), 'data', 'posts');
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

const xml = feed.xml();
const writeFile = path.resolve(process.cwd(), 'public', 'feed.xml');

fs.writeFileSync(writeFile, xml);

console.log('The RSS feed has been successfully built.');
