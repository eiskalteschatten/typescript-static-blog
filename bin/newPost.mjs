import fs from 'node:fs';
import path from 'node:path';

import { slugify } from './utils.mjs';

const pathToTemplate = path.resolve(process.cwd(), 'data', 'templates', 'newPost');
const pathToPosts = path.resolve(process.cwd(), 'data', 'posts');

const title = process.argv[2];

if (!title) {
  throw new Error('Please provide a title for the post!');
}

const id = slugify(title);
const newPostPath = path.resolve(pathToPosts, id);

fs.cpSync(pathToTemplate, newPostPath, { recursive: true });

const pathToMetaFile = path.resolve(newPostPath, 'meta.json');
const metaData = fs.readFileSync(pathToMetaFile, 'utf-8');
const meta = JSON.parse(metaData);

const newMetaData = {
  ...meta,
  id,
  title,
  titleImage: meta.titleImage.replace('{new-post}', id),
  publishedDate: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

fs.writeFileSync(pathToMetaFile, JSON.stringify(newMetaData, null, 2));

console.log(title, 'created at', newPostPath);
