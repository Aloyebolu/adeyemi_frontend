"use client"
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// 🧠 Define the context type
interface PageContextType {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  component: React.ReactNode;
  setComponent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}


// ⚙️ Create the context with proper type
const PageContext = createContext<PageContextType | undefined>(undefined);

// 🟢 Provider Component
interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [page, setPage] = useState("home");
  const [component, setComponent] = useState<React.ReactNode>(null);
  const pathname = usePathname();

  // Clear component ONLY when route changes
  useEffect(() => {
    setComponent(null);
    setPage(null)
  }, [pathname]);

  return (
    <PageContext.Provider value={{ page, setPage, component, setComponent }}>
      {children}
    </PageContext.Provider>
  );
};



// 🧩 Custom Hook
export const usePage = (): PageContextType => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context; 
};
