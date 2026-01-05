import { io, Socket } from 'socket.io-client';

class SocketClient {
  private socket: Socket | null = null;
  private static instance: SocketClient;
  private connectionPromise: Promise<Socket> | null = null;

  private constructor() {}

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  async connect(token?: string): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    // If connection is in progress, return the promise
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    
    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      const connectTimeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 10000);

      this.socket.once('connect', () => {
        clearTimeout(connectTimeout);
        resolve(this.socket!);
      });

      this.socket.once('connect_error', (error) => {
        clearTimeout(connectTimeout);
        reject(error);
      });
    });

    try {
      await this.connectionPromise;
      return this.socket!;
    } finally {
      this.connectionPromise = null;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Helper method for type-safe emits with callbacks
  emitWithCallback<T = any>(
    event: string,
    data: any,
    callback: (response: { success: boolean; [key: string]: any; error?: string }) => void
  ): void {
    if (!this.socket) {
      callback({ success: false, error: 'Socket not connected' });
      return;
    }

    this.socket.emit(event, data, callback);
  }
}

export const socketClient = SocketClient.getInstance();