export const normalizeRole = (role?: string | null) => {
  return role || "USER";
};

export const getDashboardPathByRole = (role?: string | null) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "ADMIN") return "/dashboard/admin";
  return "/dashboard/user";
};
