import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { VenueDetailModal } from "../components/VenueDetailModal";
import { VenueRealtimeList } from "../components/VenueRealtimeList";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useSearchParams } from "react-router-dom";
import { Venue } from "@/services/venueService";

const Venues = () => {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle URL search parameters
    const eventParam = searchParams.get('event');
    const locationParam = searchParams.get('location');
    
    if (eventParam) {
      toast({
        title: `Filtering by event type`,
        description: `Showing venues for ${eventParam} events`,
      });
    }
    
    if (locationParam) {
      toast({
        title: `Filtering by location`,
        description: `Showing venues in ${locationParam}`,
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    if (location.state?.filters) {
      const searchFilters = location.state.filters;
      
      toast({
        title: `Search results`,
        description: searchFilters.eventName 
          ? `For your event: ${searchFilters.eventName}` 
          : "Based on your search criteria",
        variant: "default",
      });
    }
  }, [location.state, toast]);

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Venue</h1>
            <p className="text-gray-600 max-w-2xl">
              Browse through our curated selection of stunning venues for all types of events, from weddings to corporate gatherings. Real-time updates ensure you see the latest availability.
            </p>
          </div>

          <VenueRealtimeList 
            onVenueClick={handleVenueClick}
            itemsPerPage={9}
          />
        </div>
      </main>
      <Footer />

      {selectedVenue && (
        <VenueDetailModal
          venue={{
            ...selectedVenue,
            capacity: selectedVenue.capacity,
            images: selectedVenue.images,
          }}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default Venues;
