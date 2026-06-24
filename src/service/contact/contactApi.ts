/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/api/endpoints/profileEndpoints.ts
import baseApi from "@/redux/api/baseApi";

const toStringValue = (value: unknown, fallback = "N/A") =>
  typeof value === "string" || typeof value === "number" ? String(value) : fallback;

const formatDate = (value: unknown) => {
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

const normalizeContactStatus = (value: unknown): AdminContactRequestStatus => {
  const status = toStringValue(value, "PENDING").toUpperCase();
  if (status === "REPLIED" || status === "RESOLVED") return "Replied";
  return "Pending";
};

export interface ContactData {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CreateContactRequestPayload = {
  name: string;
  email: string;
  message: string;
};

interface ContactResponse {
  success: boolean;
  message: string;
  data: ContactData;
  error: any;
  timestamp: string;
}

export interface ContactsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AllContactsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination?: ContactsPagination;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
  data: ContactData[];
}

export type AdminContactRequestStatus = "Pending" | "Replied";

export type AdminContactRequestItem = {
  id: string;
  userName: string;
  email: string;
  date: string;
  status: AdminContactRequestStatus;
  subject: string;
  message: string;
};

export type AdminContactRequestsProps = {
  requests: AdminContactRequestItem[];
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedRequest: AdminContactRequestItem | null;
  isReplying?: boolean;
  onViewRequest: (request: AdminContactRequestItem) => void;
  onCloseDetails: () => void;
  onSendFeedback: (id: string, feedback: string) => Promise<void>;
};

export type ContactRequestDetailsModalProps = {
  request: AdminContactRequestItem;
  onClose: () => void;
  isReplying?: boolean;
  onSendFeedback?: (id: string, feedback: string) => Promise<void>;
};

export type ContactRequestReplyPayload = {
  id: string;
  reply: string;
};

export const mapContactRequest = (request: ContactData): AdminContactRequestItem => ({
  id: toStringValue(request.id, ""),
  userName: toStringValue(request.name, "N/A"),
  email: toStringValue(request.email, "N/A"),
  date: formatDate(request.createdAt),
  status: normalizeContactStatus(request.status),
  subject: toStringValue(request.subject, "N/A"),
  message: toStringValue(request.message, "N/A"),
});

export const getContactsPagination = (response?: AllContactsResponse) => {
  const total = response?.pagination?.total ?? response?.meta?.total ?? response?.data?.length ?? 0;
  const page = response?.pagination?.page ?? response?.meta?.page ?? 1;
  const limit = response?.pagination?.limit ?? response?.meta?.limit ?? 10;
  const pages =
    response?.pagination?.totalPages ??
    response?.meta?.pages ??
    Math.max(1, Math.ceil(total / limit));

  return { total, page, limit, pages };
};

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all contacts
    getAllContacts: builder.query<
      AllContactsResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/admin/contact-requests",
        method: "GET",
        params,
      }),
      providesTags: ["contact"],
    }),
    getContactRequestById: builder.query<ContactResponse, string>({
      query: (id) => ({
        url: `/admin/contact-requests/${id}`,
        method: "GET",
      }),
      providesTags: ["contact"],
    }),
    replyContactRequest: builder.mutation<ContactResponse, ContactRequestReplyPayload>({
      query: ({ id, reply }) => ({
        url: `/admin/contact-requests/${id}/reply`,
        method: "PATCH",
        body: { reply },
      }),
      invalidatesTags: ["contact"],
    }),

    // Delete contact
    deleteContact: builder.mutation<any, string>({
      query: (id) => ({
        url: `/contact-us/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"],
    }),
    // Get profile data
    createContact: builder.mutation<ContactResponse, CreateContactRequestPayload>({
      query: (data) => ({
        url: "/contact-requests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useGetAllContactsQuery,
  useGetContactRequestByIdQuery,
  useReplyContactRequestMutation,
  useCreateContactMutation,
  useDeleteContactMutation,
} = contactApi;

export const { endpoints: profileApiEndpoints } = contactApi;

// Export types for use in components
export type { ContactResponse as ProfileResponse, ContactData as ProfileData };
