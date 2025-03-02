
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ButtonCustom } from "../components/ui/button-custom";
import { Link } from "react-router-dom";

const eventTypes = [
  {
    id: "wedding",
    name: "Weddings",
    description: "Elegant venues for your special day",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
    count: 124,
    popular: true,
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional spaces for meetings & conferences",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    count: 98,
    popular: false,
  },
  {
    id: "birthday",
    name: "Birthdays",
    description: "Fun spaces to celebrate another year",
    image: "https://images.unsplash.com/photo-1533294455009-a6f974f65676?q=80&w=1974&auto=format&fit=crop",
    count: 87,
    popular: true,
  },
  {
    id: "social",
    name: "Social Events",
    description: "Perfect settings for gatherings & parties",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    count: 65,
    popular: false,
  },
  {
    id: "graduation",
    name: "Graduation",
    description: "Celebrate academic achievements",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070&auto=format&fit=crop",
    count: 43,
    popular: false,
  },
  {
    id: "retirement",
    name: "Retirement",
    description: "Honor career accomplishments",
    image: "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?q=80&w=2070&auto=format&fit=crop",
    count: 38,
    popular: false,
  },
  {
    id: "reunion",
    name: "Reunions",
    description: "Reconnect with friends and family",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069&auto=format&fit=crop",
    count: 29,
    popular: false,
  },
  {
    id: "holiday",
    name: "Holiday Parties",
    description: "Festive venues for seasonal celebrations",
    image: "https://images.unsplash.com/photo-1576248004793-2c21b24b7bcc?q=80&w=2070&auto=format&fit=crop",
    count: 51,
    popular: false,
  },
];

const Events = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const popularEventTypes = eventTypes.filter(event => event.popular);
  const otherEventTypes = eventTypes.filter(event => !event.popular);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Events by Type</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From weddings to corporate meetings, find the perfect venue for any event. Filter by event type to see venues tailored to your specific needs.
            </p>
          </div>

          {/* Popular Event Types Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-brand-gold/20 text-brand-blue p-1 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              Popular Event Types
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularEventTypes.map((eventType) => (
                <Link 
                  to={`/venues?event=${eventType.id}`} 
                  key={eventType.id}
                  className="group relative overflow-hidden rounded-xl aspect-[4/3] transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <img 
                    src={eventType.image} 
                    alt={eventType.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold">{eventType.name}</h3>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                        {eventType.count} venues
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mb-3">{eventType.description}</p>
                    <span className="text-brand-gold flex items-center text-sm font-medium">
                      Browse Venues
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* All Event Types Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">All Event Types</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherEventTypes.map((eventType) => (
                <Link 
                  to={`/venues?event=${eventType.id}`} 
                  key={eventType.id}
                  className="group relative overflow-hidden rounded-lg aspect-square glass-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <img 
                    src={eventType.image} 
                    alt={eventType.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">{eventType.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-white/80 text-xs">{eventType.count} venues</p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Promotion Section */}
          <section className="mt-20">
            <div className="bg-gradient-to-r from-brand-blue/10 to-brand-blue/5 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden glass-card">
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm -z-10"></div>
              <div className="max-w-2xl mx-auto">
                <span className="bg-brand-blue/10 text-brand-blue text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
                  Hosting an event?
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">List Your Venue on GatherHaven</h2>
                <p className="text-gray-600 mb-8">
                  Reach thousands of event planners looking for venues just like yours. Our easy listing process gets your venue in front of the right audience.
                </p>
                <ButtonCustom variant="gold" size="lg">
                  List Your Venue
                </ButtonCustom>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
