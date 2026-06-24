"use client";

import React, { useState } from "react";

import {
  useGetUserDashboardQuery,
} from "@/service/userDashboard/userDashboardApi";
import {
  getTransactionsPagination,
  mapTransactionsToRecentRows,
  useGetTransactionsQuery,
} from "@/service/transactions/transactionsApi";
import type {
  ApiRecord,
  DashboardChartPoint,
  DashboardSummary,
} from "@/service/userDashboard/userDashboardApi";

const isRecord = (value: unknown): value is ApiRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[$,%\s,]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toString = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const pickRecord = (data: ApiRecord, keys: string[]) => {
  for (const key of keys) {
    const value = data[key];
    if (isRecord(value)) return value;
  }
  return {};
};

const pickArray = (data: ApiRecord, keys: string[]) => {
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) return value;
  }
  return [];
};

const getMetricValue = (source: ApiRecord, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (isRecord(value) && "value" in value) return value.value;
    if (value !== undefined) return value;
  }

  return undefined;
};

const getMetricChange = (source: ApiRecord, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (isRecord(value) && "change" in value) return value.change;
  }

  return undefined;
};

const mapStats = (data: unknown): Partial<DashboardSummary> => {
  if (!isRecord(data)) return {};

  const source = pickRecord(data, ["cards", "stats", "summary", "overview", "totals"]);

  return {
    revenue: toNumber(getMetricValue(source, ["totalRevenue", "revenue"])),
    revenueChange: toNumber(
      getMetricChange(source, ["totalRevenue", "revenue"]) ??
        source.revenueChange ??
        source.revenueGrowth ??
        source.revenuePercentage
    ),
    expenses: toNumber(getMetricValue(source, ["totalExpenses", "expenses"])),
    expensesChange: toNumber(
      getMetricChange(source, ["totalExpenses", "expenses"]) ??
        source.expensesChange ??
        source.expensesGrowth ??
        source.expensePercentage
    ),
    netIncome: toNumber(getMetricValue(source, ["netIncome", "income"])),
    netIncomeChange: toNumber(
      getMetricChange(source, ["netIncome", "income"]) ??
        source.netIncomeChange ??
        source.netIncomeGrowth ??
        source.incomePercentage
    ),
    transactions: toNumber(getMetricValue(source, ["transactions", "totalTransactions"])),
    transactionsChange: toNumber(
      getMetricChange(source, ["transactions", "totalTransactions"]) ??
        source.transactionsChange ??
        source.transactionsGrowth ??
        source.transactionPercentage
    ),
  };
};

const mapChart = (data: unknown): DashboardChartPoint[] => {
  if (!isRecord(data)) return [];

  return pickArray(data, ["chart", "chartData", "earnings", "earningsReport", "monthlyEarnings"]).map(
    (item) => {
      const record = isRecord(item) ? item : {};

      return {
        month: toString(record.month ?? record.label ?? record.name ?? record.date, "N/A"),
        revenue: toNumber(record.revenue ?? record.totalRevenue),
        expenses: toNumber(record.expenses ?? record.totalExpenses),
      };
    }
  );
};

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-[120px] rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="h-full animate-pulse space-y-8">
            <div className="h-3 w-24 rounded-full bg-gray-100" />
            <div className="flex items-end justify-between">
              <div className="h-7 w-28 rounded-full bg-gray-100" />
              <div className="h-4 w-14 rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EarningsReportSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-4 w-36 rounded-full bg-gray-100" />
        <div className="flex items-center gap-4">
          <div className="h-3 w-28 rounded-full bg-gray-100" />
          <div className="h-8 w-20 rounded-xl bg-gray-100" />
        </div>
      </div>
      <div className="flex h-64 items-end gap-3 overflow-hidden animate-pulse">
        {[84, 132, 96, 172, 116, 148, 202, 128, 164, 92, 188, 138].map((height, index) => (
          <div key={index} className="flex flex-1 items-end gap-1">
            <div className="w-full rounded-t bg-gray-100" style={{ height }} />
            <div className="w-full rounded-t bg-gray-100" style={{ height: Math.max(42, height - 38) }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTransactionsSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-4 w-40 rounded-full bg-gray-100" />
        <div className="h-3 w-14 rounded-full bg-gray-100" />
      </div>
      <div className="hidden animate-pulse md:block">
        <div className="mb-3 grid grid-cols-5 gap-4 border-b border-[#4CAF50]/30 pb-3">
          {[0, 1, 2, 3, 4].map((item) => (
            <div key={item} className="h-3 rounded-full bg-gray-100" />
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="grid grid-cols-5 gap-4 border-b border-gray-50 py-3">
            {[0, 1, 2, 3, 4].map((cell) => (
              <div key={cell} className="h-4 rounded-full bg-gray-100" />
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-4 md:hidden">
        {[0, 1, 2].map((row) => (
          <div key={row} className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-4">
            <div className="animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-24 rounded-full bg-gray-100" />
                <div className="h-4 w-16 rounded-full bg-gray-100" />
              </div>
              <div className="h-4 w-3/4 rounded-full bg-gray-100" />
              <div className="flex justify-between border-t border-gray-50 pt-3">
                <div className="h-5 w-20 rounded-full bg-gray-100" />
                <div className="h-5 w-20 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-100" />
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-8 w-8 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
        <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

export default function UserDashboardOverview() {
  const [recentTransactionsPage, setRecentTransactionsPage] = useState(1);
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetUserDashboardQuery({
    timeframe: "yearly",
    page: 1,
    limit: 10,
  });
  const {
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching,
    isError: isTransactionsError,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery({
    page: recentTransactionsPage,
    limit: 5,
  });
  const dashboardData = data?.data;
  const stats = mapStats(dashboardData);
  const chartData = mapChart(dashboardData);
  const recentTransactions = mapTransactionsToRecentRows(transactionsResponse?.data);
  const recentTransactionsPagination = getTransactionsPagination(transactionsResponse, 5);

  return (
    <div className="w-full flex flex-col gap-6 font-poppins select-text pb-12">
      {/* Welcome Banner */}
       <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">Hello and welcome!</div>

      {isError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          Failed to load dashboard data.
          <button onClick={() => refetch()} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}

      {isTransactionsError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          Failed to load recent transactions.
          <button onClick={() => refetchTransactions()} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      {isLoading ? <StatsGridSkeleton /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         
      </div>}

      {/* Earnings Report Chart (Full Width) */}
      {isLoading ? <EarningsReportSkeleton /> : <div>Hello World!</div>}

      {/* Recent Transactions List (Full Width) */}
      {isTransactionsLoading || isTransactionsFetching ? (
        <RecentTransactionsSkeleton />
      ) : (
        <div>Hello 2!</div>
      )}
    </div>
  );
}
