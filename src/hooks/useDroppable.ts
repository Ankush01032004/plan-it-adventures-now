
import { useRef, useEffect, useState } from 'react';

interface DroppableOptions {
  accept: string;
  dayId?: string;
  onDrop?: (item: any) => void;
}

export const useDroppable = (options: DroppableOptions) => {
  const { accept, dayId, onDrop } = options;
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isOver, setIsOver] = useState(false);
  
  useEffect(() => {
    const element = dropRef.current;
    if (!element) return;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
      
      if (!isOver) {
        setIsOver(true);
        element.classList.add('bg-opacity-10', 'bg-blue-200', 'border-dashed', 'border-2', 'border-blue-400');
      }
    };
    
    const handleDragLeave = (e: DragEvent) => {
      // Only consider it a leave if we're moving outside the element
      if (e.target === element && isOver) {
        setIsOver(false);
        element.classList.remove('bg-opacity-10', 'bg-blue-200', 'border-dashed', 'border-2', 'border-blue-400');
      }
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsOver(false);
      element.classList.remove('bg-opacity-10', 'bg-blue-200', 'border-dashed', 'border-2', 'border-blue-400');
      
      if (e.dataTransfer) {
        try {
          const data = JSON.parse(e.dataTransfer.getData('application/json'));
          
          // Only accept drops of the specified type
          if (data.type === accept) {
            // Dispatch custom event with the data
            const dropEvent = new CustomEvent('item-dropped', {
              bubbles: true,
              detail: {
                type: data.type,
                item: data.item,
                dayId: dayId
              }
            });
            
            element.dispatchEvent(dropEvent);
            
            // Call the onDrop callback if provided
            if (onDrop) {
              onDrop(data.item);
            }
          }
        } catch (err) {
          console.error('Error parsing drop data:', err);
        }
      }
    };
    
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);
    
    return () => {
      if (element) {
        element.removeEventListener('dragover', handleDragOver);
        element.removeEventListener('dragleave', handleDragLeave);
        element.removeEventListener('drop', handleDrop);
      }
    };
  }, [accept, isOver, dayId, onDrop]);
  
  return { dropRef, isOver };
};
