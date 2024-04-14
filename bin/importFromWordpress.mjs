/*
  1. Import categories, tags and authors (and author avatars) -- only those that have posts
  2. Import posts with images and link them to the categories, tags and authors

  Notes:
    - Think about pagination
    - Think about post status
*/

import fs from 'node:fs';
import path from 'node:path';

import { downloadImage } from './utils.mjs';

console.log('Importing posts from Wordpress...');

const dataDirectory = path.resolve(process.cwd(), 'data');

const apiUrl = 'https://www.developers-notebook.com/wp-json/wp/v2/';
const authorsUrl = `${apiUrl}users`;
const categoriesUrl = `${apiUrl}categories`;
const tagsUrl = `${apiUrl}tags`;
const postsUrl = `${apiUrl}posts`;

async function fetchAuthors() {
  console.log('Importing authors...');

  const response = await fetch(authorsUrl);
  const authors = await response.json();
  const newAuthors = [];

  for (const author of authors) {
    const avatarFile = path.resolve(process.cwd(), 'public', 'images', 'authors', `${author.slug}.jpg`);
    await downloadImage(author.avatar_urls[96], avatarFile);

    newAuthors.push({
      id: author.slug,
      name: author.name,
      bio: author.description,
      website: author.url,
      avatar: avatarFile,
    });
  }

  const authorsFile = path.resolve(dataDirectory, 'authors.json');
  await fs.promises.writeFile(authorsFile, JSON.stringify(newAuthors, null, 2));
}

await fetchAuthors();

console.log('Posts successfully imported from Wordpress!');
