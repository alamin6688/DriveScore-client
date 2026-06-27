"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getTermsConditions } from "@/utils/termsConditions";

export default function AdminTermsConditionsPage() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    setMounted(true);
    setContent(getTermsConditions());
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D13900]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 select-text">
      {/* Terms Card Wrapper */}
      <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight poppins">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Please read these terms carefully before using the ScorecardLeague
              platform.
            </p>
          </div>
          <Link
            href="/dashboard/admin/terms/edit"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#D13900] hover:bg-[#b03000] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer select-none"
          >
            Edit
          </Link>
        </div>

        {/* Dynamic Parsed Rich Text Content */}
        <div
          className="rich-text-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
