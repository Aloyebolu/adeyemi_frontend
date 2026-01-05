// [file name]: ChatInterface.tsx
// [file content begin]
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import MessageBubble from './MessageBubble';
import FileUploader from './FileUploader';
import ChatNotes from './ChatNotes';
import { Message, ChatSession } from '@/types/chat';
import {
    Send, X, Paperclip, Loader2, AlertCircle,
    Users, Download, Archive, MessageSquare,
    Phone, Mail, Calendar, Tag, Volume2, VolumeX,
    User, UserCog, Shield, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { useDataFetcher } from '@/lib/dataFetcher';

interface ChatInterfaceProps {
    socket: Socket;
    sessionId: string;
    user: any;
    onClose: () => void;
    showNotes?: boolean;
    showUserInfo?: boolean;
    onTransfer?: (sessionId: string) => void;
    onResolve?: (sessionId: string) => void;
    isAttendant?: boolean;
    onSendMessage?: (sessionId: string, content: string, attachments?: any[]) => Promise<any>;
}

// Sound utilities
class SoundManager {
    private static instance: SoundManager;
    private messageSound: HTMLAudioElement | null = null;
    private notificationSound: HTMLAudioElement | null = null;
    private errorSound: HTMLAudioElement | null = null;
    private isEnabled = true;
    
    private constructor() {
        this.initializeSounds();
    }
    
    static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }
    
    private initializeSounds() {
        try {
            // Create audio elements
            this.messageSound = new Audio('/sounds/message.mp3');
            this.notificationSound = new Audio('/sounds/notification.mp3');
            this.errorSound = new Audio('/sounds/error.mp3');
            
            // Preload sounds
            [this.messageSound, this.notificationSound, this.errorSound].forEach(sound => {
                if (sound) {
                    sound.preload = 'auto';
                    sound.load();
                }
            });
        } catch (error) {
            console.warn('Failed to initialize sounds:', error);
        }
    }
    
    playMessageSound() {
        this.playSound(this.messageSound, '/sounds/message.mp3');
    }
    
    playNotificationSound() {
        this.playSound(this.notificationSound, '/sounds/notification.mp3');
    }
    
    playErrorSound() {
        this.playSound(this.errorSound, '/sounds/error.mp3');
    }
    
    private async playSound(sound: HTMLAudioElement | null, fallbackPath: string) {
        if (!this.isEnabled) return;
        
        try {
            if (sound) {
                sound.currentTime = 0;
                await sound.play();
            } else {
                // Try to create and play fallback
                const fallbackSound = new Audio(fallbackPath);
                fallbackSound.volume = 0.3;
                await fallbackSound.play();
                setTimeout(() => {
                    fallbackSound.pause();
                    fallbackSound.remove();
                }, 1000);
            }
        } catch (error) {
            console.warn('Failed to play sound:', error);
            // Don't throw error, just log it
        }
    }
    
    toggleEnabled() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }
    
    get isSoundEnabled() {
        return this.isEnabled;
    }
}

export default function ChatInterface({
    socket,
    sessionId,
    user,
    onClose,
    showNotes = false,
    showUserInfo = false,
    onTransfer,
    onResolve,
    isAttendant = false,
    onSendMessage
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [otherTyping, setOtherTyping] = useState(false);
    const [otherTypingName, setOtherTypingName] = useState('');
    const [attendant, setAttendant] = useState<any>(null);
    const [sessionInfo, setSessionInfo] = useState<ChatSession | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const soundManager = useRef(SoundManager.getInstance());
    
    const { get, post } = useDataFetcher();

    // Load chat session and messages
    useEffect(() => {
        const loadChatData = async () => {
            try {
                setLoading(true);
                setConnectionStatus('connecting');

                // Load messages
                const { data } = await get('chat/history/:session_id' as any, {
                    params: { session_id: sessionId }
                });

                setMessages(data || []);

                // // Load session info
                // const sessionResponse = await get('chat/session/:session_id' as any, {
                //     params: { session_id: sessionId }
                // });
                
                // if (sessionResponse.data) {
                //     setSessionInfo(sessionResponse.data);
                //     if (sessionResponse.data.assigned_to) {
                //         setAttendant(sessionResponse.data.assigned_to);
                //     }
                // }

                setConnectionStatus('connected');
            } catch (err: any) {
                console.error('Failed to load chat data:', err);
                setError('Failed to load chat data');
                setConnectionStatus('disconnected');
                soundManager.current.playErrorSound();
            } finally {
                setLoading(false);
                setTimeout(() => scrollToBottom(), 100);
            }
        };

        loadChatData();
    }, [sessionId]);

    // Setup socket listeners
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: any) => {
            if (data.message && data.message.session_id === sessionId) {
                setMessages(prev => [...prev, data.message]);
                
                // Play sound for new messages (not own)
                const isOwnMessage = data.message.sender_id === user?._id || 
                                   (isAttendant && data.message.sender_type === 'attendant');
                
                if (!isOwnMessage && !data.isOwn) {
                    soundManager.current.playMessageSound();
                }
                
                if (data.message.sender_type === 'attendant' && data.sender) {
                    setAttendant(data.sender);
                }
                
                // Mark as read if we're the recipient
                if (!isOwnMessage && socket) {
                    setTimeout(() => {
                        socket.emit('mark_read', {
                            session_id: sessionId,
                            message_ids: [data.message._id]
                        });
                    }, 1000);
                }
                
                scrollToBottom();
            }
        };

        const handleUserTyping = (data: any) => {
            if (data.session_id === sessionId && data.user_id !== user?._id) {
                setOtherTyping(data.is_typing);
                setOtherTypingName(data.user_name || 'Someone');
            }
        };

        const handleChatClosed = (data: any) => {
            if (data.session_id === sessionId) {
                soundManager.current.playNotificationSound();
                alert('Chat session has been closed');
                onClose();
            }
        };

        const handleMessagesRead = (data: any) => {
            if (data.session_id === sessionId) {
                setMessages(prev => prev.map(msg => {
                    if (data.message_ids?.includes(msg._id)) {
                        return {
                            ...msg,
                            read_by: [...(msg.read_by || []), {
                                user_id: data.user_id,
                                read_at: new Date()
                            }]
                        };
                    }
                    return msg;
                }));
            }
        };

        const handleNewAssignment = (data: any) => {
            if (data.session_id === sessionId && data.attendant) {
                setAttendant(data.attendant);
                soundManager.current.playNotificationSound();
            }
        };

        const handleSocketConnect = () => {
            setConnectionStatus('connected');
        };

        const handleSocketDisconnect = () => {
            setConnectionStatus('disconnected');
        };

        // Join session room
        socket.emit('join_session', { session_id: sessionId });

        // Listen to events
        socket.on('connect', handleSocketConnect);
        socket.on('disconnect', handleSocketDisconnect);
        socket.on('new_message', handleNewMessage);
        socket.on('user_typing', handleUserTyping);
        socket.on('chat_closed', handleChatClosed);
        socket.on('messages_read', handleMessagesRead);
        socket.on('new_assignment', handleNewAssignment);

        return () => {
            socket.off('connect', handleSocketConnect);
            socket.off('disconnect', handleSocketDisconnect);
            socket.off('new_message', handleNewMessage);
            socket.off('user_typing', handleUserTyping);
            socket.off('chat_closed', handleChatClosed);
            socket.off('messages_read', handleMessagesRead);
            socket.off('new_assignment', handleNewAssignment);

            socket.emit('leave_session', { session_id: sessionId });
        };
    }, [socket, sessionId, user, onClose, isAttendant]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !socket || uploading) return;

        const messageToSend = newMessage.trim();
        setNewMessage('');

        try {
            let response;
            
            if (onSendMessage) {
                // Use provided send message function
                response = await onSendMessage(sessionId, messageToSend);
            } else {
                // Use socket directly
                response = await new Promise<any>((resolve) => {
                    socket.emit('send_message', {
                        session_id: sessionId,
                        content: messageToSend
                    }, resolve);
                });
            }

            if (!response.success) {
                setError(response.error || 'Failed to send message');
                setNewMessage(messageToSend);
                soundManager.current.playErrorSound();
            }
        } catch (err) {
            console.error('Send message error:', err);
            setError('Failed to send message');
            setNewMessage(messageToSend);
            soundManager.current.playErrorSound();
        }
    };

    const handleTyping = useCallback(() => {
        if (!socket || typingTimeoutRef.current) return;

        setIsTyping(true);

        socket.emit('typing', {
            session_id: sessionId,
            is_typing: true
        });

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('typing', {
                session_id: sessionId,
                is_typing: false
            });
            typingTimeoutRef.current = undefined;
        }, 1000);
    }, [socket, sessionId]);

    const handleFileUpload = async (file: File) => {
        if (!socket || uploading) return;

        setUploading(true);
        try {
            // Upload file to server
            const formData = new FormData();
            formData.append('file', file);
            formData.append('session_id', sessionId);

            const uploadResponse = await post('chat/upload' as any, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (uploadResponse.status === 'success' && uploadResponse.data) {
                // Send message with file attachment
                const response = await new Promise<any>((resolve) => {
                    socket.emit('send_message', {
                        session_id: sessionId,
                        content: `Sent file: ${file.name}`,
                        attachments: [uploadResponse.data]
                    }, resolve);
                });

                if (!response.success) {
                    setError(response.error || 'Failed to send file');
                    soundManager.current.playErrorSound();
                }
            } else {
                setError(uploadResponse.error || 'Failed to upload file');
                soundManager.current.playErrorSound();
            }
        } catch (err: any) {
            console.error('File upload error:', err);
            setError(err.message || 'Failed to upload file');
            soundManager.current.playErrorSound();
        } finally {
            setUploading(false);
        }
    };

    const handleCloseChat = () => {
        if (window.confirm(isAttendant 
            ? 'Are you sure you want to resolve this chat?' 
            : 'Are you sure you want to end this chat?'
        )) {
            socket.emit('close_chat', {
                session_id: sessionId,
                resolved: isAttendant
            }, (response: any) => {
                if (response.success) {
                    soundManager.current.playNotificationSound();
                    onClose();
                } else {
                    setError(response.error || 'Failed to close chat');
                    soundManager.current.playErrorSound();
                }
            });
        }
    };

    const handleTransferChat = () => {
        if (onTransfer) {
            onTransfer(sessionId);
        }
    };

    const handleResolveChat = () => {
        if (onResolve) {
            onResolve(sessionId);
        } else {
            handleCloseChat();
        }
    };

    const handleExportChat = async () => {
        try {
            const response = await get('chat/history/:session_id' as any, {
                params: { session_id: sessionId }
            });

            if (response.status === 'success') {
                const chatData = {
                    session: sessionInfo,
                    messages: response.data,
                    exportedAt: new Date().toISOString(),
                    exportedBy: user?.name || 'Unknown'
                };

                const blob = new Blob([JSON.stringify(chatData, null, 2)], {
                    type: 'application/json'
                });

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `chat-${sessionId}-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                soundManager.current.playNotificationSound();
            }
        } catch (err) {
            console.error('Export error:', err);
            setError('Failed to export chat');
            soundManager.current.playErrorSound();
        }
    };

    const toggleSound = () => {
        const enabled = soundManager.current.toggleEnabled();
        setSoundEnabled(enabled);
        
        // Play test sound if enabling
        if (enabled) {
            soundManager.current.playNotificationSound();
        }
    };

    const getUserInfo = () => {
        if (!sessionInfo) return null;

        if (sessionInfo.user_id) {
            return {
                type: 'Registered User',
                name: sessionInfo.user_id.name,
                email: sessionInfo.user_id.email,
                role: sessionInfo.user_id.role,
                department: sessionInfo.user_id.department,
                userId: sessionInfo.user_id._id
            };
        }

        if (sessionInfo.guest_info) {
            return {
                type: 'Guest User',
                name: sessionInfo.guest_info.name || 'Not provided',
                email: sessionInfo.guest_info.email,
                phone: sessionInfo.guest_info.phone || 'Not provided',
                joined: sessionInfo.createdAt,
                ip: sessionInfo.guest_info.ip_address
            };
        }

        return null;
    };

    const userInfo = getUserInfo();

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <MessageSquare className="h-6 w-6" />
                                {connectionStatus === 'connected' && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold">Live Chat Support</h3>
                                <div className="flex items-center gap-2 text-sm opacity-90">
                                    <span>
                                        {attendant
                                            ? `Chatting with ${attendant.name}`
                                            : loading
                                                ? 'Loading...'
                                                : 'Waiting for support agent...'
                                        }
                                    </span>
                                    {connectionStatus === 'disconnected' && (
                                        <span className="bg-error/20 text-error text-xs px-2 py-0.5 rounded">
                                            Disconnected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Sound Toggle */}
                        <button
                            onClick={toggleSound}
                            className="p-2 hover:bg-primary-hover rounded-lg transition"
                            title={soundEnabled ? "Disable sounds" : "Enable sounds"}
                        >
                            {soundEnabled ? (
                                <Volume2 className="h-5 w-5" />
                            ) : (
                                <VolumeX className="h-5 w-5" />
                            )}
                        </button>

                        {isAttendant && userInfo && (
                            <button
                                onClick={() => setShowUserDetails(!showUserDetails)}
                                className="p-2 hover:bg-primary-hover rounded-lg transition"
                                title="User info"
                            >
                                <Users className="h-5 w-5" />
                            </button>
                        )}

                        {isAttendant && (
                            <button
                                onClick={handleExportChat}
                                className="p-2 hover:bg-primary-hover rounded-lg transition"
                                title="Export chat"
                            >
                                <Download className="h-5 w-5" />
                            </button>
                        )}

                        <button
                            onClick={handleCloseChat}
                            className="p-2 hover:bg-primary-hover rounded-lg transition"
                            title={isAttendant ? "Resolve chat" : "Close chat"}
                        >
                            {isAttendant ? (
                                <Archive className="h-5 w-5" />
                            ) : (
                                <X className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* User Details Panel */}
                {showUserDetails && userInfo && (
                    <div className="mt-3 p-3 bg-primary/20 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                <span className="text-sm">{userInfo.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="text-sm font-medium">{userInfo.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm truncate">{userInfo.email}</span>
                            </div>
                            {'phone' in userInfo && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-sm">{userInfo.phone}</span>
                                </div>
                            )}
                            {'joined' in userInfo && (
                                <div className="col-span-2 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm">
                                        Joined: {format(new Date(userInfo.joined), 'PPpp')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-3 bg-error/10 border-b border-error/20">
                    <div className="flex items-center gap-2 text-error">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm flex-1">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-xs hover:underline px-2 py-1 bg-error/20 rounded"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Connection Status */}
            {connectionStatus === 'disconnected' && (
                <div className="p-2 bg-warning/10 border-b border-warning/20">
                    <div className="flex items-center gap-2 text-warning text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Connection lost. Attempting to reconnect...</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 flex flex-col">
                    {/* Messages Container */}
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">No messages yet</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Start the conversation by sending a message below
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {messages.map((message, index) => (
                                        <MessageBubble
                                            key={message._id || index}
                                            message={message}
                                            isOwn={message.sender_id === user?._id || 
                                                  (isAttendant && message.sender_type === 'attendant')}
                                            user={user}
                                            isAttendant={isAttendant}
                                            showTimestamp={true}
                                        />
                                    ))}
                                </div>

                                {otherTyping && (
                                    <div className="flex justify-start mb-3">
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 rounded-bl-none">
                                            <div className="flex items-center gap-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {otherTypingName} is typing...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            You are typing...
                        </div>
                    )}

                    {/* Message Input */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                            <FileUploader
                                onUpload={handleFileUpload}
                                disabled={uploading || loading || connectionStatus !== 'connected'}
                            />

                            <div className="flex-1 relative">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value);
                                        handleTyping();
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..."
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 resize-none min-h-[44px] max-h-32 transition"
                                    disabled={uploading || loading || connectionStatus !== 'connected'}
                                    rows={1}
                                />
                                {newMessage.length > 0 && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                        Enter to send
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || uploading || loading || connectionStatus !== 'connected'}
                                className="bg-primary text-white p-3 rounded-lg hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                aria-label="Send message"
                            >
                                {uploading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Side Panel - Notes & Actions */}
                {showNotes && isAttendant && (
                    <div className="w-80 border-l border-gray-200 dark:border-gray-700 flex flex-col">
                        <ChatNotes
                            sessionId={sessionId}
                            isAttendant={isAttendant}
                        />

                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <button
                                onClick={handleTransferChat}
                                disabled={!attendant}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition disabled:opacity-50"
                            >
                                <Users className="h-4 w-4" />
                                Transfer Chat
                            </button>

                            <button
                                onClick={handleResolveChat}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition"
                            >
                                <Archive className="h-4 w-4" />
                                Mark as Resolved
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
// [file content end]