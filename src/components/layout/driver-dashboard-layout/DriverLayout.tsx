"use client";

import AdminLayout from "@/components/layout/Layout";
import { ReactNode } from "react";
import { LayoutDashboard, Settings } from "lucide-react";

const navItems = [
  {
    key: "/dashboard/driver",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "/dashboard/driver/setting",
    label: "Settings",
    icon: <Settings size={18} />,
  },
];

const DriverLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default DriverLayout;
