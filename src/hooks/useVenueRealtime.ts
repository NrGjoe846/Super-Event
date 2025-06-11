import { useState, useEffect, useCallback } from 'react';
import { 
  subscribeToVenues, 
  subscribeToUserVenues, 
  Venue,
  getVenueAnalytics,
  VenueAnalytics,
  getVenueStatistics
} from '@/services/venueService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Hook for real-time venue updates with notifications
export const useVenueRealtime = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newVenueCount, setNewVenueCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToVenues((updatedVenues) => {
      const previousCount = venues.length;
      const newCount = updatedVenues.length;
      
      // Check if new venues were added
      if (previousCount > 0 && newCount > previousCount) {
        const addedCount = newCount - previousCount;
        setNewVenueCount(prev => prev + addedCount);
        
        // Show notification for new venues
        toast({
          title: "New Venues Added! 🎉",
          description: `${addedCount} new venue${addedCount > 1 ? 's' : ''} just became available`,
          duration: 5000,
        });
      }
      
      setVenues(updatedVenues);
      setIsLoading(false);
      setError(null);
    });

    return () => {
      unsubscribe();
    };
  }, [toast]);

  const refreshVenues = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setNewVenueCount(0);
  }, []);

  const clearNewVenueNotification = useCallback(() => {
    setNewVenueCount(0);
  }, []);

  return {
    venues,
    isLoading,
    error,
    newVenueCount,
    refreshVenues,
    clearNewVenueNotification
  };
};

// Hook for user's venues with real-time updates and notifications
export const useUserVenuesRealtime = () => {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) {
      setVenues([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserVenues(user.id, (updatedVenues) => {
      const previousVenues = venues;
      const newVenues = updatedVenues.filter(venue => 
        !previousVenues.find(prev => prev.id === venue.id)
      );

      // Track recently added venues
      if (newVenues.length > 0) {
        const newIds = newVenues.map(v => v.id!);
        setRecentlyAdded(prev => [...prev, ...newIds]);
        
        // Show success notification
        toast({
          title: "Venue Added Successfully! ✅",
          description: `${newVenues[0].name} has been submitted for review`,
          duration: 5000,
        });

        // Clear the recently added flag after 10 seconds
        setTimeout(() => {
          setRecentlyAdded(prev => prev.filter(id => !newIds.includes(id)));
        }, 10000);
      }

      // Check for status updates
      updatedVenues.forEach(venue => {
        const previousVenue = previousVenues.find(prev => prev.id === venue.id);
        if (previousVenue && previousVenue.status !== venue.status) {
          if (venue.status === 'approved') {
            toast({
              title: "Venue Approved! 🎉",
              description: `${venue.name} is now live on Super Events`,
              duration: 5000,
            });
          } else if (venue.status === 'rejected') {
            toast({
              title: "Venue Needs Attention",
              description: `${venue.name} requires updates before approval`,
              variant: "destructive",
              duration: 5000,
            });
          }
        }
      });

      setVenues(updatedVenues);
      setIsLoading(false);
      setError(null);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id, toast]);

  return {
    venues,
    isLoading,
    error,
    recentlyAdded
  };
};

// Hook for venue analytics
export const useVenueAnalytics = (venueId: string | null) => {
  const [analytics, setAnalytics] = useState<VenueAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!venueId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getVenueAnalytics(venueId);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics
  };
};

// Hook for venue status updates (for admins)
export const useVenueStatusUpdates = () => {
  const [pendingVenues, setPendingVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToVenues((allVenues) => {
      const pending = allVenues.filter(venue => venue.status === 'pending');
      const previousPendingCount = pendingVenues.length;
      
      // Notify about new pending venues
      if (previousPendingCount > 0 && pending.length > previousPendingCount) {
        toast({
          title: "New Venue Submission",
          description: "A new venue is awaiting approval",
          duration: 5000,
        });
      }
      
      setPendingVenues(pending);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [toast]);

  return {
    pendingVenues,
    isLoading
  };
};

// Hook for venue statistics dashboard
export const useVenueStatistics = (userId?: string) => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState({
    totalVenues: 0,
    approvedVenues: 0,
    pendingVenues: 0,
    rejectedVenues: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const stats = await getVenueStatistics(targetUserId);
      setStatistics(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  }, [userId, user?.id]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    isLoading,
    error,
    refetch: fetchStatistics
  };
};

// Hook for real-time venue search with filters
export const useVenueSearch = (filters: {
  query?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  eventType?: string;
}) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVenues = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Import searchVenues function
      const { searchVenues: searchVenuesAPI } = await import('@/services/venueService');
      const results = await searchVenuesAPI(filters);
      setVenues(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchVenues();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchVenues]);

  return {
    venues,
    isLoading,
    error,
    refetch: searchVenues
  };
};

// Hook for real-time venue activity feed
export const useVenueActivityFeed = () => {
  const [activities, setActivities] = useState<Array<{
    id: string;
    type: 'venue_added' | 'venue_approved' | 'venue_booked';
    venueName: string;
    timestamp: Date;
    details?: string;
  }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToVenues((venues) => {
      // Create activity entries for recently added venues
      const recentVenues = venues
        .filter(venue => {
          const createdAt = new Date(venue.created_at || '');
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          return createdAt > fiveMinutesAgo;
        })
        .map(venue => ({
          id: `venue_added_${venue.id}`,
          type: 'venue_added' as const,
          venueName: venue.name,
          timestamp: new Date(venue.created_at || ''),
          details: venue.location
        }));

      setActivities(prev => {
        const existingIds = prev.map(a => a.id);
        const newActivities = recentVenues.filter(a => !existingIds.includes(a.id));
        
        if (newActivities.length > 0) {
          // Show toast for new activity
          toast({
            title: "New Activity",
            description: `${newActivities[0].venueName} was just added!`,
            duration: 3000,
          });
        }
        
        return [...newActivities, ...prev].slice(0, 20); // Keep only latest 20 activities
      });
    });

    return unsubscribe;
  }, [toast]);

  return { activities };
};
