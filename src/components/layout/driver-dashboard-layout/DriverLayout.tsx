"use client";

import AdminLayout from "@/components/layout/Layout";
import { ReactNode } from "react";
import { LayoutDashboard, BarChart3, Trophy, Settings } from "lucide-react";

const navItems = [
  {
    key: "/dashboard/driver",
    label: "My Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "/dashboard/driver/performance",
    label: "My Performance",
    icon: <BarChart3 size={18} />,
  },
  {
    key: "/dashboard/driver/leaderboard",
    label: "Leaderboard",
    icon: <Trophy size={18} />,
  },
  {
    key: "/dashboard/driver/setting",
    label: "Settings",
    icon: <Settings size={18} />,
  },
];

const DriverLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems} role="driver">{children}</AdminLayout>;
};

export default DriverLayout;
