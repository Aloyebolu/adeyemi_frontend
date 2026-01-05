'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatHeader from '@/components/chat/ChatHeader';
import AdminChatPanel from '@/components/chat/AdminChatPanel';
import ChatAnalytics from '@/components/chat/ChatAnalytics';
import ChatInterface from '@/components/chat/ChatInterface';
import { useChat } from '@/hooks/useChat';
import { ChatSession } from '@/types/chat';
import { 
  BarChart3, MessageSquare, Settings, 
  Users, AlertCircle, Loader2 
} from 'lucide-react';
import useUser from '@/hooks/useUser';

export default function AdminChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'analytics'>('chats');
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const {user}= useUser()
  
  const { socket, isConnected, connectionError } = useChat({ autoConnect: true });

  useEffect(() => {
    // Check if user is authorized to access admin panel
    const checkAuthorization = () => {
      if (!user) {
        router.push('/chat');
        return;
      }

      // Only admins can access admin panel
      if (user.role !== 'admin') {
        setAuthorized(false);
        // alert(sue)
      } else {
        setAuthorized(true);
      }

      setLoading(false);
    };

    checkAuthorization();
  }, [router]);

  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session);
  };

  const handleCloseChat = () => {
    setSelectedSession(null);
  };

  const handleTransferChat = (sessionId: string) => {
    console.log('Transfer chat:', sessionId);
    // In a real app, you would open a transfer modal
  };

  const handleResolveChat = (sessionId: string) => {
    console.log('Resolve chat:', sessionId);
    // In a real app, you would mark chat as resolved
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background">
        <ChatHeader 
          title="Chat Administration" 
          showBack 
          backUrl="/chat"
        />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-error mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Admin Access Required
            </h1>
            <p className="text-text-secondary mb-6">
              You must be an administrator to access this page.
            </p>
            <button
              onClick={() => router.push('/chat')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition"
            >
              Return to Chat
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ChatHeader 
        title="Chat Administration" 
        showBack 
        backUrl="/chat"
      />

      {/* Connection Status */}
      {connectionError && (
        <div className="px-4 py-2 bg-error/10 border-b border-error/20">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-error">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{connectionError}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition ${
              activeTab === 'chats'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Chat Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition ${
              activeTab === 'analytics'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>

        {/* Content */}
        {activeTab === 'chats' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Chat List */}
            <div className="lg:col-span-1">
              <AdminChatPanel
                onSelectSession={handleSelectSession}
                activeSessionId={selectedSession?._id}
              />
            </div>

            {/* Right Panel - Chat Interface or Empty State */}
            <div className="lg:col-span-2">
              {selectedSession ? (
                <ChatInterface
                  socket={socket!}
                  sessionId={selectedSession._id}
                  user={user}
                  onClose={handleCloseChat}
                  showNotes
                  showUserInfo
                  onTransfer={handleTransferChat}
                  onResolve={handleResolveChat}
                  isAttendant={true}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-surface rounded-lg border border-border">
                  <div className="text-center max-w-md">
                    <Settings className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      Admin Chat Management
                    </h3>
                    <p className="text-text-secondary mb-6">
                      Select a chat from the left panel to view details, 
                      transfer chats between attendants, or manage chat sessions.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-background2 rounded-lg">
                        <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">
                          Monitor all active and waiting chats
                        </p>
                      </div>
                      
                      <div className="p-4 bg-background2 rounded-lg">
                        <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">
                          Transfer chats between support agents
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-surface rounded-lg border border-border">
            <ChatAnalytics />
          </div>
        )}
      </div>
    </div>
  );
}