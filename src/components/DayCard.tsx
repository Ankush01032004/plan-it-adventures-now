
import React, { useState } from 'react';
import { Day, Activity } from '@/types/trip';
import { Button } from '@/components/ui/button';
import ActivityCard from '@/components/ActivityCard';
import { Plus, CalendarIcon, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useDraggable } from '@/hooks/useDraggable';
import { useDroppable } from '@/hooks/useDroppable';

interface DayCardProps {
  day: Day;
  onAddActivity: (dayId: string) => void;
  onEditActivity: (dayId: string, activity: Activity) => void;
  onDeleteActivity: (dayId: string, activityId: string) => void;
  onEditDay: (day: Day) => void;
  onDeleteDay: (dayId: string) => void;
  index: number;
}

const DayCard: React.FC<DayCardProps> = ({ 
  day, 
  onAddActivity, 
  onEditActivity, 
  onDeleteActivity,
  onEditDay,
  onDeleteDay,
  index
}) => {
  const [showActions, setShowActions] = useState(false);
  
  const { dragRef, isDragging } = useDraggable({
    type: 'DAY',
    item: { id: day.id, index },
  });
  
  const { dropRef, isOver } = useDroppable({
    accept: 'ACTIVITY',
    dayId: day.id,
  });
  
  return (
    <div 
      ref={dragRef}
      className={`flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl shadow-md 
        ${isDragging ? 'dragging' : ''}
        hover:shadow-lg transition-all duration-300`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{day.title}</h3>
          {day.date && (
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon size={14} className="mr-1" />
              {format(new Date(day.date), 'EEEE, MMMM d')}
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEditDay(day)}
            >
              <Pencil size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700" 
              onClick={() => onDeleteDay(day.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
      
      <div 
        ref={dropRef}
        className={`min-h-[200px] ${isOver ? 'drag-over' : ''}`}
      >
        {day.activities.map((activity, actIndex) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            dayId={day.id}
            onEdit={onEditActivity}
            onDelete={onDeleteActivity}
            index={actIndex}
          />
        ))}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 border-dashed border-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50"
          onClick={() => onAddActivity(day.id)}
        >
          <Plus size={16} className="mr-1" /> Add Activity
        </Button>
      </div>
    </div>
  );
};

export default DayCard;
