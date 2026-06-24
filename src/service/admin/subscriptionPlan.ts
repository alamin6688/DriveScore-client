import baseApi from "@/redux/api/baseApi";

const toNumberValue = (value: unknown, fallback = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[$,%\s,]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// ===== SUBSCRIPTION PLAN =====
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string | null;
  features: string[];
  price: number;
  currency?: string;
  interval?: string;
  active?: boolean;
  isPopular?: boolean;
  maxPaymentMethods?: number | null;
  maxReports?: number | null;
  maxCompanyProfiles?: number | null;
  stripePriceId?: string;
  stripeProductId?: string;
  success?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ===== RESPONSE =====
export interface SubscriptionPlansResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
  data: SubscriptionPlan[] | {
    data?: SubscriptionPlan[];
    plans?: SubscriptionPlan[];
    result?: SubscriptionPlan[];
    items?: SubscriptionPlan[];
  };
}

// Query Params for listing plans
export interface SubscriptionPlanParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean | "all";
}

export type AdminSubscriptionPlanItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  currency: string;
  interval: string;
  active: boolean;
  isPopular: boolean;
  maxPaymentMethods?: number | null;
  maxReports?: number | null;
  maxCompanyProfiles?: number | null;
};

export type AdminSubscriptionPlanPayload = {
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  active: boolean;
  isPopular: boolean;
  maxPaymentMethods: number | null;
  maxReports: number | null;
  maxCompanyProfiles: number | null;
};

export type AdminSubscriptionPlansProps = {
  plans: AdminSubscriptionPlanItem[];
  isLoading?: boolean;
  isError?: boolean;
  isMutating?: boolean;
  onCreate: (plan: AdminSubscriptionPlanItem) => Promise<boolean>;
  onUpdate: (plan: AdminSubscriptionPlanItem) => Promise<boolean>;
  onDelete: (planId: string) => Promise<void>;
};

export type EditPackageFormProps = {
  plan: AdminSubscriptionPlanItem;
  isSaving?: boolean;
  onSave: (updatedPlan: AdminSubscriptionPlanItem) => Promise<boolean>;
  onCancel: () => void;
};

export const mapSubscriptionPlan = (plan: SubscriptionPlan): AdminSubscriptionPlanItem => ({
  id: plan.id,
  name: plan.name || "N/A",
  description: plan.description || "",
  price: String(plan.price ?? 0),
  features: Array.isArray(plan.features) ? plan.features : [],
  currency: plan.currency || "USD",
  interval: plan.interval || "month",
  active: plan.active ?? true,
  isPopular: plan.isPopular ?? false,
  maxPaymentMethods: plan.maxPaymentMethods ?? null,
  maxReports: plan.maxReports ?? null,
  maxCompanyProfiles: plan.maxCompanyProfiles ?? null,
});

export const mapSubscriptionPlanPayload = (
  plan: AdminSubscriptionPlanItem
): AdminSubscriptionPlanPayload => ({
  name: plan.name.trim(),
  description: plan.description.trim(),
  price: toNumberValue(plan.price),
  currency: plan.currency || "USD",
  interval: plan.interval || "month",
  features: plan.features.filter((feature) => feature.trim() !== ""),
  active: plan.active,
  isPopular: plan.isPopular,
  maxPaymentMethods: plan.maxPaymentMethods ?? null,
  maxReports: plan.maxReports ?? null,
  maxCompanyProfiles: plan.maxCompanyProfiles ?? null,
});

export const unwrapSubscriptionPlans = (data: unknown): SubscriptionPlan[] => {
  if (Array.isArray(data)) return data as SubscriptionPlan[];
  if (!isRecord(data)) return [];

  for (const key of ["data", "plans", "result", "items"]) {
    const value = data[key];
    if (Array.isArray(value)) return value as SubscriptionPlan[];
  }

  return [];
};

// ===== API slice =====
const subscriptionPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicSubscriptionPlans: builder.query<SubscriptionPlansResponse, void>({
      query: () => ({
        url: `/subscriptions/plans`,
        method: "GET",
      }),
      providesTags: ["subscriptionPlans"],
    }),
    // Fetch all subscription plans
    getSubscriptionPlans: builder.query<SubscriptionPlansResponse, SubscriptionPlanParams | void>({
      query: (params) => ({
        url: `/subscriptions/admin/plans`,
        params: params || {},
      }),
      providesTags: ["subscriptionPlans"],
    }),

    // Create a new subscription plan
    createSubscriptionPlan: builder.mutation<
      { success: boolean; message: string; data: SubscriptionPlan },
      Partial<Omit<SubscriptionPlan, "id" | "stripePriceId">>
    >({
      query: (newPlan) => ({
        url: `/subscriptions/admin/plans`,
        method: "POST",
        body: newPlan,
      }),
      invalidatesTags: ["subscriptionPlans"],
    }),

    // Update an existing subscription plan
    updateSubscriptionPlan: builder.mutation<
      { success: boolean; message: string; data: SubscriptionPlan },
      { id: string; updatedPlan: Partial<Omit<SubscriptionPlan, "id" | "stripePriceId">> }
    >({
      query: ({ id, updatedPlan }) => ({
        url: `/subscriptions/admin/plans/${id}`,
        method: "PATCH",
        body: updatedPlan,
      }),
      invalidatesTags: ["subscriptionPlans"],
    }),

    // Update subscription plan status only
    updateSubsceiptionPlanStatus: builder.mutation<
      { success: boolean; message: string; data: Partial<SubscriptionPlan> },
      { id: string; status: "ACTIVE" | "INACTIVE" }
    >({
      query: ({ id, status }) => ({
        url: `/subscriptions/admin/plans/${id}`,
        method: "PATCH",
        body: { active: status === "ACTIVE" },
      }),
      invalidatesTags: ["subscriptionPlans"],
    }),

    // Get a single subscription plan by ID
    getSingleSubscriptionPlan: builder.query<{ success: boolean; data: SubscriptionPlan }, string>({
      query: (id) => ({
        url: `/subscriptions/admin/plans/${id}`,
        method: "GET",
      }),
      providesTags: ["subscriptionPlans"],
    }),

    // DELETE/:id
    deleteSubscriptionPlan: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/subscriptions/admin/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subscriptionPlans"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPublicSubscriptionPlansQuery,
  useGetSubscriptionPlansQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useUpdateSubsceiptionPlanStatusMutation,
  useGetSingleSubscriptionPlanQuery,
  useDeleteSubscriptionPlanMutation,
} = subscriptionPlanApi;
