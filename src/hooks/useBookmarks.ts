import { useState, useEffect } from 'react';

interface Bookmark {
  id: string;
  userId: string;
  venueId: string;
  notes?: string;
  createdAt: Date;
}

export const useBookmark = (userId: string) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, [userId]);

  const loadBookmarks = async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem(`bookmarks-${userId}`);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBookmark = async (venueId: string, notes?: string) => {
    const newBookmark: Bookmark = {
      id: Math.random().toString(36).substring(7),
      userId,
      venueId,
      notes,
      createdAt: new Date(),
    };

    setBookmarks(prev => {
      const updated = [...prev, newBookmark];
      localStorage.setItem(`bookmarks-${userId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const removeBookmark = async (bookmarkId: string) => {
    setBookmarks(prev => {
      const updated = prev.filter(b => b.id !== bookmarkId);
      localStorage.setItem(`bookmarks-${userId}`, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
  };
};
