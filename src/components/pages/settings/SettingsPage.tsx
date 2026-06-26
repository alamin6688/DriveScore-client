"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Plus, X, Lock, Check } from "lucide-react";
import { toast } from "sonner";

interface SettingsPageProps {
  role?: "company" | "driver" | "admin";
}

export default function SettingsPage({ role = "company" }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [mounted, setMounted] = useState(false);

  // Accent colors config matching layouts
  const accents = {
    company: {
      color: "#D13900",
      activeTabClass:
        "border border-[#D13900] text-[#D13900] rounded-xl bg-white",
      inactiveTabClass:
        "border border-transparent text-gray-500 hover:bg-gray-50/50 hover:text-gray-700",
      btnClass: "bg-[#D13900] hover:bg-[#b23000] text-white",
      btnOutlineClass:
        "border border-[#D13900] text-[#D13900] hover:bg-red-50/10",
      inputFocusClass: "focus:ring-red-450/30 focus:border-[#D13900]",
      badgeClass: "bg-red-50 text-[#D13900] border border-red-100/35",
      logoLabel: "Add Company Logo",
    },
    driver: {
      color: "#D13900",
      activeTabClass:
        "bg-red-50/50 text-[#D13900] border-l-[5px] border-l-[#D13900] rounded-r-xl",
      inactiveTabClass:
        "border-l-[5px] border-l-transparent text-gray-500 hover:bg-gray-50/50 hover:text-gray-750",
      btnClass: "bg-[#D13900] hover:bg-[#b23000] text-white",
      btnOutlineClass:
        "border border-[#D13900] text-[#D13900] hover:bg-red-50/10",
      inputFocusClass: "focus:ring-red-450/30 focus:border-[#D13900]",
      badgeClass: "bg-red-50 text-[#D13900] border border-red-100/35",
      logoLabel: "Change Photo",
    },
    admin: {
      color: "#00B2D8",
      activeTabClass:
        "bg-sky-50/50 text-[#00B2D8] border-l-[5px] border-l-[#00B2D8] rounded-r-xl",
      inactiveTabClass:
        "border-l-[5px] border-l-transparent text-gray-500 hover:bg-gray-50/50 hover:text-gray-750",
      btnClass: "bg-[#00B2D8] hover:bg-[#0092b3] text-white",
      btnOutlineClass:
        "border border-[#00B2D8] text-[#00B2D8] hover:bg-sky-50/10",
      inputFocusClass: "focus:ring-sky-450/30 focus:border-[#00B2D8]",
      badgeClass: "bg-sky-50 text-[#00B2D8] border border-sky-100/35",
      logoLabel: "Change Photo",
    },
  };

  const currentAccent = accents[role] || accents.company;

  // Tab menu items config
  const getTabs = () => {
    if (role === "company") {
      return [
        { key: "Profile", label: "Profile" },
        { key: "Add Company", label: "Add Company" },
        { key: "Change Password", label: "Change Password" },
      ];
    }
    return [
      { key: "Profile", label: "Profile" },
      { key: "Change Password", label: "Change Password" },
    ];
  };

  const tabs = getTabs();

  // PROFILE STATE
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // ADD COMPANY STATE
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyDriversCount, setCompanyDriversCount] = useState("");
  const [companyPhoto, setCompanyPhoto] = useState<string | null>(null);

  // PASSWORD STATE
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setMounted(true);
    // Hydrate default states
    setProfileName(role === "company" ? "Alpha Fleet" : "Daniel Carter");
    setProfileEmail(
      role === "company" ? "Alpha.Fleet@gmail.com" : "Daniel.Carter@gmail.com",
    );
    setProfilePhone("+1 (555) 019-2834");
  }, [role]);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium">
        Loading Settings...
      </div>
    );
  }

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile changes saved successfully.");
  };

  // Handle Add Company
  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !companyLocation) {
      toast.error("Please fill in company name and location.");
      return;
    }
    toast.success(`Company "${companyName}" added successfully.`);
    // Reset Add Company State
    setCompanyName("");
    setCompanyLocation("");
    setCompanyPhone("");
    setCompanyDriversCount("");
    setCompanyPhoto(null);
  };

  // Handle Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    toast.success("Password updated successfully.");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full space-y-6 font-poppins pb-12 select-text animate-fade-in text-left">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none select-none">
          Settings
        </h1>
      </div>

      {/* Settings Grid Structure */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Column: Tab Menu Selector */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-4 select-none">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
            Settings
          </h2>

          <div className="flex flex-col gap-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? currentAccent.activeTabClass
                      : currentAccent.inactiveTabClass
                  }`}
                >
                  <span>{tab.label}</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-colors ${isActive ? "opacity-100" : "opacity-40"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tab View Box */}
        <div className="md:col-span-3">
          {/* PROFILE TAB */}
          {activeTab === "Profile" && (
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6"
            >
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-3 leading-none">
                Profile
              </h3>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Photo
                </p>
                <div className="flex items-center gap-6">
                  {/* Circle Image Placeholder */}
                  <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-gray-400">
                        {profileName.slice(0, 2).toUpperCase() || "DS"}
                      </div>
                    )}
                  </div>
                  {/* Action Upload Buttons */}
                  <div className="flex items-center gap-3 select-none">
                    <label
                      className={`px-4 py-2 font-semibold text-xs rounded-full cursor-pointer transition-colors shadow-sm ${currentAccent.btnClass}`}
                    >
                      {currentAccent.logoLabel}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setProfilePhoto(URL.createObjectURL(file));
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setProfilePhoto(null)}
                      className={`px-4 py-2 font-semibold text-xs rounded-full transition-colors ${currentAccent.btnOutlineClass}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile details fields */}
              <div className="space-y-4 pt-2">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    {role === "company" ? "Company Name" : "Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter Name"
                    className={`w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-xs text-gray-805 placeholder-gray-400 font-semibold transition-all ${currentAccent.inputFocusClass}`}
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    {role === "company" ? "Company Email" : "Email Address"}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      disabled
                      value={profileEmail}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-400 rounded-xl text-xs font-semibold pr-24"
                    />
                    <div
                      className={`absolute right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 select-none ${currentAccent.badgeClass}`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="Enter phone number"
                    className={`w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-xs text-gray-805 placeholder-gray-400 font-semibold transition-all ${currentAccent.inputFocusClass}`}
                  />
                </div>
              </div>

              {/* Save changes */}
              <div className="pt-2 select-none">
                <button
                  type="submit"
                  className={`px-6 py-3 bg-[#D13900] hover:bg-[#b23000] font-bold text-xs rounded-full transition-all shadow-sm cursor-pointer ${currentAccent.btnClass}`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* ADD COMPANY TAB */}
          {activeTab === "Add Company" && role === "company" && (
            <form
              onSubmit={handleAddCompany}
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6"
            >
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-3 leading-none">
                Add Company
              </h3>

              {/* Company Logo Section */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Photo
                </p>
                <div className="flex items-center gap-6">
                  {/* Logo Placeholder */}
                  <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                    {companyPhoto ? (
                      <img
                        src={companyPhoto}
                        alt="Company logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-gray-400">
                        CO
                      </div>
                    )}
                  </div>
                  {/* Upload Trigger */}
                  <div className="select-none">
                    <label
                      className={`px-4 py-2 font-semibold text-xs rounded-full cursor-pointer transition-colors shadow-sm ${currentAccent.btnClass}`}
                    >
                      {currentAccent.logoLabel}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setCompanyPhoto(URL.createObjectURL(file));
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Company Fields */}
              <div className="space-y-4 pt-2">
                {/* Grid inputs layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-800">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={`w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-xs text-gray-805 placeholder-gray-400 font-semibold transition-all ${currentAccent.inputFocusClass}`}
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-800">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Company Location"
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      className={`w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-xs text-gray-805 placeholder-gray-400 font-semibold transition-all ${currentAccent.inputFocusClass}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-800">
                      Phone
                    </label>
                    <input
                      type="text"
                      placeholder="Company Phone Number"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className={`w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-xs text-gray-805 placeholder-gray-400 font-semibold transition-all ${currentAccent.inputFocusClass}`}
                    />
                  </div>

                  {/* Drivers Count */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-800">
                      Numbers of drivers
                    </label>
                    <input
                      type="number"
                      placeholder="50"
                      value={companyDriversCount}
                      onChange={(e) => setCompanyDriversCount(e.target.value)}
                      className={`w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-xs text-gray-805 placeholder-gray-400 font-semibold transition-all ${currentAccent.inputFocusClass}`}
                    />
                  </div>
                </div>
              </div>

              {/* Form Save Button */}
              <div className="pt-2 select-none">
                <button
                  type="submit"
                  className={`px-6 py-3 font-bold text-xs rounded-full transition-all shadow-sm cursor-pointer ${currentAccent.btnClass}`}
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {/* CHANGE PASSWORD TAB */}
          {activeTab === "Change Password" && (
            <form
              onSubmit={handleChangePassword}
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6"
            >
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-3 leading-none">
                Change Password
              </h3>

              <div className="space-y-4 pt-2">
                {/* Old Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    Old Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={`w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-xs text-gray-805 placeholder-gray-400 font-semibold transition-all ${currentAccent.inputFocusClass}`}
                  />
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-xs text-gray-805 placeholder-gray-400 font-semibold transition-all ${currentAccent.inputFocusClass}`}
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-xs text-gray-805 placeholder-gray-400 font-semibold transition-all ${currentAccent.inputFocusClass}`}
                  />
                </div>
              </div>

              {/* Form Action save */}
              <div className="pt-2 select-none">
                <button
                  type="submit"
                  className={`px-6 py-3 font-bold text-xs rounded-full transition-all shadow-sm cursor-pointer ${currentAccent.btnClass}`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
