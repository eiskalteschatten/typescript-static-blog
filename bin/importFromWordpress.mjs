console.log('Importing posts from Wordpress...');

const apiUrl = 'https://www.developers-notebook.com/wp-json/wp/v2/';
const authorsUrl = `${apiUrl}users`;
const categoriesUrl = `${apiUrl}categories`;
const tagsUrl = `${apiUrl}tags`;
const postsUrl = `${apiUrl}posts`;

/*
  1. Import categories, tags and authors (and author avatars) -- only those that have posts
  2. Import posts with images and link them to the categories, tags and authors

  Notes:
    - Think about pagination
    - Think about post status
*/

console.log('Posts successfully imported from Wordpress!');
