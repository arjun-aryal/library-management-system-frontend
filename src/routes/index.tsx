import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/LoginPage";
import { Register } from "../pages/auth/RegisterPages";
import { DashboardLayout } from "../pages/dashboard/DashboardPage";
import { AuthorsPage } from "../pages/dashboard/Authorpage";
import { UsersPage } from "../pages/dashboard/UserPage";
import { BooksPage } from "../pages/dashboard/BookPages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="users" element={<UsersPage />} />
        <Route path="authors" element={<AuthorsPage />} />
        <Route path="books" element={<BooksPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
