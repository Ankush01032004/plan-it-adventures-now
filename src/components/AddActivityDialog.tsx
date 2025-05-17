
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
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { Activity, ActivityType } from '@/types/trip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, MapPin } from 'lucide-react';

interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dayId: string, activity: Partial<Activity>) => void;
  dayId: string;
  initialData?: Activity;
}

interface FormData {
  title: string;
  type: ActivityType;
  time?: string;
  description?: string;
  location?: string;
}

const activityTypes: { value: ActivityType; label: string }[] = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'museum', label: 'Museum' },
  { value: 'landmark', label: 'Landmark' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'transport', label: 'Transportation' },
  { value: 'hotel', label: 'Accommodation' },
  { value: 'other', label: 'Other' },
];

const AddActivityDialog: React.FC<AddActivityDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  dayId,
  initialData,
}) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || '',
      type: initialData?.type || 'other',
      time: initialData?.time || '',
      description: initialData?.description || '',
      location: initialData?.location || '',
    }
  });
  
  React.useEffect(() => {
    if (open && initialData) {
      reset({
        title: initialData.title,
        type: initialData.type,
        time: initialData.time || '',
        description: initialData.description || '',
        location: initialData.location || '',
      });
    } else if (open) {
      reset({
        title: '',
        type: 'other',
        time: '',
        description: '',
        location: '',
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: FormData) => {
    onSave(dayId, {
      ...initialData,
      ...data,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
            <DialogDescription>
              Add details about your activity.
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
                placeholder="E.g., Visit Eiffel Tower"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="col-span-4 text-right text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Type
              </label>
              <div className="col-span-3">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="time" className="text-right text-sm font-medium">
                Time
              </label>
              <div className="col-span-3 relative">
                <Input
                  id="time"
                  placeholder="E.g., 14:00"
                  className="pl-9"
                  {...register('time')}
                />
                <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="location" className="text-right text-sm font-medium">
                Location
              </label>
              <div className="col-span-3 relative">
                <Input
                  id="location"
                  placeholder="E.g., Champ de Mars, Paris"
                  className="pl-9"
                  {...register('location')}
                />
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium pt-2">
                Notes
              </label>
              <Textarea
                id="description"
                className="col-span-3"
                placeholder="Add any additional notes or details"
                {...register('description')}
              />
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

export default AddActivityDialog;
