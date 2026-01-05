'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChat';
import AttendantInterface from '@/components/chat/AttendantInterface';
import ChatHeader from '@/components/chat/ChatHeader';
import { AlertCircle, Loader2 } from 'lucide-react';
import useUser from '@/hooks/useUser';

export default function AttendantPage() {
  const router = useRouter();
  // const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const {user} = useUser()
  
  const { socket, isConnected, connectionError } = useChat({ autoConnect: true });

  useEffect(() => {
    // Check if user is authorized to be attendant
    const checkAuthorization = () => {
      if (!user) {
        router.push('/chat');
        return;
      }
      if (!user.extra_roles?.includes('customer_service')) {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }

      setLoading(false);
    };

    checkAuthorization();
  }, [router]);

  const handleLeave = () => {
    router.push('/chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading attendant dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background">
        <ChatHeader 
          title="Support Agent Dashboard" 
          showBack 
          backUrl="/chat"
        />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-error mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Access Denied
            </h1>
            <p className="text-text-secondary mb-6">
              You are not authorized to access the support agent dashboard.
              Only users with the "customer_service" role can access this page.
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

  if (connectionError) {
    return (
      <div className="min-h-screen bg-background">
        <ChatHeader 
          title="Support Agent Dashboard" 
          showBack 
          backUrl="/chat"
        />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-error mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Connection Error
            </h1>
            <p className="text-text-secondary mb-4">{connectionError}</p>
            <p className="text-sm text-text-secondary mb-6">
              Please check your internet connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition mr-3"
            >
              Retry Connection
            </button>
            <button
              onClick={() => router.push('/chat')}
              className="bg-background2 text-text-primary px-6 py-3 rounded-lg hover:bg-background2/80 transition border border-border"
            >
              Return to Chat
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!isConnected || !socket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Connecting to Support System
          </h2>
          <p className="text-text-secondary">
            Please wait while we establish a connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AttendantInterface
      socket={socket}
      user={user}
      onLeave={handleLeave}
    />
  );
}