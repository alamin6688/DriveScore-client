import React from "react";
import { Sparkle, FileText, Zap, Trophy, ChevronRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload Team Data",
    description:
      "Import your team data you download from Cortex via Excel or CSV. Our system reads each score automatically and presents it in a fun gamified platform.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Customized Metrics",
    description:
      "Our proprietary algorithm processes every metric instantly. You have the ability to customize the weight of each metric to your team's standards.",
    icon: Zap,
  },
  {
    number: "03",
    title: "Fun Weekly Leaderboard",
    description:
      "Team members will engage in this gamified platform to see their ranks in each metric compared to their team through their phones on the web app. ",
    icon: Trophy,
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-[#f8f9fa] select-text">
      <div className="max-w-7xl mx-auto px-4"> 
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200/80 bg-white text-xs sm:text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-sm select-none">
            <Sparkle className="w-3.5 h-3.5 text-gray-800 fill-gray-800/20" />
            <span>How It Works</span>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            Get started in 3 simple steps
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium tracking-wide">
            Three simple steps to a motivated team
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="flex flex-col justify-between p-8 sm:p-10 rounded-[32px] border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.05)] hover:border-gray-200 transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  {/* Card Header: Icon on Left, Number on Right */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-11 h-11 rounded-[12px] border border-red-500 bg-white flex items-center justify-center text-red-500">
                      <IconComponent className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <span className="text-[52px] font-black text-gray-950 font-sans tracking-tight leading-none select-none">
                      {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[19px] font-extrabold text-gray-950 mb-3 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[13px] sm:text-sm text-gray-400 font-normal leading-relaxed mb-8">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
