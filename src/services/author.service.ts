import clientApi from "../axios/axios";
import type {
  Author,
  CreateAuthorPayload,
  UpdateAuthorPayload,
} from "../types/author.types";
import type { ListQueryParams, PaginatedResponse } from "../types/common";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "../types/user.type";

async function getAll(
  params: ListQueryParams,
): Promise<PaginatedResponse<Author>> {
  const response = await clientApi.get<PaginatedResponse<Author>>("/authors", {
    params,
  });
  return response.data;
}

async function getById(id: number): Promise<Author> {
  const response = await clientApi.get<Author>(`/authors/${id}`);

  console.log("id", response.data.data);
  return response.data;
}

async function create(payload: CreateAuthorPayload): Promise<Author> {
  const response = await clientApi.post<Author>("/authors", payload);
  return response.data;
}

async function update(
  id: number,
  payload: UpdateAuthorPayload,
): Promise<Author> {
  const response = await clientApi.patch<Author>(`/authors/${id}`, payload);
  return response.data;
}

async function remove(id: number): Promise<Author> {
  const response = await clientApi.delete<Author>(`/authors/${id}`);
  return response.data;
}

async function importCsv(file: File): Promise<void> {
  const formData = new FormData();

  formData.append("file", file);

  await clientApi.post("/authors/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

async function exportCsv(): Promise<Blob> {
  const response = await clientApi.get("/authors/export", {
    responseType: "blob",
    headers: {
      Accept: "text/csv",
    },
  });

  return response.data;
}

export const authorService = {
  getAll,
  getById,
  create,
  update,
  remove,
  importCsv,
  exportCsv,
};
