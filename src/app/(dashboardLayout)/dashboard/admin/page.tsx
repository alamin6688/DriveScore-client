"use client";

import React, { useMemo, useState, useEffect } from "react";
import { getProfileName, useGetProfileDataQuery } from "@/service/profile/profileApi";
import {
  getAdminUsersPagination,
  mapAdminDashboardStats,
  mapAdminRevenueChart,
  mapAdminUser,
  unwrapAdminUsers,
  useGetAdminDashboardStatsQuery,
  useGetAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
  type AdminUserStatus,
} from "@/service/admin/dashboardApi";

const USER_LIST_PAGE_SIZE = 6;

const AdminDashboard = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const { data: profileResponse } = useGetProfileDataQuery();
  const { data: statsResponse, isLoading: isStatsLoading, isError: isStatsError } = useGetAdminDashboardStatsQuery();
  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    isError: isUsersError,
  } = useGetAdminUsersQuery({
    page: usersPage,
    limit: USER_LIST_PAGE_SIZE,
  });
  const [updateUserStatus] = useUpdateAdminUserStatusMutation();

  const adminName = getProfileName(profileResponse?.data) || "Admin";
  const stats = useMemo(
    () => mapAdminDashboardStats(statsResponse?.data),
    [statsResponse?.data]
  );
  const chartData = useMemo(
    () => mapAdminRevenueChart(statsResponse?.data),
    [statsResponse?.data]
  );
  const users = useMemo(
    () => unwrapAdminUsers(usersResponse?.data).map(mapAdminUser).filter((user) => user.id),
    [usersResponse?.data]
  );
  const usersPagination = getAdminUsersPagination(usersResponse, USER_LIST_PAGE_SIZE);
  const totalUsers = usersPagination.total || users.length;
  const isUsersPageFetching = isUsersFetching && usersPagination.page !== usersPage;

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString("en-US", options));
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 font-poppins select-text pb-12">
      {/* Welcome Banner matching User Dashboard spacing */}
      {/* <div className="flex flex-row items-center justify-between gap-4 pb-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight leading-none">
            Welcome, {adminName}
          </h1>
          <p className="text-gray-400 text-xs font-semibold mt-2">
            {currentDate || "Wednesday, May 20, 2026"}
          </p>
        </div>
      </div> */}

      {isStatsError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          Failed to load admin dashboard stats.
        </div>
      )}

      {isUsersError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          Failed to load admin users.
        </div>
      )}

      
      <div> 
        Admin Dashboard
      </div>
    </div>
  );
};

export default AdminDashboard;
