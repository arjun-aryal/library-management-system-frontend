import { BookOpen, PenTool, Users, type LucideIcon } from "lucide-react";
import type { Role } from "../types/user.type";

export interface MenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
  roles: Role[];
}

export const menuItems: MenuItem[] = [
  {
    label: "Users",
    icon: Users,
    path: "/dashboard/users",
    roles: ["super_admin"],
  },
  {
    label: "Authors",
    icon: PenTool,
    path: "/dashboard/authors",
    roles: ["super_admin", "librarian"],
  },
  {
    label: "Books",
    icon: BookOpen,
    path: "/dashboard/books",
    roles: ["super_admin", "librarian","author"],
  },
];
