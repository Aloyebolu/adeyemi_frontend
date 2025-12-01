'use client';
import React, { createContext, useState } from "react";
import { Alert } from "@/components/ui/Alert";

interface Notification {
  id: string;
  message: string;
  variant: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface NotificationContextProps {
  addNotification: (n: Omit<Notification, "id">) => void & {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warn: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
}

export const NotificationContext = createContext<NotificationContextProps>({
  addNotification: Object.assign(() => {}, {
    success: () => {},
    error: () => {},
    warn: () => {},
    info: () => {},
  }),
});

export const NotificationContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const _add = (n: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setNotifications((p) => [...p, { ...n, id }]);
  };

  // Extend addNotification with named helpers
  const addNotification = Object.assign(_add, {
    success: (message: string, duration?: number) =>
      _add({ message, variant: "success", duration }),

    error: (message: string, duration?: number) =>
      _add({ message, variant: "error", duration }),

    warn: (message: string, duration?: number) =>
      _add({ message, variant: "warning", duration }),

    info: (message: string, duration?: number) =>
      _add({ message, variant: "info", duration }),
  });

  const removeNotification = (id: string) => {
    setNotifications((p) => p.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="pointer-events-auto"
          >
            <Alert
              variant={n.variant}
              message={n.message}
              duration={n.duration ?? 4000}
              onClose={() => removeNotification(n.id)}
            />
          </div>
        ))}
      </div>
      {children}
    </NotificationContext.Provider>
  );
};
