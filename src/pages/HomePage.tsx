
import React, { useState, useEffect } from 'react';
import { useTrip } from '@/context/TripContext';
import TripCard from '@/components/TripCard';
import { Button } from '@/components/ui/button';
import AddTripDialog from '@/components/AddTripDialog';
import { Trip } from '@/types/trip';
import { Plus } from 'lucide-react';
import OnboardingDialog from '@/components/OnboardingDialog';
import { initializeWithSampleData } from '@/lib/trip-utils';

const HomePage = () => {
  const { allTrips, createTrip, updateTrip, deleteTrip } = useTrip();
  const [isAddTripDialogOpen, setIsAddTripDialogOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<Trip | undefined>(undefined);
  
  useEffect(() => {
    // Initialize with sample data if no trips exist
    initializeWithSampleData();
  }, []);

  const handleSaveTrip = (tripData: Partial<Trip>) => {
    if (tripToEdit) {
      // Update existing trip
      updateTrip({
        ...tripToEdit,
        ...tripData,
      });
    } else {
      // Create new trip
      createTrip(tripData.title || 'New Trip');
    }
    
    setTripToEdit(undefined);
  };

  const handleEditTrip = (trip: Trip) => {
    setTripToEdit(trip);
    setIsAddTripDialogOpen(true);
  };

  const handleDeleteTrip = (tripId: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <OnboardingDialog />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600">Plan and organize your adventures</p>
        </div>
        <Button 
          onClick={() => {
            setTripToEdit(undefined);
            setIsAddTripDialogOpen(true);
          }}
        >
          <Plus size={16} className="mr-1" /> New Trip
        </Button>
      </div>
      
      {allTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-2">No trips yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first trip to start planning your itinerary. Add days, activities,
              and organize them with our drag-and-drop interface.
            </p>
            <Button 
              onClick={() => {
                setTripToEdit(undefined);
                setIsAddTripDialogOpen(true);
              }}
              size="lg"
            >
              <Plus size={16} className="mr-1" /> Create Your First Trip
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTrips.map((trip) => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              onEdit={handleEditTrip}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      )}
      
      <AddTripDialog 
        open={isAddTripDialogOpen}
        onOpenChange={setIsAddTripDialogOpen}
        onSave={handleSaveTrip}
        initialData={tripToEdit}
      />
    </div>
  );
};

export default HomePage;
