export const CHAT_CONSTANTS = {
  // Socket events
  EVENTS: {
    // Client to Server
    START_CHAT: 'start_chat',
    SEND_MESSAGE: 'send_message',
    TYPING: 'typing',
    MARK_READ: 'mark_read',
    JOIN_AS_ATTENDANT: 'join_as_attendant',
    CLOSE_CHAT: 'close_chat',
    JOIN_SESSION: 'join_session',
    LEAVE_SESSION: 'leave_session',
    
    // Server to Client
    NEW_MESSAGE: 'new_message',
    USER_TYPING: 'user_typing',
    CHAT_CLOSED: 'chat_closed',
    NEW_CHAT_WAITING: 'new_chat_waiting',
    MESSAGES_READ: 'messages_read',
    MESSAGE_DELIVERED: 'message_delivered',
    NEW_ASSIGNMENT: 'new_assignment',
  },
  
  // Chat statuses
  STATUS: {
    ACTIVE: 'active',
    WAITING: 'waiting',
    CLOSED: 'closed',
    RESOLVED: 'resolved',
  },
  
  // Sender types
  SENDER_TYPES: {
    USER: 'user',
    ATTENDANT: 'attendant',
    SYSTEM: 'system',
  },
  
  // Message types
  MESSAGE_TYPES: {
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    SYSTEM_NOTIFICATION: 'system_notification',
  },
  
  // Limits
  MAX_CONCURRENT_CHATS: 50,
  MAX_CHATS_PER_AGENT: 25,
  MAX_MESSAGE_LENGTH: 5000,
  MAX_FILE_SIZE_MB: 10,
  
  // Timeouts
  TYPING_TIMEOUT_MS: 1000,
  CONNECTION_TIMEOUT_MS: 10000,
  RECONNECT_DELAY_MS: 1000,
  MAX_RECONNECT_ATTEMPTS: 5,
  
  // UI
  MESSAGES_PER_PAGE: 50,
  AUTO_SCROLL_THRESHOLD: 100, // pixels from bottom
};