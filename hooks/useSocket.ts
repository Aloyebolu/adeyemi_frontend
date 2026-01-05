import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { socketClient } from '@/utils/socketClient';
import { SocketResponse } from '@/types/chat';

export const useSocket = (token?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const socketInstance = socketClient.connect(token);
    setSocket(socketInstance);

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      setConnectionError(error.message);
      setIsConnected(false);
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('connect_error', handleConnectError);

    // Initial connection state
    setIsConnected(socketInstance.connected);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('connect_error', handleConnectError);
    };
  }, [token]);

  const emit = useCallback(
    <T = any>(event: string, data: any): Promise<SocketResponse> => {
      return new Promise((resolve) => {
        if (!socket) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socket.emit(event, data, (response: SocketResponse) => {
          resolve(response);
        });
      });
    },
    [socket]
  );

  const on = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (!socket) return;

      socket.on(event, callback);

      return () => {
        socket.off(event, callback);
      };
    },
    [socket]
  );

  const disconnect = useCallback(() => {
    socketClient.disconnect();
    setSocket(null);
    setIsConnected(false);
  }, []);

  return {
    socket,
    isConnected,
    connectionError,
    emit,
    on,
    disconnect,
  };
};