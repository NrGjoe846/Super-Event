import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Notification {
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

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data);
      updateUnreadCount(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const updateUnreadCount = (notifs: Notification[]) => {
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notification,
          read: false,
          created_at: new Date(),
        }])
        .select()
        .single();

      if (error) throw error;

      setNotifications(prev => [data, ...prev]);
      updateUnreadCount([data, ...notifications]);

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

      return data;
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      updateUnreadCount(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));

      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  const clearAll = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (userId) {
      loadNotifications();

      // Subscribe to real-time notifications
      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setNotifications(prev => [payload.new as Notification, ...prev]);
              setUnreadCount(prev => prev + 1);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
};
