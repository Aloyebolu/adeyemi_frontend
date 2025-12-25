"use client";

import { usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// 🧠 Context type
interface PageContextType {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  component: React.ReactNode;
  setComponent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

// 🟢 Provider
interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [page, setPage] = useState<string>("Home");
  const [component, setComponent] = useState<React.ReactNode>(null);
  const pathname = usePathname();

  // 🧹 Clear component on route change
  useEffect(() => {
    setComponent(null);
    setPage("Home");
  }, [pathname]);

  // 🌍 Sync page name to browser title
  useEffect(() => {
    if (page) {
      document.title = `${page} | AFUED`;
    }
  }, [page]);

  return (
    <PageContext.Provider value={{ page, setPage, component, setComponent }}>
      {children}
    </PageContext.Provider>
  );
};

// 🧩 Hook
export const usePage = (): PageContextType => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
};
