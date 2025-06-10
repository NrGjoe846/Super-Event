import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VenueStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
  className?: string;
}

export const VenueStatusBadge: React.FC<VenueStatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-200',
          label: 'Approved'
        };
      case 'pending':
        return {
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
          label: 'Pending Review'
        };
      case 'rejected':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 hover:bg-red-200',
          label: 'Rejected'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
};
