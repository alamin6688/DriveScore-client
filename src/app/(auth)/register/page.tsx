/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRegisterUserMutation } from "@/service/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Mail, User, Building, ArrowLeft } from "lucide-react";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

// import leftOverlayPng from "@/assets/overlays/left-shade.png";
// import rightOverlayPng from "@/assets/overlays/right-shade.png";
// import leftDecorationPng from "@/assets/overlays/left-float-box.png";
// import rightDecorationPng from "@/assets/overlays/right-float-box.png";
// import leftGlitterDecorationPng from "@/assets/overlays/glitter-effect.png";
import logo from "@/assets/logo/logo.png";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [register, { isLoading }] = useRegisterUserMutation();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromHero = searchParams.get("email")?.trim();
    if (emailFromHero) {
      setEmail(emailFromHero);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = { name, email, companyName };
      const res = await register(payload).unwrap();
      if (res?.success === true) {
        // SAVE EMAIL FOR OTP VERIFICATION
        sessionStorage.removeItem("temp_accessToken");
        sessionStorage.removeItem("temp_refreshToken");
        sessionStorage.setItem("email", email);
        toast.success(res?.message || "Please verify OTP to continue.");

        router.push("/otp");
      } else {
        toast.error(res?.message || "Something went wrong.");
      }
    } catch (err: unknown) {
      toast.error(
        getApiErrorMessage(err, "Something went wrong. Please try again.")
      );
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex items-center justify-center overflow-hidden py-12 select-text">
      
      {/* Soft Ambient Corner Glows (Gradients on left and right) */}
      {/* <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-br from-[#4CAF50]/15 via-[#4CAF50]/3 to-transparent blur-[80px] sm:blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-bl from-[#4CAF50]/15 via-[#4CAF50]/3 to-transparent blur-[80px] sm:blur-[120px] pointer-events-none select-none z-0" /> */}

      {/* Left Pluses Decoration - Hidden on mobile */}
      {/* <div className="absolute left-[3%] top-[30%] w-[250px] md:w-[400px] aspect-[3/4] pointer-events-none select-none z-10 opacity-100 contrast-200 hidden sm:block">
        <Image
          src={leftDecorationPng}
          alt="Left Decor"
          fill
          className="object-contain"
          priority
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div> */}

      {/* Glitter effect decoration on top-left corner - Hidden on mobile */}
      {/* <div className="absolute left-[3%] top-[30%] w-[250px] md:w-[400px] aspect-[3/4] pointer-events-none select-none z-10 opacity-100 contrast-200 hidden sm:block">
        <Image
          src={leftGlitterDecorationPng}
          alt="Glitter Decor"
          fill
          className="object-contain"
          priority
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div> */}

      {/* Right Pluses Decoration - Hidden on mobile */}
      {/* <div className="absolute right-[3%] top-[30%] w-[250px] md:w-[400px] aspect-[3/4] pointer-events-none select-none z-10 opacity-100 contrast-200 hidden sm:block">
        <Image
          src={rightDecorationPng}
          alt="Right Decor"
          fill
          className="object-contain"
          priority
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div> */}

      {/* Bottom Left Floating Cards - Hidden on mobile */}
      {/* <div className="absolute -left-[35%] bottom-[15%] w-[220px] md:w-[1300px] aspect-square pointer-events-none select-none z-10 opacity-80 hidden sm:block">
        <Image
          src={leftOverlayPng}
          alt="Left Overlay Cards"
          fill
          className="object-contain"
          priority
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div> */}

      {/* Bottom Right Floating Cards - Hidden on mobile */}
      {/* <div className="absolute -right-[35%] bottom-[15%] w-[220px] md:w-[1300px] aspect-square pointer-events-none select-none z-10 opacity-70 hidden sm:block">
        <Image
          src={rightOverlayPng}
          alt="Right Overlay Cards"
          fill
          className="object-contain"
          priority
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div> */}

      {/* Main Content Card Container */}
      <div className="relative z-20 w-full max-w-[540px] px-4">
        <div className="bg-white rounded-[32px] p-6 sm:p-12 md:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100/80 flex flex-col items-center relative">
          
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="absolute left-5 top-5 sm:left-7 sm:top-7 flex items-center justify-center w-8 h-8 rounded-full border border-gray-200/60 hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-all shadow-sm hover:shadow"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Logo */}
          <div className="relative w-44 h-14 select-none mb-6">
            <Image
              src={logo}
              alt="Accusum Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight text-center mb-1.5 font-poppins">
            Create an Account
          </h1>
          
          {/* Subheading */}
          <p className="text-sm sm:text-base text-gray-400 font-medium text-center mb-8 font-poppins">
            Join ACCUSUM for AI-powered bookkeeping
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Name Field */}
            <div className="w-full">
              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#F8F8F6] border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-sm sm:text-base text-gray-800 placeholder-gray-400 font-medium transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#F8F8F6] border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-sm sm:text-base text-gray-800 placeholder-gray-400 font-medium transition-all"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Business / Company Name Field */}
            <div className="w-full">
              <label
                htmlFor="companyName"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Business / Company Name
              </label>
              <div className="relative flex items-center">
                <Building className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#F8F8F6] border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-sm sm:text-base text-gray-800 placeholder-gray-400 font-medium transition-all"
                  placeholder="Enter your business/company name"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ background: "var(--Gradian-Colur, linear-gradient(180deg, #258200 0%, #58B500 100%))" }}
              className="w-full py-4 rounded-full hover:brightness-110 text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg text-center mt-2 disabled:opacity-75 disabled:pointer-events-none"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>

            {/* Terms and Privacy Text */}
            <p className="text-xs sm:text-[13px] text-[#71717a] text-left mt-3 font-poppins font-normal leading-relaxed">
              By signing up, you are accepting and agreeing to the ACCUSUM{" "}
              <Link href="/terms" className="font-bold underline hover:text-green-600 transition-colors">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="font-bold underline hover:text-green-600 transition-colors">
                Privacy Policy.
              </Link>
            </p>

          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-sm font-medium text-gray-500 font-poppins">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#3da800] font-bold hover:underline ml-1"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
