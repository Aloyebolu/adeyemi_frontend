"use client";
import { useState } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";

export default function useUnreadNotifications() {
  const { fetchData } = useDataFetcher();
  const [count, setCount] = useState<number | null>(null);

  const getUnreadCount = async () => {
    try {
      const { data } = await fetchData("notifications/unread-count", "GET");
      setCount(data); // store count in state
      return data;
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      return 0;
    }
  };

  return { count, getUnreadCount };
}
