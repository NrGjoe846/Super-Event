import { VenueCalendar } from "./VenueCalendar";

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 md:px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="bg-brand-blue/5 text-brand-blue text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
            Venue Calendar
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Check Venue Availability</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find and book available time slots for your preferred venue. Our real-time calendar system ensures seamless scheduling.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <VenueCalendar 
            venueId="demo-venue-1"
            venueName="Demo Venue"
          />
        </div>
      </div>
    </section>
  );
};
