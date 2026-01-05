'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Clock, 
  MessageSquare, CheckCircle, AlertCircle,
  Download, Calendar
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useDataFetcher } from '@/lib/dataFetcher';

interface AnalyticsData {
  totalChats: number;
  activeChats: number;
  waitingChats: number;
  resolvedChats: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  topAttendants: Array<{
    name: string;
    chatsHandled: number;
    averageRating: number;
  }>;
  chatsByHour: Array<{
    hour: string;
    count: number;
  }>;
  chatsByDay: Array<{
    day: string;
    count: number;
  }>;
}

export default function ChatAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('week');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  
  const { get } = useDataFetcher();

  useEffect(() => {
    loadAnalytics();
  }, [dateRange, customStartDate, customEndDate]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would have an analytics endpoint
      // For now, we'll simulate with mock data
      const mockAnalytics: AnalyticsData = {
        totalChats: 156,
        activeChats: 12,
        waitingChats: 5,
        resolvedChats: 139,
        averageResponseTime: 2.5, // minutes
        averageResolutionTime: 15.7, // minutes
        topAttendants: [
          { name: 'John Doe', chatsHandled: 45, averageRating: 4.8 },
          { name: 'Jane Smith', chatsHandled: 38, averageRating: 4.9 },
          { name: 'Bob Johnson', chatsHandled: 32, averageRating: 4.7 },
          { name: 'Alice Brown', chatsHandled: 28, averageRating: 4.6 },
          { name: 'Charlie Wilson', chatsHandled: 25, averageRating: 4.5 },
        ],
        chatsByHour: Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          count: Math.floor(Math.random() * 20) + 5
        })),
        chatsByDay: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
          day,
          count: Math.floor(Math.random() * 30) + 10
        }))
      };
      
      setAnalytics(mockAnalytics);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading || !analytics) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-primary animate-pulse mx-auto mb-3" />
          <p className="text-text-secondary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">Chat Analytics</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-1.5 bg-background2 border border-border rounded-lg text-sm"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2 py-1.5 bg-background2 border border-border rounded-lg text-sm"
              />
              <span>to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2 py-1.5 bg-background2 border border-border rounded-lg text-sm"
              />
            </div>
          )}
          
          <button
            onClick={loadAnalytics}
            className="p-2 hover:bg-background2 rounded-lg transition"
            title="Refresh"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-text-primary">{analytics.totalChats}</div>
          <div className="text-sm text-text-secondary">Total Chats</div>
        </div>
        
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-text-primary">{analytics.resolvedChats}</div>
          <div className="text-sm text-text-secondary">Resolved</div>
        </div>
        
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {formatTime(analytics.averageResponseTime)}
          </div>
          <div className="text-sm text-text-secondary">Avg Response Time</div>
        </div>
        
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-info/10 rounded-lg">
              <Users className="h-5 w-5 text-info" />
            </div>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {formatTime(analytics.averageResolutionTime)}
          </div>
          <div className="text-sm text-text-secondary">Avg Resolution Time</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Attendants */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h3 className="font-semibold text-text-primary mb-4">Top Attendants</h3>
          <div className="space-y-3">
            {analytics.topAttendants.map((attendant, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">{attendant.name}</div>
                    <div className="text-xs text-text-secondary">
                      {attendant.chatsHandled} chats • Rating: {attendant.averageRating}/5
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-primary">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chats by Day */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h3 className="font-semibold text-text-primary mb-4">Chats by Day</h3>
          <div className="h-64 flex items-end gap-2">
            {analytics.chatsByDay.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary-hover"
                  style={{ 
                    height: `${(item.count / Math.max(...analytics.chatsByDay.map(d => d.count))) * 80}%` 
                  }}
                  title={`${item.day}: ${item.count} chats`}
                />
                <div className="text-xs text-text-secondary mt-2">{item.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-surface rounded-lg p-4 border border-border lg:col-span-2">
          <h3 className="font-semibold text-text-primary mb-4">Current Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-3xl font-bold text-success">{analytics.activeChats}</div>
              <div className="text-sm text-text-secondary">Active Now</div>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <div className="text-3xl font-bold text-warning">{analytics.waitingChats}</div>
              <div className="text-sm text-text-secondary">Waiting</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-3xl font-bold text-success">
                {Math.round((analytics.resolvedChats / analytics.totalChats) * 100)}%
              </div>
              <div className="text-sm text-text-secondary">Resolution Rate</div>
            </div>
            <div className="text-center p-4 bg-info/10 rounded-lg">
              <div className="text-3xl font-bold text-info">
                {analytics.topAttendants.length}
              </div>
              <div className="text-sm text-text-secondary">Active Attendants</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}