"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] p-6 font-poppins">
      <div className="bg-white rounded-3xl border border-gray-100 p-10 md:p-14 shadow-xl max-w-lg w-full flex flex-col items-center text-center gap-8 relative overflow-hidden">
        {/* Decorative Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#D13900] to-[#FF4D4F]" />

        {/* Illustrated Icon Container */}
        <div className="w-20 h-20 rounded-2xl bg-red-50/50 flex items-center justify-center text-[#D13900] border border-red-100/50 relative">
          <AlertCircle className="w-10 h-10 stroke-[1.5]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF3B30] rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF3B30] rounded-full" />
        </div>

        {/* 404 Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-[#D13900] to-[#FF4D4F] leading-none">
            404
          </h1>
          <h2 className="text-xl font-bold text-gray-900">Oops! Page Not Found</h2>
          <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-[#D13900] hover:bg-[#b23000] text-white py-3 px-5 rounded-2xl font-bold text-xs transition-all shadow-sm cursor-pointer">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-500 py-3 px-5 rounded-2xl font-bold text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}