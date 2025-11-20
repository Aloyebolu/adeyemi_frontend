"use client";

import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export const USE_API = true;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT?.replace(/\/$/, "");

export type AppPath =
  | "faculty"
  | "department"
  | "lecturers"
  | "lecturers/hods"
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
  | "notifications/unread-count"
  | "notifications/top-unread"
  | "admin"
  | "admin/overview"
  | "auth/lecturer-login"
  | "announcements"
  ;

export function useDataFetcher() {
  const router = useRouter();
  const { user, clearUser } = useUser() || {};

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
      // Mock mode
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

      // Headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (user?.access_token)
        headers.Authorization = `Bearer ${user.access_token}`;

      const fetchOptions: RequestInit = { method, headers };
      if (body && method !== "GET") fetchOptions.body = JSON.stringify(body);

      const response = await fetch(finalUrl, fetchOptions);

      // Full response mode
      if (options?.returnFullResponse) {
        if (!response.ok) {
          let errMsg = `Request failed (${response.status})`;
          try {
            const txt = await response.text();
            const parsed = JSON.parse(txt);
            errMsg = parsed?.message || parsed?.error || txt || errMsg;
          } catch { }
          throw new Error(errMsg);
        }
        return response;
      }

      // Parse JSON
      let json: any = null;
      try {
        json = await response.json();
      } catch {
        json = null;
      }

      // 🧠 Token Expiry or Invalid
      const tokenExpired =
        response.status === 401 ||
        json?.error === "TokenExpiredError" ||
        json?.message?.toLowerCase()?.includes("expired") ||
        json?.message?.toLowerCase()?.includes("invalid token");

      const error404 = 
       response.status === 404
      if (tokenExpired) {
        console.warn("⚠️ Token expired, redirecting user...");

        switch (user?.role) {
          case "admin":
            router.push("/admin-login");
            break;
          case "lecturer":
          case "hod":
            router.push("/lecturer-login");
            break;
          case "student":
            router.push("/login");
            break;
          default:
            router.push("/login");
        }

        clearUser?.();
        throw new Error("Session expired. Please log in again.");
      }

      // ⚠️ Other error handling
      if (!response.ok || json?.status === "error" || json?.success === false) {
        const msg =
          json?.message ||
          json?.error ||
          `Request failed (${response.status})`;
        throw new Error(msg);
      }

      // ✅ Success
      console.log(json.data)
      return {
        data: json?.data ?? json,
        status: json?.status ?? "success",
        message: json?.message ?? "Request successful",
        pagination: json?.pagination ?? json
      };
    } catch (err: any) {
      console.error(`❌ Fetch error (${method}) ${path}:`, err);

      throw new Error(
        err?.message?.includes("Failed to fetch")
          ? "Network error — please check your connection"
          : err?.message || "Unexpected error occurred"
      );
    }
  };

  return { fetchData };
}
