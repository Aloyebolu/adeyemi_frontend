'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import ChatHeader from '@/components/chat/ChatHeader';
import GuestForm from '@/components/chat/GuestForm';
import ChatInterface from '@/components/chat/ChatInterface';
import { ChatSession } from '@/types/chat';
import { useDataFetcher } from '@/lib/dataFetcher';

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'user' | 'guest' | 'attendant' | null>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startingChat, setStartingChat] = useState(false);
  
  const { socket, isConnected, emit, on, connectionError } = useChat({ autoConnect: true });
  const { get } = useDataFetcher();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Determine mode based on user role
        if (parsedUser.extra_roles?.includes('customer_service')) {
          setMode('attendant');
        } else {
          setMode('user');
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
        setMode('guest');
      }
    } else {
      setMode('guest');
    }
    
    setLoading(false);
  }, []);

  // Listen for new chat waiting notifications (for attendants)
  useEffect(() => {
    if (mode !== 'attendant' || !socket) return;

    const handleNewChatWaiting = (data: any) => {
      console.log('New chat waiting:', data);
      // Could show a notification here
    };

    const unsubscribe = on('new_chat_waiting', handleNewChatWaiting);
    
    return () => {
      unsubscribe?.();
    };
  }, [mode, socket, on]);

  const handleStartAsUser = async () => {
    if (!socket || !isConnected || startingChat) return;

    setStartingChat(true);
    setError(null);

    try {
      const response = await emit('start_chat', {
        department: 'general',
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        browser: navigator.userAgent,
        os: navigator.platform,
        device: /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent) 
          ? 'mobile' 
          : 'desktop',
      });

      if (response.success && response.session_id) {
        setChatSession({
          _id: response.session_id,
          session_id: response.session_id,
          status: response.status || 'waiting',
          department: 'general',
          last_message_at: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        setError(response.error || 'Failed to start chat');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start chat session');
      console.error('Start chat error:', err);
    } finally {
      setStartingChat(false);
    }
  };

  const handleStartAsGuest = async (guestData: any) => {
    if (!socket || !isConnected || startingChat) return;

    setStartingChat(true);
    setError(null);

    try {
      const response = await emit('start_chat', {
        email: guestData.email,
        name: guestData.name,
        phone: guestData.phone,
        department: 'general',
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        browser: navigator.userAgent,
        os: navigator.platform,
        device: /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent) 
          ? 'mobile' 
          : 'desktop',
      });

      if (response.success && response.session_id) {
        setChatSession({
          _id: response.session_id,
          session_id: response.session_id,
          status: response.status || 'waiting',
          department: 'general',
          last_message_at: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        setError(response.error || 'Failed to start chat');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start chat session');
      console.error('Start chat error:', err);
    } finally {
      setStartingChat(false);
    }
  };

  const handleJoinAsAttendant = () => {
    router.push('/chat/attendant');
  };

  const handleCloseChat = () => {
    setChatSession(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ChatHeader 
        title="University Live Chat Support"
        showBack={!!chatSession}
        backUrl={chatSession ? '/chat' : undefined}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        {connectionError && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-error">{connectionError}</p>
          </div>
        )}

        {!isConnected && !connectionError && (
          <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-warning">Connecting to chat server...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-error">{error}</p>
          </div>
        )}

        {chatSession ? (
          <ChatInterface 
            socket={socket!}
            sessionId={chatSession._id}
            user={user}
            onClose={handleCloseChat}
          />
        ) : (
          <>
            {/* Welcome Card */}
            <div className="bg-surface rounded-lg shadow-medium p-6 mb-8">
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Welcome to Live Chat Support
              </h1>
              <p className="text-text-secondary">
                Get instant help from our university support team
              </p>
              
              {!isConnected && (
                <div className="mt-4 p-3 bg-background2 rounded-lg">
                  <p className="text-sm text-text-secondary">
                    Please wait while we connect to the chat server...
                  </p>
                </div>
              )}
            </div>

            {/* Mode Selection - Updated layout based on user type */}
            <div className={`grid gap-6 ${mode === 'guest' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {/* Guest User - Only show when no user is logged in */}
              {mode === 'guest' && (
                <div className="bg-surface rounded-lg shadow-medium p-6 border border-border">
                  <h3 className="font-semibold text-lg mb-3 text-text-primary">Start a Chat</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Please provide your email to start a chat with our support team.
                  </p>
                  <GuestForm 
                    onSubmit={handleStartAsGuest} 
                    disabled={!isConnected || startingChat}
                  />
                </div>
              )}

              {/* Registered User - Only show when user is logged in and not an attendant */}
              {mode === 'user' && (
                <div className="bg-surface rounded-lg shadow-medium p-6 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 text-text-primary">Start Chat as Registered User</h3>
                      <p className="text-sm text-text-secondary mb-4">
                        You are logged in as <strong className="text-primary">{user?.name}</strong>
                      </p>
                      <button
                        onClick={handleStartAsUser}
                        disabled={!isConnected || startingChat}
                        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {startingChat ? 'Starting Chat...' : 'Start Chat Now'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Support Agent - Only show when user has customer_service role */}
              {mode === 'attendant' && (
                <>
                  {/* Support Agent Dashboard Card */}
                  <div className="bg-surface rounded-lg shadow-medium p-6 border border-border">
                    <h3 className="font-semibold text-lg mb-3 text-text-primary">Support Agent</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Access the support agent dashboard to help other users.
                    </p>
                    <button
                      onClick={handleJoinAsAttendant}
                      disabled={!isConnected}
                      className="w-full bg-info text-white py-3 rounded-lg hover:bg-info/90 transition font-medium disabled:opacity-50"
                    >
                      Go to Agent Dashboard
                    </button>
                  </div>

                  {/* Regular User Chat Option */}
                  <div className="bg-surface rounded-lg shadow-medium p-6 border border-border">
                    <h3 className="font-semibold text-lg mb-3 text-text-primary">Start Chat as User</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      You are logged in as <strong className="text-primary">{user?.name}</strong>
                    </p>
                    <p className="text-sm text-text-secondary mb-4">
                      Even though you're a support agent, you can also start a chat as a regular user.
                    </p>
                    <button
                      onClick={handleStartAsUser}
                      disabled={!isConnected || startingChat}
                      className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {startingChat ? 'Starting Chat...' : 'Start Chat as User'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Additional Info for Guests */}
            {mode === 'guest' && (
              <div className="mt-8 bg-background2 rounded-lg p-6 border border-border">
                <h3 className="font-semibold text-lg mb-3 text-text-primary">Why Register?</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Faster support with your account information</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Chat history saved to your account</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>Priority in the support queue</span>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}