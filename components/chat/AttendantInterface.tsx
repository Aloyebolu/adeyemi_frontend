'use client';

import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { ChatSession } from '@/types/chat';
import ChatSidebar from './ChatSidebar';
import ChatInterface from './ChatInterface';
import { Users, MessageSquare, Clock, LogOut, Loader2, Bell } from 'lucide-react';
import { useDataFetcher } from '@/lib/dataFetcher';
import QuickReplies from './QuickReplies';

interface AttendantInterfaceProps {
    socket: Socket;
    user: any;
    onLeave: () => void;
}

export default function AttendantInterface({ socket, user, onLeave }: AttendantInterfaceProps) {
    const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
    const [joining, setJoining] = useState(true);
    const [availability, setAvailability] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notification, setNotification] = useState<{
        message: string;
        type: 'info' | 'warning' | 'error';
    } | null>(null);

    const { post } = useDataFetcher();

    // Join as attendant
    useEffect(() => {
        const joinAsAttendant = async () => {
            try {
                setJoining(true);

                // CORRECTED: Pass callback as the second argument
                socket.emit('join_as_attendant', (response: any) => {
                    if (response?.success) {
                        console.log('Joined as attendant:', response);

                        // Set availability to true
                        setAvailability(true);

                        // Show welcome notification
                        setNotification({
                            message: 'You are now online as a support agent',
                            type: 'info'
                        });
                    } else {
                        setNotification({
                            message: response?.error || 'Failed to join as attendant',
                            type: 'error'
                        });
                    }
                    setJoining(false);
                });
                
            } catch (err) {
                console.error('Join attendant error:', err);
                setNotification({
                    message: 'Failed to join as attendant',
                    type: 'error'
                });
                setJoining(false);
            }
        };

        joinAsAttendant();
    }, [socket]);

    // Listen for new chat notifications
    useEffect(() => {
        if (!socket) return;

        const handleNewChatWaiting = (data: any) => {
            setUnreadCount(prev => prev + 1);

            // Show notification
            setNotification({
                message: `New chat waiting! ${data.waiting_count || 0} chats in queue`,
                type: 'warning'
            });

            // Auto-clear notification after 5 seconds
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        };

        socket.on('new_chat_waiting', handleNewChatWaiting);

        return () => {
            socket.off('new_chat_waiting', handleNewChatWaiting);
        };
    }, [socket]);

    const handleSelectSession = (session: ChatSession) => {
        setActiveSession(session);
        // Clear unread count for this session
        // TODO: Implement proper unread tracking
    };

    const handleCloseChat = () => {
        setActiveSession(null);
    };

    const handleToggleAvailability = async () => {
        try {
            const newAvailability = !availability;

            const response = await post('chat/availability' as any, {
                is_available: newAvailability
            });

            if (response.status === 'success') {
                setAvailability(newAvailability);

                // Also update via socket if needed
                if (newAvailability) {
                    // CORRECTED: Pass callback function
                    socket.emit('join_as_attendant', (joinResponse: any) => {
                        if (joinResponse?.success) {
                            console.log('Rejoined as attendant');
                        }
                    });
                } else {
                    // You might need to create a 'leave_attendant' event on the server
                    socket.emit('leave_attendant', {}, (response: any) => {
                        console.log('Left attendant mode:', response);
                    });
                }

                setNotification({
                    message: `You are now ${newAvailability ? 'online' : 'offline'}`,
                    type: 'info'
                });
            }
        } catch (err) {
            console.error('Toggle availability error:', err);
            setNotification({
                message: 'Failed to update availability',
                type: 'error'
            });
        }
    };

    const handleLeaveAttendant = async () => {
        try {
            // Set availability to false
            await post('chat/availability' as any, {
                is_available: false
            });

            // Leave via socket - you might need to create this event
            socket.emit('leave_attendant', {}, (response: any) => {
                console.log('Left attendant:', response);
                onLeave();
            });
            
        } catch (err) {
            console.error('Leave attendant error:', err);
            onLeave(); // Still leave the page
        }
    };

    // Send message function (if you need it elsewhere)
    const handleSendMessage = useCallback(async (sessionId: string, content: string, attachments?: any[]) => {
        return new Promise((resolve, reject) => {
            socket.emit('send_message', {
                session_id: sessionId,
                content,
                attachments
            }, (response: any) => {
                if (response?.success) {
                    resolve(response.message);
                } else {
                    reject(new Error(response?.error || 'Failed to send message'));
                }
            });
        });
    }, [socket]);

    if (joining) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-text-primary mb-2">
                        Joining as Support Agent
                    </h2>
                    <p className="text-text-secondary">
                        Please wait while we connect you to the support system...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="bg-surface border-b border-border shadow-sm">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-6 w-6 text-primary" />
                                <h1 className="text-xl font-bold text-text-primary">
                                    Support Agent Dashboard
                                </h1>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${availability ? 'bg-success animate-pulse' : 'bg-error'
                                    }`} />
                                <span className="text-sm text-text-secondary">
                                    {availability ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            {unreadCount > 0 && (
                                <div className="relative">
                                    <Bell className="h-5 w-5 text-warning" />
                                    <span className="absolute -top-1 -right-1 bg-warning text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                </div>
                            )}

                            {/* Availability Toggle */}
                            <button
                                onClick={handleToggleAvailability}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${availability
                                    ? 'bg-success/10 text-success hover:bg-success/20'
                                    : 'bg-error/10 text-error hover:bg-error/20'
                                    }`}
                            >
                                {availability ? 'Go Offline' : 'Go Online'}
                            </button>

                            {/* Leave Button */}
                            <button
                                onClick={handleLeaveAttendant}
                                className="flex items-center gap-2 px-3 py-1.5 bg-error/10 text-error rounded-lg hover:bg-error/20 transition text-sm font-medium"
                            >
                                <LogOut className="h-4 w-4" />
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Notification Banner */}
            {notification && (
                <div className={`px-4 py-2 ${notification.type === 'info' ? 'bg-info/10 text-info' :
                    notification.type === 'warning' ? 'bg-warning/10 text-warning' :
                        'bg-error/10 text-error'
                    }`}>
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <p className="text-sm">{notification.message}</p>
                        <button
                            onClick={() => setNotification(null)}
                            className="text-sm hover:opacity-70"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 border-r border-border">
                    <ChatSidebar
                        activeSessionId={activeSession?._id}
                        onSelectSession={handleSelectSession}
                        showAttendantView
                    />
                </div>

                {/* Chat Interface */}
                <div className="flex-1">
                    {activeSession ? (
                        <div className="h-full flex">
                            <div className="flex-1">
                                <ChatInterface
                                    socket={socket}
                                    sessionId={activeSession._id}
                                    user={user}
                                    onClose={handleCloseChat}
                                    onSendMessage={handleSendMessage} // Pass the send message function
                                />
                            </div>

                            {/* Quick Replies Sidebar */}
                            <div className="w-64 border-l border-border hidden lg:block">
                                <QuickReplies
                                    onSelect={(text) => {
                                        if (activeSession) {
                                            handleSendMessage(activeSession._id, text)
                                                .catch(err => {
                                                    setNotification({
                                                        message: `Failed to send message: ${err.message}`,
                                                        type: 'error'
                                                    });
                                                });
                                        }
                                    }}
                                    disabled={!activeSession}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8">
                            <div className="text-center max-w-md">
                                <MessageSquare className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-text-primary mb-2">
                                    No Chat Selected
                                </h3>
                                <p className="text-text-secondary mb-6">
                                    Select a chat from the sidebar to start helping a user.
                                    You'll be able to see all active and waiting chats here.
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-surface p-4 rounded-lg border border-border">
                                        <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                                        <p className="text-sm text-text-secondary">
                                            Quick responses help reduce wait times
                                        </p>
                                    </div>

                                    <div className="bg-surface p-4 rounded-lg border border-border">
                                        <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                                        <p className="text-sm text-text-secondary">
                                            Be professional and helpful in all interactions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}