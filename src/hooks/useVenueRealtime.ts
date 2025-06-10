import { useState, useEffect, useCallback } from 'react';
import { 
  subscribeToVenues, 
  subscribeToUserVenues, 
  Venue,
  getVenueAnalytics,
  VenueAnalytics
} from '@/services/venueService';
import { useAuth } from '@/contexts/AuthContext';

// Hook for real-time venue updates
export const useVenueRealtime = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToVenues((updatedVenues) => {
      setVenues(updatedVenues);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refreshVenues = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  return {
    venues,
    isLoading,
    error,
    refreshVenues
  };
};

// Hook for user's venues with real-time updates
export const useUserVenuesRealtime = () => {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setVenues([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserVenues(user.id, (updatedVenues) => {
      setVenues(updatedVenues);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  return {
    venues,
    isLoading,
    error
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

  useEffect(() => {
    const unsubscribe = subscribeToVenues((allVenues) => {
      const pending = allVenues.filter(venue => venue.status === 'pending');
      setPendingVenues(pending);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    pendingVenues,
    isLoading
  };
};
