import { baseApi } from "@/redux/api/baseApi";

export type ApiRecord = Record<string, unknown>;

export type DashboardSummary = {
  revenue?: number;
  revenueChange?: number;
  expenses?: number;
  expensesChange?: number;
  netIncome?: number;
  netIncomeChange?: number;
  transactions?: number;
  transactionsChange?: number;
};

export type DashboardChartPoint = {
  month: string;
  revenue: number;
  expenses: number;
};

export type DashboardTimeFrame = "Yearly" | "Monthly" | "Weekly";

export type StatsGridProps = {
  stats?: Partial<DashboardSummary>;
};

export type StatItemProps = {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
};

export type EarningsReportChartProps = {
  chartData?: DashboardChartPoint[];
};

export type UserDashboardData = {
  stats?: DashboardSummary;
  summary?: DashboardSummary;
  overview?: DashboardSummary;
  chart?: DashboardChartPoint[];
  chartData?: DashboardChartPoint[];
  earnings?: DashboardChartPoint[];
  earningsReport?: DashboardChartPoint[];
};

export type UserDashboardResponse = {
  success: boolean;
  message: string;
  data: UserDashboardData;
};

export type UserDashboardQueryParams = {
  page?: number;
  limit?: number;
  timeframe?: "weekly" | "monthly" | "yearly";
};

export const userDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboard: builder.query<UserDashboardResponse, UserDashboardQueryParams | void>({
      query: (params: UserDashboardQueryParams | void) => ({
        url: "/user/dashboard",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["user"],
    }),
  }),
});

export const { useGetUserDashboardQuery } = userDashboardApi;
