export const normalizeRole = (role?: string | null) => {
  return role || "USER";
};

export const getDashboardPathByRole = (role?: string | null) => {
  const normalizedRole = normalizeRole(role).toUpperCase();

  if (normalizedRole === "ADMIN") return "/dashboard/admin";
  if (normalizedRole === "COMPANY") return "/dashboard/company";
  if (normalizedRole === "DRIVER") return "/dashboard/driver";
  return "/dashboard/user";
};
