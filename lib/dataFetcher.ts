"use client";

import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
const api = "http://localhost:5000/afued/result/portal"
// Configurable API mode
const USE_API = process.env.NEXT_PUBLIC_USE_API !== "false";
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT?.replace(/\/$/, "");
// const API_ENDPOINT = api?.replace(/\/$/, "");

const API_TIMEOUT = 300000; // 30 seconds

// Add more specific paths and type safety
export type AppPath =
  | "faculty" | "department" | "lecturers" | "lecturers/hods" | "lecturers/deans"
  | "lecturer/profile" | "lecturer/update-profile" | "lecturer/change-password"
  | "departments" | "department/create" | "department/update" | "department/delete"
  | "department/stats" | "faculty/departments" | "faculty/create" | "faculty/update"
  | "faculty/delete" | "faculty/my-faculty" | "courses" | "course" | "course/assignments"
  | "course/assign" | "course/lecturer" | "course/remove-lecturer" | "course/update-assignment"
  | "course/borrowed"
  | "students" | "signin/admin" | "auth/student-login" | "settings" | "semester"
  | "semester/active" | "semester/start" | "semester/end" | "semester/toggle-registration"
  | "semester/toggle-results" | "semester/registration" | "semester/results"
  | "semester/result-publication" | "semester/can-rollback" | "semester/rollback" | "semester/level-settings" | "auth/admin-login" | "notifications/send"
  | "notifications/templates" | "notifications" | "notifications/unread-count"
  | "notifications/top-unread" | "admin" | "admin/overview" | "auth/lecturer-login"
  | "announcements" |
  "computation" | "computation/start" | "computation/levels" | "computation/semesters"
  | "computation/status" | "computation/cancel" | "results" | "results/upload"
  | "results/student" | "results/course" | "results/approve" | "results/reject"
  | "results/publish" | "results/rollback" | "users" | "user/create" | "user/update"
  | "user/delete" | "user/roles" | "profile" | "profile/update" | "profile/change-password"
  | "dashboard/stats" | "dashboard/faculty-stats" | "dashboard/department-stats"
  | "reports/department-performance" | "reports/faculty-performance"
  | "reports/student-performance" | "reports/course-performance";

export interface FetchOptions {
  returnFullResponse?: boolean;
  params?: string | Record<string, string | number>;
  query?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: 'force-cache' | 'no-store' | 'reload';
}

export interface ApiResponse<T = any> {
  data: T;
  status: "success" | "error";
  message: string;
  pagination?: any;
  text?: BlobPart
}

// Cache interface for simple request caching
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useDataFetcher() {
  const router = useRouter();
  const { user, clearUser } = useUser() || {};
  const abortControllers = useRef(new Map());


  const buildUrl = (path: AppPath, options?: FetchOptions): string => {
    let finalUrl = `${API_ENDPOINT}/${path.replace(/^\/|\/$/g, "")}`;

    // Handle params
    if (options?.params) {
      if (typeof options.params === 'string') {
        finalUrl += `/${options.params}`;
      } else {
        Object.entries(options.params).forEach(([key, value]) => {
          finalUrl = finalUrl.replace(`:${key}`, encodeURIComponent(value));
        });
      }
    }

    // Handle query parameters
    if (options?.query) {
      const searchParams = new URLSearchParams();
      Object.entries(options.query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) finalUrl += `?${queryString}`;
    }

    return finalUrl;
  };

  const getCacheKey = (url: string, method: string, body?: any): string => {
    return `${method}:${url}:${body ? JSON.stringify(body) : ''}`;
  };

  const fetchData = useCallback(async <T = any>(
    path: AppPath,
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" = "GET",
    body?: any,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> => {
    const finalUrl = buildUrl(path, options);
    const cacheKey = getCacheKey(finalUrl, method, body);
    try {

      console.log("🌍 Fetching:", finalUrl);

      // Clean up old abort controllers
      abortControllers.current.forEach((controller, key) => {
        if (controller.signal.aborted) {
          abortControllers.current.delete(key);
        }
      });

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllers.current.set(cacheKey, abortController);

      // Check cache for GET requests
      if (method === 'GET' && !options.returnFullResponse && options.cache == "force-cache") {
        const cached = requestCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          console.log("📦 Using cached response for:", path);
          return cached.data;
        }
      }
      // Mock mode
      if (!USE_API) {
        const mockUrl = `/data/${path}.json`;
        const response = await fetch(mockUrl);
        if (!response.ok) throw new Error(`Mock fetch failed: ${mockUrl}`);
        const mockData = await response.json();
        const result = {
          data: mockData.data,
          status: "success" as const,
          message: "Mock data fetched successfully",
        };

        // Cache the mock response
        requestCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });

        return result;
      }

      // Headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (user?.access_token) {
        headers.Authorization = `Bearer ${user.access_token}`;
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: abortController.signal,
        cache: options.cache,
      };

      if (body && method !== "GET") {
        fetchOptions.body = JSON.stringify(body);
      }

      // Add timeout
      const timeout = options.timeout || API_TIMEOUT;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => {
          abortController.abort();
          reject(new Error(`Request timeout after ${timeout}ms`));
        }, timeout)
      );

      const fetchPromise = fetch(finalUrl, fetchOptions);
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // Full response mode
      if (options?.returnFullResponse) {
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `Request failed (${response.status})`;

          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson?.message || errorJson?.error || errorText || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }

          throw new Error(errorMessage);
        }
        return response as any;
      }

      // Parse JSON
      let json: any = null;
      const responseText = await response.text();

      try {
        json = responseText ? JSON.parse(responseText) : null;
      } catch {
        json = null;
      }

      // Handle token expiration and authentication errors
      if (response.status === 401) {
        const tokenExpired =
          json?.error === "TokenExpiredError" ||
          json?.message?.toLowerCase()?.includes("expired") ||
          json?.message?.toLowerCase()?.includes("invalid token");

        if (tokenExpired) {
          console.warn("⚠️ Token expired, redirecting user...");
          clearUser?.();

          // Redirect based on role
          const redirectPaths = {
            admin: "/admin-login",
            lecturer: "/lecturer-login",
            hod: "/lecturer-login",
            student: "/login"
          };

          router.push(redirectPaths[user?.role as keyof typeof redirectPaths] || "/login");
          throw new Error("Session expired. Please log in again.");
        }
      }

      // Handle specific HTTP status codes
      if (!response.ok) {
        const errorMessages: Record<number, string> = {
          400: json?.message || "Bad request - please check your input",
          403: "You don't have permission to access this resource",
          404: json?.message || "The requested resource was not found",
          409: json?.message || "Conflict - resource already exists",
          422: json?.message || "Validation error - please check your input",
          429: "Too many requests - please try again later",
          500: "Server error - please try again later",
          502: "Bad gateway - service temporarily unavailable",
          503: "Service unavailable - please try again later",
        };

        const errorMessage = errorMessages[response.status] ||
          json?.message ||
          json?.error ||
          `Request failed (${response.status})`;

        throw new Error(errorMessage);
      }

      // Handle API-level errors (non-HTTP errors but business logic errors)
      if (json?.status === "error" || json?.success === false) {
        throw new Error(json?.message || json?.error || "Request failed");
      }

      // Success response
      const result: ApiResponse<T> = {
        text: json?.text ?? json,
        data: json?.data ?? json,
        status: json?.status ?? "success",
        message: json?.message ?? "Request successful",
        pagination: json?.pagination,
      };

      // Cache successful GET requests
      if (method === 'GET') {
        requestCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }

      return result;

    } catch (err: any) {
      console.error(`❌ Fetch error (${method}) ${path}:`, err);

      // Don't log aborted requests as errors
      if (err.name === 'AbortError') {
        console.log('Request was aborted');
        throw err;
      }

      // Enhanced error messages
      const errorMessages: Record<string, string> = {
        'Failed to fetch': 'Network error - please check your internet connection',
        'Network request failed': 'Network error - please check your internet connection',
        'NetworkError': 'Network error - please check your internet connection',
      };

      throw new Error(
        errorMessages[err.message] ||
        err?.message ||
        "Unexpected error occurred"
      );
    } finally {
      // Clean up abort controller
      abortControllers.current.delete(cacheKey);
      //       // Debug log with stack trace
      // console.group(`🚀 API Call: ${method} ${path}`);
      // console.trace('Call stack:'); // This shows where the call came from
      // console.groupEnd();
    }


  }, [user, router, clearUser]);

  // Utility methods for common operations
  const get = useCallback(<T = any>(
    path: AppPath,
    options?: FetchOptions
  ) => fetchData<T>(path, "GET", undefined, options), [fetchData]);

  const post = useCallback(<T = any>(
    path: AppPath,
    body?: any,
    options?: FetchOptions
  ) => fetchData<T>(path, "POST", body, options), [fetchData]);

  const put = useCallback(<T = any>(
    path: AppPath,
    body?: any,
    options?: FetchOptions
  ) => fetchData<T>(path, "PUT", body, options), [fetchData]);

  const patch = useCallback(<T = any>(
    path: AppPath,
    body?: any,
    options?: FetchOptions
  ) => fetchData<T>(path, "PATCH", body, options), [fetchData]);

  const del = useCallback(<T = any>(
    path: AppPath,
    options?: FetchOptions
  ) => fetchData<T>(path, "DELETE", undefined, options), [fetchData]);

  // Cancel ongoing request
  const cancelRequest = useCallback((path: AppPath, method: string = "GET", body?: any) => {
    const url = buildUrl(path);
    const cacheKey = getCacheKey(url, method, body);
    const controller = abortControllers.current.get(cacheKey);

    if (controller && !controller.signal.aborted) {
      controller.abort();
      console.log('Request cancelled:', cacheKey);
    }
  }, []);

  // Clear cache for specific path or all
  const clearCache = useCallback((path?: AppPath) => {
    if (path) {
      const url = buildUrl(path);
      for (const [key] of requestCache) {
        if (key.includes(url)) {
          requestCache.delete(key);
        }
      }
    } else {
      requestCache.clear();
    }
  }, []);

  return {
    fetchData,
    get,
    getData: get,
    post,
    postData: post,
    put,
    putData: put,
    patch,
    patchData: patch,
    delete: del,
    deleteData: del,
    cancelRequest,
    clearCache
  };
}