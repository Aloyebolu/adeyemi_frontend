"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { formatDistanceToNow } from "date-fns";

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchData } = useDataFetcher();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data: stats } = await fetchData("notifications/unread-count", "GET");
      setUnreadCount(stats.total || 0);
      
      const { data: recent } = await fetchData("notifications/top-unread?limit=5", "GET");
      setRecentNotifications(recent || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetchData(`notifications/${id}/read`, "PUT", { read: true });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetchData("notifications/bulk", "POST", {
        ids: recentNotifications.map(n => n._id),
        operation: "read"
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {recentNotifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              disabled={loading}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading...
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            <div className="p-2">
              {recentNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer",
                    notification.is_read ? "opacity-70" : ""
                  )}
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <div className={cn(
                    "p-2 rounded",
                    notification.is_read ? 'bg-muted' : 'bg-primary/10'
                  )}>
                    {notification.category === 'academic' ? (
                      <GraduationCap className="h-4 w-4" />
                    ) : notification.category === 'financial' ? (
                      <DollarSign className="h-4 w-4" />
                    ) : notification.category === 'emergency' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <Info className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      {!notification.is_read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="border-t p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-center"
            onClick={() => window.location.href = '/notifications'}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}