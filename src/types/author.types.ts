export interface BaseAuthor {
  name: string;
  nationality: string;
  bio: string;
}
export interface Author extends BaseAuthor {
  id: number;
}
