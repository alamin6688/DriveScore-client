import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
// import AiToggleButton from "@/components/ui/AiToggleButton/AiToggleButton";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton/ScrollToTopButton";
import { HeroUiProvider } from "@/lib/providers/HeroUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Drive Score - Gamified Performance Tracking",
  description: "Drive Score is a gamified platform that transforms Excel-based performance tracking into real-time insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <HeroUiProvider>
        <ReduxProvider>
          <>
            <div className="min-h-screen grid grid-rows-[auto_1fr_auto] max-w-[100vw] overflow-hidden">
              <div className="">
                <Navbar />
              </div>
              <div className="w-full">{children}</div>
              <div className="mx-4 md:mx-8 mb-4 md:mb-10 lg:mb-8  rounded-2xl bg-[#181922] p-6 md:p-12 md:pt-16">
 
              <Footer />
              </div>
            </div>
            <ScrollToTopButton />
            {/* <AiToggleButton /> */}
          </>
        </ReduxProvider>
      </HeroUiProvider>
    </div>
  );
}
