import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { VenueDetailModal } from "../components/VenueDetailModal";
import { VenueCard } from "../components/VenueCard";
import { PaginationCustom } from "../components/ui/pagination-custom";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAllVenuesEnhanced, isSuperEventsUser } from "@/services/enhancedVenueService";
import { Venue } from "@/services/venueService";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, RefreshCw } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";

const Venues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { toast } = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Load venues on component mount and when user changes
  useEffect(() => {
    loadVenues();
  }, [user?.email]);

  // Handle URL search parameters
  useEffect(() => {
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

  const loadVenues = async () => {
    setIsLoading(true);
    try {
      const venuesData = await getAllVenuesEnhanced(user?.email);
      setVenues(venuesData);
      setFilteredVenues(venuesData);
      
      // Show special message for super events user
      if (isSuperEventsUser(user?.email) && venuesData.length > 0) {
        const userVenues = venuesData.filter(v => v.submitted_by === 'superevents_user');
        if (userVenues.length > 0) {
          toast({
            title: "Your Venues Loaded",
            description: `Found ${userVenues.length} venue(s) from your JSON storage.`,
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Error loading venues:', error);
      toast({
        title: "Error Loading Venues",
        description: "Failed to load venues. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort venues
  useEffect(() => {
    let filtered = [...venues];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply URL filters
    const eventParam = searchParams.get('event');
    const locationParam = searchParams.get('location');
    
    if (eventParam) {
      filtered = filtered.filter(venue =>
        venue.event_types?.some(type => 
          type.toLowerCase().includes(eventParam.toLowerCase())
        )
      );
    }
    
    if (locationParam) {
      filtered = filtered.filter(venue =>
        venue.location.toLowerCase().includes(locationParam.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'created_at':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    setFilteredVenues(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [venues, searchQuery, sortBy, searchParams]);

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    loadVenues();
    toast({
      title: "Venues Refreshed",
      description: "Venue list has been updated with the latest data.",
    });
  };

  // Pagination
  const indexOfLastVenue = currentPage * itemsPerPage;
  const indexOfFirstVenue = indexOfLastVenue - itemsPerPage;
  const currentVenues = filteredVenues.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Venue</h1>
            <p className="text-gray-600 max-w-2xl">
              Browse through our curated selection of stunning venues for all types of events, from weddings to corporate gatherings. 
              {isSuperEventsUser(user?.email) && " Your personal venues from JSON storage are included and highlighted."}
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Newest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <ButtonCustom
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </ButtonCustom>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              Showing {currentVenues.length} of {filteredVenues.length} venues
              {searchQuery && ` for "${searchQuery}"`}
            </div>
            {isSuperEventsUser(user?.email) && (
              <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                📁 Super Events User - JSON Storage Active
              </div>
            )}
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
              <p className="ml-4 text-lg text-gray-600">Loading venues...</p>
            </div>
          )}

          {/* Venues grid */}
          {!isLoading && currentVenues.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentVenues.map((venue) => (
                <div key={venue.id} className="relative">
                  <VenueCard
                    id={venue.id!}
                    image={venue.images[0] || 'https://via.placeholder.com/400x300'}
                    name={venue.name}
                    location={venue.location}
                    price={venue.price}
                    rating={venue.rating}
                    featured={venue.featured}
                    availability={venue.availability}
                    amenities={venue.amenities}
                    onClick={() => handleVenueClick(venue)}
                  />
                  {/* Special indicator for super events user's venues */}
                  {isSuperEventsUser(user?.email) && venue.submitted_by === 'superevents_user' && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        YOUR VENUE
                      </span>
                    </div>
                  )}
                  {/* New venue indicator */}
                  {venue.created_at && new Date(venue.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        NEW
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && currentVenues.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No venues found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `No venues match your search for "${searchQuery}"`
                  : 'No venues available at the moment'
                }
              </p>
              {searchQuery && (
                <ButtonCustom
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                >
                  Clear Search
                </ButtonCustom>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationCustom
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredVenues.length}
              className="mt-8"
            />
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
