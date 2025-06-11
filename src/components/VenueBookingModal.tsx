import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createVenueBooking, checkVenueAvailability } from '@/services/venueService';
import { format } from 'date-fns';

interface VenueBookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  venue: {
    id: string;
    name: string;
    price: number;
    location: string;
  };
}

export const VenueBookingModal: React.FC<VenueBookingModalProps> = ({
  isOpen,
  onOpenChange,
  venue
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [guestCount, setGuestCount] = useState(50);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to make a booking',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: 'Date Required',
        description: 'Please select a booking date',
        variant: 'destructive'
      });
      return;
    }

    if (startTime >= endTime) {
      toast({
        title: 'Invalid Time',
        description: 'End time must be after start time',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check availability
      const isAvailable = await checkVenueAvailability(
        venue.id,
        format(selectedDate, 'yyyy-MM-dd'),
        startTime,
        endTime
      );

      if (!isAvailable) {
        toast({
          title: 'Time Slot Unavailable',
          description: 'This time slot is already booked. Please choose a different time.',
          variant: 'destructive'
        });
        return;
      }

      // Calculate total amount (price per hour)
      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = parseInt(endTime.split(':')[0]);
      const hours = endHour - startHour;
      const totalAmount = venue.price * hours;

      // Create booking
      await createVenueBooking({
        venue_id: venue.id,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: startTime,
        end_time: endTime,
        guest_count: guestCount,
        total_amount: totalAmount,
        status: 'pending',
        special_requests: specialRequests || undefined
      });

      toast({
        title: 'Booking Successful',
        description: `Your booking for ${venue.name} has been submitted and is pending confirmation.`
      });

      onOpenChange(false);
      
      // Reset form
      setSelectedDate(undefined);
      setStartTime('09:00');
      setEndTime('17:00');
      setGuestCount(50);
      setSpecialRequests('');

    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Failed to create booking',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedDate || !startTime || !endTime) return 0;
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const hours = Math.max(0, endHour - startHour);
    return venue.price * hours;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {venue.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <h3 className="font-medium mb-3">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Time</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Time</label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Guests</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                placeholder="Any special arrangements or requirements..."
              />
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h4 className="font-medium mb-3">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Venue:</span>
              <span className="font-medium">{venue.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span>{venue.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{startTime} - {endTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span>{guestCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Rate per hour:</span>
              <span>₹{venue.price.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Total Amount:</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6">
          <ButtonCustom
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </ButtonCustom>
          <ButtonCustom
            variant="gold"
            onClick={handleBooking}
            disabled={!selectedDate || isLoading}
            isLoading={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Booking'}
          </ButtonCustom>
        </div>
      </DialogContent>
    </Dialog>
  );
};
