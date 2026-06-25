"use client";

import React, { useState } from "react";
import {
  Crown,
  SlidersHorizontal,
  Building2,
  Calendar,
  Shield,
  History,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import tabImage1 from "@/assets/tabImages/tabImage1.png";
import tabImage2 from "@/assets/tabImages/tabImage2.png";
import tabImage3 from "@/assets/tabImages/tabImage3.png";
import tabImage4 from "@/assets/tabImages/tabImage4.png";
import tabImage5 from "@/assets/tabImages/tabImage5.png";
import tabImage6 from "@/assets/tabImages/tabImage6.png";

const tabImages = [
  tabImage1,
  tabImage2,
  tabImage3,
  tabImage4,
  tabImage5,
  tabImage6,
];

// Predefined slides content
const featuresData = [
  {
    id: "leaderboards",
    number: "01",
    title: "Real-Time Leaderboards",
    description: "Real-time rankings updated after every upload",
    icon: Crown,
  },
  {
    id: "custom_metric_weights",
    number: "02",
    title: "Custom Metric Weights",
    description: "You decide what matters most to your business",
    icon: SlidersHorizontal,
  },
  {
    id: "multi_company_support",
    number: "03",
    title: "Multi Company Support",
    description: "Each company gets their own private workspace",
    icon: Building2,
  },
  {
    id: "weekly_competition_cycle",
    number: "04",
    title: "Weekly Competition Cycle",
    description: "Auto-reset every week keeps motivation high",
    icon: Calendar,
  },
  {
    id: "data_isolation",
    number: "05",
    title: "Data Isolation",
    description: "Companies never see each other's data",
    icon: Shield,
  },
  {
    id: "performance_history",
    number: "06",
    title: "Performance History",
    description: "Track improvement trends over weeks and months",
    icon: History,
  },
];

const FeaturesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % featuresData.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + featuresData.length) % featuresData.length);
  };

  const activeFeature = featuresData[activeIndex];
  const IconComponent = activeFeature.icon;

  return (
    <section id="features" className="py-24 bg-[#f8f9fa] select-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        
        {/* Badge: Platform Features */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-sm select-none">
            <div className="w-2 h-2 rounded-full bg-[#D13900] animate-pulse" />
            <span>Platform Features</span>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 tracking-tight leading-tight mb-4 poppins">
            Everything you need to make the scorecard fun
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium tracking-wide">
            Built for fleet managers who want results
          </p>
        </div>

        {/* Main Grid: Left Interactive Card & Right Image Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Card: Feature Info (clickable to swap to next slide) */}
          <div 
            onClick={nextSlide}
            className="flex flex-col justify-center p-6 sm:p-8 rounded-[32px] border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-all duration-300 min-h-[320px] cursor-pointer select-none group"
          >
            <div>
              {/* Feature Icon in Rounded Red/Orange Border Container */}
              <div className="w-12 h-12 rounded-2xl border border-red-500/80 bg-white flex items-center justify-center text-[#D13900] shadow-sm mb-5 transition-transform duration-300 group-hover:scale-105">
                <IconComponent className="w-5 h-5 stroke-2" />
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2.5 tracking-tight poppins transition-all duration-300">
                {activeFeature.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal mb-6 max-w-md">
                {activeFeature.description}
              </p>

              {/* Carousel Navigation Footer */}
              <div className="flex items-center justify-between mt-4">
                {/* Navigation Arrow Circles */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card onClick (nextSlide) from firing
                      prevSlide();
                    }}
                    disabled={activeIndex === 0}
                    aria-label="Previous Feature"
                    className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 shadow-sm ${
                      activeIndex === 0
                        ? "border-gray-250 text-gray-300 pointer-events-none"
                        : "border-[#D13900] text-[#D13900] hover:text-[#b23000] hover:bg-red-50/20 active:scale-95 cursor-pointer"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.25]" />
                  </button>
                  {activeIndex < featuresData.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card onClick (nextSlide) from firing
                        nextSlide();
                      }}
                      aria-label="Next Feature"
                      className="w-11 h-11 rounded-full border border-[#D13900] bg-white hover:bg-red-50/20 flex items-center justify-center text-[#D13900] hover:text-[#b23000] transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5 stroke-[2.25]" />
                    </button>
                  )}
                </div>

                {/* Pagination counter */}
                <div className="text-sm font-semibold font-sans tracking-wide text-gray-400 select-none">
                  <span className="text-[#D13900] text-base">{activeFeature.number}</span>
                  <span className="mx-1">/</span>
                  <span>{featuresData.length.toString().padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Static Dashboard Overview Image */}
          <div className="rounded-[32px] border border-gray-100 bg-linear-to-t from-[#FFEBE6] via-white to-[#FFEBE6] shadow-[0_8px_30px_rgba(0,0,0,0.015)] p-4 sm:p-6 flex flex-col justify-center items-center overflow-hidden min-h-[320px]">
            <div className="relative w-full h-full flex justify-center items-center">
              <Image
                src={tabImages[activeIndex] || tabImage1}
                alt={`${activeFeature.title} Mockup`}
                className="w-full h-auto object-contain rounded-[24px] max-h-[460px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                priority
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
