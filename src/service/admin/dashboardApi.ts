import baseApi from "@/redux/api/baseApi";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toNumberValue = (value: unknown, fallback = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[$,%\s,]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toStringValue = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const toArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export type AdminDashboardTimeframe = "Yearly" | "Monthly" | "Weekly";

export type AdminDashboardStats = {
  totalRevenue: number;
  totalRevenueChange: number;
  totalUsers: number;
  totalUsersChange: number;
  subscriptionUsers: number;
  subscriptionUsersChange: number;
  supportMessages: number;
  supportMessagesChange: number;
};

export type AdminRevenueChartPoint = {
  month: string;
  revenue: number;
};

export type AdminUserStatus = "ACTIVE" | "SUSPENDED" | string;

export type AdminDashboardUser = {
  id: string;
  key: string;
  userName: string;
  email: string;
  plan: string;
  joined: string;
  createdAt: string;
  status: string;
  rawStatus: AdminUserStatus;
};

export type AdminStatsGridProps = {
  stats?: AdminDashboardStats | null;
  isLoading?: boolean;
};

export type AdminRevenueChartProps = {
  chartData?: Partial<Record<AdminDashboardTimeframe, AdminRevenueChartPoint[]>>;
  isLoading?: boolean;
};

export type AdminUserListTableProps = {
  users: AdminDashboardUser[];
  isLoading?: boolean;
  isFetching?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onStatusChange: (userId: string, status: AdminUserStatus) => Promise<void>;
};

export type AdminAllUsersListProps = AdminUserListTableProps & {
  isError?: boolean;
};

export type AdminUsersQueryParams = {
  page?: number;
  limit?: number;
};

export type AdminTransactionsQueryParams = {
  page?: number;
  limit?: number;
};

export type AdminPaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type AdminTransactionStatus = "Pending" | "Completed" | string;

export type AdminTransactionItem = {
  id: string;
  userName: string;
  userEmail: string;
  userPicture: string;
  paymentDate: string;
  amount: string;
  status: AdminTransactionStatus;
  rawStatus: string;
  paymentMethod: string;
  description: string;
  packageName: string;
  subscriptionType: string;
  subscriptionStatus: string;
  subscriptionId: string;
  stripeSubscriptionId: string;
  stripePaymentIntentId: string;
  stripeInvoiceId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt: string;
  joined: string;
};

export type AdminTransactionsProps = {
  transactions: AdminTransactionItem[];
  isLoading?: boolean;
  isError?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export type TransactionDetailsModalProps = {
  transaction: AdminTransactionItem;
  onClose: () => void;
};

export type AdminProfileUpdateResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};

export type AdminDashboardStatsResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

export type AdminUsersResponse = {
  success: boolean;
  message: string;
  data: unknown;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
};

export type AdminTransactionsResponse = {
  success: boolean;
  message: string;
  data: unknown;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
};

export type AdminUserStatusPayload = {
  userId: string;
  status: AdminUserStatus;
};

const formatDate = (value: unknown) => {
  const rawValue = toStringValue(value, "");
  if (!rawValue) return "N/A";
  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) return rawValue;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getNestedRecord = (root: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = root[key];
    if (isRecord(value)) return value;
  }
  return {};
};

const getStatValue = (source: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (isRecord(value) && "value" in value) return value.value;
    if (value !== undefined) return value;
  }

  return undefined;
};

const getStatChange = (source: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (isRecord(value) && "change" in value) return value.change;
  }

  return undefined;
};

export const unwrapAdminUsers = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (!isRecord(data)) return [];

  for (const key of ["data", "users", "result", "items"]) {
    const value = data[key];
    if (Array.isArray(value)) return value as Record<string, unknown>[];
  }

  return [];
};

export const getAdminUsersPagination = (
  response?: AdminUsersResponse,
  fallbackLimit = 10
): AdminPaginationMeta => {
  const data = isRecord(response?.data) ? response.data : {};
  const nestedMeta = isRecord(data.meta) ? data.meta : {};
  const meta: Record<string, unknown> = response?.meta ?? nestedMeta;
  const total = toNumberValue(meta.total);
  const limit = toNumberValue(meta.limit, fallbackLimit) || fallbackLimit;
  const page = toNumberValue(meta.page, 1) || 1;
  const pages =
    toNumberValue(meta.pages ?? meta.totalPages) ||
    Math.max(Math.ceil(total / limit), 1);

  return {
    total,
    page,
    limit,
    pages,
  };
};

export const getAdminTransactionsPagination = (
  response?: AdminTransactionsResponse,
  fallbackLimit = 10
): AdminPaginationMeta => {
  const data = isRecord(response?.data) ? response.data : {};
  const nestedMeta = isRecord(data.meta) ? data.meta : {};
  const meta: Record<string, unknown> = response?.meta ?? nestedMeta;
  const total = toNumberValue(meta.total);
  const limit = toNumberValue(meta.limit, fallbackLimit) || fallbackLimit;
  const page = toNumberValue(meta.page, 1) || 1;
  const pages =
    toNumberValue(meta.pages ?? meta.totalPages) ||
    Math.max(Math.ceil(total / limit), 1);

  return {
    total,
    page,
    limit,
    pages,
  };
};

export const mapAdminDashboardStats = (data: unknown): AdminDashboardStats => {
  const root = isRecord(data) ? data : {};
  const stats = getNestedRecord(root, ["cards", "stats", "summary", "overview"]);
  const source = Object.keys(stats).length > 0 ? stats : root;

  return {
    totalRevenue: toNumberValue(
      getStatValue(source, ["totalRevenue", "revenue", "totalIncome", "income"]),
    ),
    totalRevenueChange: toNumberValue(
      getStatChange(source, ["totalRevenue", "revenue", "totalIncome", "income"]),
    ),
    totalUsers: toNumberValue(
      getStatValue(source, ["totalUser", "totalUsers", "userCount", "users", "customerCount"]),
    ),
    totalUsersChange: toNumberValue(
      getStatChange(source, ["totalUser", "totalUsers", "userCount", "users", "customerCount"]),
    ),
    subscriptionUsers: toNumberValue(
      getStatValue(source, [
        "subscriptionUser",
        "subscriptionUsers",
        "subscribedUsers",
        "subscriptionCount",
        "activeSubscriptions",
      ]),
    ),
    subscriptionUsersChange: toNumberValue(
      getStatChange(source, [
        "subscriptionUser",
        "subscriptionUsers",
        "subscribedUsers",
        "subscriptionCount",
        "activeSubscriptions",
      ]),
    ),
    supportMessages: toNumberValue(
      getStatValue(source, [
        "supportMessage",
        "supportMessages",
        "supportMessageCount",
        "contactRequests",
        "contactRequestCount",
      ]),
    ),
    supportMessagesChange: toNumberValue(
      getStatChange(source, [
        "supportMessage",
        "supportMessages",
        "supportMessageCount",
        "contactRequests",
        "contactRequestCount",
      ]),
    ),
  };
};

const mapChartPoint = (point: Record<string, unknown>, index: number): AdminRevenueChartPoint => ({
  month: toStringValue(
    point.month ?? point.label ?? point.name ?? point.period ?? point.date,
    `Item ${index + 1}`,
  ),
  revenue: toNumberValue(point.revenue ?? point.amount ?? point.totalRevenue ?? point.value),
});

const getChartSource = (data: unknown) => {
  const root = isRecord(data) ? data : {};
  const chart = getNestedRecord(root, ["chart", "revenueChart", "revenue", "analytics"]);
  return Object.keys(chart).length > 0 ? chart : root;
};

export const mapAdminRevenueChart = (
  data: unknown
): Partial<Record<AdminDashboardTimeframe, AdminRevenueChartPoint[]>> => {
  const root = isRecord(data) ? data : {};
  const directChart = toArray<Record<string, unknown>>(root.chart).map(mapChartPoint);
  const source = getChartSource(data);
  const yearly = source.yearly ?? source.year ?? source.monthlyRevenue ?? source.revenueData;
  const monthly = source.monthly ?? source.month;
  const weekly = source.weekly ?? source.week;

  return {
    Yearly: directChart.length > 0 ? directChart : toArray<Record<string, unknown>>(yearly).map(mapChartPoint),
    Monthly: toArray<Record<string, unknown>>(monthly).map(mapChartPoint),
    Weekly: toArray<Record<string, unknown>>(weekly).map(mapChartPoint),
  };
};

export const mapAdminUser = (user: Record<string, unknown>): AdminDashboardUser => {
  const subscription = isRecord(user.subscription) ? user.subscription : {};
  const plan = isRecord(subscription.plan) ? subscription.plan : {};
  const rawStatus = toStringValue(user.status, "ACTIVE");
  const id = toStringValue(user.id ?? user._id ?? user.userId, "");

  return {
    id,
    key: id,
    userName: toStringValue(user.name ?? user.userName ?? user.email, "N/A"),
    email: toStringValue(user.email, "N/A"),
    plan: toStringValue(plan.name ?? subscription.planName ?? user.plan, "N/A"),
    joined: formatDate(user.createdAt ?? user.joinedAt ?? user.joined),
    createdAt: formatDate(user.createdAt ?? user.joinedAt ?? user.joined),
    status: rawStatus === "SUSPENDED" ? "Suspended" : "Active",
    rawStatus,
  };
};

export const unwrapAdminTransactions = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (!isRecord(data)) return [];

  for (const key of ["data", "transactions", "payments", "result", "items"]) {
    const value = data[key];
    if (Array.isArray(value)) return value as Record<string, unknown>[];
  }

  return [];
};

const formatCurrency = (amount: unknown, currency: unknown) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: toStringValue(currency, "USD"),
    maximumFractionDigits: 2,
  }).format(toNumberValue(amount));

const formatTransactionStatus = (value: unknown): AdminTransactionStatus => {
  const status = toStringValue(value, "PENDING").toUpperCase();
  if (status === "COMPLETED" || status === "SUCCESS" || status === "PAID") return "Completed";
  return "Pending";
};

export const mapAdminTransaction = (transaction: Record<string, unknown>): AdminTransactionItem => {
  const user = isRecord(transaction.user) ? transaction.user : {};
  const subscription = isRecord(transaction.subscription) ? transaction.subscription : {};
  const plan = isRecord(subscription.plan) ? subscription.plan : {};
  const id = toStringValue(transaction.id ?? transaction._id, "");
  const paymentMethod = toStringValue(transaction.paymentMethod, "N/A");
  const lastFour = toStringValue(transaction.lastFourCardDigits, "");
  const rawStatus = toStringValue(transaction.status, "N/A");

  return {
    id,
    userName: toStringValue(user.name ?? transaction.userName ?? user.email, "N/A"),
    userEmail: toStringValue(user.email ?? transaction.userEmail, "N/A"),
    userPicture: toStringValue(user.picture ?? user.avatar ?? transaction.userPicture, ""),
    paymentDate: formatDate(transaction.createdAt ?? transaction.paymentDate ?? transaction.date),
    amount: formatCurrency(transaction.amount, transaction.currency),
    status: formatTransactionStatus(transaction.status),
    rawStatus,
    paymentMethod: lastFour ? `${paymentMethod} ending ${lastFour}` : paymentMethod,
    description: toStringValue(transaction.description, "N/A"),
    packageName: toStringValue(plan.name ?? subscription.planName ?? transaction.packageName, "N/A"),
    subscriptionType: toStringValue(plan.interval ?? subscription.interval ?? transaction.subscriptionType, "N/A"),
    subscriptionStatus: toStringValue(subscription.status, "N/A"),
    subscriptionId: toStringValue(transaction.subscriptionId ?? subscription.id, "N/A"),
    stripeSubscriptionId: toStringValue(subscription.stripeSubscriptionId, "N/A"),
    stripePaymentIntentId: toStringValue(transaction.stripePaymentIntentId, "N/A"),
    stripeInvoiceId: toStringValue(transaction.stripeInvoiceId, "N/A"),
    currentPeriodStart: formatDate(subscription.currentPeriodStart),
    currentPeriodEnd: formatDate(subscription.currentPeriodEnd),
    cancelledAt: subscription.cancelledAt ? formatDate(subscription.cancelledAt) : "N/A",
    joined: formatDate(user.createdAt ?? transaction.joinedAt ?? transaction.createdAt),
  };
};

const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query<AdminDashboardStatsResponse, void>({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
    getAdminUsers: builder.query<AdminUsersResponse, AdminUsersQueryParams | void>({
      query: (params) => ({
        url: "/admin/users",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["user"],
    }),
    updateAdminUserStatus: builder.mutation<unknown, AdminUserStatusPayload>({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["user", "dashboard"],
    }),
    getAdminTransactions: builder.query<AdminTransactionsResponse, AdminTransactionsQueryParams | void>({
      query: (params) => ({
        url: "/admin/transactions",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["payments"],
    }),
    updateAdminProfile: builder.mutation<AdminProfileUpdateResponse, FormData>({
      query: (body) => ({
        url: "/admin/settings/profile-update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useGetAdminDashboardStatsQuery,
  useGetAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
  useGetAdminTransactionsQuery,
  useUpdateAdminProfileMutation,
} = adminDashboardApi;
