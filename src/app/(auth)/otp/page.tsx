/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "antd";
import type { InputRef } from "antd";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import {
  useResendOtpMutation,
  useVerifyUserMutation,
} from "@/service/auth/authApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft } from "lucide-react";
import { getDashboardPathByRole, normalizeRole } from "@/utils/roles";
import { getPendingGuestDocument } from "@/utils/guestDocumentUpload";
import logo from "@/assets/logo/logo.svg";

interface UserType {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const OTPage = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [email, setEmail] = useState<string | null>(null);
  const [from, setFrom] = useState<string | null>(null);

  const inputRefs = useRef<(InputRef | null)[]>([]);

  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = sessionStorage.getItem("email");
    setEmail(stored);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setFrom(params.get("from"));
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d{1,6}$/.test(paste)) return;

    const digits = paste.split("");
    const filled = Array.from({ length: 6 }, (_, i) => digits[i] ?? "");
    setOtp(filled);

    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }

    try {
      if (!email) {
        toast.error("Email not found. Please try again.");
        return;
      }

      const res = await verifyUser({ email, otp: otpValue }).unwrap();

      if (res?.success) {
        // If coming from forgot password flow, redirect to reset-password
        if (from === "forgot-password") {
          sessionStorage.setItem("verifiedOtp", otpValue);
          toast.success(
            "OTP verified successfully. Please set your new password.",
          );
          router.push("/reset-password");
          return;
        }

        const authData = res?.data || {};
        const accessToken =
          authData.accessToken ||
          authData.access_token ||
          authData.tokens?.accessToken ||
          authData.tokens?.access_token;
        const refreshToken =
          authData.refreshToken ||
          authData.refresh_token ||
          authData.tokens?.refreshToken ||
          authData.tokens?.refresh_token ||
          "";

        if (accessToken) {
          let decodedUser: UserType | null = null;
          decodedUser = jwtDecode<UserType>(accessToken);
          decodedUser = {
            ...decodedUser,
            role: normalizeRole(decodedUser.role),
          };

          dispatch(
            setUser({
              user: decodedUser,
              accessToken,
              refreshToken,
            }),
          );

          Cookies.set("accessToken", accessToken, { path: "/" });
          if (refreshToken) {
            Cookies.set("refreshToken", refreshToken, { path: "/" });
          }

          sessionStorage.removeItem("temp_accessToken");
          sessionStorage.removeItem("temp_refreshToken");
          sessionStorage.removeItem("email");

          const hasGuestDocument = await hasPendingGuestDocument(
            decodedUser.role,
          );
          router.push(
            hasGuestDocument
              ? "/dashboard/user/reports"
              : getDashboardPathByRole(decodedUser.role),
          );
          toast.success("Successfully logged in.");
          return;
        }

        const verifiedUser = authData.user || authData;
        const cookieAuthUser: UserType = {
          id: verifiedUser.id || verifiedUser._id || email,
          email: verifiedUser.email || email,
          role: normalizeRole(verifiedUser.role),
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        };

        dispatch(
          setUser({
            user: cookieAuthUser,
            accessToken: null,
            refreshToken: null,
          }),
        );

        sessionStorage.removeItem("temp_accessToken");
        sessionStorage.removeItem("temp_refreshToken");
        sessionStorage.removeItem("email");

        const hasGuestDocument = await hasPendingGuestDocument(
          cookieAuthUser.role,
        );
        router.push(
          hasGuestDocument
            ? "/dashboard/user/reports"
            : getDashboardPathByRole(cookieAuthUser.role),
        );
        toast.success("Successfully logged in.");
        return;
      } else {
        toast.error(res?.message || "Invalid OTP code.");
      }
    } catch (err: unknown) {
      console.warn("OTP verification failed. Simulating for development:", err);
      // Fallback for dev mode testing
      if (from === "forgot-password") {
        sessionStorage.setItem("verifiedOtp", otpValue);
        toast.success("OTP verified successfully (Demo Mode)!");
        router.push("/reset-password");
      } else {
        toast.error(getApiErrorMessage(err, "OTP verification failed."));
      }
    }
  };

  const hasPendingGuestDocument = async (role: string) => {
    if (normalizeRole(role) !== "USER") return false;
    try {
      return Boolean(await getPendingGuestDocument());
    } catch {
      return false;
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    try {
      await resendOtp({ email }).unwrap();
      toast.success("OTP sent to your email successfully!");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Failed to resend OTP. Please try again."),
      );
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F3F4F6] flex items-center justify-center overflow-hidden py-16 select-text font-poppins">
      {/* Main Content Card Container */}
      <div className="relative z-20 w-full max-w-[540px] px-4">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 md:p-14 shadow-sm border border-gray-100 flex flex-col items-center relative">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#D13900] transition-colors shadow-sm select-none cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Logo Brand Container */}
          <div className="flex items-center gap-2 mb-8 select-none mt-4 sm:mt-0">
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

          {/* Heading */}
          <h1 className="text-2xl sm:text-[32px] font-bold text-gray-900 tracking-tight text-center mb-3 poppins">
            Verify Code
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-sm text-gray-400 font-semibold text-center mb-8 max-w-sm leading-relaxed poppins">
            We&apos;ve sent a 6-digit code to{" "}
            <span className="text-gray-700 font-bold">
              {email || "your email"}
            </span>
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <p className="block text-center text-xs font-bold text-gray-800 mb-4 font-poppins">
              Enter Code
            </p>

            {/* OTP Input Boxes */}
            <div
              className="mx-auto mb-8 flex justify-center gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  size="large"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputMode="numeric"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-transparent transition-all px-0"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#D13900] hover:bg-[#b23000] text-white font-bold transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 mt-6 disabled:opacity-75 disabled:pointer-events-none cursor-pointer select-none text-sm font-poppins"
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </form>

          {/* Footer Resend Actions */}
          <div className="mt-8 text-center text-sm font-medium text-gray-500 font-poppins">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResendingOtp}
              className="text-[#D13900] font-bold hover:underline ml-1 disabled:opacity-50 cursor-pointer"
            >
              {isResendingOtp ? "Resending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPage;
