import AdminLayout from "@/components/layout/Layout";
import { ReactNode } from "react";
import { 
  LayoutDashboard, 
  Building2, 
  BarChart3, 
  Users, 
  FileText, 
  ShieldAlert, 
  Settings,
  HelpCircle
} from "lucide-react";

const navItems = [
  {
    key: "/dashboard/admin",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    key: "/dashboard/admin/companies",
    label: "Companies",
    icon: <Building2 size={18} />,
  },
  {
    key: "/dashboard/admin/performance",
    label: "Performance Overview",
    icon: <BarChart3 size={18} />,
  },
  {
    key: "/dashboard/admin/users",
    label: "User Management",
    icon: <Users size={18} />,
  },
  {
    key: "/dashboard/admin/logs",
    label: "Activity Logs",
    icon: <ShieldAlert size={18} />,
  },
  {
    key: "/dashboard/admin/privacy",
    label: "Privacy Policy",
    icon: <FileText size={18} />,
  },
  {
    key: "/dashboard/admin/terms",
    label: "Terms & Conditions",
    icon: <FileText size={18} />,
  },
  {
    key: "/dashboard/admin/settings",
    label: "Settings",
    icon: <Settings size={18} />,
  },
];

const SuperAdminLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems} role="admin">{children}</AdminLayout>;
};

export default SuperAdminLayout;
