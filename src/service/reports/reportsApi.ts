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

const toArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const hasBackendValue = (value: unknown) =>
  value !== null && value !== undefined && value !== "";

export type ReportType = string;

export type ReportTabKey = "PNL" | "BALANCE_SHEET" | "TAX" | "VENDOR" | "EXPENSE";

export type ReportTabDefinition = {
  key: ReportTabKey;
  label: string;
};

export type ReportItem = {
  id: string;
  userId?: string;
  companyId?: string | null;
  uploadId?: string | null;
  type: ReportType;
  title: string;
  summary?: string | null;
  data: unknown;
  periodFrom?: string | null;
  periodTo?: string | null;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ReportsQueryParams = {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
};

export type ReportDocumentMatchInput = {
  id: string;
  filename?: string;
  uploadedAtRaw?: string;
};

export type ReportsPaginationMeta = {
  total?: number | string;
  page?: number | string;
  limit?: number | string;
  totalPages?: number | string;
  pages?: number | string;
  skip?: number | string;
};

export type ReportsResponse = {
  success: boolean;
  message: string;
  meta?: ReportsPaginationMeta;
  data:
    | ReportItem[]
    | {
        data?: ReportItem[];
        reports?: ReportItem[];
        result?: ReportItem[];
        items?: ReportItem[];
        list?: ReportItem[];
        rows?: ReportItem[];
        docs?: ReportItem[];
        total?: number | string;
        meta?: ReportsPaginationMeta;
        pagination?: ReportsPaginationMeta;
      };
};

export type ReportResponse = {
  success: boolean;
  message: string;
  data: ReportItem;
};

export type ReportTransactionRow = {
  date: string;
  description: string;
  vendor: string;
  category: string;
  type: string;
  amount: number;
  debitAmount: number;
  creditAmount: number;
  balanceAfter: number;
  confidence: number;
};

export type AnalysisMetric = {
  label: string;
  value: string;
  tone: "neutral" | "success" | "danger";
};

export type AnalysisBreakdownRow = {
  category: string;
  amount: number;
  share: number;
};

export type ReportVendorRow = {
  id: string;
  name: string;
  category: string;
  transactionsCount: number;
  totalPaid: string;
  status: string;
};

export type ReportSectionRow = {
  label: string;
  amount: number;
  value: string;
  notes: string;
  rate: string;
};

export type ReportSection = {
  title: string;
  total: string;
  rows: ReportSectionRow[];
};

export type AccountDetailRow = {
  label: string;
  value: string;
};

export type ReportAnalysisView = {
  id?: string;
  title: string;
  type: ReportType;
  sourceLabel: string;
  summary: string;
  documentType: string;
  currency: string;
  periodText: string;
  generatedAt: string;
  metrics: AnalysisMetric[];
  accountDetails: AccountDetailRow[];
  breakdown: AnalysisBreakdownRow[];
  transactions: ReportTransactionRow[];
  vendors: ReportVendorRow[];
  sections: ReportSection[];
};

export type EmptyAnalysisCardProps = {
  activeTabLabel?: string;
};

export type ReportAnalysisPanelProps = {
  analysis: ReportAnalysisView;
};

export type ActiveReportContentProps = {
  activeTab: ReportTabKey;
  analysis: ReportAnalysisView;
};

export type ReportHistoryRow = {
  id: string;
  title: string;
  type: ReportType;
  period: string;
  generated: string;
  format: string;
  summary: string;
};

export type ReportHistoryTableProps = {
  reports: ReportHistoryRow[];
  isError: boolean;
  isFetching?: boolean;
  isLoadingReport: boolean;
  activeReportId: string | null;
  loadingReportId: string | null;
  downloadingReportId: string | null;
  currentPage: number;
  pageSize?: number;
  totalPages: number;
  onLoadReport: (reportId: string) => void;
  onDownloadReport: (reportId: string) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
};

export const REPORT_TABS: ReportTabDefinition[] = [
  { key: "PNL", label: "P&L Statement" },
  { key: "BALANCE_SHEET", label: "Balance Sheet" },
  { key: "TAX", label: "Tax Report" },
  { key: "VENDOR", label: "Vendor Report" },
  { key: "EXPENSE", label: "Expense Report" },
];

export const REPORT_ANALYSIS_SESSION_KEY = "accusum:last-ai-extract-response";

export const formatReportDate = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const parseJsonValue = (value: unknown) => {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const isReportLike = (value: Record<string, unknown>) =>
  typeof value.id === "string" &&
  (typeof value.type === "string" || typeof value.title === "string");

export const normalizeReportType = (value?: unknown): ReportTabKey | undefined => {
  const normalized = toStringValue(value).toUpperCase().replace(/[\s-]+/g, "_");

  if (["PNL", "P_AND_L", "P&L", "PL", "PROFIT_LOSS", "PROFIT_AND_LOSS"].includes(normalized)) {
    return "PNL";
  }

  if (["BALANCE", "BALANCE_SHEET"].includes(normalized)) {
    return "BALANCE_SHEET";
  }

  if (["TAX", "TAX_REPORT"].includes(normalized)) {
    return "TAX";
  }

  if (["VENDOR", "VENDORS", "VENDOR_REPORT"].includes(normalized)) {
    return "VENDOR";
  }

  if (["EXPENSE", "EXPENSES", "EXPENSE_REPORT"].includes(normalized)) {
    return "EXPENSE";
  }

  return undefined;
};

export const formatCurrencyValue = (value: unknown, currency = "USD") => {
  if (!hasBackendValue(value)) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(toNumberValue(value));
};

const formatPlainValue = (value: unknown) =>
  hasBackendValue(value) ? toStringValue(value, "N/A") : "N/A";

export const unwrapReportList = (data: unknown): ReportItem[] => {
  if (Array.isArray(data)) return data as ReportItem[];
  if (!isRecord(data)) return [];

  for (const key of ["data", "reports", "result", "items", "list", "rows", "docs"]) {
    const value = data[key];
    if (Array.isArray(value)) return value as ReportItem[];
  }

  return [];
};

export const getReportsPagination = (response?: ReportsResponse, fallbackLimit = 10) => {
  const data = isRecord(response?.data) ? response.data : {};
  const meta =
    response?.meta ??
    (isRecord(data.meta)
      ? data.meta
      : isRecord(data.pagination)
        ? data.pagination
        : {});
  const metaPage = toNumberValue(meta.page);
  const metaLimit = toNumberValue(meta.limit);
  const metaTotal = toNumberValue(meta.total ?? data.total);
  const page = metaPage && metaPage > 0 ? metaPage : 1;
  const limit = metaLimit && metaLimit > 0 ? metaLimit : fallbackLimit;
  const total = metaTotal && metaTotal > 0 ? metaTotal : unwrapReportList(response?.data).length;
  const totalPagesValue = meta.totalPages ?? meta.pages;
  const totalPagesNumber = toNumberValue(totalPagesValue);
  const totalPages =
    totalPagesNumber && totalPagesNumber > 0
      ? totalPagesNumber
      : limit > 0
        ? Math.max(Math.ceil(total / limit), 1)
        : 1;

  return {
    page,
    limit,
    total,
    totalPages,
  };
};

export const unwrapReportItem = (data: unknown): ReportItem | undefined => {
  if (!isRecord(data)) return undefined;
  if (isReportLike(data)) return data as ReportItem;
  if (isRecord(data.data)) return data.data as ReportItem;
  if (isRecord(data.report)) return data.report as ReportItem;
  return data as ReportItem;
};

export const reportMatchesUploadId = (report: ReportItem, uploadId: string) => {
  const reportRecord = report as Record<string, unknown>;
  const reportData = parseJsonValue(report.data);
  const candidateRoots = [
    reportRecord,
    reportData,
    isRecord(reportData) ? reportData.meta : undefined,
    isRecord(reportData) ? reportData.source : undefined,
    isRecord(reportData) ? reportData.upload : undefined,
    isRecord(reportData) ? reportData.document : undefined,
    reportRecord.meta,
    reportRecord.source,
    reportRecord.upload,
    reportRecord.document,
  ];
  const candidateKeys = [
    "uploadId",
    "upload_id",
    "documentId",
    "document_id",
    "sourceUploadId",
    "sourceDocumentId",
    "fileUploadId",
    "id",
  ];

  return candidateRoots.some((root) => {
    if (!isRecord(root)) return false;

    return candidateKeys.some((key) => {
      const value = root[key];

      if (value === uploadId) return true;
      if (typeof value === "number" && String(value) === uploadId) return true;

      if (isRecord(value)) {
        return value.id === uploadId || value.uploadId === uploadId || value.documentId === uploadId;
      }

      return false;
    });
  });
};

const normalizeComparableText = (value?: string | null) =>
  toStringValue(value)
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "");

const getReportCandidateText = (report: ReportItem) => {
  const reportRecord = report as Record<string, unknown>;
  const reportData = parseJsonValue(report.data);
  const candidateRoots = [
    reportRecord,
    reportData,
    isRecord(reportData) ? reportData.meta : undefined,
    isRecord(reportData) ? reportData.source : undefined,
    isRecord(reportData) ? reportData.upload : undefined,
    isRecord(reportData) ? reportData.document : undefined,
  ];
  const candidateKeys = [
    "title",
    "summary",
    "filename",
    "fileName",
    "originalName",
    "documentName",
    "sourceFileName",
    "name",
  ];

  return candidateRoots
    .flatMap((root) => {
      if (!isRecord(root)) return [];
      return candidateKeys.map((key) => toStringValue(root[key]));
    })
    .filter(Boolean)
    .join(" ");
};

const isReportNearDocumentTime = (report: ReportItem, uploadedAtRaw?: string) => {
  if (!uploadedAtRaw || !report.createdAt) return false;

  const uploadTime = new Date(uploadedAtRaw).getTime();
  const reportTime = new Date(report.createdAt).getTime();
  if (!Number.isFinite(uploadTime) || !Number.isFinite(reportTime)) return false;

  return Math.abs(reportTime - uploadTime) <= 30 * 60 * 1000;
};

export const reportMatchesDocument = (
  report: ReportItem,
  document: ReportDocumentMatchInput
) => {
  if (reportMatchesUploadId(report, document.id)) return true;

  const documentName = normalizeComparableText(document.filename);
  const reportText = normalizeComparableText(getReportCandidateText(report));

  if (documentName && reportText.includes(documentName)) return true;
  if (documentName && isReportNearDocumentTime(report, document.uploadedAtRaw)) {
    const compactDocumentName = documentName.slice(0, 16);
    return compactDocumentName.length > 6 && reportText.includes(compactDocumentName);
  }

  return false;
};

export const getReportsFromAiExtractResponse = (response: unknown): ReportItem[] => {
  const root = isRecord(response) && isRecord(response.data) ? response.data : response;
  if (!isRecord(root)) return [];
  return unwrapReportList(root.reports);
};

const getReportDataRecord = (report?: ReportItem | null) =>
  isRecord(parseJsonValue(report?.data)) ? parseJsonValue(report?.data) as Record<string, unknown> : {};

const getMetaRecord = (report?: ReportItem | null) => {
  const data = getReportDataRecord(report);
  return isRecord(data.meta) ? data.meta : {};
};

const getAccountRecord = (report?: ReportItem | null) => {
  const data = getReportDataRecord(report);
  return isRecord(data.account) ? data.account : {};
};

const getTabsRecord = (report?: ReportItem | null) => {
  const data = getReportDataRecord(report);
  return isRecord(data.tabs) ? data.tabs : {};
};

const getReportTabRecord = (report?: ReportItem | null, tabKey: ReportTabKey = "PNL") => {
  const tabs = getTabsRecord(report);
  const tabMap: Record<ReportTabKey, string> = {
    PNL: "pnl",
    BALANCE_SHEET: "balanceSheet",
    TAX: "tax",
    VENDOR: "vendor",
    EXPENSE: "expense",
  };
  const tab = tabs[tabMap[tabKey]];
  return isRecord(tab) ? tab : {};
};

const getTabSummaryRecord = (report?: ReportItem | null, tabKey: ReportTabKey = "PNL") => {
  const tab = getReportTabRecord(report, tabKey);
  return isRecord(tab.summary) ? tab.summary : {};
};

export const reportHasTabData = (report?: ReportItem | null, tabKey?: ReportTabKey) => {
  if (!report || !tabKey) return false;
  if (normalizeReportType(report.type) === tabKey) return true;
  return Object.keys(getReportTabRecord(report, tabKey)).length > 0;
};

export const getTransactionsFromReport = (report?: ReportItem | null): ReportTransactionRow[] => {
  const data = getReportDataRecord(report);

  return toArray<Record<string, unknown>>(data.transactions).map((transaction) => ({
    date: toStringValue(transaction.date, "N/A"),
    description: toStringValue(transaction.description, "N/A"),
    vendor: toStringValue(transaction.vendor, "N/A"),
    category: toStringValue(transaction.category, "Uncategorized"),
    type: toStringValue(transaction.type, "N/A"),
    amount: toNumberValue(transaction.amount),
    debitAmount: toNumberValue(transaction.debitAmount),
    creditAmount: toNumberValue(transaction.creditAmount),
    balanceAfter: toNumberValue(transaction.balanceAfter),
    confidence: toNumberValue(transaction.confidence),
  }));
};

export const getVendorsFromReport = (report?: ReportItem | null): ReportVendorRow[] => {
  const vendorTab = getReportTabRecord(report, "VENDOR");
  const vendors = toArray<Record<string, unknown>>(vendorTab.vendors);
  const currency = toStringValue(getMetaRecord(report).currency, "USD");

  return vendors.map((vendor, index) => {
    const riskLevel = toStringValue(vendor.riskLevel);

    return {
      id: toStringValue(vendor.id ?? vendor.name, `vendor-${index}`),
      name: toStringValue(vendor.name ?? vendor.normalizedName, "N/A"),
      category: toStringValue(vendor.category, "Uncategorized"),
      transactionsCount: toNumberValue(vendor.transactionCount ?? vendor.transactionsCount),
      totalPaid: formatCurrencyValue(vendor.totalSpend ?? vendor.totalPaid, currency),
      status: riskLevel
        ? `${riskLevel.charAt(0).toUpperCase()}${riskLevel.slice(1)} Risk`
        : "Active",
    };
  });
};

export const getSectionsFromReport = (
  report?: ReportItem | null,
  tabKey: ReportTabKey = "PNL"
): ReportSection[] => {
  const tab = getReportTabRecord(report, tabKey);
  const currency = toStringValue(getMetaRecord(report).currency, "USD");

  return toArray<Record<string, unknown>>(tab.sections).map((section, sectionIndex) => {
    const directRows = toArray<Record<string, unknown>>(section.rows);
    const subsectionRows = toArray<Record<string, unknown>>(section.subsections).flatMap((subsection) =>
      toArray<Record<string, unknown>>(subsection.rows).map<Record<string, unknown>>((row) => ({
        ...row,
        notes: row.notes ?? subsection.title,
      }))
    );
    const rows = directRows.length > 0 ? directRows : subsectionRows;

    return {
      title: toStringValue(section.title, `Section ${sectionIndex + 1}`),
      total: formatCurrencyValue(section.total, currency),
      rows: rows.map((row) => ({
        label: toStringValue(row.label ?? row.name, "N/A"),
        amount: toNumberValue(row.amount),
        value: formatCurrencyValue(row.amount, currency),
        notes: toStringValue(row.notes, ""),
        rate: toStringValue(row.rate, "N/A"),
      })),
    };
  });
};

export const getBackendBreakdown = (
  report?: ReportItem | null,
  tabKey: ReportTabKey = "PNL"
): AnalysisBreakdownRow[] => {
  const tab = tabKey === "PNL" ? getReportTabRecord(report, "EXPENSE") : getReportTabRecord(report, tabKey);
  const expenseBreakdown = toArray<Record<string, unknown>>(tab.expenseBreakdown);
  const categories = toArray<Record<string, unknown>>(tab.categories);
  const source = expenseBreakdown.length > 0 ? expenseBreakdown : categories;

  const breakdown = source
    .map((item) => ({
      category: toStringValue(item.label ?? item.name ?? item.category, "Uncategorized"),
      amount: toNumberValue(item.amount),
      share: toNumberValue(item.percent ?? item.share),
    }))
    .slice(0, 8);

  if (breakdown.length > 0 || tabKey !== "PNL") return breakdown;

  const pnlExpenseSection = getSectionsFromReport(report, "PNL").find((section) =>
    section.title.toLowerCase().includes("expense")
  );
  const expenseRows = pnlExpenseSection?.rows ?? [];
  const totalExpense = expenseRows.reduce((total, row) => total + row.amount, 0);

  return expenseRows
    .map((row) => ({
      category: row.label,
      amount: row.amount,
      share: totalExpense > 0 ? Number(((row.amount / totalExpense) * 100).toFixed(2)) : 0,
    }))
    .slice(0, 8);
};

const buildMetricsForTab = (
  report: ReportItem,
  tabKey: ReportTabKey,
  transactions: ReportTransactionRow[],
  currency: string
): AnalysisMetric[] => {
  const summary = getTabSummaryRecord(report, tabKey);

  if (tabKey === "BALANCE_SHEET") {
    return [
      { label: "Total Assets", value: formatCurrencyValue(summary.totalAssets, currency), tone: "neutral" },
      { label: "Transactions", value: String(transactions.length), tone: "neutral" },
    ];
  }

  if (tabKey === "TAX") {
    const pnlSummary = getTabSummaryRecord(report, "PNL");
    const grossIncome =
      summary.grossIncome ??
      summary.totalIncome ??
      summary.revenue ??
      pnlSummary.revenue;
    const deductions =
      summary.deductions ??
      summary.totalDeductions ??
      summary.deductibleExpenses ??
      summary.totalDeductibleExpenses;
    const estimatedTax =
      summary.estimatedTax ??
      summary.estimateTax ??
      summary.totalTaxes ??
      summary.incomeTax ??
      summary.salesTax;

    return [
      { label: "Gross Income", value: formatCurrencyValue(grossIncome, currency), tone: "neutral" },
      { label: "Deductions", value: formatCurrencyValue(deductions, currency), tone: "neutral" },
      { label: "Taxable Income", value: formatCurrencyValue(summary.taxableIncome, currency), tone: "neutral" },
      { label: "Estimated Tax", value: formatCurrencyValue(estimatedTax, currency), tone: "neutral" },
    ];
  }

  if (tabKey === "VENDOR") {
    return [
      { label: "Total Vendors", value: formatPlainValue(summary.totalVendors), tone: "neutral" },
      { label: "Unique Vendors", value: formatPlainValue(summary.uniqueVendors), tone: "neutral" },
      { label: "Total Spend", value: formatCurrencyValue(summary.totalSpend, currency), tone: "neutral" },
    ];
  }

  if (tabKey === "EXPENSE") {
    return [
      { label: "Total Expenses", value: formatCurrencyValue(summary.totalExpenses, currency), tone: "neutral" },
      { label: "Expenses", value: formatPlainValue(summary.numberOfExpenses), tone: "neutral" },
      { label: "Average Expense", value: formatCurrencyValue(summary.averageExpense, currency), tone: "neutral" },
      { label: "Highest Expense", value: formatCurrencyValue(summary.highestExpense, currency), tone: "neutral" },
    ];
  }

  return [
    { label: "Revenue", value: formatCurrencyValue(summary.revenue, currency), tone: "neutral" },
    { label: "Expenses", value: formatCurrencyValue(summary.expenses, currency), tone: "neutral" },
    { label: "Net Income", value: formatCurrencyValue(summary.netIncome, currency), tone: "neutral" },
    { label: "Transactions", value: String(transactions.length), tone: "neutral" },
  ];
};

export const mapReportToAnalysisView = (report?: ReportItem | null, tabKey: ReportTabKey = "PNL"): ReportAnalysisView | null => {
  if (!report) return null;

  const meta = getMetaRecord(report);
  const account = getAccountRecord(report);
  const transactions = getTransactionsFromReport(report);
  const currency = toStringValue(meta.currency, "USD");
  const period = isRecord(meta.period) ? meta.period : {};
  const periodText =
    report.periodFrom || report.periodTo
      ? `${formatReportDate(report.periodFrom)} to ${formatReportDate(report.periodTo)}`
      : period.from || period.to
        ? `${formatReportDate(toStringValue(period.from))} to ${formatReportDate(toStringValue(period.to))}`
        : "N/A";

  return {
    id: report.id,
    title: report.title || "Financial Analysis",
    type: tabKey,
    sourceLabel: report.id ? "Saved report" : "Latest AI extraction",
    summary: report.summary || toStringValue(meta.documentType, "Generated financial report"),
    documentType: toStringValue(meta.documentType, "N/A"),
    currency,
    periodText,
    generatedAt: formatDateTime(report.createdAt || toStringValue(meta.generatedAt)),
    metrics: buildMetricsForTab(report, tabKey, transactions, currency),
    accountDetails: [
      { label: "Account Holder", value: toStringValue(account.accountHolder, "N/A") },
      { label: "Bank", value: toStringValue(account.bankName, "N/A") },
      { label: "Account Number", value: toStringValue(account.accountNumber, "N/A") },
      { label: "Opening Balance", value: formatCurrencyValue(account.openingBalance, currency) },
      { label: "Closing Balance", value: formatCurrencyValue(account.closingBalance, currency) },
      { label: "Confidence", value: `${Math.round(toNumberValue(meta.confidence) * 100)}%` },
    ],
    breakdown: getBackendBreakdown(report, tabKey),
    transactions,
    vendors: getVendorsFromReport(report),
    sections: getSectionsFromReport(report, tabKey),
  };
};

export const mapReportToHistoryRow = (report: ReportItem): ReportHistoryRow => ({
  id: report.id,
  title: report.title || "Untitled report",
  type: normalizeReportType(report.type) || report.type,
  period:
    report.periodFrom || report.periodTo
      ? `${formatReportDate(report.periodFrom)} to ${formatReportDate(report.periodTo)}`
      : mapReportToAnalysisView(report)?.periodText || "N/A",
  generated: formatDateTime(report.createdAt),
  format: toStringValue((report as ReportItem & { format?: unknown }).format, "PDF"),
  summary: report.summary || "N/A",
});

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<ReportsResponse, ReportsQueryParams | void>({
      query: (params: ReportsQueryParams | void) => ({
        url: "/reports",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["reports"],
    }),
    getReportById: builder.query<ReportResponse, string>({
      query: (id) => ({
        url: `/reports/${id}`,
        method: "GET",
      }),
      providesTags: ["reports"],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useLazyGetReportsQuery,
  useLazyGetReportByIdQuery,
} = reportsApi;
