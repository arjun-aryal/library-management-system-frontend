import { Navigate } from "react-router-dom";
import { menuItems } from "../config/menuItems";
import { useAuth } from "../context/AuthContext";
import { getMenuPath } from "./roleutils";

export function DashboardRedirect() {
  const { user } = useAuth();

  const firstMenu = menuItems.find((item) =>
    user?.role ? item.roles.includes(user.role) : false,
  );

  if (!firstMenu) {
    return <Navigate to="/login" replace />;
  }

  const redirectPath = getMenuPath(firstMenu.label, firstMenu.path, user);

  return <Navigate to={redirectPath} replace />;
}
