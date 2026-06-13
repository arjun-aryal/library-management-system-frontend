import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { menuItems } from "../../config/menuItems";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import { formatRole, getMenuPath } from "../../lib/roleutils";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleItems = menuItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false,
  );

  const initials =
    user?.name
      ?.trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "";

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* User Info */}
      <div className="flex h-20 items-center border-b px-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium">{user?.name}</p>

            {user && (
              <Badge variant="secondary" className="mt-1">
                {formatRole(user.role)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const menuPath = getMenuPath(item.label, item.path, user);

          return (
            <Link
              key={item.label}
              to={menuPath}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(menuPath)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
