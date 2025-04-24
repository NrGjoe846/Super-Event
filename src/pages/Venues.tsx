import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { VenueCard } from "../components/VenueCard";
import { VenueDetailModal } from "../components/VenueDetailModal";
import { ButtonCustom } from "../components/ui/button-custom";
import { PaginationCustom } from "../components/ui/pagination-custom";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

// Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyDPuQbZTNDsPwPKoCa7D_UuQngx2mVR8xs";

// Sample venue data with Indian locations
const initialVenues = [
  {
    id: "v1",
    name: "Taj Mahal Palace",
    location: "Mumbai, Maharashtra",
    price: 150000,
    rating: 4.9,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1590596724152-f8aa7b67e637?q=80&w=2072&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533154680026-74ea9bd4db5d?q=80&w=2069&auto=format&fit=crop",
    ],
    description: "An elegant heritage venue with panoramic Mumbai skyline views. Perfect for grand Indian weddings, galas, and corporate events requiring a touch of luxury and history.",
    capacity: "100-500",
    amenities: ["WiFi", "Traditional Catering", "Valet Parking", "AV Equipment", "Bar", "Stage"],
    availability: ["Monday", "Wednesday", "Friday", "Saturday"],
  },
  {
    id: "v2",
    name: "Rajmahal Gardens",
    location: "Jaipur, Rajasthan",
    price: 120000,
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1601959124933-71e57ba8f7de?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582399094862-04fb6fc0ebed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572508589584-94d778209bc1?q=80&w=2070&auto=format&fit=crop",
    ],
    description: "A beautiful royal outdoor venue surrounded by lush gardens and water features in the Pink City. Ideal for traditional Rajasthani weddings, mehndi ceremonies, and lavish parties.",
    capacity: "200-800",
    amenities: ["WiFi", "Royal Catering", "Parking", "Outdoor Space", "Tent Option"],
    availability: ["Thursday", "Friday", "Saturday", "Sunday"],
  },
  {
    id: "v3",
    name: "Bengaluru Tech Hub",
    location: "Bengaluru, Karnataka",
    price: 90000,
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1569230516306-5a8cb5586399?q=80&w=2070&auto=format&fit=crop",
    ],
    description: "A modern venue equipped with the latest technology for conferences, seminars, and corporate meetings. Located in the heart of India's tech capital with seamless digital integration.",
    capacity: "50-250",
    amenities: ["High-speed WiFi", "AV Equipment", "Corporate Catering", "Coffee Service", "Parking"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "v4",
    name: "Delhi Grand Ballroom",
    location: "New Delhi, Delhi",
    price: 180000,
    rating: 4.9,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2798&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553267751-1c148a7280a1?q=80&w=2134&auto=format&fit=crop",
    ],
    description: "A stunning ballroom with classic Indian architecture and modern amenities. Perfect for large Delhi weddings, charity galas, and corporate celebrations with old-world charm.",
    capacity: "300-1200",
    amenities: ["WiFi", "Premium Catering", "Valet Parking", "AV Equipment", "Dressing Rooms", "Grand Piano"],
    availability: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  {
    id: "v5",
    name: "Goa Beach Resort",
    location: "North Goa, Goa",
    price: 135000,
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2065&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601959124933-71e57ba8f7de?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601959516584-e03ddec8cce7?q=80&w=2071&auto=format&fit=crop",
    ],
    description: "A breathtaking beachfront venue with panoramic Arabian Sea views. Ideal for destination weddings, beach parties, and corporate retreats with Goa's famous sunset backdrop.",
    capacity: "100-400",
    amenities: ["WiFi", "Seafood Catering", "Parking", "Beach Access", "Outdoor Bar"],
    availability: ["Monday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  {
    id: "v6",
    name: "Kerala Backwaters",
    location: "Kochi, Kerala",
    price: 110000,
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586132527833-6fa4ea92429c?q=80&w=2070&auto=format&fit=crop",
    ],
    description: "A serene venue on traditional Kerala houseboats and backwaters. Perfect for intimate weddings, unique cultural experiences, and exclusive small gatherings in God's Own Country.",
    capacity: "20-150",
    amenities: ["WiFi", "Kerala Cuisine", "Boat Transport", "Cultural Performances", "Outdoor Space"],
    availability: ["Friday", "Saturday", "Sunday"],
  },
];

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
  const [selectedVenue, setSelectedVenue] = useState<(typeof initialVenues)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venues, setVenues] = useState(initialVenues);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.filters) {
      const searchFilters = location.state.filters;
      console.log("Applying search filters:", searchFilters);
      
      setIsLoading(true);
      
      setTimeout(() => {
        let filteredVenues = [...initialVenues];
        
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
  
  const filteredVenues = venues;
  
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

  const handleVenueClick = (venue: typeof venues[0]) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const handleWishlist = (id: string) => {
    toast({
      title: "Added to wishlist",
      description: "The venue has been added to your wishlist",
      variant: "default",
    });
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
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentVenues.map((venue) => (
                  <div key={venue.id} onClick={() => handleVenueClick(venue)} className="cursor-pointer">
                    <VenueCard
                      id={venue.id}
                      image={venue.images[0]}
                      name={venue.name}
                      location={venue.location}
                      price={venue.price}
                      rating={venue.rating}
                      featured={venue.featured}
                      availability={venue.availability}
                      amenities={venue.amenities}
                    />
                  </div>
                ))}
              </div>

              <PaginationCustom
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={sortedVenues.length}
                className="mt-8"
              />
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
                  setVenues(initialVenues);
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
          venue={selectedVenue}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default Venues;
