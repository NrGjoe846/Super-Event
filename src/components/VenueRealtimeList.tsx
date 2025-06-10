import React, { useState } from 'react';
import { useVenueRealtime } from '@/hooks/useVenueRealtime';
import { VenueCard } from './VenueCard';
import { VenueStatusBadge } from './VenueStatusBadge';
import { ButtonCustom } from './ui/button-custom';
import { PaginationCustom } from './ui/pagination-custom';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, RefreshCw } from 'lucide-react';

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
  const { venues, isLoading, error, refreshVenues } = useVenueRealtime();
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

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {currentVenues.length} of {sortedVenues.length} venues
        {searchQuery && ` for "${searchQuery}"`}
      </div>

      {/* Loading state */}
      {isLoading && venues.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          <p className="ml-4 text-lg text-gray-600">Loading venues...</p>
        </div>
      )}

      {/* Venues grid */}
      {!isLoading && currentVenues.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                onClick={() => onVenueClick?.(venue)}
              />
              {showStatus && venue.status && (
                <div className="absolute top-2 right-2">
                  <VenueStatusBadge status={venue.status} />
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
                setStatusFilter('all');
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
          totalItems={sortedVenues.length}
          className="mt-8"
        />
      )}
    </div>
  );
};
