
import React, { useState } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { ButtonCustom } from "./ui/button-custom";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface VenueDetailModalProps {
  venue: {
    id: string;
    name: string;
    location: string;
    price: number;
    rating: number;
    images: string[];
    description: string;
    capacity: string;
    amenities: string[];
    availability: string[];
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VenueDetailModal: React.FC<VenueDetailModalProps> = ({
  venue,
  isOpen,
  onOpenChange,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState(50);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setActiveImageIndex((prev) => 
      prev === venue.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? venue.images.length - 1 : prev - 1
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      alert(`Booking submitted for ${venue.name} on ${date ? format(date, 'PPP') : 'No date selected'}`);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div>
          {/* Image gallery */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={venue.images[activeImageIndex]}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            
            {/* Navigation buttons */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white text-gray-800 transition-colors"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white text-gray-800 transition-colors"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
            
            {/* Image pagination */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {venue.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === activeImageIndex ? "bg-white scale-125" : "bg-white/60"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                ></button>
              ))}
            </div>
            
            <DialogClose className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white p-1.5 rounded-full hover:bg-black/50 transition-colors z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </DialogClose>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {venue.name}
                </DialogTitle>
                <DialogDescription className="text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {venue.location}
                </DialogDescription>
              </div>
              
              <div className="flex flex-col sm:items-end">
                <div className="flex items-center mb-1">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FFD700" stroke="#FFD700" />
                    </svg>
                    <span className="text-sm font-medium">{venue.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xl font-semibold text-brand-blue">${venue.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/day</span>
                </div>
                <p className="text-sm text-gray-500">Capacity: {venue.capacity} guests</p>
              </div>
            </div>
            
            {!showBookingForm ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">About this venue</h3>
                  <p className="text-gray-600">{venue.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {venue.amenities.map((amenity, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Availability</h3>
                    <div className="flex flex-wrap gap-1">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                        <span 
                          key={idx} 
                          className={`inline-block text-xs px-2 py-1 rounded ${
                            venue.availability.includes(day) 
                              ? "bg-green-50 text-green-600" 
                              : "bg-gray-100 text-gray-400 line-through"
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <ButtonCustom
                    variant="gold"
                    size="lg"
                    onClick={() => setShowBookingForm(true)}
                  >
                    Book This Venue
                  </ButtonCustom>
                </div>
              </>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <h3 className="text-xl font-semibold mb-6">Book this venue</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date
                    </label>
                    <div className="border rounded-md">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        disabled={(date) => 
                          date < new Date() || 
                          date.getDay() === 0 || // Sunday disabled if not in availability
                          date.getDay() === 6    // Saturday disabled if not in availability
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                        rows={4}
                        placeholder="Any special arrangements or needs..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{date ? format(date, 'PPP') : 'No date selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-medium">{guestCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue fee</span>
                      <span className="font-medium">${venue.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service fee</span>
                      <span className="font-medium">${Math.round(venue.price * 0.1)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">${venue.price + Math.round(venue.price * 0.1)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <ButtonCustom
                    type="button"
                    variant="outline"
                    onClick={() => setShowBookingForm(false)}
                  >
                    Back
                  </ButtonCustom>
                  <ButtonCustom
                    type="submit"
                    variant="gold"
                    isLoading={loading}
                    disabled={!date}
                  >
                    Confirm Booking
                  </ButtonCustom>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
