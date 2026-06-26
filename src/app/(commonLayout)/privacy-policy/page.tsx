"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPrivacyPolicy } from "@/utils/privacyPolicy";

export default function PrivacyPolicyPage() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    setMounted(true);
    setContent(getPrivacyPolicy());
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen py-16 sm:py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D13900]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-16 sm:py-24 select-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-950 transition-colors mb-8 select-none"
        >
          <ChevronLeft className="w-4.5 h-4.5 text-[#D13900] stroke-[2.5]" />
          <span>Back to Home</span>
        </Link>

        {/* Main Content Card */}
        <div className="bg-white rounded-[32px] p-8 sm:p-12 md:p-16 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          {/* Header */}
          <div className="mb-12 pb-6 border-b border-gray-100 select-none">
            <h1 className="text-3xl sm:text-[40px] font-extrabold text-gray-900 tracking-tight mb-4 poppins">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-medium">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
          </div>

          {/* Dynamic Rich Text Content */}
          <div 
            className="rich-text-content" 
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        </div>

      </div>
    </div>
  );
}
