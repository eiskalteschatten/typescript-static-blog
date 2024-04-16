/*
  1. Import categories and authors (and author avatars) -- only those that have posts
  2. Import posts with images and link them to the categories and authors. Also import tags.

  Notes:
    - Think about pagination
    - Think about post status
*/

import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';
import * as cheerio from 'cheerio';

import { downloadImage, convertEscapedAscii } from './utils.mjs';

console.log('Importing data from Wordpress...');

const dataDirectory = path.resolve(process.cwd(), 'data');
const categoriesFile = path.resolve(dataDirectory, 'categories.json');
const authorsFile = path.resolve(dataDirectory, 'authors.json');

const apiUrl = 'https://blog.alexseifert.com/wp-json/wp/v2/';
const authorsUrl = `${apiUrl}users`;
const categoriesUrl = `${apiUrl}categories`;
const postsUrl = `${apiUrl}posts`;
const tagsUrl = `${apiUrl}tags`;

async function fetchAuthors() {
  console.log('Importing authors...');

  let newAuthors = [];

  if (fs.existsSync(authorsFile)) {
    const existingAuthors = await fs.promises.readFile(authorsFile, 'utf8');
    newAuthors = JSON.parse(existingAuthors);
  }

  const totalPagesResponse = await fetch(authorsUrl);
  const totalPages = totalPagesResponse.headers.get('x-wp-totalpages');

  const importData = async page => {
    const response = await fetch(`${authorsUrl}?page=${page}`);
    const authors = await response.json();

    for (const author of authors) {
      console.log('Importing author:', author.name);

      const existingAuthorIndex = newAuthors.findIndex(existingAuthor => existingAuthor.id === author.slug);

      if (existingAuthorIndex > -1) {
        console.log(`Author "${author.slug}" already exists, skipping...`);
        newAuthors[existingAuthorIndex].wordpressId = author.id;
        continue;
      }

      const extention = path.extname(author.avatar_urls[96]).split('&')[0];
      const avatarFile = `${author.slug}${extention}`;
      const avatarFilePath = path.resolve(process.cwd(), 'public', 'images', 'authors', avatarFile);
      const imageDownloaded = await downloadImage(author.avatar_urls[96], avatarFilePath);

      newAuthors.push({
        id: author.slug,
        name: author.name,
        bio: author.description,
        website: author.url,
        ...imageDownloaded && {
          avatar: `/images/authors/${avatarFile}`,
        },
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

  let newCategories = [];

  if (fs.existsSync(categoriesFile)) {
    const existingCategories = await fs.promises.readFile(categoriesFile, 'utf8');
    newCategories = JSON.parse(existingCategories);
  }

  const totalPagesResponse = await fetch(categoriesUrl);
  const totalPages = totalPagesResponse.headers.get('x-wp-totalpages');

  const importData = async page => {
    const response = await fetch(`${categoriesUrl}?page=${page}`);
    const categories = await response.json();

    for (const category of categories) {
      if (category.count === 0) {
        continue;
      }

      console.log('Importing category:', category.name);

      const existingCategoryIndex = newCategories.findIndex(existingCategory => existingCategory.id === category.slug);

      if (existingCategoryIndex > -1) {
        console.log(`Category "${category.slug}" already exists, skipping...`);
        newCategories[existingCategoryIndex].wordpressId = category.id;
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

  const downloadPostImage = async (src, postSlug) => {
    const destinationFolder = path.resolve(process.cwd(), 'public', 'images', 'posts', postSlug);

    if (!fs.existsSync(destinationFolder)) {
      fs.promises.mkdir(destinationFolder, { recursive: true });
    }

    const fileName = path.basename(src).split('?')[0];
    const destinationFile = path.resolve(destinationFolder, fileName);
    const imageDownloaded = await downloadImage(src, destinationFile);
    return imageDownloaded ? `/images/posts/${postSlug}/${fileName}` : undefined;
  };

  const cleanUpHtml = html => {
    const $ = cheerio.load(html);

    const figures = $('figure');
    for (const figure of figures) {
      $(figure).removeAttr('class');
    }

    const images = $('img');
    for (const image of images) {
      $(image).removeAttr('class width height data-recalc-dims sizes srcset');
    }

    const captions = $('figcaption');
    for (const caption of captions) {
      $(caption).removeAttr('class');
    }

    $('.wp-polls').html('<em>Polls have been temporarily removed while we migrate to a new platform.</em>');
    $('.wp-polls-loading').remove();

    return $.html();
  };


  const downloadAndUpdateImages = async (html, postSlug) => {
    const $ = cheerio.load(html);
    const images = $('img');

    for (const image of images) {
      const src = $(image).attr('src');
      const newSrc = await downloadPostImage(src, postSlug);
      $(image).attr('src', newSrc);
    }

    return $.html();
  };

  const importData = async page => {
    const response = await fetch(`${postsUrl}?page=${page}`);
    const posts = await response.json();

    for (const post of posts) {
      const postTitle = convertEscapedAscii(post.title.rendered);
      console.log('Importing post:', postTitle);

      const postAuthor = authors.find(author => post.author === author.wordpressId);
      const postCategories = categories.filter(category => post.categories.includes(category.wordpressId));
      const titleImage = await downloadPostImage(post.jetpack_featured_media_url, post.slug);
      const tags = [];

      for (const tag of post.tags) {
        const tagId = await fetchTag(tag);
        tags.push(tagId);
      }

      const metaData = {
        id: post.slug,
        title: postTitle,
        status: post.status === 'publish' ? 'published' : 'draft',
        authors: [postAuthor.id],
        titleImage,
        excerpt: post.yoast_head_json.description,
        metaDescription: post.yoast_head_json.description,
        categories: postCategories.map(category => category.id),
        tags,
        publishedDate: post.date,
        updatedAt: post.modified,
        wordpressId: post.id,
      };

      const pathToPostFolder = path.resolve(dataDirectory, 'posts', post.slug);

      if (!fs.existsSync(pathToPostFolder)) {
        await fs.promises.mkdir(pathToPostFolder);
      }

      const metaDataFile = path.resolve(pathToPostFolder, 'meta.json');
      await fs.promises.writeFile(metaDataFile, JSON.stringify(metaData, null, 2));

      const cleanedContent = cleanUpHtml(post.content.rendered);
      const htmlWithImages = await downloadAndUpdateImages(cleanedContent, post.slug);

      const turndownService = new TurndownService({
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
      });

      turndownService.keep(['figure', 'figcaption']);

      const content = turndownService.turndown(htmlWithImages);
      const contentFile = path.resolve(pathToPostFolder, 'index.md');
      await fs.promises.writeFile(contentFile, content);
    }
  };

  for (let page = 1; page <= totalPages; page++) {
    await importData(page);
  }
}

async function fetchTag(tagId) {
  const response = await fetch(`${tagsUrl}/${tagId}`);
  const tag = await response.json();
  return tag.name;
}

await fetchAuthors();
await fetchCategories();
await fetchPosts();

console.log('Data successfully imported from Wordpress!');
