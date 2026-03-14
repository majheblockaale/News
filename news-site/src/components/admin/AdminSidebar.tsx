"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Layers,
  Rss,
  BarChart3,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/articles/new", label: "New Article", icon: PlusCircle },
  { href: "/admin/queue", label: "Content Queue", icon: Layers },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] p-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
        Admin Panel
      </h2>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors",
                isActive
                  ? "bg-accent text-white font-medium"
                  : "text-muted hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
