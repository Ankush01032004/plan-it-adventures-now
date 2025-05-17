
import { useRef, useEffect, useState } from 'react';

interface DraggableOptions {
  type: string;
  item: any;
}

export const useDraggable = (options: DraggableOptions) => {
  const { type, item } = options;
  const dragRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;
    
    const handleDragStart = (e: DragEvent) => {
      if (e.dataTransfer) {
        e.dataTransfer.setData('application/json', JSON.stringify({
          type,
          item,
        }));
        e.dataTransfer.effectAllowed = 'move';
        
        // Add a small delay before adding the dragging class
        // This allows the drag preview to be captured before styling changes
        setTimeout(() => {
          element.classList.add('dragging');
          setIsDragging(true);
        }, 0);
      }
    };
    
    const handleDragEnd = () => {
      element.classList.remove('dragging');
      setIsDragging(false);
    };
    
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    
    return () => {
      if (element) {
        element.removeAttribute('draggable');
        element.removeEventListener('dragstart', handleDragStart);
        element.removeEventListener('dragend', handleDragEnd);
      }
    };
  }, [type, item]);
  
  return { dragRef, isDragging };
};
