import React, { useState } from 'react';
import { useVenueRealtime } from '@/hooks/useVenueRealtime';
import { VenueCard } from './VenueCard';
import { VenueStatusBadge } from './VenueStatusBadge';
import { ButtonCustom } from './ui/button-custom';
import { PaginationCustom } from './ui/pagination-custom';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, RefreshCw, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VenueRealtimeListProps {
  showStatus?: boolean;
  itemsPerPage?: number;
  onVenueClick?: (venue: any) => void;
}

export const VenueRealtimeList: React.FC<VenueRealtimeListProps> = ({
  showStatus = false,
  itemsPerPage = 9,
  onVenueClick
}) => {
  const { venues, isLoading, error, newVenueCount, refreshVenues, clearNewVenueNotification } = useVenueRealtime();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort venues
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || venue.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedVenues = [...filteredVenues].sort((a, b) => {
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

  // Pagination
  const indexOfLastVenue = currentPage * itemsPerPage;
  const indexOfFirstVenue = indexOfLastVenue - itemsPerPage;
  const currentVenues = sortedVenues.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(sortedVenues.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewVenueNotificationClick = () => {
    clearNewVenueNotification();
    setCurrentPage(1); // Go to first page to see new venues
    setSortBy('created_at'); // Sort by newest first
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading venues: {error}</p>
        <ButtonCustom onClick={refreshVenues} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </ButtonCustom>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Venue Notification */}
      <AnimatePresence>
        {newVenueCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">
                    {newVenueCount} New Venue{newVenueCount > 1 ? 's' : ''} Available!
                  </h3>
                  <p className="text-sm text-green-600">
                    Fresh venues just added to our platform
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ButtonCustom
                  variant="outline"
                  size="sm"
                  onClick={handleNewVenueNotificationClick}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  View New Venues
                </ButtonCustom>
                <button
                  onClick={clearNewVenueNotification}
                  className="text-green-600 hover:text-green-800 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
          
          {showStatus && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          )}
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
            onClick={refreshVenues}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </ButtonCustom>
        </div>
      </div>

      {/* Results count with real-time indicator */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {currentVenues.length} of {sortedVenues.length} venues
          {searchQuery && ` for "${searchQuery}"`}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && venues.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          <p className="ml-4 text-lg text-gray-600">Loading venues...</p>
        </div>
      )}

      {/* Venues grid with animations */}
      {!isLoading && currentVenues.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {currentVenues.map((venue, index) => (
              <motion.div
                key={venue.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1,
                  layout: { duration: 0.3 }
                }}
                className="relative"
              >
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
                  onClick={() => onVenueClick?.(venue)}
                />
                {showStatus && venue.status && (
                  <div className="absolute top-2 right-2">
                    <VenueStatusBadge status={venue.status} />
                  </div>
                )}
                {/* New venue indicator */}
                {venue.created_at && new Date(venue.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      NEW
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && currentVenues.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
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
                setStatusFilter('all');
                setCurrentPage(1);
              }}
            >
              Clear Search
            </ButtonCustom>
          )}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationCustom
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={sortedVenues.length}
          className="mt-8"
        />
      )}
    </div>
  );
};
