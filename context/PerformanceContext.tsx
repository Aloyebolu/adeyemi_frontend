"use client";

import { createContext, useContext, useEffect, useState } from "react";

const PerformanceContext = createContext<any>(null);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("performance_profile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  return (
    <PerformanceContext.Provider value={{ profile, setProfile }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export const usePerformance = () => useContext(PerformanceContext);
