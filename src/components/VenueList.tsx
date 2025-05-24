import React, { useState, useEffect, useCallback } from 'react';
import { Venue, getVenues, deleteVenue } from '../services/venueService';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card'; // Assuming shadcn/ui card
import { toast } from 'sonner';
import { AlertTriangle, Edit, Trash2, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react'; // Icons
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
} from "@/components/ui/alert-dialog"; // Assuming shadcn/ui alert-dialog
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface VenueListProps {
  onEditVenue: (venue: Venue) => void;
  onAddVenue: () => void; // To trigger showing the form for a new venue
  refreshKey: number; // Used to trigger a refresh from parent
}

const PAGE_LIMIT = 5; // Number of venues per page

const VenueList: React.FC<VenueListProps> = ({ onEditVenue, onAddVenue, refreshKey }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisibleVenue, setLastVisibleVenue] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstVisibleVenueStack, setFirstVisibleVenueStack] = useState<(QueryDocumentSnapshot<DocumentData> | null)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchVenues = useCallback(async (direction: 'next' | 'prev' | 'reset' = 'reset') => {
    setIsLoading(true);
    setError(null);
    let newLastVisible: QueryDocumentSnapshot<DocumentData> | null | undefined = null; 

    if (direction === 'reset') {
      newLastVisible = undefined;
      setLastVisibleVenue(null);
      setFirstVisibleVenueStack([]);
      setCurrentPage(1);
    } else if (direction === 'next') {
      newLastVisible = lastVisibleVenue;
    } else { // prev
      // For 'prev', we need to fetch from the start of the previous page.
      // The stack `firstVisibleVenueStack` stores the `startAfter` cursor for each page.
      // The last element in the stack is the cursor that led to the *current* page.
      // To go to the *previous* page, we pop twice: once for current, once for previous's cursor.
      if (firstVisibleVenueStack.length > 0) { 
        const newStack = [...firstVisibleVenueStack];
        newStack.pop(); // Remove the current page's first visible marker (which is the startAfter for this page)
        newLastVisible = newStack.pop() || undefined; // Get the previous page's first visible marker (startAfter for that page)
        setFirstVisibleVenueStack(newStack);
      } else {
         // Already on the first page or stack is empty, reset to first page
        newLastVisible = undefined;
        setLastVisibleVenue(null);
        setFirstVisibleVenueStack([]);
        setCurrentPage(1);
      }
    }

    try {
      // `getVenues` service expects `undefined` for the very first page fetch,
      // or a `QueryDocumentSnapshot` for subsequent pages (`startAfter` cursor).
      const { venues: fetchedVenues, lastVisible } = await getVenues(PAGE_LIMIT, newLastVisible);
      
      if (fetchedVenues.length > 0) {
        setVenues(fetchedVenues);
        setLastVisibleVenue(lastVisible); // Store the snapshot of the last doc on the fetched page
        
        // Logic for managing firstVisibleVenueStack
        // `newLastVisible` here refers to the `startAfter` cursor used for the current fetch.
        if (direction === 'next') {
            // When going next, `newLastVisible` (which was `lastVisibleVenue` from previous state)
            // is the first document of the page we just left. We push it to stack.
            // Or, if it was the very first page (newLastVisible was undefined), we push `null` to represent the start.
            setFirstVisibleVenueStack(prev => [...prev, newLastVisible === undefined ? null : newLastVisible]);
        } else if (direction === 'reset' && fetchedVenues.length > 0) {
            // If we reset and get results, the "first document" of this first page is 'null' (start of collection).
            // So, to enable "prev" from page 2 (if it exists), we need to startAfter 'null'.
            // Push 'null' onto the stack if there are venues and potentially a next page (indicated by 'lastVisible' being present).
            setFirstVisibleVenueStack(lastVisible ? [null] : []);
        }
        // For 'prev', the stack is already managed before the fetch.

        setIsLastPage(fetchedVenues.length < PAGE_LIMIT || !lastVisible); // Check if it's the last page
      } else {
        // No venues fetched
        if (direction === 'next') {
          setIsLastPage(true); // No more venues
        } else if (direction === 'reset') {
          setVenues([]); // No venues at all
          setIsLastPage(true);
        }
        // If 'prev' results in no venues, it implies we are at the first page or an issue occurred.
        // The stack logic should handle resetting to page 1 if it was an invalid 'prev' attempt.
        if(direction === 'prev') {
            setVenues([]); // Clear venues if previous page is empty
            // Current page might be 1 already if stack logic determined that.
        }
      }

      // Update current page number based on direction
      if (direction === 'next') {
        setCurrentPage(prev => prev + 1);
      } else if (direction === 'prev') {
        // Only decrement if not already on page 1
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
        // If stack is now empty, it means we've returned to page 1
        if(firstVisibleVenueStack.length === 0 && newLastVisible === undefined) setCurrentPage(1);

      } else if (direction === 'reset') {
        setCurrentPage(1);
      }

    } catch (err) {
      console.error("Error fetching venues:", err);
      setError("Failed to fetch venues. Please try again.");
      toast.error("Failed to fetch venues.");
      // Reset pagination state on error
      setLastVisibleVenue(null);
      setFirstVisibleVenueStack([]);
      setCurrentPage(1);
      setIsLastPage(false);
      setVenues([]);
    } finally {
      setIsLoading(false);
    }
  }, [lastVisibleVenue, currentPage, firstVisibleVenueStack]);


  // Helper to create a simplified snapshot for pagination state (Illustrative)
  // IMPORTANT: This is a placeholder. `getVenues` should ideally return full QueryDocumentSnapshot objects
  // for robust pagination, especially for the `startAfter` cursor.
  // For this example, we pass the venue object itself, and the service might need adjustment
  // or this needs to be replaced by actual snapshot management.
  const querySnapshotToSimplified = (venue: Venue): QueryDocumentSnapshot<DocumentData> => {
    // This is not a real QueryDocumentSnapshot. This is a placeholder.
    // The `getVenues` function in `venueService` expects an actual `QueryDocumentSnapshot`.
    // This function and its usage highlight a potential issue with the current pagination for "previous" page.
    // A proper implementation would involve `getVenues` returning the actual snapshot.
    // console.warn("querySnapshotToSimplified is illustrative and not central to the pagination logic if using actual snapshots.");
    return venue as unknown as QueryDocumentSnapshot<DocumentData>;
  };


  useEffect(() => {
    fetchVenues('reset');
  }, [refreshKey, fetchVenues]); // Added fetchVenues to dependency array

  const handleDeleteVenue = async (id: string) => {
    try {
      await deleteVenue(id);
      toast.success('Venue deleted successfully!');
      // If current page becomes empty after deletion, and it's not the first page,
      // try to go to previous page to avoid an empty screen. Otherwise, reset.
      if (venues.length === 1 && currentPage > 1 && firstVisibleVenueStack.length > 0) {
        fetchVenues('prev');
      } else {
        fetchVenues('reset'); 
      }
    } catch (error) {
      console.error('Failed to delete venue:', error);
      toast.error('Failed to delete venue. Please try again.');
    }
  };

  if (isLoading && venues.length === 0 && currentPage === 1) { // Show initial loading message only on first load
    return <p className="text-center py-10 text-lg text-muted-foreground">Loading venues...</p>;
  }

  if (error) {
    return (
      <div className="text-red-600 flex flex-col items-center justify-center p-6 text-center bg-red-50 rounded-lg shadow-md">
        <AlertTriangle className="h-12 w-12 mb-3 text-red-500" /> 
        <p className="text-xl font-semibold mb-1">Error Fetching Venues</p>
        <p className="text-sm mb-4">{error}</p>
        <Button onClick={() => fetchVenues('reset')} variant="destructive" className="bg-red-500 hover:bg-red-600">
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
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-8">
          {venues.map((venue) => (
            <Card key={venue.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out group rounded-lg">
              <div className="h-56 overflow-hidden">
                <img 
                  src={(venue.images && venue.images.length > 0 ? venue.images[0] : 'https://via.placeholder.com/400x200.png?text=No+Image')} 
                  alt={venue.venueName} 
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200.png?text=Image+Not+Available'; 
                    e.currentTarget.onerror = null; 
                  }}
                />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold tracking-tight truncate" title={venue.venueName}>{venue.venueName}</CardTitle>
                <CardDescription className="text-sm text-gray-500 truncate" title={venue.location}>{venue.location}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-0 pb-4">
                <p className="text-sm text-gray-600 mb-1">Capacity: <span className="font-medium text-gray-800">{venue.capacity}</span></p>
                <p className="text-sm text-gray-600 line-clamp-3 h-[3.75rem] overflow-hidden" title={venue.description}>{venue.description}</p>
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
                        This action cannot be undone. This will permanently delete the venue "<span className="font-semibold">{venue.venueName}</span>".
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
      )}
      
      {/* Show pagination controls if there are venues, or if not on page 1 (e.g. navigating back to an empty page 1), or if loading */}
      { (venues.length > 0 || currentPage > 1 || isLoading) && 
        <div className="flex justify-center items-center space-x-4 pt-6 pb-2">
          <Button
            variant="outline"
            onClick={() => fetchVenues('prev')}
            disabled={firstVisibleVenueStack.length === 0 || isLoading} // Disable if stack is empty (at page 1) or loading
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" /> Previous
          </Button>
          <span className="text-sm font-medium text-gray-700 px-2 py-1 bg-gray-100 rounded-md">Page {currentPage}</span>
          <Button
            variant="outline"
            onClick={() => fetchVenues('next')}
            disabled={isLastPage || isLoading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      }
    </div>
  );
};

export default VenueList;
```
