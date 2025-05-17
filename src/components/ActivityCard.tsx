
import React, { useState } from 'react';
import { Activity } from '@/types/trip';
import { Pencil, Trash2, MapPin, Clock, UtensilsCrossed, Landmark, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDraggable } from '@/hooks/useDraggable';

interface ActivityCardProps {
  activity: Activity;
  dayId: string;
  onEdit: (dayId: string, activity: Activity) => void;
  onDelete: (dayId: string, activityId: string) => void;
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  dayId, 
  onEdit, 
  onDelete,
  index
}) => {
  const [showActions, setShowActions] = useState(false);
  
  // Make sure we include dayId in the item being dragged
  const { dragRef, isDragging } = useDraggable({
    type: 'ACTIVITY',
    item: { id: activity.id, dayId, index, ...activity },
  });
  
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'food':
        return <UtensilsCrossed size={20} />;
      case 'museum':
        return <Landmark size={20} />;
      case 'landmark':
        return <Map size={20} />;
      default:
        return null;
    }
  };
  
  return (
    <div 
      ref={dragRef}
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-3 cursor-grab border-l-4 
        ${activity.type === 'food' ? 'border-coral' : ''}
        ${activity.type === 'museum' ? 'border-ocean' : ''}
        ${activity.type === 'landmark' ? 'border-green-500' : ''}
        ${activity.type === 'shopping' ? 'border-purple-500' : ''}
        ${activity.type === 'transport' ? 'border-yellow-500' : ''}
        ${activity.type === 'hotel' ? 'border-indigo-500' : ''}
        ${activity.type === 'other' ? 'border-gray-500' : ''}
        ${isDragging ? 'opacity-50 shadow-lg scale-95' : ''}
        hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="activity-icon">
            {getActivityIcon()}
          </div>
          <div>
            <h4 className="font-semibold">{activity.title}</h4>
            
            <div className="flex flex-wrap gap-3 mt-2">
              {activity.time && (
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                  <Clock size={14} className="mr-1" />
                  {activity.time}
                </div>
              )}
              
              {activity.location && (
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                  <MapPin size={14} className="mr-1" />
                  {activity.location}
                </div>
              )}
            </div>
            
            {activity.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {activity.description}
              </p>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-1 opacity-70">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(dayId, activity);
              }}
            >
              <Pencil size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(dayId, activity.id);
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
