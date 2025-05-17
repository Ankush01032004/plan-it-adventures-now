import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '@/context/TripContext';
import TripHeader from '@/components/TripHeader';
import DayCard from '@/components/DayCard';
import { Button } from '@/components/ui/button';
import { Day, Activity } from '@/types/trip';
import { Plus } from 'lucide-react';
import AddDayDialog from '@/components/AddDayDialog';
import AddActivityDialog from '@/components/AddActivityDialog';
import { createNewDay, createNewActivity, reorder } from '@/lib/trip-utils';
import { toast } from '@/components/ui/use-toast';

const TripDetailPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { currentTrip, loadTripById, updateTrip } = useTrip();
  
  const [isAddDayDialogOpen, setIsAddDayDialogOpen] = useState(false);
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [dayToEdit, setDayToEdit] = useState<Day | undefined>(undefined);
  
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
  
  const handleAddDay = () => {
    setDayToEdit(undefined);
    setIsAddDayDialogOpen(true);
  };
  
  const handleEditDay = (day: Day) => {
    setDayToEdit(day);
    setIsAddDayDialogOpen(true);
  };
  
  const handleSaveDay = (dayData: Partial<Day>) => {
    if (!currentTrip) return;
    
    let updatedTrip = { ...currentTrip };
    
    if (dayToEdit) {
      // Update existing day
      updatedTrip = {
        ...currentTrip,
        days: currentTrip.days.map(day => 
          day.id === dayToEdit.id 
            ? { ...day, ...dayData, id: day.id } 
            : day
        ),
      };
    } else {
      // Create new day
      const newDay = createNewDay(
        dayData.title || `Day ${currentTrip.days.length + 1}`, 
        dayData.date
      );
      updatedTrip = {
        ...currentTrip,
        days: [...currentTrip.days, newDay],
      };
    }
    
    updateTrip(updatedTrip);
  };
  
  const handleDeleteDay = (dayId: string) => {
    if (!currentTrip) return;
    
    if (confirm('Are you sure you want to delete this day?')) {
      const updatedTrip = {
        ...currentTrip,
        days: currentTrip.days.filter(day => day.id !== dayId),
      };
      
      updateTrip(updatedTrip);
    }
  };
  
  const handleAddActivity = (dayId: string) => {
    setSelectedDayId(dayId);
    setSelectedActivity(undefined);
    setIsAddActivityDialogOpen(true);
  };
  
  const handleEditActivity = (dayId: string, activity: Activity) => {
    setSelectedDayId(dayId);
    setSelectedActivity(activity);
    setIsAddActivityDialogOpen(true);
  };
  
  const handleSaveActivity = (dayId: string, activityData: Partial<Activity>) => {
    if (!currentTrip) return;
    
    let updatedTrip = { ...currentTrip };
    
    if (selectedActivity) {
      // Update existing activity
      updatedTrip = {
        ...currentTrip,
        days: currentTrip.days.map(day => 
          day.id === dayId 
            ? {
                ...day,
                activities: day.activities.map(act => 
                  act.id === selectedActivity.id 
                    ? { ...act, ...activityData, id: act.id } 
                    : act
                ),
              } 
            : day
        ),
      };
    } else {
      // Create new activity
      const newActivity = createNewActivity(
        activityData.title || 'New Activity',
        activityData.type || 'other',
        activityData.time
      );
      
      // Add other fields if provided
      if (activityData.description) newActivity.description = activityData.description;
      if (activityData.location) newActivity.location = activityData.location;
      
      updatedTrip = {
        ...currentTrip,
        days: currentTrip.days.map(day => 
          day.id === dayId 
            ? {
                ...day,
                activities: [...day.activities, newActivity],
              } 
            : day
        ),
      };
    }
    
    updateTrip(updatedTrip);
  };
  
  const handleDeleteActivity = (dayId: string, activityId: string) => {
    if (!currentTrip) return;
    
    const updatedTrip = {
      ...currentTrip,
      days: currentTrip.days.map(day => 
        day.id === dayId 
          ? {
              ...day,
              activities: day.activities.filter(act => act.id !== activityId),
            } 
          : day
      ),
    };
    
    updateTrip(updatedTrip);
  };
  
  // Fix the drag and drop for days
  const handleDayDrop = (e: CustomEvent) => {
    if (!currentTrip) return;
    
    const { item } = e.detail;
    
    if (item && typeof item.index === 'number') {
      // Instead of using element property which doesn't exist, use direct index comparison
      const dropIndex = e.target ? Array.from(document.querySelectorAll('.day-card')).indexOf(e.target as Element) : -1;
      
      if (dropIndex !== -1 && dropIndex !== item.index) {
        const updatedDays = reorder(currentTrip.days, item.index, dropIndex);
        
        updateTrip({
          ...currentTrip,
          days: updatedDays,
        });
      }
    }
  };
  
  // Handle drag and drop for activities
  const handleActivityDrop = (e: any) => {
    if (!currentTrip) return;
    
    const { type, item, dayId: targetDayId } = e.detail;
    
    if (type === 'ACTIVITY' && item) {
      const sourceDayId = item.dayId;
      
      // Find source and target days
      const sourceDay = currentTrip.days.find(day => day.id === sourceDayId);
      const targetDay = currentTrip.days.find(day => day.id === targetDayId);
      
      if (sourceDay && targetDay) {
        // Copy the activity to be moved
        const activityToMove = sourceDay.activities.find(act => act.id === item.id);
        
        if (activityToMove) {
          // Create updated trip
          const updatedTrip = {
            ...currentTrip,
            days: currentTrip.days.map(day => {
              // Remove from source day
              if (day.id === sourceDayId) {
                return {
                  ...day,
                  activities: day.activities.filter(act => act.id !== item.id),
                };
              }
              
              // Add to target day
              if (day.id === targetDayId) {
                return {
                  ...day,
                  activities: [...day.activities, activityToMove],
                };
              }
              
              return day;
            }),
          };
          
          updateTrip(updatedTrip);
          
          toast({
            title: "Activity moved",
            description: `"${activityToMove.title}" moved to ${targetDay.title}`,
          });
        }
      }
    }
  };
  
  // Use effect for setting up global event listeners for drag and drop
  useEffect(() => {
    const handleItemDropped = (e: any) => {
      const detail = e.detail;
      
      if (detail.type === 'DAY') {
        handleDayDrop(e);
      } else if (detail.type === 'ACTIVITY') {
        handleActivityDrop(e);
      }
    };
    
    document.addEventListener('item-dropped', handleItemDropped as EventListener);
    
    return () => {
      document.removeEventListener('item-dropped', handleItemDropped as EventListener);
    };
  }, [currentTrip]);

  return (
    <div className="container mx-auto px-4 py-8">
      <TripHeader trip={currentTrip} />

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Itinerary</h2>
        <Button onClick={handleAddDay}>
          <Plus size={16} className="mr-1" /> Add Day
        </Button>
      </div>

      {currentTrip.days.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No days in itinerary yet</h3>
          <p className="text-gray-600 mb-4">
            Start building your itinerary by adding days and activities.
          </p>
          <Button onClick={handleAddDay}>
            <Plus size={16} className="mr-1" /> Add Your First Day
          </Button>
        </div>
      ) : (
        <div className="flex overflow-x-auto pb-6 gap-6 snap-x">
          {currentTrip.days.map((day, index) => (
            <div key={day.id} className="snap-start day-card">
              <DayCard
                day={day}
                onAddActivity={handleAddActivity}
                onEditActivity={handleEditActivity}
                onDeleteActivity={handleDeleteActivity}
                onEditDay={handleEditDay}
                onDeleteDay={handleDeleteDay}
                index={index}
              />
            </div>
          ))}
        </div>
      )}
      
      <AddDayDialog
        open={isAddDayDialogOpen}
        onOpenChange={setIsAddDayDialogOpen}
        onSave={handleSaveDay}
        initialData={dayToEdit}
      />
      
      <AddActivityDialog
        open={isAddActivityDialogOpen}
        onOpenChange={setIsAddActivityDialogOpen}
        onSave={handleSaveActivity}
        dayId={selectedDayId || ''}
        initialData={selectedActivity}
      />
    </div>
  );
};

export default TripDetailPage;
