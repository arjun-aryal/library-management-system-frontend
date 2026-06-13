import clientApi from "../axios/axios";
import type {
  Book,
  CreateBookPayload,
  UpdateBookPayload,
} from "../types/book.type";

import type { ListQueryParams, PaginatedResponse } from "../types/common";

async function getAll(
  authorId: number,
  params?: ListQueryParams,
): Promise<PaginatedResponse<Book>> {
  const response = await clientApi.get<PaginatedResponse<Book>>(
    `/authors/${authorId}/books`,
    { params },
  );

  return response.data;
}

async function getById(authorId: number, id: number): Promise<Book> {
  const response = await clientApi.get<Book>(
    `/authors/${authorId}/books/${id}`,
  );

  return response.data;
}

async function create(
  authorId: number,
  payload: CreateBookPayload,
): Promise<Book> {
  const response = await clientApi.post<Book>(
    `/authors/${authorId}/books`,
    payload,
  );

  return response.data;
}

async function update(
  authorId: number,
  id: number,
  payload: UpdateBookPayload,
): Promise<Book> {
  const response = await clientApi.patch<Book>(
    `/authors/${authorId}/books/${id}`,
    payload,
  );

  return response.data;
}

async function remove(authorId: number, id: number): Promise<Book> {
  const response = await clientApi.delete<Book>(
    `/authors/${authorId}/books/${id}`,
  );

  return response.data;
}

export const bookService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
