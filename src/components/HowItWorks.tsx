
import { ButtonCustom } from "./ui/button-custom";

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 md:px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="bg-brand-blue/5 text-brand-blue text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Booking your perfect venue is simple and straightforward with our intuitive platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="glass-card p-8 text-center hover-scale">
            <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Search Venues</h3>
            <p className="text-gray-600">
              Browse our curated selection of venues and filter by location, capacity, and price to find the perfect match for your event.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="glass-card p-8 text-center hover-scale">
            <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Check Availability</h3>
            <p className="text-gray-600">
              View the venue's calendar to find available dates that work with your schedule and instantly reserve your time slot.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="glass-card p-8 text-center hover-scale">
            <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue">
                <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"></path>
                <path d="M15 3v6h6"></path>
                <path d="M10 16l4-4"></path>
                <path d="M8 13h.01"></path>
                <path d="M16 13h.01"></path>
                <path d="M9 19h6"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Confirm Booking</h3>
            <p className="text-gray-600">
              Complete your booking with secure payment options and receive immediate confirmation for your event.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
