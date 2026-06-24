import React from "react";
import ContactUsSection from "@/components/pages/home/ContactUsSection/ContactUsSection";
import HeroSection from "@/components/pages/home/HeroSection/HeroSection";
import HowItWorksSection from "@/components/pages/home/HowItWorksSection/HowItWorksSection";
import FeaturesSection from "@/components/pages/home/FeaturesSection/FeaturesSection";
import ImportDataSection from "@/components/pages/home/ImportDataSection/ImportDataSection";

const HompPage = () => {
  return (
    <div className="overflow-hidden bg-white">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ImportDataSection />
      <ContactUsSection />
    </div>
  );
};

export default HompPage;
