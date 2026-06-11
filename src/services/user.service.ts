import clientApi from "../axios/axios";
import type { ListQueryParams, PaginatedResponse } from "../types/common";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "../types/user.type";

async function getAll(
  params: ListQueryParams,
): Promise<PaginatedResponse<User>> {
  const response = await clientApi.get<PaginatedResponse<User>>("/users", {
    params,
  });
  return response.data;
}

async function getById(id: number): Promise<User> {
  const response = await clientApi.get<User>(`/users/${id}`);
  return response.data;
}

async function create(payload: CreateUserPayload): Promise<User> {
  const response = await clientApi.post<User>("/users", payload);
  return response.data;
}

async function update(id: number, payload: UpdateUserPayload): Promise<User> {
  const response = await clientApi.patch<User>(`/users/${id}`, payload);
  return response.data;
}

async function remove(id: number): Promise<User> {
  const response = await clientApi.delete<User>(`/users/${id}`);
  return response.data;
}

export const userService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
