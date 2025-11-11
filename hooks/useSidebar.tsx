'use client'
// hooks/useSidebar.ts
import { useState, useEffect } from "react";

export function useSidebar() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_open");
    if (saved) setOpen(saved === "true");
  }, []);

  const toggleSidebar = () => {
    const newState = !open;
    setOpen(newState);
    localStorage.setItem("sidebar_open", String(newState));
  };

  return { open, toggleSidebar };
}
