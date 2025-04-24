import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export const useChat = (venueId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io('https://api.gatherhaven.com', {
      query: { venueId },
      auth: { token: user?.id },
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [venueId, user]);

  const sendMessage = useCallback((content: string) => {
    if (socket && user) {
      const message = {
        id: Math.random().toString(36).substring(7),
        senderId: user.id,
        receiverId: venueId,
        content,
        timestamp: new Date(),
      };
      socket.emit('message', message);
      setMessages(prev => [...prev, message]);
    }
  }, [socket, user, venueId]);

  return {
    messages,
    sendMessage,
    isConnected,
  };
};
