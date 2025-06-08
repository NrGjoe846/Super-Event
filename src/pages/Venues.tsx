import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { VenueCard } from "../components/VenueCard";
import { VenueDetailModal } from "../components/VenueDetailModal";
import { ButtonCustom } from "../components/ui/button-custom";
import { PaginationCustom } from "../components/ui/pagination-custom";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useSearchParams } from "react-router-dom";
import { getAllVenues, Venue, subscribeToVenues } from "@/services/venueService";

const filters = [
  { name: "All", value: "all" },
  { name: "Wedding", value: "wedding" },
  { name: "Corporate", value: "corporate" },
  { name: "Birthday", value: "birthday" },
  { name: "Social", value: "social" },
];

const Venues = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { toast } = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadVenues();

    const unsubscribe = subscribeToVenues((updatedVenues) => {
      setVenues(updatedVenues);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Handle URL search parameters
    const eventParam = searchParams.get('event');
    const locationParam = searchParams.get('location');
    
    if (eventParam) {
      setActiveFilter(eventParam);
    }
    
    if (locationParam) {
      // Filter venues by location if specified
      const filteredByLocation = venues.filter(venue => 
        venue.location.toLowerCase().includes(locationParam.toLowerCase())
      );
      if (filteredByLocation.length > 0) {
        toast({
          title: `Found ${filteredByLocation.length} venues`,
          description: `In ${locationParam}`,
        });
      }
    }
  }, [searchParams, venues, toast]);

  const loadVenues = async () => {
    try {
      setIsLoading(true);
      const loadedVenues = await getAllVenues();
      setVenues(loadedVenues);
    } catch (error) {
      toast({
        title: "Error loading venues",
        description: "Failed to load venues. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.filters) {
      const searchFilters = location.state.filters;
      setIsLoading(true);
      
      setTimeout(() => {
        let filteredVenues = [...venues];
        
        if (searchFilters.capacity) {
          const capacityNum = parseInt(searchFilters.capacity);
          filteredVenues = filteredVenues.filter(venue => {
            const [min, max] = venue.capacity.split('-').map(Number);
            return capacityNum >= min && capacityNum <= max;
          });
        }
        
        if (searchFilters.location) {
          const locationLower = searchFilters.location.toLowerCase();
          filteredVenues = filteredVenues.filter(venue => 
            venue.location.toLowerCase().includes(locationLower)
          );
        }
        
        if (searchFilters.activities && searchFilters.activities.length > 0) {
          filteredVenues = filteredVenues.filter(venue => 
            searchFilters.activities.some((activity: string) => 
              venue.amenities.some(amenity => 
                amenity.toLowerCase().includes(activity.toLowerCase())
              )
            )
          );
        }
        
        setVenues(filteredVenues);
        setIsLoading(false);
        
        toast({
          title: `Found ${filteredVenues.length} venues`,
          description: searchFilters.eventName 
            ? `For your event: ${searchFilters.eventName}` 
            : "Based on your search criteria",
          variant: "default",
        });
      }, 1500);
    }
  }, [location.state, toast]);
  
  // Filter venues based on active filter
  const filteredVenues = venues.filter(venue => {
    if (activeFilter === "all") return true;
    
    // Check if the venue amenities or description contains the filter term
    const filterTerm = activeFilter.toLowerCase();
    return venue.amenities.some(amenity => 
      amenity.toLowerCase().includes(filterTerm)
    ) || venue.description.toLowerCase().includes(filterTerm);
  });
  
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    if (sortBy === "featured") {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    } else if (sortBy === "price-low") {
      return a.price - b.price;
    } else if (sortBy === "price-high") {
      return b.price - a.price;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  const indexOfLastVenue = currentPage * itemsPerPage;
  const indexOfFirstVenue = indexOfLastVenue - itemsPerPage;
  const currentVenues = sortedVenues.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(sortedVenues.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, sortBy]);

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
              Browse through our curated selection of stunning venues for all types of events, from weddings to corporate gatherings
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="flex overflow-x-auto pb-2 mb-4 md:mb-0 hide-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  className={`whitespace-nowrap px-4 py-2 rounded-full mr-2 transition-colors ${
                    activeFilter === filter.value
                      ? "bg-brand-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveFilter(filter.value)}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            <div className="flex items-center">
              <label className="text-gray-600 mr-2 whitespace-nowrap">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
              <p className="ml-4 text-lg text-gray-600">Loading venues...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    id={venue.id!}
                    image={venue.images[0]}
                    name={venue.name}
                    location={venue.location}
                    price={venue.price}
                    rating={venue.rating}
                    featured={venue.featured}
                    availability={venue.availability}
                    amenities={venue.amenities}
                    onClick={() => handleVenueClick(venue)}
                  />
                ))}
              </div>

              {sortedVenues.length > itemsPerPage && (
                <PaginationCustom
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={sortedVenues.length}
                  className="mt-8"
                />
              )}
            </>
          )}

          {!isLoading && sortedVenues.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No venues found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search criteria
              </p>
              <ButtonCustom
                variant="primary"
                onClick={() => {
                  setActiveFilter("all");
                  loadVenues();
                }}
              >
                Clear Filters
              </ButtonCustom>
            </div>
          )}
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
