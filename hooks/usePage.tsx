import React, { createContext, useContext, useState, ReactNode } from "react";

// 🧠 Define the context type
interface PageContextType {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

// ⚙️ Create the context with a proper type
const PageContext = createContext<PageContextType | undefined>(undefined);

// 🟢 Provider Component
interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const [page, setPage] = useState<string>("home"); // default page

  return (
    <PageContext.Provider value={{ page, setPage }}>
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
  return context; // gives { page, setPage }
};
