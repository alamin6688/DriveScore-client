"use client";

import React, { useMemo, useState } from "react";
import {
  getAdminUsersPagination,
  mapAdminUser,
  unwrapAdminUsers,
  useGetAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
  type AdminUserStatus,
} from "@/service/admin/dashboardApi";

const PAGE_SIZE = 15;

const AllUsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useGetAdminUsersQuery({
    page: currentPage,
    limit: PAGE_SIZE,
  });
  const [updateUserStatus] = useUpdateAdminUserStatusMutation();
  const users = useMemo(
    () => unwrapAdminUsers(data?.data).map(mapAdminUser).filter((user) => user.id),
    [data?.data]
  );
  const pagination = getAdminUsersPagination(data, PAGE_SIZE);
  const totalItems = pagination.total || users.length;

  return (
    < div> All Users </div>
  );
};

export default AllUsersPage;
