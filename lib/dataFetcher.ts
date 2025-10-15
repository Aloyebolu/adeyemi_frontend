"use client";

import useUser from "@/hooks/useUser";
import { error } from "console";

// import { useUser } from "@/hooks/useUser"; // 👈 adjust path if needed

export const USE_API = true;
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT?.replace(/\/$/, "");

/**
 * A universal data fetching hook supporting all HTTP methods, with Bearer auth and flexible response handling.
 */
export function useDataFetcher() {
  const { user } = useUser() || {};

  const fetchData = async <T>(
    path: 'faculty' | 'lecturer' | 'user' | 'semester' | 'settings',
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' = "GET",
    body?: any,
    options?: {
      returnFullResponse?: boolean; // If true, returns the entire API response instead of just .data
      params: string; // This works to attach something to the back of the url 
    }
  ): Promise<T> => {
    let finalUrl = `${API_ENDPOINT}/${path.replace(/^\//, "")}`;
    options?.params ? finalUrl = finalUrl+'/'+options.params : {}
    console.log("🌍 Fetching:", finalUrl);

    try {
      if (!USE_API) {
        // Mock data mode
        const mockUrl = `/data/${path}.json`;
        const response = await fetch(mockUrl);
        if (!response.ok) throw new Error(`Failed to fetch mock data: ${mockUrl}`);
        const mockData = await response.json();
        return (options?.returnFullResponse ? mockData : mockData.data) as T;
      }

      // Headers setup
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (user.access_token) headers.Authorization = `Bearer ${user.access_token}`;

      // Fetch config
      const fetchOptions: RequestInit = { method, headers };
      if (body && method !== "GET") fetchOptions.body = JSON.stringify(body);

      // Request
      const response = await fetch(finalUrl, fetchOptions);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const json = await response.json();

      // ✅ Return only the data field by default
      return (options?.returnFullResponse ? json : {data: json.data, error: json.error, status: json.status}) as T;
    } catch (error) {
      console.error(`❌ Error (${method}) ${path}:`, error);
      throw error;
    }
  };

  return { fetchData };
}
