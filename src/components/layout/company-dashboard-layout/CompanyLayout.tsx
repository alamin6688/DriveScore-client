"use client";

import AdminLayout from "@/components/layout/Layout";
import { ReactNode } from "react";
import { LayoutDashboard, Settings } from "lucide-react";

const navItems = [
  {
    key: "/dashboard/company",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "/dashboard/company/setting",
    label: "Settings",
    icon: <Settings size={18} />,
  },
];

const CompanyLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default CompanyLayout;
