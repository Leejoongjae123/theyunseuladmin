import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full">
      <AdminSidebar />
      <main className="flex md:ml-64 w-full">
        {children}
      </main>
    </div>
  );
} 