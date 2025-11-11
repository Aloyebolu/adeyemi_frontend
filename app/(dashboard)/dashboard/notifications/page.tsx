"use client";

import { useEffect, useState } from "react";
import { usePage } from "@/hooks/usePage";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Tokens used: bg-surface, text-primary, text-muted, border, surfaceElevated, success, warning, error, info

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  time: string;
  action?: string;
  read?: boolean;
}

export default function NotificationsPage() {
  const { setPage } = usePage();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setPage("Notifications");
    // Mock data — will be replaced with API later
    setNotifications([
      {
        id: "1",
        title: "Result Uploaded",
        message: "Your CSC 201 result was successfully uploaded.",
        type: "success",
        time: "2 hours ago",
        action: "View Result",
      },
      {
        id: "2",
        title: "Approval Pending",
        message: "The HOD has not yet approved CSC 203 results.",
        type: "warning",
        time: "Yesterday",
      },
      {
        id: "3",
        title: "Result Rejected",
        message: "CSC 202 result was returned for correction.",
        type: "error",
        time: "3 days ago",
        action: "Fix Now",
      },
      {
        id: "4",
        title: "System Update",
        message: "New grading policy applied for next semester.",
        type: "info",
        time: "1 week ago",
      },
    ]);
  }, [setPage]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto ">


      {notifications.length === 0 ? (
        <Card className="rounded-xl shadow-md bg-surface text-center p-10 text-muted">
          <p>No notifications at the moment 🎉</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card
                  className={`rounded-xl shadow-md border border-border bg-surfaceElevated transition-all ${
                    note.read ? "opacity-70" : "opacity-100"
                  }`}
                >
                  <CardContent className="p-4 flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {getIcon(note.type)}
                      <div>
                        <h2 className="font-semibold text-primary">
                          {note.title}
                        </h2>
                        <p className="text-muted text-sm">{note.message}</p>
                        <p className="text-xs text-muted mt-1">{note.time}</p>
                        {note.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs"
                            onClick={() => alert(`Action: ${note.action}`)}
                          >
                            {note.action}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!note.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkRead(note.id)}
                          className="text-xs"
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(note.id)}
                      >
                        <Trash2 className="w-4 h-4 text-muted hover:text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
