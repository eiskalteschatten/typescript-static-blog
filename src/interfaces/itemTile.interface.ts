import { AuthorMetaData } from './author.interface';

export interface ItemTileItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  date: string | Date;
  authors: AuthorMetaData[];
  openInNewTab?: boolean;
  status: string;
  scheduled: boolean;
}
