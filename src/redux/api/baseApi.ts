/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setAccessToken } from "../features/auth"; // 🔸 `logout` no longer needed → removed import

const getRequestUrl = (args: string | FetchArgs) =>
  typeof args === "string" ? args : args.url;

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // If it's a refresh token request, we skip setting the Authorization header
    // so we don't send an expired token to the refresh endpoint.
    if (headers.has("x-skip-auth")) {
      headers.delete("x-skip-auth");
      return headers;
    }
    const token = (getState() as { auth: { accessToken: string | null } }).auth?.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const requestUrl = getRequestUrl(args);
  const shouldSkipReauth =
    requestUrl.includes("/auth/logout") ||
    requestUrl.includes("/auth/refresh-token");

  if (result.error && result.error.status === 401 && !shouldSkipReauth) {
    // Attempt to refresh the access token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        headers: {
          "x-skip-auth": "true",
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).accessToken;
      api.dispatch(setAccessToken(newAccessToken));
      // Retry the original request with new token
      result = await baseQuery(args, api, extraOptions);
    }
    // ❌ Auto-logout REMOVED:
    // else {
    //   api.dispatch(logout());
    // }
    // → Now, if refresh fails, the 401 error is returned to the component
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["auth", "roofing", "window", "profile", "contact", "properties", "dashboard", "user", "payments", "subscription", "subscriptionPlans", "favorites", "reports"],
  endpoints: () => ({}),
});

export default baseApi;
