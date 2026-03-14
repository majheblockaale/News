import type { Metadata } from "next";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin Dashboard", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
