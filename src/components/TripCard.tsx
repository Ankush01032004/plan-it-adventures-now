
import React from 'react';
import { Trip } from '@/types/trip';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar, Map, CalendarIcon } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const formatDateRange = () => {
    if (!trip.startDate || !trip.endDate) return '';
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };
  
  const getDuration = () => {
    if (!trip.startDate || !trip.endDate) return '';
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = differenceInDays(end, start) + 1;
    
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-ocean text-white p-4">
        <CardTitle>{trip.title}</CardTitle>
        <CardDescription className="text-ocean-light">
          {trip.destination || 'No destination set'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {(trip.startDate && trip.endDate) ? (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <CalendarIcon size={16} className="mr-1" />
              <span className="text-sm">{formatDateRange()}</span>
            </div>
            <div className="text-sm font-medium">
              {getDuration()}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm mb-4">No dates set</div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {trip.days.length} {trip.days.length === 1 ? 'day' : 'days'} planned
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(trip)}
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(trip.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted p-4 flex justify-end">
        <Button
          variant="default"
          onClick={() => navigate(`/trip/${trip.id}`)}
        >
          View Itinerary
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TripCard;
