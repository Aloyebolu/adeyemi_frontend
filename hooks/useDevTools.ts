// hooks/useDevTools.ts
"use client";

import { useState, useEffect } from "react";
import { DevAction } from "@/components/dev-tools/DevToolsMenu";

export function useDevTools() {
  const [customActions, setCustomActions] = useState<DevAction[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const saved = localStorage.getItem("dev_custom_actions");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse saved custom actions", error);
      return [];
    }
  });

  const loadCustomActions = () => {
    try {
      const saved = localStorage.getItem("dev_custom_actions");
      if (saved) {
        setCustomActions(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load custom actions", error);
    }
  };

  // Initial load is handled by the state initializer above to avoid calling setState synchronously in an effect.
  // Call reloadActions() (loadCustomActions) manually when you need to re-read saved actions at runtime.

  const addCustomAction = (action: Omit<DevAction, "id">) => {
    const newAction = {
      ...action,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedActions = [...customActions, newAction];
    setCustomActions(updatedActions);
    
    try {
      localStorage.setItem("dev_custom_actions", JSON.stringify(updatedActions));
    } catch (error) {
      console.error("Failed to save custom action", error);
    }
  };

  const removeCustomAction = (id: string) => {
    const updatedActions = customActions.filter(action => action.id !== id);
    setCustomActions(updatedActions);
    
    try {
      localStorage.setItem("dev_custom_actions", JSON.stringify(updatedActions));
    } catch (error) {
      console.error("Failed to remove custom action", error);
    }
  };

  const clearCustomActions = () => {
    setCustomActions([]);
    localStorage.removeItem("dev_custom_actions");
  };

  return {
    customActions,
    addCustomAction,
    removeCustomAction,
    clearCustomActions,
    reloadActions: loadCustomActions,
  };
}