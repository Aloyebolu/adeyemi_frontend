'use client';

import { ChatSession } from '@/types/chat';
import { MessageSquare, Clock, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatSessionCardProps {
  session: ChatSession;
  isActive: boolean;
  unreadCount?: number;
  onClick: () => void;
}

export default function ChatSessionCard({ 
  session, 
  isActive, 
  unreadCount = 0,
  onClick 
}: ChatSessionCardProps) {
  const getStatusIcon = () => {
    switch (session.status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'waiting':
        return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'closed':
        return <AlertCircle className="h-4 w-4 text-error" />;
      default:
        return <MessageSquare className="h-4 w-4 text-text-secondary" />;
    }
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'active':
        return 'border-l-success';
      case 'waiting':
        return 'border-l-warning';
      case 'resolved':
        return 'border-l-success';
      case 'closed':
        return 'border-l-error';
      default:
        return 'border-l-border';
    }
  };

  const getUserDisplay = () => {
    if (session.user_id) {
      return session.user_id.name || 'Registered User';
    }
    
    if (session.guest_info) {
      return session.guest_info.name || session.guest_info.email || 'Guest User';
    }
    
    return 'Unknown User';
  };

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(session.last_message_at), { 
        addSuffix: true 
      });
    } catch {
      return 'Just now';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border border-border rounded-lg hover:bg-background2 transition-all duration-200 ${getStatusColor()} border-l-4 ${
        isActive ? 'bg-background2 ring-2 ring-primary/20' : 'bg-surface'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-text-primary">
            {getUserDisplay()}
          </span>
        </div>
        
        {unreadCount > 0 && (
          <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <User className="h-3 w-3" />
          <span className="truncate">
            {session.guest_info?.email || 'No email provided'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <MessageSquare className="h-3 w-3" />
          <span>Department: {session.department}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Clock className="h-3 w-3" />
          <span>{getTimeAgo()}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${
          session.status === 'active' ? 'bg-success/10 text-success' :
          session.status === 'waiting' ? 'bg-warning/10 text-warning' :
          session.status === 'resolved' ? 'bg-success/10 text-success' :
          'bg-error/10 text-error'
        }`}>
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
        
        {session.status === 'waiting' && (
          <div className="flex items-center gap-1 text-xs text-warning">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Waiting</span>
          </div>
        )}
      </div>
    </button>
  );
}