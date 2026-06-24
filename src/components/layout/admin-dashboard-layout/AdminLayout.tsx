"use client";

import AdminLayout from "@/components/layout/Layout";
import { ReactNode } from "react";
import { LayoutDashboard, Users, CreditCard, Settings } from "lucide-react";

const navItems = [
  {
    key: "/dashboard/admin",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "/dashboard/admin/all-users",
    label: "All Users",
    icon: <Users size={18} />,
  },
  {
    key: "/dashboard/admin/subscription",
    label: "Subscriptions",
    icon: <CreditCard size={18} />,
  },
  {
    key: "/dashboard/admin/settings",
    label: "Settings",
    icon: <Settings size={18} />,
  },
];

const SuperAdminLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default SuperAdminLayout;
