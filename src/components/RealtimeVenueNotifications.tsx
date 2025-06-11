import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, MapPin, Clock, Star } from 'lucide-react';
import { useVenueActivityFeed } from '@/hooks/useVenueRealtime';
import { ButtonCustom } from './ui/button-custom';
import { Card, CardContent } from './ui/card';
import { formatDistanceToNow } from 'date-fns';

interface RealtimeVenueNotificationsProps {
  className?: string;
}

export const RealtimeVenueNotifications: React.FC<RealtimeVenueNotificationsProps> = ({
  className = ''
}) => {
  const { activities } = useVenueActivityFeed();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTime, setLastReadTime] = useState(new Date());

  // Update unread count when new activities arrive
  useEffect(() => {
    const newActivities = activities.filter(activity => activity.timestamp > lastReadTime);
    setUnreadCount(newActivities.length);
  }, [activities, lastReadTime]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark all as read when opening
      setLastReadTime(new Date());
      setUnreadCount(0);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'venue_added':
        return <MapPin className="h-4 w-4 text-green-600" />;
      case 'venue_approved':
        return <Star className="h-4 w-4 text-blue-600" />;
      case 'venue_booked':
        return <Clock className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'venue_added':
        return 'border-l-green-500 bg-green-50';
      case 'venue_approved':
        return 'border-l-blue-500 bg-blue-50';
      case 'venue_booked':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getActivityMessage = (activity: any) => {
    switch (activity.type) {
      case 'venue_added':
        return `New venue "${activity.venueName}" was added`;
      case 'venue_approved':
        return `"${activity.venueName}" was approved and is now live`;
      case 'venue_booked':
        return `"${activity.venueName}" received a new booking`;
      default:
        return `Activity for "${activity.venueName}"`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-brand-blue transition-colors rounded-full hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-900">Live Activity</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Activity List */}
              <div className="max-h-80 overflow-y-auto">
                {activities.length > 0 ? (
                  <div className="p-2">
                    {activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 mb-2 rounded-lg border-l-4 ${getActivityColor(activity.type)} transition-colors hover:bg-opacity-80`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {getActivityMessage(activity)}
                            </p>
                            {activity.details && (
                              <p className="text-xs text-gray-600 mt-1">
                                {activity.details}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {activities.length > 0 && (
                <div className="p-3 border-t bg-gray-50">
                  <ButtonCustom
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      // Navigate to activity page or refresh
                      window.location.reload();
                    }}
                  >
                    View All Activity
                  </ButtonCustom>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
