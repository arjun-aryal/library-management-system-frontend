import type { Role, User } from "../types/user.type";

export const formatRole = (role: Role): string => {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


export function getMenuPath(
  label: string,
  path: string,
  user: User | null
): string {
  if (label === "Books" && user?.role === "author" && user.authorId) {
    return `/dashboard/authors/${user.authorId}/books`;
  }
  return path;
}

