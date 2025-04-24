import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'review' | 'chat' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
}

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = async () => {
    try {
      const stored = localStorage.getItem(`notifications-${userId}`);
      if (stored) {
        const data = JSON.parse(stored);
        setNotifications(data);
        updateUnreadCount(data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const updateUnreadCount = (notifs: Notification[]) => {
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      read: false,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      localStorage.setItem(`notifications-${userId}`, JSON.stringify(updated));
      updateUnreadCount(updated);
      return updated;
    });

    // Request permission and show browser notification
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
          });
        }
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`notifications-${userId}`, JSON.stringify(updated));
      updateUnreadCount(updated);
      return updated;
    });
  };

  const markAllAsRead = async () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem(`notifications-${userId}`, JSON.stringify(updated));
      updateUnreadCount(updated);
      return updated;
    });
  };

  const clearAll = async () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem(`notifications-${userId}`);
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
};
