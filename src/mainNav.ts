export interface MainNavItem {
  id: string;
  label: string;
  url: string;
}

const mainNav: MainNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    url: '/',
  },
  {
    id: 'categories',
    label: 'Categories',
    url: '/categories/',
  },
  {
    id: 'allPosts',
    label: 'All Posts',
    url: '/posts/',
  },
  {
    id: 'about',
    label: 'About TypeScript Static Blog',
    url: '/about/',
  },
];

export default mainNav;
