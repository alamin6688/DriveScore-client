import SuperAdminLayout from "@/components/layout/admin-dashboard-layout/AdminLayout";
import React from "react";
interface AdminLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: AdminLayoutProps) => {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
};

export default layout;
