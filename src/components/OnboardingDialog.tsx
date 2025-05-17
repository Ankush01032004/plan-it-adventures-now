
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const OnboardingDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, []);
  
  const closeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setOpen(false);
  };
  
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      closeOnboarding();
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Welcome to Trip Planner!</DialogTitle>
              <DialogDescription>
                Let's build your perfect trip itinerary together.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Getting Started</h3>
                <p className="text-gray-700 mb-4">
                  Trip Planner helps you create detailed itineraries for your travels.
                  Start by creating a trip with dates and destination.
                </p>
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=500&q=80" 
                    alt="Travel planning" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Building Your Itinerary</DialogTitle>
              <DialogDescription>
                Adding days and activities to your trip
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ocean text-white flex items-center justify-center font-bold">1</div>
                  <p>Create days for your trip</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ocean text-white flex items-center justify-center font-bold">2</div>
                  <p>Add activities to each day</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ocean text-white flex items-center justify-center font-bold">3</div>
                  <p>Fill in details like times, locations, and notes</p>
                </div>
                <div className="border rounded-lg p-3 bg-gray-50">
                  <p className="text-sm text-gray-700">
                    <strong>Pro tip:</strong> Use activity types (food, museum, etc.) to color-code and organize your itinerary!
                  </p>
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Drag and Drop Features</DialogTitle>
              <DialogDescription>
                Easily reorganize your trip plans
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">How to Drag & Drop:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Click and hold any day card to reorder days</li>
                  <li>Drag activities between days to reschedule</li>
                  <li>Reorder activities within a day by dragging them</li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="animate-pulse-once border-2 border-dashed border-primary rounded-md p-3 text-center">
                  <p className="text-primary font-medium">Try dragging items to reorganize your plans!</p>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px]">
        {renderStepContent()}
        <DialogFooter>
          <div className="flex w-full justify-between">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <Button 
                  key={i}
                  variant={i === step ? "default" : "outline"}
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setStep(i)}
                >
                  {i}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {step < 3 ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={closeOnboarding} className="bg-green-600 hover:bg-green-700">
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
