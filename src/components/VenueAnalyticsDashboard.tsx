import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVenueAnalytics } from '@/hooks/useVenueRealtime';
import { Eye, Heart, Calendar, TrendingUp } from 'lucide-react';

interface VenueAnalyticsDashboardProps {
  venueId: string;
  className?: string;
}

export const VenueAnalyticsDashboard: React.FC<VenueAnalyticsDashboardProps> = ({ 
  venueId, 
  className 
}) => {
  const { analytics, isLoading, error } = useVenueAnalytics(venueId);

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">Unable to load analytics</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Views',
      value: analytics.total_views,
      icon: Eye,
      description: `${analytics.recent_views} in last 7 days`,
      color: 'text-blue-600'
    },
    {
      title: 'Total Bookings',
      value: analytics.total_bookings,
      icon: Calendar,
      description: 'All time bookings',
      color: 'text-green-600'
    },
    {
      title: 'Favorites',
      value: analytics.total_favorites,
      icon: Heart,
      description: 'Users who favorited',
      color: 'text-red-600'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversion_rate}%`,
      icon: TrendingUp,
      description: 'Views to bookings',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </div>
              <p className="text-xs text-gray-500">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
