// [file name]: MessageBubble.tsx
// [file content begin]
'use client';

import { Message } from '@/types/chat';
import { Check, CheckCheck, ImageIcon, FileIcon, User, UserCog, Shield, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  user: any;
  isAttendant?: boolean;
  showTimestamp?: boolean;
}

export default function MessageBubble({ 
  message, 
  isOwn, 
  user, 
  isAttendant = false,
  showTimestamp = true 
}: MessageBubbleProps) {
  const [imageError, setImageError] = useState(false);
  
  const getSenderName = () => {
    if (message.sender_type === 'system') return 'System';
    if (message.sender_type === 'attendant') {
      if (message.sender_id?.name) return message.sender_id.name;
      return 'Support Agent';
    }
    if (isOwn) return isAttendant ? 'You (Agent)' : 'You';
    
    // For other users
    if (message.sender_id?.name) return message.sender_id.name;
    if (user && user.name) return user.name;
    return 'User';
  };

  const getSenderIcon = () => {
    if (message.sender_type === 'system') {
      return <Shield className="h-3 w-3 text-warning" />;
    }
    if (message.sender_type === 'attendant') {
      return <UserCog className="h-3 w-3 text-info" />;
    }
    return <User className="h-3 w-3 text-primary" />;
  };

  const getBubbleStyles = () => {
    if (message.sender_type === 'system') {
      return {
        container: 'justify-center',
        bubble: 'bg-warning/10 border border-warning/20 text-warning rounded-lg max-w-md',
        text: 'text-warning italic'
      };
    }
    
    if (isOwn) {
      return {
        container: 'justify-end',
        bubble: isAttendant 
          ? 'bg-info text-white rounded-2xl rounded-br-none shadow-sm'
          : 'bg-primary text-white rounded-2xl rounded-br-none shadow-sm',
        text: 'text-white'
      };
    }
    
    return {
      container: 'justify-start',
      bubble: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none border border-gray-200 dark:border-gray-700 shadow-sm',
      text: 'text-current'
    };
  };

  const getReadStatus = () => {
    if (!isOwn || message.sender_type === 'system') return null;
    
    const isRead = message.read_by && message.read_by.length > 0;
    const readTime = isRead && message.read_by[0]?.read_at 
      ? format(new Date(message.read_by[0].read_at), 'HH:mm')
      : null;
    
    return (
      <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
        {isRead ? (
          <>
            <CheckCheck className="h-3 w-3" />
            <span>Read{readTime ? ` at ${readTime}` : ''}</span>
          </>
        ) : (
          <>
            <Check className="h-3 w-3" />
            <span>Sent</span>
          </>
        )}
      </div>
    );
  };

  const renderAttachment = (attachment: any) => {
    const isImage = attachment.mime_type?.startsWith('image/');
    const isPDF = attachment.mime_type === 'application/pdf';
    
    const handleDownload = () => {
      if (attachment.url) {
        window.open(attachment.url, '_blank');
      }
    };
    
    return (
      <div 
        onClick={handleDownload}
        className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer max-w-xs"
      >
        {isImage ? (
          <div className="relative">
            <ImageIcon className="h-5 w-5 text-primary" />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                <span className="text-xs">Image</span>
              </div>
            )}
          </div>
        ) : (
          <FileIcon className="h-5 w-5 text-primary" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.filename}</p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(attachment.size / 1024).toFixed(1)} KB
            </p>
            {isPDF && (
              <span className="text-xs bg-red-100 text-red-800 px-1 rounded">PDF</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderImagePreview = (attachment: any) => {
    if (!attachment.mime_type?.startsWith('image/')) return null;
    
    return (
      <div className="mt-2 max-w-xs">
        <div 
          className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition"
          onClick={() => window.open(attachment.url, '_blank')}
        >
          <img
            src={attachment.url}
            alt={attachment.filename}
            className="w-full h-auto"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center p-4">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Failed to load image</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
          {attachment.filename}
        </p>
      </div>
    );
  };

  const styles = getBubbleStyles();

  return (
    <div className={`flex ${styles.container} mb-3 group`}>
      <div className={`max-w-[75%] ${styles.bubble} p-3`}>
        {/* Sender Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {getSenderIcon()}
            <span className={`text-xs font-medium ${styles.text} opacity-90`}>
              {getSenderName()}
            </span>
          </div>
          
          {showTimestamp && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-70" />
              <span className="text-xs opacity-70">
                {format(new Date(message.createdAt), 'HH:mm')}
              </span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="mb-2">
          <p className={`whitespace-pre-wrap break-words ${styles.text}`}>
            {message.content}
          </p>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-2 mt-2">
            {message.attachments.map((attachment, index) => (
              <div key={index}>
                {attachment.mime_type?.startsWith('image/') 
                  ? renderImagePreview(attachment)
                  : renderAttachment(attachment)}
              </div>
            ))}
          </div>
        )}

        {/* Read Status */}
        {getReadStatus()}

        {/* Hidden timestamp on hover */}
        {!showTimestamp && (
          <div className="absolute -bottom-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {format(new Date(message.createdAt), 'HH:mm:ss')}
          </div>
        )}
      </div>
    </div>
  );
}
// [file content end]