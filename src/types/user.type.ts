export type Role = "super_admin" | "librarian" | "author";

export interface BaseUser {
  name: string;
  email: string;
  role: Role;
}

export interface User extends BaseUser {
  id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload extends BaseUser {
  password?: string;
}

export interface UpdateUserPayload extends BaseUser {
  password?: string;
}
