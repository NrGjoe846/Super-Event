import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

export interface Booking {
  id: string;
  venueId: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  guestCount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  specialRequests?: string;
  createdAt: Date;
}

export const useBookings = (venueId?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('bookings').select('*');
      if (venueId) {
        query = query.eq('venue_id', venueId);
      }
      const { data, error } = await query;
      if (error) throw error;
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{ ...bookingData, created_at: new Date() }])
        .select()
        .single();

      if (error) throw error;

      setBookings(prev => [...prev, data]);
      toast({
        title: 'Booking Created',
        description: 'Your booking has been confirmed',
      });

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to create booking',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      toast({
        title: 'Status Updated',
        description: `Booking status updated to ${status}`,
      });

      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const checkAvailability = async (date: Date, startTime: string, endTime: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('venue_id', venueId)
        .eq('date', date.toISOString().split('T')[0])
        .not('status', 'eq', 'cancelled');

      if (error) throw error;

      const isTimeSlotAvailable = !data.some(booking => 
        (startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime)
      );

      return isTimeSlotAvailable;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (venueId) {
      loadBookings();
    }
  }, [venueId]);

  return {
    bookings,
    isLoading,
    createBooking,
    updateBookingStatus,
    checkAvailability,
    loadBookings,
  };
};
