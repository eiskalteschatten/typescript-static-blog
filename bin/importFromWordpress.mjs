/*
  1. Import categories and authors (and author avatars) -- only those that have posts
  2. Import posts with images and link them to the categories and authors. Also import tags.

  Notes:
    - Think about pagination
    - Think about post status
*/

import fs from 'node:fs';
import path from 'node:path';

import { downloadImage } from './utils.mjs';

console.log('Importing posts from Wordpress...');

const dataDirectory = path.resolve(process.cwd(), 'data');
const categoriesFile = path.resolve(dataDirectory, 'categories.json');
const authorsFile = path.resolve(dataDirectory, 'authors.json');

const apiUrl = 'https://www.developers-notebook.com/wp-json/wp/v2/';
const authorsUrl = `${apiUrl}users`;
const categoriesUrl = `${apiUrl}categories`;
const postsUrl = `${apiUrl}posts`;
const tagsUrl = `${apiUrl}tags`;

async function fetchAuthors() {
  console.log('Importing authors...');

  const newAuthors = [];
  const totalPagesResponse = await fetch(authorsUrl);
  const totalPages = totalPagesResponse.headers.get('x-wp-totalpages');

  const importData = async page => {
    const response = await fetch(`${authorsUrl}?page=${page}`);
    const authors = await response.json();

    for (const author of authors) {
      const extention = path.extname(author.avatar_urls[96]).split('&')[0];
      const avatarFile = `${author.slug}${extention}`;
      const avatarFilePath = path.resolve(process.cwd(), 'public', 'images', 'authors', avatarFile);
      await downloadImage(author.avatar_urls[96], avatarFilePath);

      newAuthors.push({
        id: author.slug,
        name: author.name,
        bio: author.description,
        website: author.url,
        avatar: `/images/authors/${avatarFile}`,
        wordpressId: author.id,
      });
    }
  };

  for (let page = 1; page <= totalPages; page++) {
    await importData(page);
  }

  await fs.promises.writeFile(authorsFile, JSON.stringify(newAuthors, null, 2));
}

async function fetchCategories() {
  console.log('Importing categories...');

  const newCategories = [];
  const totalPagesResponse = await fetch(categoriesUrl);
  const totalPages = totalPagesResponse.headers.get('x-wp-totalpages');

  const importData = async page => {
    const response = await fetch(`${categoriesUrl}?page=${page}`);
    const categories = await response.json();

    for (const category of categories) {
      if (category.count === 0) {
        continue;
      }

      newCategories.push({
        id: category.slug,
        name: category.name,
        description: category.description,
        wordpressId: category.id,
      });
    }
  };

  for (let page = 1; page <= totalPages; page++) {
    await importData(page);
  }

  await fs.promises.writeFile(categoriesFile, JSON.stringify(newCategories, null, 2));
}

async function fetchPosts() {
  console.log('Importing posts...');

  const totalPagesResponse = await fetch(postsUrl);
  const totalPages = totalPagesResponse.headers.get('x-wp-totalpages');

  const authorsFileContent = await fs.promises.readFile(authorsFile, 'utf8');
  const authors = JSON.parse(authorsFileContent);

  const categoriesFileContent = await fs.promises.readFile(categoriesFile, 'utf8');
  const categories = JSON.parse(categoriesFileContent);

  const downloadPostImage = async post => {
    const basename = path.basename(post.jetpack_featured_media_url);
    const extention = path.extname(post.jetpack_featured_media_url).split('?')[0];
    const fileName = `${basename}${extention}`;
    const destinationFolder = path.resolve(process.cwd(), 'public', 'images', 'posts', post.slug);

    if (!fs.existsSync(destinationFolder)) {
      fs.promises.mkdir(destinationFolder, { recursive: true });
    }

    const destinationFile = path.resolve(destinationFolder, fileName);
    await downloadImage(post.jetpack_featured_media_url, destinationFile);
    return `/images/posts/${post.slug}/${destinationFile}`;
  };

  const importData = async page => {
    const response = await fetch(`${postsUrl}?page=${page}`);
    const posts = await response.json();

    for (const post of posts) {
      const postAuthor = authors.find(author => post.author === author.wordpressId);
      const postCategories = categories.filter(category => post.categories.includes(category.wordpressId));
      const titleImage = await downloadPostImage(post);

      const metaData = {
        id: post.slug,
        title: post.title.rendered,
        status: post.status === 'publish' ? 'published' : 'draft',
        authors: [postAuthor.id],
        titleImage,
        excerpt: post.yoast_head_json.description,
        metaDescription: post.yoast_head_json.description,
        categories: postCategories.map(category => category.id),
        // TODO
        // tags:,
        publishedDate: post.date,
        updatedAt: post.modified,
        wordpressId: post.id,
      };

      const pathToPostFolder = path.resolve(dataDirectory, 'posts', post.slug);
      await fs.promises.mkdir(pathToPostFolder);

      const metaDataFile = path.resolve(pathToPostFolder, 'meta.json');
      await fs.promises.writeFile(metaDataFile, JSON.stringify(metaData, null, 2));

      // TODO: convert to markdown, import images and replace image URLs
      const content = post.content.rendered;
      const contentFile = path.resolve(pathToPostFolder, 'index.md');
      await fs.promises.writeFile(contentFile, content);
    }
  };

  for (let page = 1; page <= totalPages; page++) {
    await importData(page);
  }
}

async function fetchTag(tagId) {

}

await fetchAuthors();
await fetchCategories();
await fetchPosts();

console.log('Posts successfully imported from Wordpress!');
