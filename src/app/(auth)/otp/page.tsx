/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "antd";
import type { InputRef } from "antd";
import { appAlert } from "@/utils/appAlert";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { useResendOtpMutation, useVerifyUserMutation } from "@/service/auth/authApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft } from "lucide-react";
import { getDashboardPathByRole, normalizeRole } from "@/utils/roles";
import { getPendingGuestDocument } from "@/utils/guestDocumentUpload";

import logo from "@/assets/logo/logo.png";

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

  const inputRefs = useRef<(InputRef | null)[]>([]);

  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = sessionStorage.getItem("email");
    setEmail(stored);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
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
      appAlert.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please enter the 6-digit OTP.",
      });
      return;
    }

    try {
      if (!email) {
        appAlert.fire({
          icon: "error",
          title: "Verification failed",
          text: "Email not found. Please register again.",
        });
        return;
      }

      const res = await verifyUser({ email, otp: otpValue }).unwrap();

      if (res?.success) {
        // appAlert.fire({
        //   icon: "success",
        //   title: "Verification successful 🎉",
        //   text: res?.message || "Your email has been verified.",
        //   timer: 2000,
        //   showConfirmButton: false,
        // });

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
            })
          );

          Cookies.set("accessToken", accessToken, { path: "/" });
          if (refreshToken) {
            Cookies.set("refreshToken", refreshToken, { path: "/" });
          }

          sessionStorage.removeItem("temp_accessToken");
          sessionStorage.removeItem("temp_refreshToken");
          sessionStorage.removeItem("email");

          const hasGuestDocument = await hasPendingGuestDocument(
            decodedUser.role
          );
          router.push(
            hasGuestDocument
              ? "/dashboard/user/reports"
              : getDashboardPathByRole(decodedUser.role)
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
          })
        );

        sessionStorage.removeItem("temp_accessToken");
        sessionStorage.removeItem("temp_refreshToken");
        sessionStorage.removeItem("email");

        const hasGuestDocument = await hasPendingGuestDocument(
          cookieAuthUser.role
        );
        router.push(
          hasGuestDocument
            ? "/dashboard/user/reports"
            : getDashboardPathByRole(cookieAuthUser.role)
        );
        toast.success("Successfully logged in.");
        return;

      } else {
        appAlert.fire({
          icon: "error",
          title: "Verification failed",
          text: res?.message || "Invalid OTP.",
        });
      }
    } catch (err: unknown) {
      appAlert.fire({
        icon: "error",
        title: "Verification failed",
        text: getApiErrorMessage(err, "Something went wrong."),
      });
    }
  };

  const hasPendingGuestDocument = async (role: string) => {
    if (normalizeRole(role) !== "USER") return false;
    try {
      return Boolean(await getPendingGuestDocument());
    } catch (error) {
      return false;
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    try {
      await resendOtp({ email }).unwrap();
      toast.success("OTP resend success!");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Something went wrong. Please try again.")
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
      <div className="relative z-20 w-full max-w-[620px] px-4">
        <div className="bg-white rounded-[32px] p-6 sm:p-12 md:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100/80 flex flex-col items-center relative">
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
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
            Enter Verification Code
          </h1>
          
          {/* Subheading */}
          <p className="text-sm sm:text-base text-gray-400 font-medium text-center mb-8 font-poppins leading-relaxed">
            We&apos;ve sent a 6-digit code to <span className="text-gray-700 font-bold">{email || "your email"}</span>
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            {/* OTP Input Boxes */}
            <div
              className="mx-auto mb-8 flex justify-center gap-1 min-[350px]:gap-1.5 min-[400px]:gap-2 sm:gap-3"
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
                  className="w-9 h-9 min-[350px]:w-10 min-[350px]:h-10 min-[400px]:w-12 min-[400px]:h-12 sm:w-14 sm:h-14 text-center text-base sm:text-xl font-bold bg-[#F8F8F6] border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all px-0"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ background: "var(--Gradian-Colur, linear-gradient(180deg, #258200 0%, #58B500 100%))" }}
              className="w-full py-4 rounded-full hover:brightness-110 text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg text-center disabled:opacity-75 disabled:pointer-events-none"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* Footer Resend Actions */}
          <div className="mt-8 text-center text-sm font-medium text-gray-500 font-poppins">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResendingOtp}
              className="text-gray-900 font-bold hover:underline hover:text-green-600 transition-colors ml-1 disabled:opacity-50"
            >
              {isResendingOtp ? "Resending..." : "Resend otp"}
            </button>
          </div>

          {!email && (
            <div className="mt-4 text-center text-sm font-semibold text-red-500">
              Email not found. Please register again.
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default OTPage;
