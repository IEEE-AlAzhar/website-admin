export interface Article {
  _id?: string;
  title: string;
  body: string;
  metaDescription: string;
  authorName: string;
  authorProfileLink: string;
  cover: string;
  categories: string[];
  createdAt?: string;
}
