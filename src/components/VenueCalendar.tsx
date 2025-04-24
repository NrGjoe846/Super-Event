import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useCalendar } from "@/hooks/useCalendar";
import { format } from "date-fns";
import { ButtonCustom } from "./ui/button-custom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface VenueCalendarProps {
  venueId: string;
  venueName: string;
}

export const VenueCalendar: React.FC<VenueCalendarProps> = ({ venueId, venueName }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const { events, addEvent, checkAvailability, getEventsByDate } = useCalendar(venueId);
  const { toast } = useToast();

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  const isTimeSlotAvailable = (date: Date, timeSlot: string) => {
    const [hour, period] = timeSlot.split(" ");
    const [hourStr, minuteStr] = hour.split(":");
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
    setSelectedDate(date);
    if (date) {
      setIsBookingModalOpen(true);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) return;

    const [hour, period] = selectedTimeSlot.split(" ");
    const [hourStr, minuteStr] = hour.split(":");
    let hour24 = parseInt(hourStr);
    
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;

    const startTime = new Date(selectedDate);
    startTime.setHours(hour24, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(hour24 + 1, 0, 0, 0);

    try {
      await addEvent({
        venueId,
        userId: "user123", // Replace with actual user ID
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

      setIsBookingModalOpen(false);
      setSelectedTimeSlot("");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Time Slot</DialogTitle>
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
          <div className="flex justify-end gap-3 mt-6">
            <ButtonCustom
              variant="outline"
              onClick={() => setIsBookingModalOpen(false)}
            >
              Cancel
            </ButtonCustom>
            <ButtonCustom
              variant="gold"
              onClick={handleBooking}
              disabled={!selectedTimeSlot}
            >
              Book Now
            </ButtonCustom>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
