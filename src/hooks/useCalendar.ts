import { useState, useEffect } from 'react';
import { format, parse, isWithinInterval } from 'date-fns';

interface CalendarEvent {
  id: string;
  venueId: string;
  userId: string;
  title: string;
  start: Date;
  end: Date;
  type: 'booking' | 'maintenance' | 'blocked';
  description?: string;
  color?: string;
}

export const useCalendar = (venueId: string) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [venueId]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem(`calendar-${venueId}`);
      if (stored) {
        const data = JSON.parse(stored);
        setEvents(data.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        })));
      }
    } catch (error) {
      console.error('Error loading calendar events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substring(7),
    };

    setEvents(prev => {
      const updated = [...prev, newEvent];
      localStorage.setItem(`calendar-${venueId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const updateEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => {
      const updated = prev.map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      );
      localStorage.setItem(`calendar-${venueId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteEvent = async (eventId: string) => {
    setEvents(prev => {
      const updated = prev.filter(event => event.id !== eventId);
      localStorage.setItem(`calendar-${venueId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const checkAvailability = (start: Date, end: Date) => {
    return !events.some(event =>
      isWithinInterval(start, { start: event.start, end: event.end }) ||
      isWithinInterval(end, { start: event.start, end: event.end })
    );
  };

  const getEventsByDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => 
      format(event.start, 'yyyy-MM-dd') === dateStr
    );
  };

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    checkAvailability,
    getEventsByDate,
  };
};
