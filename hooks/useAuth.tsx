"use client";
import { useState } from "react";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const request = async (path: string, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_ENDPOINT}/user/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Something went wrong");
      }
      console.log(result)

      return result;
    } catch (err: any) {
      setError(err.message || "Failed to connect");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: any) => request("signin", payload);
  const signup = async (payload: any) => request("signup", payload);

  return { login, signup, loading, error };
}
