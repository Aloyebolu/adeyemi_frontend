"use client";

import { useEffect, useState, useCallback } from "react";
import { usePage } from "@/hooks/usePage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Trash2,
  Check,
  CheckCheck,
  Filter,
  RefreshCw,
  Archive,
  AlertCircle,
  BellRing,
  MessageSquare,
  FileText,
  Calendar,
  User,
  Settings,
  ChevronRight,
  MoreVertical,
  Eye,
  EyeOff,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDataFetcher } from "@/lib/dataFetcher";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "system" | "academic" | "announcement";
  time: string;
  timestamp: Date;
  read: boolean;
  archived: boolean;
  priority: "low" | "medium" | "high";
  source?: "system" | "admin" | "hod" | "lecturer";
  action?: {
    label: string;
    url?: string;
    onClick?: () => void;
  };
  metadata?: {
    userId?: string;
    department?: string;
    course?: string;
    semester?: string;
    actionRequired?: boolean;
  };
}

type NotificationTab = "all" | "unread" | "archived" | "priority";

export default function NotificationsPage() {
  const { setPage } = usePage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [priorityCount, setPriorityCount] = useState(0);
  const { fetchData } = useDataFetcher();

  useEffect(() => {
    setPage("Notifications");
    fetchNotifications();
  }, [setPage]);

  const fetchNotifications = async () => {
    setRefreshing(true);
    try {
      // Mock data - replace with actual API call


      // In production, use:
      const { data } = await fetchData("notifications", "GET");
      setNotifications(data);
      
      // Calculate counts
      const unread = data.filter(n => !n.read).length;
      const priority = data.filter(n => n.priority === "high" && !n.read).length;
      
      setUnreadCount(unread);
      setPriorityCount(priority);
      
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    filterNotifications();
  }, [notifications, activeTab, showArchived]);

  const filterNotifications = useCallback(() => {
    let filtered = [...notifications];

    switch (activeTab) {
      case "unread":
        filtered = filtered.filter(n => !n.read);
        break;
      case "archived":
        filtered = filtered.filter(n => n.archived);
        break;
      case "priority":
        filtered = filtered.filter(n => n.priority === "high");
        break;
    }

    if (!showArchived) {
      filtered = filtered.filter(n => !n.archived);
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeTab, showArchived]);

  const handleMarkRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleArchive = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, archived: true, read: true } : n))
    );
  };

  const handleUnarchive = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, archived: false } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDeleteAllArchived = () => {
    setNotifications(prev => prev.filter(n => !n.archived));
  };

  const getIcon = (type: string) => {
    const baseClass = "w-5 h-5";
    
    switch (type) {
      case "success":
        return <CheckCircle2 className={`${baseClass} text-green-500`} />;
      case "warning":
        return <AlertTriangle className={`${baseClass} text-amber-500`} />;
      case "error":
        return <XCircle className={`${baseClass} text-red-500`} />;
      case "academic":
        return <FileText className={`${baseClass} text-blue-500`} />;
      case "announcement":
        return <BellRing className={`${baseClass} text-purple-500`} />;
      case "system":
        return <Settings className={`${baseClass} text-gray-500`} />;
      default:
        return <Info className={`${baseClass} text-sky-500`} />;
    }
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "admin":
        return <User className="w-3 h-3" />;
      case "hod":
        return <User className="w-3 h-3" />;
      case "lecturer":
        return <User className="w-3 h-3" />;
      default:
        return <Settings className="w-3 h-3" />;
    }
  };

  const formatMessageWithLineBreaks = (message: string) => {
    return message.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Check for bullet points or numbered lists
      if (line.trim().startsWith('•') || line.trim().match(/^\d+\./)) {
        return (
          <div key={index} className="flex items-start gap-2 ml-4">
            <span className="text-muted-foreground mt-1">•</span>
            <span>{line.replace(/^[•\d\.\s]+/, '')}</span>
          </div>
        );
      }
      
      // Check for emoji headings
      if (line.match(/^[🎯📊🏆📍🕒💻📅👤⚠️🎓❌💳]/)) {
        return (
          <div key={index} className="flex items-center gap-2 mt-2 font-medium">
            <span>{line.match(/^[^\s]+/)?.[0]}</span>
            <span>{line.replace(/^[^\s]+\s*/, '')}</span>
          </div>
        );
      }
      
      return <p key={index} className="my-1">{line}</p>;
    });
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="rounded-lg border">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="w-5 h-5 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <Card className="rounded-xl border-dashed border-2">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Bell className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No notifications found
        </h3>
        <p className="text-muted-foreground mb-6">
          {activeTab === "unread" 
            ? "All caught up! You have no unread notifications." 
            : activeTab === "archived"
            ? "No archived notifications yet."
            : "You'll see important updates here."}
        </p>
        {activeTab === "unread" && (
          <Button variant="outline" onClick={() => setActiveTab("all")}>
            View All Notifications
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        {renderSkeleton()}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="hidden md:block" size={28} />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 rounded-full">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with important announcements and activities
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNotifications}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleMarkAllRead}>
                <CheckCheck size={16} className="mr-2" />
                Mark all as read
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowArchived(!showArchived)}>
                {showArchived ? (
                  <>
                    <EyeOff size={16} className="mr-2" />
                    Hide archived
                  </>
                ) : (
                  <>
                    <Eye size={16} className="mr-2" />
                    Show archived
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteAllArchived}>
                <Trash2 size={16} className="mr-2" />
                Clear archived
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download size={16} className="mr-2" />
                Export notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as NotificationTab)}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="relative">
                All
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs rounded-full">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="priority">
                Priority
                {priorityCount > 0 && (
                  <Badge variant="destructive" className="ml-2 text-xs rounded-full">
                    {priorityCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="archived">
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="show-archived"
                checked={showArchived}
                onCheckedChange={setShowArchived}
              />
              <Label htmlFor="show-archived" className="text-sm">
                Show archived
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <AnimatePresence mode="wait">
        {filteredNotifications.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderEmptyState()}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredNotifications.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`rounded-xl border transition-all hover:shadow-md ${
                    note.read 
                      ? "bg-surface border-border" 
                      : "bg-surfaceElevated border-border shadow-sm"
                  } ${note.archived ? "opacity-70" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${note.read ? 'bg-muted' : 'bg-primary/10'}`}>
                        {getIcon(note.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${note.read ? 'text-foreground/80' : 'text-foreground'}`}>
                              {note.title}
                            </h3>
                            {!note.read && (
                              <Badge variant="outline" className="text-xs rounded-full">
                                New
                              </Badge>
                            )}
                            {note.priority === "high" && !note.read && (
                              <Badge variant="destructive" className="text-xs rounded-full">
                                Priority
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {/* {formatDistanceToNow && formatDistanceToNow(note.timestamp, { addSuffix: true })} */}
                          </span>
                        </div>

                        {/* Message with proper line breaks */}
                        <div className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                          {formatMessageWithLineBreaks(note.message)}
                        </div>

                        {/* Metadata and Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {note.source && (
                              <div className="flex items-center gap-1">
                                {getSourceIcon(note.source)}
                                <span className="capitalize">{note.source}</span>
                              </div>
                            )}
                            {note.metadata?.department && (
                              <>
                                <span>•</span>
                                <span>{note.metadata.department}</span>
                              </>
                            )}
                            {note.metadata?.semester && (
                              <>
                                <span>•</span>
                                <span>{note.metadata.semester}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {note.action && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={note.action.onClick}
                              >
                                {note.action.label}
                                <ChevronRight size={12} className="ml-1" />
                              </Button>
                            )}
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreVertical size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!note.read ? (
                                  <DropdownMenuItem onClick={() => handleMarkRead(note.id)}>
                                    <Check size={14} className="mr-2" />
                                    Mark as read
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleMarkRead(note.id)}>
                                    <EyeOff size={14} className="mr-2" />
                                    Mark as unread
                                  </DropdownMenuItem>
                                )}
                                
                                {!note.archived ? (
                                  <DropdownMenuItem onClick={() => handleArchive(note.id)}>
                                    <Archive size={14} className="mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleUnarchive(note.id)}>
                                    <Archive size={14} className="mr-2" />
                                    Unarchive
                                  </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(note.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Footer */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{notifications.length}</div>
            <div>Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{unreadCount}</div>
            <div>Unread</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{priorityCount}</div>
            <div>Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {notifications.filter(n => n.archived).length}
            </div>
            <div>Archived</div>
          </div>
        </div>
      </div>
    </div>
  );
}