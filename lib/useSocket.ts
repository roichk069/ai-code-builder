'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SocketUser {
  userId: number;
  name: string;
  email: string;
}

export interface CodeUpdate {
  userId: number;
  name: string;
  filePath: string;
  content: string;
  cursorPosition: any;
}

export interface CursorUpdate {
  userId: number;
  name: string;
  filePath: string;
  position: any;
}

export interface ChatMessage {
  userId: number;
  name: string;
  message: string;
  timestamp: string;
}

export function useSocket(projectId: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<SocketUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!projectId) return;

    // Get auth token from cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];

    if (!token) {
      console.error('No auth token found');
      return;
    }

    // Initialize socket connection
    const socketInstance = io({
      path: '/api/socket',
      auth: { token },
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      
      // Join project room
      socketInstance.emit('join-project', projectId);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socketInstance.on('users-list', (usersList: SocketUser[]) => {
      setUsers(usersList);
    });

    socketInstance.on('user-joined', (user: SocketUser) => {
      setUsers(prev => [...prev, user]);
    });

    socketInstance.on('user-left', (user: { userId: number; name: string }) => {
      setUsers(prev => prev.filter(u => u.userId !== user.userId));
    });

    socketInstance.on('chat-message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socketInstance.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance.connected) {
        socketInstance.emit('leave-project', projectId);
        socketInstance.disconnect();
      }
    };
  }, [projectId]);

  const sendCodeChange = useCallback((filePath: string, content: string, cursorPosition: any) => {
    if (!socket || !projectId) return;
    socket.emit('code-change', {
      projectId,
      filePath,
      content,
      cursorPosition,
    });
  }, [socket, projectId]);

  const sendCursorMove = useCallback((filePath: string, position: any) => {
    if (!socket || !projectId) return;
    socket.emit('cursor-move', {
      projectId,
      filePath,
      position,
    });
  }, [socket, projectId]);

  const sendFileSelect = useCallback((filePath: string) => {
    if (!socket || !projectId) return;
    socket.emit('file-select', {
      projectId,
      filePath,
    });
  }, [socket, projectId]);

  const sendChatMessage = useCallback((message: string) => {
    if (!socket || !projectId) return;
    socket.emit('chat-message', {
      projectId,
      message,
    });
  }, [socket, projectId]);

  const onCodeUpdate = useCallback((callback: (data: CodeUpdate) => void) => {
    if (!socket) return;
    socket.on('code-update', callback);
    return () => {
      socket.off('code-update', callback);
    };
  }, [socket]);

  const onCursorUpdate = useCallback((callback: (data: CursorUpdate) => void) => {
    if (!socket) return;
    socket.on('cursor-update', callback);
    return () => {
      socket.off('cursor-update', callback);
    };
  }, [socket]);

  return {
    socket,
    connected,
    users,
    messages,
    sendCodeChange,
    sendCursorMove,
    sendFileSelect,
    sendChatMessage,
    onCodeUpdate,
    onCursorUpdate,
  };
}
