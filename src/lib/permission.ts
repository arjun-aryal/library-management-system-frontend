import type { User } from "../types/user.type";

export function canManageBooks(user: User | null): boolean {
  return (
    user?.role === "librarian" ||
    user?.role === "super_admin" ||
    user?.role === "author"
  );
}

export function isReadOnly(user: User | null): boolean {
  return user?.role === "super_admin";
}
