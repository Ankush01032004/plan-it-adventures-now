
import React from 'react';
import { Trip } from '@/types/trip';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar, Map, CalendarIcon, MoreHorizontal } from 'lucide-react';

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
  
  // Generate a consistent background gradient based on trip title
  const getBackgroundGradient = () => {
    const gradients = [
      'from-blue-500 to-purple-500',
      'from-green-400 to-blue-500',
      'from-yellow-400 to-orange-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-blue-500',
      'from-cyan-400 to-sky-500',
      'from-amber-400 to-orange-600',
    ];
    
    // Use trip id to select a consistent gradient
    const index = trip.id.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader className={`bg-gradient-to-r ${getBackgroundGradient()} text-white p-5 relative`}>
        <CardTitle className="font-bold text-xl">{trip.title}</CardTitle>
        <CardDescription className="text-white/90 font-medium">
          {trip.destination || 'No destination set'}
        </CardDescription>
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(trip);
            }}
          >
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        {(trip.startDate && trip.endDate) ? (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <CalendarIcon size={16} className="mr-1 text-muted-foreground" />
              <span className="text-sm">{formatDateRange()}</span>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
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
              onClick={(e) => {
                e.stopPropagation();
                onEdit(trip);
              }}
              className="hover:text-ocean"
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(trip.id);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex justify-end">
        <Button
          variant="default"
          onClick={() => navigate(`/trip/${trip.id}`)}
          className="w-full bg-gradient-to-r from-ocean to-ocean-dark hover:from-ocean-dark hover:to-ocean-dark transition-all duration-300"
        >
          View Itinerary
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TripCard;
