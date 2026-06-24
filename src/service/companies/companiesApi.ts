import { baseApi } from "@/redux/api/baseApi";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export type CompanyProfileItem = {
  id: string;
  userId?: string;
  name: string;
  industry?: string | null;
  businessAddress?: string | null;
  logoUrl?: string | null;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CompanyFormValues = {
  name: string;
  industry?: string;
  businessAddress?: string;
  isDefault?: boolean;
};

export type CompanySectionProps = {
  companies: CompanyProfileItem[];
  isLoading: boolean;
  isUpdating: boolean;
  onCreate: (values: CompanyFormValues, logo?: File | null) => Promise<void>;
  onUpdate: (id: string, values: CompanyFormValues, logo?: File | null) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSwitch: (id: string) => Promise<void>;
};

export type CompaniesResponse = {
  success: boolean;
  message: string;
  data: CompanyProfileItem[] | {
    data?: CompanyProfileItem[];
    result?: CompanyProfileItem[];
    companies?: CompanyProfileItem[];
  };
};

export type CompanyResponse = {
  success: boolean;
  message: string;
  data: CompanyProfileItem;
};

export type CompanyMutationPayload = {
  data: CompanyFormValues;
  logo?: File | null;
};

export type UpdateCompanyMutationPayload = CompanyMutationPayload & {
  id: string;
};

const buildCompanyFormData = ({ data, logo }: CompanyMutationPayload) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (logo) {
    formData.append("logo", logo);
  }
  return formData;
};

export const unwrapCompanies = (data: unknown): CompanyProfileItem[] => {
  if (Array.isArray(data)) return data as CompanyProfileItem[];
  if (!isRecord(data)) return [];

  for (const key of ["data", "result", "companies"]) {
    const value = data[key];
    if (Array.isArray(value)) return value as CompanyProfileItem[];
  }

  return [];
};

export const companiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<CompaniesResponse, void>({
      query: () => ({
        url: "/companies",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    createCompany: builder.mutation<CompanyResponse, CompanyMutationPayload>({
      query: (payload) => ({
        url: "/companies",
        method: "POST",
        body: buildCompanyFormData(payload),
      }),
      invalidatesTags: ["user"],
    }),
    updateCompany: builder.mutation<CompanyResponse, UpdateCompanyMutationPayload>({
      query: ({ id, ...payload }) => ({
        url: `/companies/${id}`,
        method: "PATCH",
        body: buildCompanyFormData(payload),
      }),
      invalidatesTags: ["user"],
    }),
    deleteCompany: builder.mutation<CompanyResponse, string>({
      query: (id) => ({
        url: `/companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    switchCompany: builder.mutation<CompanyResponse, string>({
      query: (id) => ({
        url: `/companies/${id}/switch`,
        method: "PATCH",
        body: {},
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useSwitchCompanyMutation,
} = companiesApi;
