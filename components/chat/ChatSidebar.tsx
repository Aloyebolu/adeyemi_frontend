'use client';

import { useState, useEffect } from 'react';
import { ChatSession } from '@/types/chat';
import ChatSessionCard from './ChatSessionCard';
import { Search, Filter, Users, MessageSquare, Clock, Loader2 } from 'lucide-react';
import { useDataFetcher } from '@/lib/dataFetcher';

interface ChatSidebarProps {
  activeSessionId?: string;
  onSelectSession: (session: ChatSession) => void;
  onNewChat?: () => void;
  showAttendantView?: boolean;
}

export default function ChatSidebar({
  activeSessionId,
  onSelectSession,
  onNewChat,
  showAttendantView = false
}: ChatSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'waiting' | 'closed'>('all');
  const [stats, setStats] = useState({
    active: 0,
    waiting: 0,
    total: 0
  });

  const { get } = useDataFetcher();

  // Load chat sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const endpoint = showAttendantView 
          ? 'chat/my-chats' 
          : 'chat/admin/active-chats';
        
        const response = await get(endpoint as any);
        
          const sessionsData = showAttendantView 
            ? response.data 
            : response.data?.chats || response.data;
            
          setSessions(sessionsData || []);
          setFilteredSessions(sessionsData || []);
          
          // Calculate stats
          if (sessionsData) {
            const activeCount = sessionsData.filter((s: ChatSession) => 
              s.status === 'active').length;
            const waitingCount = sessionsData.filter((s: ChatSession) => 
              s.status === 'waiting').length;
            
            setStats({
              active: activeCount,
              waiting: waitingCount,
              total: sessionsData.length
            });
          }
      } catch (err) {
        console.error('Failed to load chat sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadSessions, 30000);
    return () => clearInterval(interval);
  }, [showAttendantView]);

  // Filter sessions based on search and filter
  useEffect(() => {
    let result = sessions;
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(session => session.status === filter);
    }
    
    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(session => {
        const userName = session.user_id?.name?.toLowerCase() || '';
        const guestName = session.guest_info?.name?.toLowerCase() || '';
        const guestEmail = session.guest_info?.email?.toLowerCase() || '';
        const department = session.department?.toLowerCase() || '';
        
        return userName.includes(searchLower) ||
               guestName.includes(searchLower) ||
               guestEmail.includes(searchLower) ||
               department.includes(searchLower);
      });
    }
    
    // Sort by last message (newest first)
    result.sort((a, b) => 
      new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    );
    
    setFilteredSessions(result);
  }, [sessions, search, filter]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const endpoint = showAttendantView 
        ? 'chat/my-chats' 
        : 'chat/admin/active-chats';
      
      const response = await get(endpoint as any);
      
        const sessionsData = showAttendantView 
          ? response.data 
          : response.data?.chats || response.data;
          
        setSessions(sessionsData || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-text-primary">
            {showAttendantView ? 'My Chats' : 'All Chats'}
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="text-sm text-primary hover:text-primary-hover transition"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 bg-background2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-background2 rounded-lg p-2 text-center">
            <div className="text-xs text-text-secondary">Active</div>
            <div className="font-semibold text-success">{stats.active}</div>
          </div>
          <div className="bg-background2 rounded-lg p-2 text-center">
            <div className="text-xs text-text-secondary">Waiting</div>
            <div className="font-semibold text-warning">{stats.waiting}</div>
          </div>
          <div className="bg-background2 rounded-lg p-2 text-center">
            <div className="text-xs text-text-secondary">Total</div>
            <div className="font-semibold text-text-primary">{stats.total}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-1">
          {['all', 'active', 'waiting', 'closed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`flex-1 text-xs px-2 py-1.5 rounded transition ${
                filter === filterType
                  ? 'bg-primary text-white'
                  : 'bg-background2 text-text-secondary hover:bg-background2/80'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-text-secondary">Loading chats...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <MessageSquare className="h-8 w-8 text-text-secondary mb-2" />
            <p className="text-sm text-text-secondary">
              {search || filter !== 'all' 
                ? 'No matching chats found' 
                : 'No active chats'}
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <ChatSessionCard
              key={session._id}
              session={session}
              isActive={session._id === activeSessionId}
              unreadCount={0} // TODO: Implement unread count
              onClick={() => onSelectSession(session)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {showAttendantView ? (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Users className="h-4 w-4" />
            <span>Attendant Mode</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock className="h-4 w-4" />
            <span>Auto-refresh every 30s</span>
          </div>
        )}
      </div>
    </div>
  );
}