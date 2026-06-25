import CompanyLayout from "@/components/layout/company-dashboard-layout/CompanyLayout";
import React from "react";
interface AdminLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: AdminLayoutProps) => {
  return <CompanyLayout>{children}</CompanyLayout>;
};

export default layout;
