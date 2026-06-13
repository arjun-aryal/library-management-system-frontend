import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/LoginPage";
import { Register } from "../pages/auth/RegisterPages";
import { DashboardLayout } from "../pages/dashboard/DashboardPage";
import { AuthorsPage } from "../pages/dashboard/Authorpage";
import { UsersPage } from "../pages/dashboard/UserPage";
import { BooksPage } from "../pages/dashboard/BookPages";
import { DashboardRedirect } from "../lib/dashboardRedirect";
import { PublicRoute } from "./PublicRoutes";
import { ProtectedRoute } from "./ProtectedRoutes";
import { RoleGuard } from "./RoleGuard";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardRedirect />} />

          <Route element={<RoleGuard allowedRoles={["super_admin"]} />}>
            <Route path="users" element={<UsersPage />} />
          </Route>

          <Route
            element={<RoleGuard allowedRoles={["super_admin", "librarian"]} />}
          >
            <Route path="authors" element={<AuthorsPage />} />
          </Route>

          <Route
            element={
              <RoleGuard
                allowedRoles={["super_admin", "librarian", "author"]}
              />
            }
          >
            <Route path="authors/:authorId/books" element={<BooksPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
