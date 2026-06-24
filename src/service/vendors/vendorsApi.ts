import { baseApi } from "@/redux/api/baseApi";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toStringValue = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const toNumberValue = (value: unknown, fallback = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[$,%\s,]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export type VendorListItem = {
  id: string;
  userId: string;
  companyId?: string | null;
  name: string;
  category?: string | null;
  aliases?: string[];
  metadata?: unknown;
  createdAt: string;
  updatedAt: string;
  transactions?: unknown[];
  transactionsCount?: number;
  _count?: {
    transactions?: number;
  };
  totalPaid?: number | string;
  status?: string;
};

export type VendorRow = {
  id: string;
  name: string;
  category: string;
  transactionsCount: number;
  totalPaid: string;
  status: string;
};

export type VendorStatsProps = {
  totalVendors: string;
  activeVendors: string;
  totalPaid: string;
};

export type VendorFiltersProps = {
  search: string;
  onSearchChange: (val: string) => void;
  selectedVendor: string;
  onVendorChange: (val: string) => void;
  vendorOptions: string[];
  onExport: () => void;
  isExportDisabled?: boolean;
};

export type VendorTableProps = {
  vendors: VendorRow[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export type PaginatedVendorsData = {
  data?: VendorListItem[];
  result?: VendorListItem[];
  vendors?: VendorListItem[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    pages?: number;
  };
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    pages?: number;
  };
};

export type VendorsResponse = {
  success: boolean;
  message: string;
  data: VendorListItem[] | PaginatedVendorsData;
  summary?: {
    totalVendors?: number;
    totalPaid?: number | string;
    activeVendors?: number;
  };
  categories?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    pages?: number;
  };
};

export type VendorsQueryParams = {
  page?: number;
  limit?: number;
  categories?: string;
  search?: string;
};

export const unwrapVendorList = (data: unknown): VendorListItem[] => {
  if (Array.isArray(data)) return data as VendorListItem[];
  if (!isRecord(data)) return [];

  for (const key of ["data", "result", "vendors"]) {
    const value = data[key];
    if (Array.isArray(value)) return value as VendorListItem[];
  }

  return [];
};

export const mapVendorToRow = (vendor: VendorListItem, index = 0): VendorRow => {
  const metadata = isRecord(vendor.metadata) ? vendor.metadata : {};
  const transactionCount =
    vendor.transactionsCount ??
    vendor._count?.transactions ??
    toNumberValue(metadata.transactionCount) ??
    (Array.isArray(vendor.transactions) ? vendor.transactions.length : 0);
  const paid = toNumberValue(vendor.totalPaid);

  return {
    id: toStringValue(vendor.id, `vendor-${index}`),
    name: toStringValue(vendor.name, "N/A"),
    category: toStringValue(vendor.category, "Uncategorized"),
    transactionsCount: transactionCount,
    totalPaid: formatCurrency(paid),
    status: toStringValue(vendor.status, "Active"),
  };
};

export const mapVendorsToRows = (data: unknown): VendorRow[] =>
  unwrapVendorList(data).map((vendor, index) => mapVendorToRow(vendor, index));

export const getVendorFilterOptions = (rows: VendorRow[]) =>
  Array.from(new Set(rows.map((row) => row.name).filter((name) => name && name !== "N/A")));

export const getVendorStats = (
  response?: VendorsResponse,
  fallbackRows: VendorRow[] = []
): VendorStatsProps => {
  if (response?.summary) {
    return {
      totalVendors: String(toNumberValue(response.summary.totalVendors)),
      activeVendors: String(toNumberValue(response.summary.activeVendors)),
      totalPaid: formatCurrency(toNumberValue(response.summary.totalPaid)),
    };
  }

  const rows = fallbackRows;
  const activeVendors = rows.filter((row) => row.status.toLowerCase() === "active").length;
  const totalPaid = rows.reduce((total, row) => total + toNumberValue(row.totalPaid), 0);

  return {
    totalVendors: String(rows.length),
    activeVendors: String(activeVendors),
    totalPaid: formatCurrency(totalPaid),
  };
};

export const getVendorsPagination = (
  response?: VendorsResponse,
  fallbackLimit = 10
) => {
  const data = isRecord(response?.data) ? response.data : {};
  const meta =
    response?.meta ??
    (isRecord(data.meta)
      ? data.meta
      : isRecord(data.pagination)
        ? data.pagination
        : {});

  const total = typeof meta.total === "number" ? meta.total : 0;
  const limit =
    typeof meta.limit === "number" && meta.limit > 0 ? meta.limit : fallbackLimit;
  const page = typeof meta.page === "number" && meta.page > 0 ? meta.page : 1;
  const totalPagesValue = meta.totalPages ?? meta.pages;
  const totalPages =
    typeof totalPagesValue === "number" && totalPagesValue > 0
      ? totalPagesValue
      : Math.max(Math.ceil(total / limit), 1);

  return { total, page, limit, totalPages };
};

export const vendorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<VendorsResponse, VendorsQueryParams | void>({
      query: (params: VendorsQueryParams | void) => ({
        url: "/vendors",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["user"],
    }),
  }),
});

export const { useGetVendorsQuery } = vendorsApi;
