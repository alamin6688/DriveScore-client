/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

export type BillingApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
};

export type BillingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  active: boolean;
  maxPaymentMethods?: number | null;
  maxReports?: number | null;
  maxCompanyProfiles?: number | null;
};

export type CurrentSubscription = {
  id: string;
  status: string;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelledAt?: string | null;
  plan?: BillingPlan | null;
};

export type SavedPaymentMethod = {
  id: string;
  stripePaymentMethodId: string;
  brand: string;
  last4: string;
  expiryMonth?: number | null;
  expiryYear?: number | null;
  isDefault: boolean;
};

export type CheckoutPayload = {
  planId: string;
};

export type CheckoutResponseData = {
  clientSecret?: string;
  ClientSecret?: string;
  client_secret?: string;
  sessionId?: string;
  customerSessionClientSecret?: string;
};

export type AttachPaymentMethodPayload = {
  paymentMethodId: string;
};

export type AddCardModalProps = {
  open: boolean;
  isSubmitting: boolean;
  email?: string;
  onClose: () => void;
  onAttach: (paymentMethodId: string) => Promise<void>;
};

export type BillingPlanSelectorProps = {
  plans: BillingPlan[];
  currentPlanId?: string;
  isLoading: boolean;
  isCheckingOut: boolean;
  checkingOutPlanId: string;
  onCheckout: (planId: string) => void;
};

export type SavedCardRowProps = {
  card: SavedPaymentMethod;
  isUpdating: boolean;
  isDeleting: boolean;
  onSetDefault: (card: SavedPaymentMethod) => void;
  onDelete: (card: SavedPaymentMethod) => void;
};

export type EmbeddedCheckoutModalProps = {
  open: boolean;
  clientSecret: string;
  onClose: () => void;
};

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toStringValue = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
};

const toNumberValue = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const toBooleanValue = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const toStringArray = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => toStringValue(item).trim())
    .filter(Boolean);
};

const unwrapArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (isRecord(value)) {
    if (Array.isArray(value.data)) return value.data as T[];
    if (Array.isArray(value.items)) return value.items as T[];
    if (Array.isArray(value.plans)) return value.plans as T[];
    if (Array.isArray(value.cards)) return value.cards as T[];
    if (Array.isArray(value.paymentMethods)) return value.paymentMethods as T[];
    if (Array.isArray(value.methods)) return value.methods as T[];
  }
  return [];
};

const unwrapRecord = (value: unknown): Record<string, any> | null => {
  if (!isRecord(value)) return null;
  if (isRecord(value.data)) return value.data;
  return value;
};

export const formatBillingMoney = (
  amount: number,
  currency = "USD",
  options?: Intl.NumberFormatOptions
) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    ...options,
  }).format(amount);

export const formatBillingDate = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export const mapBillingPlan = (value: unknown): BillingPlan | null => {
  const plan = unwrapRecord(value);
  if (!plan) return null;

  const id = toStringValue(plan.id || plan._id || plan.planId);
  if (!id) return null;

  return {
    id,
    name: toStringValue(plan.name, "Plan"),
    description: toStringValue(plan.description),
    price: toNumberValue(plan.price),
    currency: toStringValue(plan.currency, "USD"),
    interval: toStringValue(plan.interval, "month"),
    features: toStringArray(plan.features),
    active: toBooleanValue(plan.active, true),
    maxPaymentMethods:
      plan.maxPaymentMethods === null || plan.maxPaymentMethods === undefined
        ? null
        : toNumberValue(plan.maxPaymentMethods),
    maxReports:
      plan.maxReports === null || plan.maxReports === undefined
        ? null
        : toNumberValue(plan.maxReports),
    maxCompanyProfiles:
      plan.maxCompanyProfiles === null || plan.maxCompanyProfiles === undefined
        ? null
        : toNumberValue(plan.maxCompanyProfiles),
  };
};

export const mapBillingPlans = (value: unknown): BillingPlan[] =>
  unwrapArray(value)
    .map(mapBillingPlan)
    .filter((plan): plan is BillingPlan => Boolean(plan));

export const mapCurrentSubscription = (
  value: unknown
): CurrentSubscription | null => {
  const data = unwrapRecord(value);
  if (!data) return null;

  const subscription = isRecord(data.subscription)
    ? data.subscription
    : isRecord(data.currentSubscription)
      ? data.currentSubscription
      : isRecord(data.userSubscription)
        ? data.userSubscription
        : data;

  const id = toStringValue(subscription.id || subscription.subscriptionId);
  if (!id) return null;

  const planSource =
    subscription.plan ||
    subscription.subscriptionPlan ||
    data.plan ||
    data.subscriptionPlan;

  return {
    id,
    status: toStringValue(subscription.status, "UNKNOWN"),
    currentPeriodStart: toStringValue(subscription.currentPeriodStart) || null,
    currentPeriodEnd: toStringValue(subscription.currentPeriodEnd) || null,
    cancelledAt: toStringValue(subscription.cancelledAt) || null,
    plan: mapBillingPlan(planSource),
  };
};

export const mapSavedPaymentMethod = (
  value: unknown
): SavedPaymentMethod | null => {
  const card = unwrapRecord(value);
  if (!card) return null;

  const stripePaymentMethodId = toStringValue(
    card.stripePaymentMethodId || card.paymentMethodId || card.id
  );
  const id = toStringValue(card.id || stripePaymentMethodId);
  if (!id || !stripePaymentMethodId) return null;

  return {
    id,
    stripePaymentMethodId,
    brand: toStringValue(card.brand || card.card?.brand, "Card").toUpperCase(),
    last4: toStringValue(card.last4 || card.card?.last4, "0000"),
    expiryMonth:
      card.expiryMonth === undefined && card.expMonth === undefined
        ? null
        : toNumberValue(card.expiryMonth ?? card.expMonth),
    expiryYear:
      card.expiryYear === undefined && card.expYear === undefined
        ? null
        : toNumberValue(card.expiryYear ?? card.expYear),
    isDefault: toBooleanValue(card.isDefault || card.default),
  };
};

export const mapSavedPaymentMethods = (value: unknown): SavedPaymentMethod[] =>
  unwrapArray(value)
    .map(mapSavedPaymentMethod)
    .filter((card): card is SavedPaymentMethod => Boolean(card));

export const getCheckoutClientSecret = (value: unknown) => {
  const data = unwrapRecord(value);
  if (!data) return "";
  return toStringValue(data.clientSecret || data.ClientSecret || data.client_secret);
};

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentSubscription: builder.query<
      BillingApiResponse<CurrentSubscription | Record<string, any> | null>,
      void
    >({
      query: () => ({
        url: "/subscriptions/current",
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),

    getSubscriptionBillingDetails: builder.query<
      BillingApiResponse<Record<string, any> | null>,
      void
    >({
      query: () => ({
        url: "/subscriptions/billing/details",
        method: "GET",
      }),
      providesTags: ["subscription", "payments"],
    }),

    getBillingPlans: builder.query<
      BillingApiResponse<BillingPlan[] | Record<string, any>>,
      void
    >({
      query: () => ({
        url: "/subscriptions/plans",
        method: "GET",
      }),
      providesTags: ["subscriptionPlans"],
    }),

    createSubscriptionCheckout: builder.mutation<
      BillingApiResponse<CheckoutResponseData | Record<string, any>>,
      CheckoutPayload
    >({
      query: (body) => ({
        url: "/subscriptions/checkout",
        method: "POST",
        body,
      }),
    }),

    cancelUserSubscription: builder.mutation<
      BillingApiResponse<CurrentSubscription | Record<string, any>>,
      string
    >({
      query: (subscriptionId) => ({
        url: `/subscriptions/${subscriptionId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["subscription", "profile"],
    }),

    getPaymentMethods: builder.query<
      BillingApiResponse<SavedPaymentMethod[] | Record<string, any>>,
      void
    >({
      query: () => ({
        url: "/payments/methods",
        method: "GET",
      }),
      providesTags: ["payments"],
    }),

    attachPaymentMethod: builder.mutation<
      BillingApiResponse<SavedPaymentMethod | Record<string, any>>,
      AttachPaymentMethodPayload
    >({
      query: (body) => ({
        url: "/payments/attach-method",
        method: "POST",
        body,
      }),
      invalidatesTags: ["payments", "subscription"],
    }),

    setDefaultPaymentMethod: builder.mutation<
      BillingApiResponse<SavedPaymentMethod | Record<string, any>>,
      string
    >({
      query: (paymentMethodId) => ({
        url: `/payments/methods/${paymentMethodId}/default`,
        method: "PATCH",
        body: { paymentMethodId },
      }),
      invalidatesTags: ["payments"],
    }),

    deletePaymentMethod: builder.mutation<
      BillingApiResponse<Record<string, any>>,
      string
    >({
      query: (paymentMethodId) => ({
        url: `/payments/methods/${paymentMethodId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["payments"],
    }),
  }),
});

export const {
  useGetCurrentSubscriptionQuery,
  useGetSubscriptionBillingDetailsQuery,
  useGetBillingPlansQuery,
  useCreateSubscriptionCheckoutMutation,
  useCancelUserSubscriptionMutation,
  useGetPaymentMethodsQuery,
  useAttachPaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = billingApi;
