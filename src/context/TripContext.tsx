
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Trip } from '@/types/trip';
import { createNewTrip, getAllTrips, loadTrip, saveTrip } from '@/lib/trip-utils';
import { useToast } from '@/components/ui/use-toast';

interface TripContextType {
  currentTrip: Trip | null;
  allTrips: Trip[];
  setCurrentTrip: (trip: Trip) => void;
  updateTrip: (updatedTrip: Trip) => void;
  createTrip: (title: string) => Trip;
  loadTripById: (id: string) => void;
  deleteTrip: (id: string) => void;
  clearCurrentTrip: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrip, setCurrentTripState] = useState<Trip | null>(null);
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const { toast } = useToast();

  // Load all trips on initial render
  useEffect(() => {
    const trips = getAllTrips();
    setAllTrips(trips);
  }, []);

  const setCurrentTrip = (trip: Trip) => {
    setCurrentTripState(trip);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setCurrentTripState(updatedTrip);
    saveTrip(updatedTrip);
    
    // Update allTrips state
    setAllTrips(prev => 
      prev.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip)
    );
    
    toast({
      title: "Trip updated",
      description: `${updatedTrip.title} has been saved.`,
      duration: 2000,
    });
  };

  const createTrip = (title: string) => {
    const newTrip = createNewTrip(title);
    saveTrip(newTrip);
    
    // Update allTrips state
    setAllTrips(prev => [...prev, newTrip]);
    
    toast({
      title: "Trip created",
      description: `${title} has been created.`,
    });
    
    return newTrip;
  };

  const loadTripById = (id: string) => {
    const trip = loadTrip(id);
    if (trip) {
      setCurrentTripState(trip);
    } else {
      toast({
        title: "Error",
        description: "Could not find the requested trip.",
        variant: "destructive",
      });
    }
  };

  const deleteTrip = (id: string) => {
    // Remove the trip from localStorage
    localStorage.removeItem(`trip-${id}`);
    
    // Update allTrips state
    setAllTrips(prev => prev.filter(trip => trip.id !== id));
    
    // Clear current trip if it's the one being deleted
    if (currentTrip?.id === id) {
      setCurrentTripState(null);
    }
    
    // Update the trips index
    const tripsIndex = JSON.parse(localStorage.getItem('trip-ids') || '[]');
    localStorage.setItem('trip-ids', JSON.stringify(tripsIndex.filter((tripId: string) => tripId !== id)));
    
    toast({
      title: "Trip deleted",
      description: "The trip has been removed.",
    });
  };

  const clearCurrentTrip = () => {
    setCurrentTripState(null);
  };

  return (
    <TripContext.Provider
      value={{
        currentTrip,
        allTrips,
        setCurrentTrip,
        updateTrip,
        createTrip,
        loadTripById,
        deleteTrip,
        clearCurrentTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
