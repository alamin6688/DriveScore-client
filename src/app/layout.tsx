import ScrollToTopButton from "@/components/ui/ScrollToTopButton/ScrollToTopButton";
import { HeroUiProvider } from "@/lib/providers/HeroUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { ConfigProvider } from "antd";
import "antd/dist/reset.css";

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Drive Score - Gamified Performance Tracking",
  description:
    "Drive Score is a gamified platform that transforms Excel-based performance tracking into real-time insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${dmSans.variable} antialiased bg-white`}
      >
        <HeroUiProvider>
          <ReduxProvider>
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  colorPrimary: "#0BA8CC",
                  colorInfo: "#0BA8CC",
                  colorSuccess: "#3ECF8E",
                  colorWarning: "#FAAD14",
                  colorError: "#FF6B6B",

                  colorTextBase: "#1F1F1F",
                  colorBgBase: "#FFFFFF",
                  borderRadius: 8,
                  fontSize: 15,
                  lineHeight: 1.6,
                  controlHeight: 40,
                },
                components: {
                  Button: {
                    colorPrimary: "#0BA8CC",
                    colorPrimaryHover: "#0aa0bd",
                    colorPrimaryActive: "#088aa3",

                    colorSuccess: "#3ECF8E",
                    colorSuccessHover: "#36b87d",
                    colorSuccessActive: "#2fa36e",

                    colorWarning: "#FAAD14",
                    colorWarningHover: "#e89c0f",
                    colorWarningActive: "#c27e0d",

                    colorError: "#FF6B6B",
                    colorErrorHover: "#e95e5e",
                    colorErrorActive: "#c94d4d", 
                  },
                },
              }}
            >
              <>
                <div className="min-h-screen grid grid-rows-[auto_1fr_auto] text-title max-w-[100vw] overflow-hidden">
                  {children}
                </div>
                <ScrollToTopButton />
                <Toaster richColors position="top-right" />
              </>
            </ConfigProvider>
          </ReduxProvider>
        </HeroUiProvider>
      </body>
    </html>
  );
}
