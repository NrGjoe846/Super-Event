import { useState, useEffect } from 'react';

interface Review {
  id: string;
  userId: string;
  venueId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  helpful: number;
}

export const useReviews = (venueId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  useEffect(() => {
    loadReviews();
  }, [venueId]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      const stored = localStorage.getItem(`reviews-${venueId}`);
      if (stored) {
        const data = JSON.parse(stored);
        setReviews(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (reviewData: Review[]) => {
    const total = reviewData.length;
    const sum = reviewData.reduce((acc, review) => acc + review.rating, 0);
    const distribution = reviewData.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    setStats({
      average: total ? sum / total : 0,
      total,
      distribution,
    });
  };

  const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      helpful: 0,
    };

    setReviews(prev => {
      const updated = [...prev, newReview];
      localStorage.setItem(`reviews-${venueId}`, JSON.stringify(updated));
      calculateStats(updated);
      return updated;
    });
  };

  const markHelpful = async (reviewId: string) => {
    setReviews(prev => {
      const updated = prev.map(review =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      );
      localStorage.setItem(`reviews-${venueId}`, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    reviews,
    stats,
    isLoading,
    addReview,
    markHelpful,
  };
};
