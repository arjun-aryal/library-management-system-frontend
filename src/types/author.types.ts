import type { Role } from "./user.type";

export interface BaseAuthor {
  name: string;
  nationality: string;
  bio: string;
}
export interface Author extends BaseAuthor {
  id: number;
  user_id:number
}

export interface CreateAuthorPayload extends BaseAuthor {
  email?: string;
  role?: Role;

}

export interface UpdateAuthorPayload extends BaseAuthor {}

