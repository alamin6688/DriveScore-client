import { baseApi } from "@/redux/api/baseApi";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toStringValue = (value: unknown, fallback = "") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const toNumberValue = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[$,%\s,]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return "N/A";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (value?: string | null) => {
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

const getFileFormat = (document: DocumentUploadItem) => {
  if (document.fileFormat?.trim()) return document.fileFormat.trim().toUpperCase();

  const sourceName = document.originalName || document.filename;
  const hasExtension = sourceName.includes(".") && !sourceName.endsWith(".");
  const extension = hasExtension ? sourceName.split(".").pop()?.trim() : "";
  if (extension) return extension.toUpperCase();

  const mimeSubtype = document.mimeType?.split("/").pop()?.split(";")[0]?.trim();
  return mimeSubtype ? mimeSubtype.toUpperCase() : "N/A";
};

const getDocumentReportId = (document: DocumentUploadItem) => {
  const documentRecord = document as Record<string, unknown>;
  const directReportId = toStringValue(
    document.reportId ??
      document.generatedReportId ??
      document.financialReportId ??
      document.report_id
  );

  if (directReportId) return directReportId;

  for (const key of ["report", "generatedReport", "financialReport"]) {
    const value = documentRecord[key];
    if (!isRecord(value)) continue;

    const nestedReportId = toStringValue(value.id ?? value.reportId);
    if (nestedReportId) return nestedReportId;
  }

  for (const key of ["reports", "generatedReports"]) {
    const value = documentRecord[key];
    const firstReport = Array.isArray(value) ? value[0] : undefined;

    if (isRecord(firstReport)) {
      const nestedReportId = toStringValue(firstReport.id ?? firstReport.reportId);
      if (nestedReportId) return nestedReportId;
    }

    const firstReportId = toStringValue(firstReport);
    if (firstReportId) return firstReportId;
  }

  const reportIds = document.reportIds;
  const firstReportId = Array.isArray(reportIds) ? toStringValue(reportIds[0]) : "";
  return firstReportId || undefined;
};

export type UploadStatus =
  | "PENDING"
  | "UPLOADED"
  | "PROCESSING"
  | "OCR_COMPLETED"
  | "AI_COMPLETED"
  | "REPORT_READY"
  | "COMPLETED"
  | "FAILED";

export type DocumentProgressEvent = {
  uploadId: string;
  status: Extract<UploadStatus, "PROCESSING" | "COMPLETED" | "FAILED">;
  errorMessage?: string | null;
};

export type DocumentUploadItem = {
  id: string;
  userId?: string;
  companyId?: string | null;
  reportId?: string | null;
  generatedReportId?: string | null;
  financialReportId?: string | null;
  report_id?: string | null;
  report?: unknown;
  reports?: unknown;
  generatedReport?: unknown;
  generatedReports?: unknown;
  financialReport?: unknown;
  reportIds?: unknown;
  filename: string;
  originalName?: string | null;
  fileUrl?: string;
  storageKey?: string | null;
  mimeType?: string;
  fileFormat?: string;
  size?: number | null;
  status: UploadStatus;
  errorMessage?: string | null;
  extractedData?: unknown;
  normalizedData?: unknown;
  uploadedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DocumentItem = {
  id: string;
  filename: string;
  size: string;
  uploadDate: string;
  uploadedAtRaw?: string;
  status: "Extracted" | "Processing" | "Failed";
  extractedAmount?: number;
  category?: string;
  vendorName?: string;
  fileUrl?: string;
  fileFormat?: string;
  reportId?: string;
  errorMessage?: string | null;
};

export type DocumentUploaderProps = {
  onUploadSuccess: (document?: DocumentUploadItem) => void;
  onProcessingComplete?: (document?: DocumentUploadItem) => void;
  isPipelineBusy?: boolean;
};

export type DocumentListTableProps = {
  documents: DocumentItem[];
  onView: (doc: DocumentItem) => void;
  onLoadReport?: (doc: DocumentItem) => void;
  loadingReportDocumentId?: string | null;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export type ViewDetailsModalProps = {
  doc: DocumentItem;
  onClose: () => void;
};

export type DocumentProcessingModalProps = {
  isOpen: boolean;
};

export type PaginatedDocumentsData = {
  data?: DocumentUploadItem[];
  result?: DocumentUploadItem[];
  documents?: DocumentUploadItem[];
  uploads?: DocumentUploadItem[];
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

export type DocumentsResponse = {
  success: boolean;
  message: string;
  data: DocumentUploadItem[] | PaginatedDocumentsData;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    pages?: number;
  };
};

export type UploadDocumentResponse = {
  success: boolean;
  message: string;
  data: DocumentUploadItem;
};

export type DocumentsQueryParams = {
  page?: number;
  limit?: number;
  skip?: number;
};

export const unwrapDocumentList = (data: unknown): DocumentUploadItem[] => {
  if (Array.isArray(data)) return data as DocumentUploadItem[];
  if (!isRecord(data)) return [];

  for (const key of ["data", "result", "documents", "uploads"]) {
    const value = data[key];
    if (Array.isArray(value)) return value as DocumentUploadItem[];
  }

  return [];
};

export const mapUploadStatusToDocumentStatus = (status: UploadStatus): DocumentItem["status"] => {
  if (status === "FAILED") return "Failed";
  if (status === "COMPLETED" || status === "REPORT_READY" || status === "AI_COMPLETED" || status === "OCR_COMPLETED") {
    return "Extracted";
  }
  return "Processing";
};

export const mapDocumentToRow = (document: DocumentUploadItem): DocumentItem => {
  const normalizedData = isRecord(document.normalizedData) ? document.normalizedData : {};
  const extractedData = isRecord(document.extractedData) ? document.extractedData : {};

  return {
    id: document.id,
    filename: document.originalName || document.filename,
    size: formatFileSize(document.size),
    uploadDate: formatDate(document.createdAt),
    uploadedAtRaw: document.createdAt || document.uploadedAt,
    status: mapUploadStatusToDocumentStatus(document.status),
    extractedAmount: toNumberValue(
      normalizedData.amount ??
        normalizedData.total ??
        normalizedData.totalAmount ??
        extractedData.amount ??
        extractedData.total ??
        extractedData.totalAmount
    ),
    category: toStringValue(normalizedData.category ?? extractedData.category),
    vendorName: toStringValue(normalizedData.vendorName ?? normalizedData.vendor ?? extractedData.vendorName ?? extractedData.vendor),
    fileUrl: document.fileUrl,
    fileFormat: getFileFormat(document),
    reportId: getDocumentReportId(document),
    errorMessage: document.errorMessage,
  };
};

export const mapDocumentsToRows = (data: unknown): DocumentItem[] =>
  unwrapDocumentList(data).map(mapDocumentToRow);

export const getDocumentsPagination = (response?: DocumentsResponse) => {
  const data = isRecord(response?.data) ? response.data : {};
  const meta = response?.meta ?? (isRecord(data.meta) ? data.meta : isRecord(data.pagination) ? data.pagination : {});
  const metaPage = toNumberValue(meta.page);
  const metaLimit = toNumberValue(meta.limit);
  const metaTotal = toNumberValue(meta.total);
  const page = metaPage && metaPage > 0 ? metaPage : 1;
  const limit = metaLimit && metaLimit > 0 ? metaLimit : 0;
  const total = metaTotal ?? 0;
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

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<DocumentsResponse, DocumentsQueryParams | void>({
      query: (params: DocumentsQueryParams | void) => ({
        url: "/documents",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["user"],
    }),
    uploadDocument: builder.mutation<UploadDocumentResponse, FormData>({
      query: (body) => ({
        url: "/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useGetDocumentsQuery, useUploadDocumentMutation } = documentsApi;
