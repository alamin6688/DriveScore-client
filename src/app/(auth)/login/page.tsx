"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import {
  useLoginUserMutation,
  useResendOtpMutation,
} from "@/service/auth/authApi";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import logo from "@/assets/logo/logo.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginUserMutation();
  const [resendOtp] = useResendOtpMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = { email };
      const res = await login(payload).unwrap();

      if (res?.success) {
        if (!res.data) {
          toast.info(res.message || "Please verify your account.");
          sessionStorage.setItem("email", email);
          router.push("/otp");
          return;
        }

        // 1. Save temp tokens to sessionStorage for verification recovery
        sessionStorage.setItem("temp_accessToken", res.data.accessToken);
        sessionStorage.setItem("temp_refreshToken", res.data.refreshToken);
        sessionStorage.setItem("email", email);

        // 2. Dispatch OTP code sending
        try {
          await resendOtp({ email }).unwrap();
        } catch (otpErr) {
          console.error("Failed to send OTP:", otpErr);
        }

        toast.success("OTP sent to your email. Please verify.");
        router.push("/otp");
      }
    } catch (err: unknown) {
      console.error("Login failed:", err);
      toast.error(
        getApiErrorMessage(
          err,
          "An unexpected error occurred. Please try again.",
        ),
      );
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f8f9fa] flex items-center justify-center overflow-hidden py-16 select-text">
      {/* Main Content Card Container */}
      <div className="relative z-20 w-full max-w-[540px] px-4">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 md:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col items-center">
          {/* Logo Brand Container */}
          <div className="flex items-center gap-2 mb-8 select-none">
            <Image
              src={logo}
              width={38}
              height={38}
              alt="DriveScore"
              className="h-9.5 w-auto"
            />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#D13900] poppins">
              DriveScore
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-[32px] font-bold text-gray-900 tracking-tight text-center mb-3 poppins">
            Welcome to DRIVESCORE
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-sm text-gray-500 font-medium text-center mb-8 max-w-sm leading-relaxed poppins">
            Turn Excel data into scores, rankings, and weekly competition.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email Field */}
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5"
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
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-transparent text-sm text-gray-800 placeholder-gray-400 font-medium transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-transparent text-sm text-gray-800 placeholder-gray-400 font-medium transition-all"
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex justify-between items-center w-full pt-1.5 select-none">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#D13900] focus:ring-[#D13900] w-3.5 h-3.5"
                />
                <span>Remember Me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs sm:text-sm font-bold text-[#D13900] hover:underline cursor-pointer"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#D13900] hover:bg-[#b23000] text-white font-bold transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 mt-6 disabled:opacity-75 disabled:pointer-events-none cursor-pointer select-none"
            >
              <span>{isLoading ? "Logging In..." : "Log In"}</span>
              {!isLoading && (
                <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
              )}
            </button>
          </form>

          {/* Redirect to Sign Up */}
          <div className="mt-8 text-center text-sm font-medium text-gray-500 poppins">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#D13900] font-bold hover:underline ml-1 cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
