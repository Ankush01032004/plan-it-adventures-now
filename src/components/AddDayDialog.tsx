
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Day } from '@/types/trip';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddDayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (day: Partial<Day>) => void;
  initialData?: Day;
}

interface FormData {
  title: string;
  date: Date | null;
}

const AddDayDialog: React.FC<AddDayDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  initialData 
}) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || '',
      date: initialData?.date ? new Date(initialData.date) : null,
    }
  });
  
  const selectedDate = watch('date');
  
  React.useEffect(() => {
    if (open && initialData) {
      reset({
        title: initialData.title,
        date: initialData.date ? new Date(initialData.date) : null,
      });
    } else if (open) {
      reset({
        title: '',
        date: null,
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: FormData) => {
    onSave({
      ...initialData,
      title: data.title,
      date: data.date ? format(data.date, 'yyyy-MM-dd') : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Day' : 'Add New Day'}</DialogTitle>
            <DialogDescription>
              Create a new day for your trip itinerary.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                className="col-span-3"
                placeholder="E.g., Day 1: Arrival"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="col-span-4 text-right text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right text-sm font-medium">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={(date) => setValue('date', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDayDialog;
