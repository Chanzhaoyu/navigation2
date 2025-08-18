import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "@/components/AdminSidebar";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
