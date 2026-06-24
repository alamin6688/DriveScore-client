"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import {
  getProfileAvatar,
  getProfileName,
  getUpdatedProfileData,
  useGetProfileDataQuery,
  type ProfileData,
  type UpdateProfilePayload,
} from "@/service/profile/profileApi";
import { useUpdateAdminProfileMutation } from "@/service/admin/dashboardApi";
import { appAlert } from "@/utils/appAlert";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { getImageUrl } from "@/utils/getImageUrl";

const getNormalizedAvatarUrl = (profile?: ProfileData | null) => {
  const avatar = getProfileAvatar(profile).trim();
  return avatar ? getImageUrl(avatar) : null;
};

const SettingsPageSkeleton = () => (
  <div className="w-full min-h-[calc(100vh-112px)] flex flex-col gap-6 font-poppins select-none pb-1">
    <div className="flex flex-row items-center justify-between gap-4 pb-2 shrink-0">
      <div className="h-8 w-32 animate-pulse rounded-full bg-gray-100" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="h-5 w-20 animate-pulse rounded-full bg-gray-100 mb-4" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-green-50/70" />
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-7">
          <div className="space-y-4">
            <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 animate-pulse rounded-full bg-gray-100" />
              <div className="h-9 w-28 animate-pulse rounded-full bg-gray-100" />
            </div>
          </div>

          <div className="space-y-5 pt-2">
            <div className="h-5 w-40 animate-pulse rounded-full bg-gray-100" />
            <div className="space-y-2">
              <div className="h-3 w-14 animate-pulse rounded-full bg-gray-100" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-14 animate-pulse rounded-full bg-gray-100" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
            </div>
          </div>

          <div className="pt-4">
            <div className="h-10 w-32 animate-pulse rounded-full bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Profile() {
  const { data: profileResponse, isLoading, refetch: refetchProfile } = useGetProfileDataQuery();
  const [updateAdminProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    email: "",
    role: "",
    profile: {
      name: "",
      phone: "",
      street: "",
      city: "",
      zipCode: "",
      region: "",
      country: "",
      description: "",
      avatar: "",
    },
    stats: {
      totalProperty: 0,
      totalShare: 0,
      totalView: 0,
      totalSaved: 0,
    },
  });

  const [editFormData, setEditFormData] = useState<UpdateProfilePayload>({
    name: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
    region: "",
    country: "",
    description: "",
  });

  useEffect(() => {
    if (profileResponse?.data) {
      const u = profileResponse.data;
      setProfileData(u);
      const profile = u.profile;

      setEditFormData({
        name: getProfileName(u),
        phone: profile?.phone || "",
        street: profile?.street || "",
        city: profile?.city || "",
        zipCode: profile?.zipCode || "",
        region: profile?.region || "",
        country: profile?.country || "",
        description: profile?.description || "",
      });

      setImagePreview(getNormalizedAvatarUrl(u));
      setAvatarLoadError(false);
      setAvatarFile(null);
    }
  }, [profileResponse]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      appAlert.fire({
        icon: "error",
        title: "File Too Large",
        text: "The file size exceeds the 2MB limit. Please choose a smaller file.",
      });
      return;
    }
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      appAlert.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Only JPEG and PNG image files are allowed.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setAvatarLoadError(false);
    };
    reader.readAsDataURL(file);

    setAvatarFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify({ name: editFormData.name || "" }));

      if (avatarFile) {
        formData.append("picture", avatarFile);
      }

      const res = await updateAdminProfile(formData).unwrap();

      appAlert.fire({
        icon: "success",
        title: "Success!",
        text: res?.message || "Profile Updated!",
        confirmButtonText: "OK",
      });

      const refreshedProfileResponse = await refetchProfile().unwrap();
      const refreshedProfile = refreshedProfileResponse?.data;
      const updatedProfile = getUpdatedProfileData(res?.data);
      const nextProfile = refreshedProfile || updatedProfile;

      if (nextProfile) {
        setProfileData(nextProfile);
        setImagePreview(getNormalizedAvatarUrl(nextProfile));
        setAvatarLoadError(false);
      }

      setAvatarFile(null);
    } catch (err: unknown) {
      console.error("Update profile error:", err);

      appAlert.fire({
        icon: "error",

        text: getApiErrorMessage(err, "Failed to save changes."),
        confirmButtonText: "OK",
      });
    }
  };

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <div className="w-full min-h-[calc(100vh-112px)] flex flex-col gap-6 font-poppins select-text pb-1">
      {/* Page Title */}
      <div className="flex flex-row items-center justify-between gap-4 pb-2 select-none shrink-0">
        <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight leading-none">
          Settings
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column: Settings card */}
        <div className="md:col-span-1 select-none">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4 tracking-tight">
              Settings
            </h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-green-50/50 border-l-[5px] border-l-[#258200] text-[#258200] font-bold text-xs transition-all text-left cursor-default">
                <span>Profile</span>
                <ChevronRight size={14} className="text-[#258200]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Profile editing forms */}
        <div className="md:col-span-2 space-y-8">
          {/* Main profile form card */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6"
          >
            {/* Photo Section */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900">Photo</h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  {imagePreview && !avatarLoadError ? (
                    <Image
                      src={imagePreview}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarLoadError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-amber-100 text-amber-700">
                      {getProfileName(profileData).slice(0, 2).toUpperCase() || "AD"}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 select-none">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="settings-avatar-input"
                  />
                  <label
                    htmlFor="settings-avatar-input"
                    className="px-4 py-2 bg-[#4CAF50] hover:bg-[#439e47] text-white text-xs font-semibold rounded-full cursor-pointer transition-colors shadow-sm active:scale-[0.98]"
                  >
                    Change Photo
                  </label>
                  {/* <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setAvatarFile(null);
                    }}
                    className="px-4 py-2 border border-[#4CAF50] text-[#4CAF50] hover:bg-green-50/50 text-xs font-semibold rounded-full cursor-pointer transition-colors"
                  >
                    Remove
                  </button> */}
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold text-gray-900">Personal Information</h3>

              {/* Name field */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleEditChange}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 bg-[#F8F9FA] rounded-xl text-xs font-semibold text-gray-800 focus:outline-none border border-transparent focus:border-[#4CAF50]/30 transition-all"
                />
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profileData.email || "example2345@gmail.com"}
                    disabled
                    className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#4CAF50] rounded-xl text-xs font-semibold text-gray-800 focus:outline-none pr-24 select-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8EE] text-[#4CAF50] select-none border border-green-100/30">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Save Action */}
            <div className="flex justify-start pt-4 select-none">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 bg-[#4CAF50] hover:bg-[#439e47] text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm disabled:opacity-50 active:scale-[0.98]"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
