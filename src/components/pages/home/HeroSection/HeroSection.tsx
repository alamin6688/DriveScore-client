"use client";

import Link from "next/link";
import Image from "next/image";
import dashboardMockup from "@/assets/images/heroSectionImage.png";

const HeroSection = () => {
  return (
    <div className="relative w-full min-h-[580px] lg:min-h-[640px] bg-linear-to-t from-[#FFEBE6] via-white to-white overflow-hidden flex items-center justify-center pt-32 md:pt-40 select-text">
      <div className="container relative z-20 px-4 sm:px-6 lg:px-8 mx-auto text-center flex flex-col items-center">
        {/* Trophy Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-250 bg-white text-xs sm:text-sm font-semibold text-gray-800 mb-10 shadow-sm select-none">
          <span>🏆</span>
          <span>Gamified Performance Tracking</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-gray-900 leading-[1.15] tracking-normal mb-6 max-w-5xl select-text px-1 sm:px-0 poppins">
          Turn Your{" "}
          <span className="italic font-light text-gray-500">Scorecard</span>
          <span>{" "}</span>
          Into a Fun <span> </span>
          {/* <br className="hidden md:inline" /> */}
          Game
        </h1>

        {/* Sub-headline */}
        <p className="text-sm sm:text-base md:text-lg lg:text-[18px] leading-relaxed text-gray-500 max-w-3xl mb-12 select-text font-normal px-2 sm:px-0">

          Upload your scorecard data via excel, set your custom metric weights, let us calculate the scores, watch your team compete each week on a live scoreboard.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="text-sm sm:text-base py-3.5 px-8 rounded-full bg-[#D13900] hover:bg-[#b23000] text-white font-bold transition-all duration-200 shadow-sm hover:shadow-lg flex items-center gap-2"
          >
            Get started for free <span>→</span>
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm sm:text-base py-3.5 px-8 rounded-full bg-white hover:bg-gray-50 border border-[#D13900] text-[#D13900] font-bold transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            See how it work <span>→</span>
          </Link>
        </div>

        {/* Mockup Dashboard Image (2nd Half) */}
        <div className="mt-16 max-w-7xl mx-auto relative z-10 flex justify-center">
          {/* Subtle Orange-Red Brand Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#D13900]/10 rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />

          <Image
            src={dashboardMockup}
            alt="Scorecard League Dashboard Mockup"
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
