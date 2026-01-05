'use client';

import { useState, useEffect } from 'react';
import { ChatSession } from '@/types/chat';
import ChatSessionCard from './ChatSessionCard';
import ChatTransferModal from './ChatTransferModal';
import { 
  Search, Filter, Users, Clock, MessageSquare, 
  BarChart, Download, RefreshCw, Settings,
  UserPlus, Mail, Phone, Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { useDataFetcher } from '@/lib/dataFetcher';

interface AdminChatPanelProps {
  onSelectSession: (session: ChatSession) => void;
  activeSessionId?: string;
}

export default function AdminChatPanel({ onSelectSession, activeSessionId }: AdminChatPanelProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'waiting' | 'closed' | 'resolved'>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [attendants, setAttendants] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    waiting: 0,
    resolved: 0,
    closed: 0
  });

  const { get, post } = useDataFetcher();

  // Load data
  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load chats
      const chatsResponse = await get('chat/admin/active-chats' as any);
      if (chatsResponse.status === 'success') {
        const chatsData = chatsResponse.data?.chats || chatsResponse.data || [];
        setSessions(chatsData);
        
        // Calculate stats
        const statsData = {
          total: chatsData.length,
          active: chatsData.filter((s: ChatSession) => s.status === 'active').length,
          waiting: chatsData.filter((s: ChatSession) => s.status === 'waiting').length,
          resolved: chatsData.filter((s: ChatSession) => s.status === 'resolved').length,
          closed: chatsData.filter((s: ChatSession) => s.status === 'closed').length
        };
        setStats(statsData);
      }
      
      // Load attendants
      const attendantsResponse = await get('chat/admin/attendants' as any);
      if (attendantsResponse.status === 'success') {
        setAttendants(attendantsResponse.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions
  useEffect(() => {
    let result = sessions;
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(session => session.status === filter);
    }
    
    // Apply time filter
    const now = new Date();
    const timeFilters: Record<string, Date> = {
      today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    };
    
    if (timeFilter !== 'all' && timeFilters[timeFilter]) {
      const cutoffDate = timeFilters[timeFilter];
      result = result.filter(session => 
        new Date(session.createdAt) >= cutoffDate
      );
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
  }, [sessions, search, filter, timeFilter]);

  const handleTransfer = (session: ChatSession) => {
    setSelectedSession(session);
    setShowTransferModal(true);
  };

  const handleTransferConfirm = async (attendantId: string) => {
    if (!selectedSession) return;
    
    try {
      const response = await post('chat/admin/assign' as any, {
        session_id: selectedSession._id,
        attendant_id: attendantId
      });
      
      if (response.status === 'success') {
        setShowTransferModal(false);
        setSelectedSession(null);
        loadData(); // Refresh data
      }
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        stats,
        sessions: sessions.map(session => ({
          id: session._id,
          status: session.status,
          department: session.department,
          user: session.user_id || session.guest_info,
          createdAt: session.createdAt,
          lastMessage: session.last_message_at
        }))
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-admin-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-text-primary">Chat Administration</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-3 py-2 bg-background2 rounded-lg hover:bg-background2/80 transition"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Export</span>
            </button>
            
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="bg-background2 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
            <div className="text-xs text-text-secondary">Total</div>
          </div>
          <div className="bg-success/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-success">{stats.active}</div>
            <div className="text-xs text-text-secondary">Active</div>
          </div>
          <div className="bg-warning/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-warning">{stats.waiting}</div>
            <div className="text-xs text-text-secondary">Waiting</div>
          </div>
          <div className="bg-success/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-success">{stats.resolved}</div>
            <div className="text-xs text-text-secondary">Resolved</div>
          </div>
          <div className="bg-error/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-error">{stats.closed}</div>
            <div className="text-xs text-text-secondary">Closed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats by name, email, or department..."
              className="w-full pl-10 pr-4 py-2 bg-background2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status Filters */}
            <div className="flex gap-1">
              {['all', 'active', 'waiting', 'closed', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${
                    filter === status
                      ? 'bg-primary text-white'
                      : 'bg-background2 text-text-secondary hover:bg-background2/80'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Time Filters */}
            <div className="flex gap-1">
              {['today', 'week', 'month', 'all'].map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeFilter(time as any)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${
                    timeFilter === time
                      ? 'bg-info text-white'
                      : 'bg-background2 text-text-secondary hover:bg-background2/80'
                  }`}
                >
                  {time.charAt(0).toUpperCase() + time.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-text-secondary">Loading chats...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <MessageSquare className="h-12 w-12 text-text-secondary mb-3" />
            <h3 className="font-medium text-text-primary mb-1">No chats found</h3>
            <p className="text-sm text-text-secondary">
              {search || filter !== 'all' || timeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No active chats at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              <div key={session._id} className="relative">
                <ChatSessionCard
                  session={session}
                  isActive={session._id === activeSessionId}
                  onClick={() => onSelectSession(session)}
                />
                
                {/* Admin Actions */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {session.status === 'waiting' && attendants.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTransfer(session);
                      }}
                      className="p-1.5 bg-warning/10 text-warning rounded hover:bg-warning/20 transition"
                      title="Assign to attendant"
                    >
                      <UserPlus className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && selectedSession && (
        <ChatTransferModal
          session={selectedSession}
          attendants={attendants}
          onClose={() => {
            setShowTransferModal(false);
            setSelectedSession(null);
          }}
          onConfirm={handleTransferConfirm}
        />
      )}
    </div>
  );
}