
import { ButtonCustom } from "./ui/button-custom";

export const EventTypes = () => {
  return (
    <section className="py-20 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="bg-brand-blue/5 text-brand-blue text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
            Event Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect Venues for Every Indian Occasion</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover spaces tailored to your specific event needs, from traditional Indian weddings to modern corporate gatherings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Wedding Card */}
          <div className="relative group overflow-hidden rounded-lg aspect-[3/4] glass-card hover-scale">
            <img 
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop" 
              alt="Indian Wedding Venue" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-semibold mb-1">Indian Weddings</h3>
              <p className="text-white/90 text-sm mb-3">Majestic venues for traditional celebrations</p>
              <span className="text-brand-gold flex items-center text-sm font-medium">
                Explore Venues
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </div>
          </div>
          
          {/* Corporate Card */}
          <div className="relative group overflow-hidden rounded-lg aspect-[3/4] glass-card hover-scale">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop" 
              alt="Corporate Venue in India" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-semibold mb-1">Corporate Events</h3>
              <p className="text-white/90 text-sm mb-3">Professional spaces for meetings & conferences</p>
              <span className="text-brand-gold flex items-center text-sm font-medium">
                Explore Venues
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </div>
          </div>
          
          {/* Cultural Events Card */}
          <div className="relative group overflow-hidden rounded-lg aspect-[3/4] glass-card hover-scale">
            <img 
              src="https://images.unsplash.com/photo-1580069698581-e41df28c6ade?q=80&w=1974&auto=format&fit=crop" 
              alt="Cultural Event Venue" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-semibold mb-1">Cultural Events</h3>
              <p className="text-white/90 text-sm mb-3">Venues for festivals, music & dance performances</p>
              <span className="text-brand-gold flex items-center text-sm font-medium">
                Explore Venues
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </div>
          </div>
          
          {/* Social Card */}
          <div className="relative group overflow-hidden rounded-lg aspect-[3/4] glass-card hover-scale">
            <img 
              src="https://images.unsplash.com/photo-1564940904267-6ebc55bb0692?q=80&w=1974&auto=format&fit=crop" 
              alt="Social Event Venue in India" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-semibold mb-1">Social Events</h3>
              <p className="text-white/90 text-sm mb-3">Perfect settings for gatherings & parties</p>
              <span className="text-brand-gold flex items-center text-sm font-medium">
                Explore Venues
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
