import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useCalendar } from "@/hooks/useCalendar";
import { format } from "date-fns";
import { ButtonCustom } from "./ui/button-custom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";

interface VenueCalendarProps {
  venueId: string;
  venueName: string;
  pricePerHour: number;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const VenueCalendar: React.FC<VenueCalendarProps> = ({ venueId, venueName, pricePerHour }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { events, addEvent, checkAvailability, getEventsByDate } = useCalendar(venueId);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  const isTimeSlotAvailable = (date: Date, timeSlot: string) => {
    const [hour, period] = timeSlot.split(" ");
    const [hourStr] = hour.split(":");
    let hour24 = parseInt(hourStr);
    
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;

    const startTime = new Date(date);
    startTime.setHours(hour24, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(hour24 + 1, 0, 0, 0);

    return checkAvailability(startTime, endTime);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a venue",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedDate(date);
    if (date) {
      setIsBookingModalOpen(true);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot || !user) return;

    setIsProcessing(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const [hour, period] = selectedTimeSlot.split(" ");
      const [hourStr] = hour.split(":");
      let hour24 = parseInt(hourStr);
      
      if (period === "PM" && hour24 !== 12) hour24 += 12;
      if (period === "AM" && hour24 === 12) hour24 = 0;

      const startTime = new Date(selectedDate);
      startTime.setHours(hour24, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(hour24 + 1, 0, 0, 0);

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: pricePerHour,
          venueId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret);

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Add booking to calendar
      await addEvent({
        venueId,
        userId: user.id,
        title: "Venue Booking",
        start: startTime,
        end: endTime,
        type: "booking",
        description: `Booking for ${venueName}`,
      });

      toast({
        title: "Booking Successful",
        description: `Your booking for ${format(startTime, "PPP")} at ${selectedTimeSlot} has been confirmed.`,
      });

      // Send confirmation email
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          booking: {
            venue: venueName,
            date: format(startTime, "PPP"),
            time: selectedTimeSlot,
          },
        }),
      });

      setIsBookingModalOpen(false);
      setSelectedTimeSlot("");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Check Availability</h3>
        <p className="text-gray-600">Select a date to view available time slots and make a booking.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
          disabled={(date) => date < new Date()}
        />

        <div className="flex-1">
          <h4 className="font-medium mb-4">Upcoming Bookings</h4>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {format(event.start, "PPP")} at {format(event.start, "p")}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.type === "booking" ? "bg-green-100 text-green-800" :
                  event.type === "maintenance" ? "bg-orange-100 text-orange-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Time Slot</DialogTitle>
            <DialogDescription>
              Select your preferred time slot. Price: ₹{pricePerHour} per hour
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {timeSlots.map((timeSlot) => {
              const available = selectedDate ? isTimeSlotAvailable(selectedDate, timeSlot) : false;
              return (
                <button
                  key={timeSlot}
                  onClick={() => setSelectedTimeSlot(timeSlot)}
                  disabled={!available}
                  className={`p-2 rounded-md text-sm font-medium transition-colors ${
                    available
                      ? selectedTimeSlot === timeSlot
                        ? "bg-brand-blue text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {timeSlot}
                </button>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Date</span>
                <span>{selectedDate ? format(selectedDate, "PPP") : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Time</span>
                <span>{selectedTimeSlot || "-"}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Amount</span>
                <span>₹{pricePerHour}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <ButtonCustom
              variant="outline"
              onClick={() => setIsBookingModalOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </ButtonCustom>
            <ButtonCustom
              variant="gold"
              onClick={handleBooking}
              disabled={!selectedTimeSlot || isProcessing}
              isLoading={isProcessing}
            >
              {isProcessing ? "Processing..." : "Book Now"}
            </ButtonCustom>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
