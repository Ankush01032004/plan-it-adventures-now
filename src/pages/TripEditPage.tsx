
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '@/context/TripContext';
import { Button } from '@/components/ui/button';
import AddTripDialog from '@/components/AddTripDialog';
import { ChevronLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const TripEditPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { currentTrip, loadTripById, updateTrip } = useTrip();
  const [isDialogOpen, setIsDialogOpen] = React.useState(true);
  
  useEffect(() => {
    if (tripId) {
      loadTripById(tripId);
    }
  }, [tripId]);
  
  useEffect(() => {
    if (!currentTrip && tripId) {
      navigate('/');
      toast({
        title: "Trip not found",
        description: "The requested trip could not be found.",
        variant: "destructive",
      });
    }
  }, [currentTrip, tripId]);
  
  if (!currentTrip) {
    return <div className="p-8">Loading...</div>;
  }
  
  const handleSave = (tripData: any) => {
    if (currentTrip) {
      updateTrip({
        ...currentTrip,
        ...tripData,
      });
      navigate(`/trip/${currentTrip.id}`);
    }
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    navigate(`/trip/${tripId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate(`/trip/${tripId}`)}
        className="mb-6"
      >
        <ChevronLeft size={16} className="mr-1" /> Back to Trip
      </Button>
      
      <AddTripDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onSave={handleSave}
        initialData={currentTrip}
      />
    </div>
  );
};

export default TripEditPage;
