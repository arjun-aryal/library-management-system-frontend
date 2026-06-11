import { Outlet } from "react-router-dom";
import { Header } from "../../components/layout/Header";
import { Sidebar } from "../../components/layout/SideBar";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0">
        <Sidebar />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
