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
  addNotification: (n: Omit<Notification, "id">) => void;
}

export const NotificationContext = createContext<NotificationContextProps>({
  addNotification: () => {},
});

export const NotificationContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (n: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setNotifications((p) => [...p, { ...n, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((p) => p.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      <div className="fixed top-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
        {notifications.map((n, idx) => (
          <div
            key={n.id}
            className="pointer-events-auto"
            style={{
              transition: "transform 400ms ease, opacity 300ms ease",
              // translateY automatically handled by flex + gap
            }}
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
