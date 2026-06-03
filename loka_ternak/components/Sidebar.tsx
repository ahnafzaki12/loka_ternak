"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Leaf,
  Wallet,
  HeartPulse,
  Package,
  Sparkles,
  PieChart,
  Menu,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Manajemen Ternak", href: "/manajemen", icon: ClipboardList },
  { name: "Manajemen Pakan", href: "/pakan", icon: Leaf },
  { name: "Keuangan", href: "/keuangan", icon: Wallet },
  { name: "Kesehatan Ternak", href: "/kesehatan", icon: HeartPulse },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Insight", href: "/insight", icon: PieChart },
  { name: "AI Assistant", href: "/ai", icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{name: string, role: string} | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-gray-100 transition-all duration-300 flex flex-col relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <span className="font-bold text-2xl tracking-tight text-gray-900">
              Loka<span className="text-emerald-600">Ternak</span>
            </span>
          )}
          {collapsed && (
            <span className="font-bold text-2xl tracking-tight text-emerald-600 mx-auto">
              L
            </span>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 shadow-sm z-10"
      >
        {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors group",
                isActive
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                collapsed ? "justify-center" : "justify-start"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Area / Bottom */}
      <div className="p-4 border-t border-gray-100">
        <div className={cn(
          "flex items-center gap-3",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-700 font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{user?.name || "Loading..."}</span>
              <span className="text-xs text-gray-500">
                {user?.role === 'OWNER' ? 'Pemilik' : (user?.role === 'WORKER' ? 'Pekerja' : '')}
              </span>
            </div>
          )}
        </div>
        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            "mt-4 flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full",
            collapsed ? "justify-center" : "justify-start"
          )}
          title={collapsed ? "Keluar" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
