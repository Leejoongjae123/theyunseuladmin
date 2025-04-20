import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4">
        {children}
      </main>
    </div>
  );
} 