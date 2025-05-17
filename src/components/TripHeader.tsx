
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trip } from '@/types/trip';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TripHeaderProps {
  trip: Trip;
}

const TripHeader: React.FC<TripHeaderProps> = ({ trip }) => {
  const navigate = useNavigate();
  
  const formatDateRange = () => {
    if (!trip.startDate || !trip.endDate) return '';
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    
    // Format: May 20-25, 2025
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${format(start, 'MMMM d')}-${format(end, 'd')}, ${format(end, 'yyyy')}`;
    }
    
    // Format: May 20 - June 5, 2025
    if (start.getFullYear() === end.getFullYear()) {
      return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d')}, ${format(end, 'yyyy')}`;
    }
    
    // Format: May 20, 2025 - June 5, 2026
    return `${format(start, 'MMMM d, yyyy')} - ${format(end, 'MMMM d, yyyy')}`;
  };

  return (
    <div className="w-full bg-ocean p-4 text-white rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2 text-white hover:bg-ocean-dark" 
            onClick={() => navigate('/')}
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Trips
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-white border-white hover:bg-ocean-dark"
            onClick={() => navigate(`/trip/${trip.id}/edit`)}
          >
            Edit Trip
          </Button>
        </div>
      </div>
      
      <div className="mt-2">
        <h1 className="text-3xl font-bold">{trip.title}</h1>
        {trip.destination && (
          <div className="text-ocean-light">{trip.destination}</div>
        )}
        {(trip.startDate && trip.endDate) && (
          <div className="text-sm opacity-90 mt-1">{formatDateRange()}</div>
        )}
        {trip.description && (
          <p className="mt-2 text-sm opacity-80">{trip.description}</p>
        )}
      </div>
    </div>
  );
};

export default TripHeader;
