
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
import { useForm, Controller } from 'react-hook-form';
import { Trip } from '@/types/trip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

interface AddTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (trip: Partial<Trip>) => void;
  initialData?: Trip;
}

interface FormData {
  title: string;
  destination?: string;
  description?: string;
  startDate: Date | null;
  endDate: Date | null;
}

const AddTripDialog: React.FC<AddTripDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || '',
      destination: initialData?.destination || '',
      description: initialData?.description || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : null,
      endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
    }
  });
  
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          title: initialData.title,
          destination: initialData.destination || '',
          description: initialData.description || '',
          startDate: initialData.startDate ? new Date(initialData.startDate) : null,
          endDate: initialData.endDate ? new Date(initialData.endDate) : null,
        });
      } else {
        reset({
          title: '',
          destination: '',
          description: '',
          startDate: null,
          endDate: null,
        });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: FormData) => {
    onSave({
      ...initialData,
      title: data.title,
      destination: data.destination,
      description: data.description,
      startDate: data.startDate ? format(data.startDate, 'yyyy-MM-dd') : undefined,
      endDate: data.endDate ? format(data.endDate, 'yyyy-MM-dd') : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Trip' : 'Create New Trip'}</DialogTitle>
            <DialogDescription>
              {initialData 
                ? 'Update the details of your trip.' 
                : 'Add the details of your new trip.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Trip Name
              </label>
              <div className="col-span-3">
                <Input
                  id="title"
                  placeholder="E.g., Paris 2025"
                  {...register('title', { required: 'Trip name is required' })}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="destination" className="text-right text-sm font-medium">
                Destination
              </label>
              <Input
                id="destination"
                className="col-span-3"
                placeholder="E.g., Paris, France"
                {...register('destination')}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startDate" className="text-right text-sm font-medium">
                Start Date
              </label>
              <div className="col-span-3">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endDate" className="text-right text-sm font-medium">
                End Date
              </label>
              <div className="col-span-3">
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick an end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => startDate ? date < startDate : false}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium pt-2">
                Description
              </label>
              <Textarea
                id="description"
                className="col-span-3"
                placeholder="Add a description of your trip"
                {...register('description')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? 'Update Trip' : 'Create Trip'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTripDialog;
