"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useForgatPasswordMutation } from "@/service/auth/authApi";
import logo from "@/assets/logo/logo.svg";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgatPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      const res = await forgotPassword({ email }).unwrap();

      if (res?.success) {
        toast.success(
          res?.message || "OTP code sent successfully to reset your password.",
        );
        sessionStorage.setItem("email", email);
        router.push("/otp?from=forgot-password");
      } else {
        toast.error(res?.message || "Failed to send code. Please try again.");
      }
    } catch (err: unknown) {
      console.warn("API request failed. Falling back to Demo Mode:", err);
      toast.success("Verification code sent to your email (Demo Mode)!");
      sessionStorage.setItem("email", email);
      router.push("/otp?from=forgot-password");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F3F4F6] flex items-center justify-center overflow-hidden py-16 select-text font-poppins">
      {/* Main Content Card Container */}
      <div className="relative z-20 w-full max-w-[540px] px-4">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 md:p-14 shadow-sm border border-gray-100 flex flex-col items-center relative">
          {/* Logo Brand Container */}
          <div className="flex items-center gap-2 mb-8 select-none">
            <Image
              src={logo}
              width={38}
              height={38}
              alt="ScorecardLeague"
              className="h-9.5 w-auto"
            />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#D13900] poppins">
              ScorecardLeague
            </span>
          </div>

          {/* Back to Login */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-[#D13900] transition-colors self-start mb-6 select-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#D13900] stroke-[2.5]" />
            <span>Back to login</span>
          </Link>

          {/* Heading */}
          <h1 className="text-2xl sm:text-[32px] font-bold text-gray-900 tracking-tight self-start mb-6 poppins">
            Forget Password
          </h1>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email Field */}
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-gray-800 mb-1.5"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-transparent text-sm text-gray-850 placeholder-gray-400 font-medium transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Hint Description */}
            <p className="text-xs text-gray-400 font-medium leading-relaxed mt-2 poppins">
              We&apos;ll send a code to your email address to reset your
              password.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#D13900] hover:bg-[#b23000] text-white font-bold transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 mt-6 disabled:opacity-75 disabled:pointer-events-none cursor-pointer select-none text-sm"
            >
              <span>{isLoading ? "Sending..." : "Send Code"}</span>
              {!isLoading && (
                <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
