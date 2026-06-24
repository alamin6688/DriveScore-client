/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi"; // <-- adjust path if different

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// ---------------- TYPES ----------------
export type ProfileData = {
  id: string;
  email: string;
  role: string;
  name?: string;
  avatar?: string;
  picture?: string;
  companyName?: string;
  subscription?: {
    id?: string;
    status?: string;
    plan?: {
      id?: string;
      name?: string;
      price?: number;
      interval?: string;
    };
  };
  profile?: {
    name?: string;
    phone?: string;
    street?: string;
    city?: string;
    zipCode?: string;
    region?: string;
    country?: string;
    description?: string;
    avatar?: string;
    picture?: string;
  };
  stats?: {
    totalProperty: number;
    totalShare: number;
    totalView: number;
    totalSaved: number;
  };
};

export type GetProfileResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: ProfileData;
};

export type UpdateProfileResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: ProfileData; // some backends return updated user, some only message
};

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  region?: string;
  country?: string;
  description?: string;
};

export type SettingsTab = "Profile" | "Company" | "Billing & Plan" | "Security";

export type SettingsMenuItem = {
  key: SettingsTab;
  label: string;
};

const settingsTabParams: Record<SettingsTab, string> = {
  Profile: "profile",
  Company: "company",
  "Billing & Plan": "billing",
  Security: "security",
};

export const getSettingsTabParam = (tab: SettingsTab) =>
  settingsTabParams[tab];

export const getSettingsTabFromParam = (
  value: string | null
): SettingsTab => {
  const entry = Object.entries(settingsTabParams).find(
    ([, param]) => param === value?.toLowerCase()
  );

  return (entry?.[0] as SettingsTab | undefined) || "Profile";
};

export type ProfileSectionProps = {
  name: string;
  email: string;
  avatarUrl: string | null;
  isUpdating: boolean;
  onNameChange: (val: string) => void;
  onAvatarChange: (file: File) => void;
  // onRemoveAvatar: () => void;
  onSave: () => void;
};

export const getProfileName = (data?: ProfileData | null) =>
  data?.profile?.name || data?.name || "";

export const getProfileAvatar = (data?: ProfileData | null) =>
  data?.profile?.avatar || data?.profile?.picture || data?.avatar || data?.picture || "";

export const getProfileEmail = (data?: ProfileData | null) =>
  data?.email || "";

export const getUpdatedProfileData = (data: unknown): ProfileData | undefined => {
  if (!isRecord(data)) return undefined;
  const nestedData = data.data;
  if (isRecord(nestedData)) return nestedData as ProfileData;
  return data as ProfileData;
};

// ---------------- API ----------------
export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // getAgencyProfileData: builder.query<GetProfileResponse, void>({
    //   query: () => ({
    //     url: "/users/me/agency", // GET /api/v1/users
    //     method: "GET",
    //   }),
    //   providesTags: ["profile"],
    // }),

        getProfileData: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "/auth/me", // GET /api/v1/users
        method: "GET",
      }),
      providesTags: ["profile"],
    }),


    

    updateProfileData: builder.mutation<UpdateProfileResponse, FormData>({
      query: (body) => ({
        url: "/user/settings/profile",
        method: "PATCH",
        body,
        // ✅ IMPORTANT: do NOT set "Content-Type"
        // browser will set multipart/form-data boundary automatically
      }),
      invalidatesTags: ["profile"],
    }),

    updateThreadId: builder.mutation<any, { threadId: string }>({
      query: (body) => ({
        url: "/users/threadId",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useGetProfileDataQuery,
  // useGetAgencyProfileDataQuery,
  useUpdateProfileDataMutation,
  useUpdateThreadIdMutation,
} = profileApi;
