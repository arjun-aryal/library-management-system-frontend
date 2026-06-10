export type Role = "super_admin" | "librarian" | "author";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
