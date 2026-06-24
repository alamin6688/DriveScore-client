"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] p-6 font-poppins">
      <div className="bg-white rounded-3xl border border-gray-100 p-10 md:p-14 shadow-xl max-w-lg w-full flex flex-col items-center text-center gap-8 relative overflow-hidden">
        {/* Decorative Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#FF3B30] to-[#E02B20]" />

        {/* Illustrated Icon Container */}
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center text-[#FF3B30] border border-red-100 relative">
          <AlertTriangle className="w-10 h-10 stroke-[1.5]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF3B30] rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF3B30] rounded-full" />
        </div>

        {/* 500 Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-[#FF3B30] to-[#E02B20] leading-none">
            500
          </h1>
          <h2 className="text-xl font-bold text-gray-900">Something Went Wrong</h2>
          <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto leading-relaxed">
            An unexpected error occurred while loading this page. You can try reloading or head back to your dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 bg-[#4CAF50] hover:bg-[#439e47] text-white py-3 px-5 rounded-2xl font-bold text-xs transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link href="/dashboard/user" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-500 py-3 px-5 rounded-2xl font-bold text-xs transition-all cursor-pointer">
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
