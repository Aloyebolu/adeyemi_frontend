// components/dev-tools/DevToolsOverlay.tsx
"use client";

import { useState, useEffect } from "react";
import DevToolsMenu from "./DevToolsMenu";
import { isDevMode } from "@/lib/env";

export default function DevToolsOverlay() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Only show in dev mode
  useEffect(() => {
    if (!isDevMode()) return;
    
    // Small delay to ensure component is mounted
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isDevMode() || !isVisible) return null;

  return (
    <>
      {/* Overlay button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg transition-all hover:scale-110 hover:bg-red-600 active:scale-95"
        title="Dev Tools (Click to open)"
        aria-label="Open development tools"
      >
        DEV
      </button>

      {/* Menu modal */}
      <DevToolsMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}