"use client";
 
import AdminLayout from "@/components/layout/Layout";
import { ReactNode } from "react";
import { LayoutDashboard, Settings, Upload, Users, Trophy, SlidersHorizontal } from "lucide-react";
 
const navItems = [
  {
    key: "/dashboard/company",
    label: "Overview",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "/dashboard/company/data-upload",
    label: "Data Upload",
    icon: <Upload size={18} />,
  },
  {
    key: "/dashboard/company/drivers",
    label: "Drivers",
    icon: <Users size={18} />,
  },
  {
    key: "/dashboard/company/leaderboard",
    label: "Leaderboard",
    icon: <Trophy size={18} />,
  },
  {
    key: "/dashboard/company/scoring-system",
    label: "Scoring System",
    icon: <SlidersHorizontal size={18} />,
  },
  {
    key: "/dashboard/company/settings",
    label: "Settings",
    icon: <Settings size={18} />,
  },
];
 
const CompanyLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems} role="company">{children}</AdminLayout>;
};
 
export default CompanyLayout;
