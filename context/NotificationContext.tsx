'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { Alert } from '@/components/ui/Alert';

interface Notification {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const NotificationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      <div className="fixed top-0 right-4 space-y-2 z-50" style={{position: ''}}>
        {notifications.map((n) => (
          <Alert
            key={n.id}
            variant={n.variant}
            message={n.message}
            duration={5000}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
      {children}
    </NotificationContext.Provider>
  );
};
