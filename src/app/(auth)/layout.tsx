"use client";

import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-white">
      {children}
    </div>
  );
};

export default layout;
