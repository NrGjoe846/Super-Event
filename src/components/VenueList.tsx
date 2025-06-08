import React, { useState, useEffect, useCallback } from 'react';
import { Venue, getAllVenues as getVenues, deleteVenue } from '../services/venueService';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { toast } from 'sonner';
import { AlertTriangle, Edit, Trash2, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VenueListProps {
  onEditVenue: (venue: Venue) => void;
  onAddVenue: () => void;
  refreshKey: number;
}

const PAGE_LIMIT = 6;

const VenueList: React.FC<VenueListProps> = ({ onEditVenue, onAddVenue, refreshKey }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchVenues = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedVenues = await getVenues();
      setVenues(fetchedVenues || []);
    } catch (err) {
      console.error("Error fetching venues:", err);
      setError("Failed to fetch venues. Please try again.");
      toast.error("Failed to fetch venues.");
      setVenues([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [refreshKey, fetchVenues]);

  const handleDeleteVenue = async (id: string) => {
    try {
      await deleteVenue(id);
      toast.success('Venue deleted successfully!');
      
      // Calculate if we need to go to previous page
      const remainingVenues = venues.length - 1;
      const totalPages = Math.ceil(remainingVenues / PAGE_LIMIT);
      
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      
      fetchVenues();
    } catch (error) {
      console.error('Failed to delete venue:', error);
      toast.error('Failed to delete venue. Please try again.');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(venues.length / PAGE_LIMIT);
  const startIndex = (currentPage - 1) * PAGE_LIMIT;
  const endIndex = startIndex + PAGE_LIMIT;
  const currentVenues = venues.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && venues.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
        <p className="ml-4 text-lg text-muted-foreground">Loading venues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 flex flex-col items-center justify-center p-6 text-center bg-red-50 rounded-lg shadow-md">
        <AlertTriangle className="h-12 w-12 mb-3 text-red-500" /> 
        <p className="text-xl font-semibold mb-1">Error Fetching Venues</p>
        <p className="text-sm mb-4">{error}</p>
        <Button onClick={fetchVenues} variant="destructive" className="bg-red-500 hover:bg-red-600">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pt-2">
        <h2 className="text-3xl font-bold tracking-tight">Venue Management</h2>
        <Button onClick={onAddVenue} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Venue
        </Button>
      </div>

      {venues.length === 0 && !isLoading ? (
         <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">No venues found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new venue.</p>
          <Button onClick={onAddVenue} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Venue
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {currentVenues.map((venue) => (
              <Card key={venue.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out group rounded-lg">
                <div className="h-56 overflow-hidden">
                  <img 
                    src={(venue.images && venue.images.length > 0 ? venue.images[0] : 'https://via.placeholder.com/400x200.png?text=No+Image')} 
                    alt={venue.name} 
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x200.png?text=Image+Not+Available'; 
                      e.currentTarget.onerror = null; 
                    }}
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold tracking-tight truncate" title={venue.name}>{venue.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500 truncate" title={venue.location}>{venue.location}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pt-0 pb-4">
                  <p className="text-sm text-gray-600 mb-1">Capacity: <span className="font-medium text-gray-800">{venue.capacity}</span></p>
                  <p className="text-sm text-gray-600 line-clamp-3 h-[3.75rem] overflow-hidden" title={venue.description}>{venue.description}</p>
                  <p className="text-lg font-semibold text-brand-blue mt-2">₹{venue.price.toLocaleString()}/day</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 bg-gray-50 py-3 px-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => onEditVenue(venue)}>
                    <Edit className="mr-1.5 h-4 w-4" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the venue "{venue.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteVenue(venue.id!)} className="bg-red-600 hover:bg-red-700">
                          Yes, delete venue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-6 pb-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1.5" /> Previous
              </Button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={isLoading}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          )}

          {/* Show pagination info */}
          {venues.length > 0 && (
            <div className="text-center text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, venues.length)} of {venues.length} venues
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VenueList;
