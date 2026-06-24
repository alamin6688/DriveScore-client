import { baseApi } from "@/redux/api/baseApi";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toStringValue = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const toAmountValue = (value: unknown) => {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  return toStringValue(value, "$0.00");
};

const toDateValue = (value: unknown) => {
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

export type TransactionVendor = {
  id: string;
  userId?: string;
  companyId?: string | null;
  name: string;
  category?: string | null;
  aliases?: string[];
  metadata?: unknown;
  createdAt?: string;
  updatedAt?: string;
};

export type TransactionListItem = {
  id: string;
  userId: string;
  companyId?: string | null;
  vendorId?: string | null;
  vendor?: TransactionVendor | null;
  amount?: number | null;
  type?: string | null;
  status?: string | null;
  date?: string | null;
  category?: string | null;
  description?: string | null;
  reference?: string | null;
  confidence?: number | null;
  sourceUploadId?: string | null;
  raw?: unknown;
  createdAt: string;
  updatedAt: string;
};

export type TransactionRow = {
  id?: string;
  date: string;
  description: string;
  category: string;
  vendorName: string;
  amount: string;
};

export type TransactionTableProps = {
  transactions: TransactionRow[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export type TransactionFiltersProps = {
  search: string;
  onSearchChange: (val: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedVendor: string;
  onVendorChange: (val: string) => void;
  categoryOptions: string[];
  vendorOptions: string[];
  onExport: () => void;
  isExportDisabled?: boolean;
};

export type RecentTransactionRow = {
  id?: string;
  date: string;
  description: string;
  category: string;
  amount: string | number;
  status: string;
};

export type RecentTransactionsProps = {
  transactions?: RecentTransactionRow[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export type PaginatedTransactionsData = {
  data?: TransactionListItem[];
  result?: TransactionListItem[];
  transactions?: TransactionListItem[];
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

export type TransactionsResponse = {
  success: boolean;
  message: string;
  data: TransactionListItem[] | PaginatedTransactionsData;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    pages?: number;
  };
};

export type TransactionsQueryParams = {
  page?: number;
  limit?: number;
  vendor?: string;
  category?: string;
  dateRange?: string;
  search?: string;
  searchTerm?: string;
};

export const unwrapTransactionList = (data: unknown): TransactionListItem[] => {
  if (Array.isArray(data)) return data as TransactionListItem[];
  if (!isRecord(data)) return [];

  const possibleKeys = ["data", "result", "transactions"];

  for (const key of possibleKeys) {
    const value = data[key];
    if (Array.isArray(value)) return value as TransactionListItem[];
  }

  return [];
};

export const mapTransactionToRow = (transaction: TransactionListItem, index = 0): TransactionRow => {
  const vendor = transaction.vendor;

  return {
    id: toStringValue(transaction.id, `transaction-${index}`),
    date: toStringValue(transaction.date ?? transaction.createdAt, "N/A"),
    description: toStringValue(transaction.description ?? transaction.reference, "Transaction"),
    category: toStringValue(transaction.category ?? vendor?.category, "Uncategorized"),
    vendorName: toStringValue(vendor?.name, "N/A"),
    amount: toAmountValue(transaction.amount),
  };
};

export const mapTransactionsToRows = (data: unknown): TransactionRow[] =>
  unwrapTransactionList(data).map((transaction, index) => mapTransactionToRow(transaction, index));

export const mapTransactionsToRecentRows = (data: unknown): RecentTransactionRow[] =>
  unwrapTransactionList(data).map((transaction, index) => {
    const vendor = transaction.vendor;

    return {
      id: toStringValue(transaction.id, `transaction-${index}`),
      date: toDateValue(transaction.date ?? transaction.createdAt),
      description: toStringValue(
        transaction.description ?? transaction.reference ?? vendor?.name,
        "Transaction",
      ),
      category: toStringValue(transaction.category ?? vendor?.category, "Uncategorized"),
      amount: toAmountValue(transaction.amount),
      status: toStringValue(transaction.status, "Completed"),
    };
  });

export const getTransactionsPagination = (
  response?: TransactionsResponse,
  fallbackLimit = 5
) => {
  const data = isRecord(response?.data) ? response.data : {};
  const meta = response?.meta ?? (isRecord(data.meta) ? data.meta : isRecord(data.pagination) ? data.pagination : {});
  const total = typeof meta.total === "number" ? meta.total : 0;
  const limit = typeof meta.limit === "number" && meta.limit > 0 ? meta.limit : fallbackLimit;
  const page = typeof meta.page === "number" && meta.page > 0 ? meta.page : 1;
  const totalPagesValue = meta.totalPages ?? meta.pages;
  const totalPages =
    typeof totalPagesValue === "number" && totalPagesValue > 0
      ? totalPagesValue
      : Math.max(Math.ceil(total / limit), 1);

  return {
    total,
    page,
    limit,
    totalPages,
  };
};

export const getTransactionFilterOptions = (rows: TransactionRow[]) => ({
  categories: Array.from(new Set(rows.map((row) => row.category).filter(Boolean))),
  vendors: Array.from(new Set(rows.map((row) => row.vendorName).filter((vendor) => vendor && vendor !== "N/A"))),
});

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionsResponse, TransactionsQueryParams | void>({
      query: (params: TransactionsQueryParams | void) => ({
        url: "/transactions",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["user"],
    }),
  }),
});

export const { useGetTransactionsQuery, useLazyGetTransactionsQuery } = transactionsApi;
