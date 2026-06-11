import type { Role } from "../types/user.type";

export const formatRole = (role: Role): string => {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
