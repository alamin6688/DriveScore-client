"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { 
  Mail, 
  User, 
  Building2, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight 
} from "lucide-react";
import { useRegisterUserMutation } from "@/service/auth/authApi";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import logo from "@/assets/logo/logo.svg";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Selection role toggle state (visual)
  const [role, setRole] = useState<"company" | "driver">("company");
  
  // Password visible toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      // API expects name, email, and companyName
      const payload = { name, email, companyName };
      const res = await register(payload).unwrap();
      
      if (res?.success === true) {
        // Save email in sessionStorage for OTP check
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
            Create an account
          </h1>

          {/* Role Toggle Selector Grid */}
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            <button
              type="button"
              onClick={() => setRole("company")}
              className={`text-xs sm:text-sm font-bold py-3 rounded-xl border transition-all duration-200 select-none cursor-pointer ${
                role === "company"
                  ? "bg-[#D13900] text-white border-transparent shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              As a Company
            </button>
            <button
              type="button"
              onClick={() => setRole("driver")}
              className={`text-xs sm:text-sm font-bold py-3 rounded-xl border transition-all duration-200 select-none cursor-pointer ${
                role === "driver"
                  ? "bg-[#D13900] text-white border-transparent shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              As a Driver
            </button>
          </div>
          
          {/* Subheading */}
          <p className="text-xs sm:text-sm text-gray-500 font-medium text-center mb-8 max-w-sm leading-relaxed poppins">
            Turn Excel data into scores, rankings, and weekly competition.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            
            {/* Name Field */}
            <div className="w-full">
              <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-transparent text-sm text-gray-800 placeholder-gray-400 font-medium transition-all"
                  placeholder="Enter your Name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="w-full">
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
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

            {/* Company Name Field */}
            <div className="w-full">
              <label htmlFor="companyName" className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                Company Name
              </label>
              <div className="relative flex items-center">
                <Building2 className="absolute left-4 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-transparent text-sm text-gray-800 placeholder-gray-400 font-medium transition-all"
                  placeholder="Company Name"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="w-full">
              <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
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
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="w-full">
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-transparent text-sm text-gray-800 placeholder-gray-400 font-medium transition-all"
                  placeholder="Enter your confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#D13900] hover:bg-[#b23000] text-white font-bold transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 mt-6 disabled:opacity-75 disabled:pointer-events-none cursor-pointer select-none"
            >
              <span>{isLoading ? "Signing Up..." : "Sign Up"}</span>
              {!isLoading && <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />}
            </button>

          </form>

          {/* Redirect to Sign In */}
          <div className="mt-8 text-center text-sm font-medium text-gray-550 poppins">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#D13900] font-bold hover:underline ml-1 cursor-pointer"
            >
              Log In
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
