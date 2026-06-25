"use client";

import React from "react";
import Image from "next/image";
import dashboardImage1 from "@/assets/images/DashboardImageNew1.png";
import dashboardImage2 from "@/assets/images/DashboardImageNew2.png";

const PerspectivesSection = () => {
  return (
    <section id="perspectives" className="py-20 bg-[#F2F2F2] select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading & Subtitle */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-normal text-gray-900 leading-tight tracking-tight mb-5 poppins">
            See the platform from every perspective
          </h2>
          <p className="text-[13px] sm:text-sm md:text-[15px] text-gray-500/90 leading-relaxed font-medium max-w-2xl mx-auto px-2">
            Powerful insights for company owners to manage their teams and individual drivers to track and improve their performance.
          </p>
        </div>

        {/* Two Images Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
          <div className="relative w-full h-auto aspect-[1.60] overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-100">
            <Image
              src={dashboardImage1}
              alt="Driver Dashboard Perspective"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="relative w-full h-auto aspect-[1.6] overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-100">
            <Image
              src={dashboardImage2}
              alt="Company Dashboard Perspective"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default PerspectivesSection;
