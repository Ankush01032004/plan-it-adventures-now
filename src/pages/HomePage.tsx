import React, { useState, useEffect } from 'react';
import { useTrip } from '@/context/TripContext';
import TripCard from '@/components/TripCard';
import { Button } from '@/components/ui/button';
import AddTripDialog from '@/components/AddTripDialog';
import { Trip } from '@/types/trip';
import { Plus, Compass, Calendar, MapPin, Award } from 'lucide-react';
import OnboardingDialog from '@/components/OnboardingDialog';
import { initializeWithSampleData } from '@/lib/trip-utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
const HomePage = () => {
  const {
    allTrips,
    createTrip,
    updateTrip,
    deleteTrip
  } = useTrip();
  const [isAddTripDialogOpen, setIsAddTripDialogOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<Trip | undefined>(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    // Initialize with sample data if no trips exist
    initializeWithSampleData();
  }, []);
  const handleSaveTrip = (tripData: Partial<Trip>) => {
    if (tripToEdit) {
      // Update existing trip
      updateTrip({
        ...tripToEdit,
        ...tripData
      });
      toast({
        title: "Trip updated",
        description: `${tripData.title} has been updated successfully.`
      });
    } else {
      // Create new trip
      createTrip(tripData.title || 'New Trip');
      toast({
        title: "Trip created",
        description: `${tripData.title || 'New Trip'} has been created successfully.`
      });
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
      toast({
        title: "Trip deleted",
        description: "The trip has been deleted successfully.",
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen bg-background">
      <OnboardingDialog />
      
      {/* Hero Section */}
      <div className="relative bg-ocean text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-dark/90 to-ocean/30 z-10"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1500')] bg-cover bg-center opacity-50"></div>
        </div>
        
        <div className="container relative z-20 mx-auto px-4 py-16 sm:py-24">
          <NavigationMenu className="max-w-none justify-end mb-12">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors" onClick={() => setIsAddTripDialogOpen(true)}>
                  Create Trip
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors">
                  Help
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Your journey begins with a plan
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl">
              Create detailed trip itineraries, organize activities, and make the most of every adventure with our powerful trip planner.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" onClick={() => {
              setTripToEdit(undefined);
              setIsAddTripDialogOpen(true);
            }} className="bg-white text-ocean hover:bg-white/90">
                <Plus size={18} className="mr-2" /> Start Planning
              </Button>
              {allTrips.length > 0 && <Button variant="outline" size="lg" onClick={() => {
              const scrollTarget = document.getElementById('my-trips');
              if (scrollTarget) {
                scrollTarget.scrollIntoView({
                  behavior: 'smooth'
                });
              }
            }} className="border-white hover:bg-white/10 text-zinc-950">
                  View My Trips
                </Button>}
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Plan your perfect adventure</h2>
          <p className="mt-2 text-lg text-gray-600">Everything you need to create unforgettable journeys</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-ocean-light/20 flex items-center justify-center mb-4">
              <Calendar className="text-ocean" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Day-by-Day Planning</h3>
            <p className="text-gray-600">Create detailed daily itineraries for your entire trip, with time slots for each activity.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-coral-light/20 flex items-center justify-center mb-4">
              <MapPin className="text-coral" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Location Tracking</h3>
            <p className="text-gray-600">Keep track of every destination and activity location to optimize your travel routes.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Compass className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drag & Drop Interface</h3>
            <p className="text-gray-600">Easily rearrange activities and days with our intuitive drag-and-drop interface.</p>
          </div>
        </div>
      </div>
      
      {/* My Trips Section */}
      <div id="my-trips" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Trips</h2>
              <p className="text-gray-600">Plan and organize your adventures</p>
            </div>
            <Button onClick={() => {
            setTripToEdit(undefined);
            setIsAddTripDialogOpen(true);
          }}>
              <Plus size={16} className="mr-1" /> New Trip
            </Button>
          </div>
          
          {allTrips.length === 0 ? <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-center max-w-md space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-ocean-light/20 flex items-center justify-center">
                  <Compass className="text-ocean h-8 w-8" />
                </div>
                <h2 className="text-2xl font-semibold">No trips yet</h2>
                <p className="text-gray-600">
                  Create your first trip to start planning your itinerary. Add days, activities,
                  and organize them with our drag-and-drop interface.
                </p>
                <Button onClick={() => {
              setTripToEdit(undefined);
              setIsAddTripDialogOpen(true);
            }} size="lg" className="animate-pulse-once mt-4">
                  <Plus size={16} className="mr-1" /> Create Your First Trip
                </Button>
              </div>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTrips.map(trip => <div key={trip.id} className="group animate-fade-in hover:animate-lift-up">
                  <TripCard trip={trip} onEdit={handleEditTrip} onDelete={handleDeleteTrip} />
                </div>)}
            </div>}
        </div>
      </div>
      
      {/* App Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-ocean">Trip Planner</h3>
              <p className="text-gray-500 text-sm">Plan your adventures with confidence</p>
            </div>
            <div className="flex space-x-6">
              <Button variant="ghost" size="sm">Help</Button>
              <Button variant="ghost" size="sm">Privacy</Button>
              <Button variant="ghost" size="sm">Terms</Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Trip Planner. All rights reserved.
          </div>
        </div>
      </footer>
      
      <AddTripDialog open={isAddTripDialogOpen} onOpenChange={setIsAddTripDialogOpen} onSave={handleSaveTrip} initialData={tripToEdit} />
    </div>;
};
export default HomePage;