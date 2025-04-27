import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

export interface Review {
  id: string;
  venueId: string;
  userId: string;
  rating: number;
  comment: string;
  images?: string[];
  helpful: number;
  createdAt: Date;
}

export interface ReviewStats {
  average: number;
  total: number;
  distribution: Record<number, number>;
}

export const useReviews = (venueId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    average: 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculateStats = (reviewData: Review[]) => {
    const total = reviewData.length;
    const sum = reviewData.reduce((acc, review) => acc + review.rating, 0);
    const distribution = reviewData.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    setStats({
      average: total ? Number((sum / total).toFixed(1)) : 0,
      total,
      distribution,
    });
  };

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'helpful' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          ...reviewData,
          helpful: 0,
          created_at: new Date(),
        }])
        .select()
        .single();

      if (error) throw error;

      setReviews(prev => [data, ...prev]);
      calculateStats([...reviews, data]);

      toast({
        title: 'Review Added',
        description: 'Thank you for your review!',
      });

      return data;
    } catch (error) {
      console.error('Error adding review:', error);
      toast({
        title: 'Error',
        description: 'Failed to add review',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const markHelpful = async (reviewId: string) => {
    try {
      const { data, error } = await supabase.rpc('increment_helpful', {
        review_id: reviewId,
      });

      if (error) throw error;

      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId
            ? { ...review, helpful: review.helpful + 1 }
            : review
        )
      );

      toast({
        title: 'Marked as Helpful',
        description: 'Thank you for your feedback!',
      });
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark review as helpful',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (venueId) {
      loadReviews();
    }
  }, [venueId]);

  return {
    reviews,
    stats,
    isLoading,
    addReview,
    markHelpful,
  };
};
