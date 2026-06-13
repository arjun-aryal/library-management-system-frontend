export interface BaseBook {
  title: string;
  isbn: string;
  published_year: number;
}

export interface Book extends BaseBook {
  id: number;
}

export interface CreateBookPayload extends BaseBook {
  author_id?: number;
}

export interface UpdateBookPayload extends Partial<BaseBook> {
}
