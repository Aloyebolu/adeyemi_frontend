"use client";

import useUser from "@/hooks/useUser";

export const USE_API = true;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT?.replace(/\/$/, "");
export type AppPath =
  | "faculty"
  | "department"
  | "lecturers"
  | "course"
  | "course/assignments"
  | "course/assign"
  | "course/lecturer"
  | "course/remove-lecturer"
  | "course/update-assignment"
  | "students"
  | "signin/admin"
  | "auth/student-login"
  | "settings"
  | "semester"
  | "semester/active"
  | "semester/start"
  | "semester/end"
  | "semester/toggle-registration"
  | "semester/toggle-results"
  | "semester/registration"
  | "semester/results"
  | "semester/result-publication"
  | "auth/admin-login"
  | "notifications/send"
  | "notifications/templates"
  | "notifications"
  | "admin"
  | "admin/overview"
  | "auth/lecturer-login";

export function useDataFetcher() {
  const { user } = useUser() || {};

  const fetchData = async (
    path: AppPath,
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" = "GET",
    body?: any,
    options?: {
      returnFullResponse?: boolean;
      params?: string;
    }
  ): Promise<any> => {
let finalUrl = `${API_ENDPOINT}/${path.replace(/^\/|\/$/g, "")}`;
    if (options?.params) finalUrl += `/${options.params}`;

    console.log("🌍 Fetching:", finalUrl);

    try {
      // 🧪 Mock mode
      if (!USE_API) {
        const mockUrl = `/data/${path}.json`;
        const response = await fetch(mockUrl);
        if (!response.ok) throw new Error(`Mock fetch failed: ${mockUrl}`);
        const mockData = await response.json();
        return {
          data: mockData.data,
          status: "success",
          message: "Mock data fetched successfully",
        };
      }

      // 🧾 Headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (user?.access_token) headers.Authorization = `Bearer ${user.access_token}`;

      const fetchOptions: RequestInit = { method, headers };
      if (body && method !== "GET") fetchOptions.body = JSON.stringify(body);

      const response = await fetch(finalUrl, fetchOptions);

      // If caller asked for full response, return it (after checking for network errors)
      if (options?.returnFullResponse) {
        if (!response.ok) {
          // try to read message from body
          let errMsg = `Request failed (${response.status})`;
          try {
            const txt = await response.text();
            try {
              const parsed = JSON.parse(txt);
              errMsg = parsed?.message || parsed?.error || txt || errMsg;
            } catch {
              errMsg = txt || errMsg;
            }
          } catch {}
          throw new Error(errMsg);
        }
        return response;
      }

      // 🧩 Safely parse JSON
      let json: any = null;
      try {
        json = await response.json();
      } catch {
        json = null;
      }

      // ⚠️ Handle all error cases cleanly
      if (!response.ok || json?.status === "error" || json?.success === false) {
        const msg = json?.message || json?.error || `Request failed (${response.status})`;
        throw new Error(msg);
      }

      // ✅ Normal successful response
      return {
        data: json?.data ?? json,
        status: json?.status ?? "success",
        message: json?.message ?? "Request successful",
      };
    } catch (err: any) {
      console.error(`❌ Fetch error (${method}) ${path}:`, err);

      // 🧠 Throw a clean message (not raw JSON)
      throw new Error(
        err?.message?.includes("Failed to fetch")
          ? "Network error — please check your connection"
          : err?.message || "Unexpected error occurred"
      );
    }
  };

  return { fetchData };
}
