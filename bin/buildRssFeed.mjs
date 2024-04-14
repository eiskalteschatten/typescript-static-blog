import fs from 'node:fs';
import path from 'node:path';
import RSS from 'rss';

import authors from '../data/authors.json' assert { type: 'json' };

const postsDirectory = path.resolve(process.cwd(), 'data', 'posts');

console.log('Building the RSS feed...');



console.log('The RSS feed has been successfully built.');
