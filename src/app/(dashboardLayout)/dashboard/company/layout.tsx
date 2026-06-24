import UserLayout from "@/components/layout/driver-dashboard-layout/DriverLayout";
import React from "react";
interface AdminLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: AdminLayoutProps) => {
  return <UserLayout>{children}</UserLayout>;
};

export default layout;
