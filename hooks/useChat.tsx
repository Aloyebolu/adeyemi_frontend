'use client';

import { useState, useEffect, useCallback } from 'react';
import { socketClient } from '@/utils/socketClient';
import useUser from './useUser';

interface UseChatOptions {
  autoConnect?: boolean;
  onConnectionChange?: (connected: boolean) => void;
}


// Update the useChat hook to include more socket management
export const useChat = (options: UseChatOptions = {}) => {
  const { autoConnect = true, onConnectionChange } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [eventListeners, setEventListeners] = useState<Map<string, Function[]>>(new Map());
  const { user } = useUser();

  // Setup socket connection and listeners
  useEffect(() => {
    if (!autoConnect || !user?.access_token) return;

    const connectSocket = async () => {
      try {
        const socketInstance = await socketClient.connect(user.access_token);
        setSocket(socketInstance);
        setIsConnected(true);
        setConnectionError(null);
        onConnectionChange?.(true);
        
        // Setup default event listeners
        socketInstance.on('disconnect', () => {
          setIsConnected(false);
          onConnectionChange?.(false);
        });
        
        socketInstance.on('connect_error', (error: Error) => {
          setConnectionError(error.message);
          setIsConnected(false);
          onConnectionChange?.(false);
        });
        
        socketInstance.on('reconnect', () => {
          setIsConnected(true);
          setConnectionError(null);
          onConnectionChange?.(true);
        });
        
        socketInstance.on('reconnect_attempt', (attemptNumber: number) => {
          console.log(`Reconnection attempt ${attemptNumber}`);
        });
        
        socketInstance.on('reconnect_error', (error: Error) => {
          console.error('Reconnection error:', error);
        });
        
      } catch (error: any) {
        setConnectionError(error.message || 'Failed to connect');
        setIsConnected(false);
        onConnectionChange?.(false);
      }
    };

    connectSocket();

    return () => {
      // Cleanup all event listeners
      if (socket) {
        eventListeners.forEach((callbacks, event) => {
          callbacks.forEach(callback => {
            socket.off(event, callback);
          });
        });
      }
      
      socketClient.disconnect();
      setSocket(null);
      setIsConnected(false);
      setEventListeners(new Map());
    };
  }, [autoConnect, user?.access_token]);

  // Enhanced emit function with retry logic
  const emit = useCallback(
    async <T = any>(
      event: string,
      data: any,
      options: { retries?: number; timeout?: number } = {}
    ): Promise<{ success: boolean; [key: string]: any; error?: string }> => {
      if (!socket) {
        return { success: false, error: 'Socket not connected' };
      }

      const { retries = 3, timeout = 5000 } = options;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          return await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error(`Socket emit timeout for event: ${event}`));
            }, timeout);

            socket.emit(event, data, (response: any) => {
              clearTimeout(timeoutId);
              resolve(response);
            });
          });
        } catch (error) {
          if (attempt === retries) {
            return { success: false, error: error.message || 'Socket emit failed' };
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }

      return { success: false, error: 'Max retries exceeded' };
    },
    [socket]
  );

  // Enhanced on function with listener management
  const on = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (!socket) return () => {};

      socket.on(event, callback);

      // Track listener for cleanup
      setEventListeners(prev => {
        const newListeners = new Map(prev);
        const eventCallbacks = newListeners.get(event) || [];
        newListeners.set(event, [...eventCallbacks, callback]);
        return newListeners;
      });

      return () => {
        socket.off(event, callback);
        
        setEventListeners(prev => {
          const newListeners = new Map(prev);
          const eventCallbacks = newListeners.get(event) || [];
          const filtered = eventCallbacks.filter(cb => cb !== callback);
          
          if (filtered.length === 0) {
            newListeners.delete(event);
          } else {
            newListeners.set(event, filtered);
          }
          
          return newListeners;
        });
      };
    },
    [socket]
  );

  const disconnect = useCallback(() => {
    socketClient.disconnect();
    setSocket(null);
    setIsConnected(false);
    setEventListeners(new Map());
    onConnectionChange?.(false);
  }, [onConnectionChange]);

  const reconnect = useCallback(async () => {
    if (!user?.access_token) return false;
    
    disconnect();
    
    try {
      const socketInstance = await socketClient.connect(user.access_token);
      setSocket(socketInstance);
      setIsConnected(true);
      setConnectionError(null);
      onConnectionChange?.(true);
      return true;
    } catch (error: any) {
      setConnectionError(error.message || 'Failed to reconnect');
      return false;
    }
  }, [user?.access_token, disconnect, onConnectionChange]);

  return {
    socket,
    isConnected,
    connectionError,
    emit,
    on,
    disconnect,
    connect: () => socketClient.connect(user?.access_token),
    reconnect,
    // Helper to check if socket is ready
    isReady: !!(socket && isConnected),
  };
};