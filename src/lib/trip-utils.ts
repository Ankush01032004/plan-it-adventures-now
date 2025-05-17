
import { Activity, ActivityType, Day, Trip } from "@/types/trip";

// Generate unique IDs
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Helper to create a new empty trip
export const createNewTrip = (title: string = "New Trip"): Trip => {
  return {
    id: generateId(),
    title,
    days: [],
  };
};

// Helper to create a new day
export const createNewDay = (title: string = "New Day", date?: string): Day => {
  return {
    id: generateId(),
    title,
    date,
    activities: [],
  };
};

// Helper to create a new activity
export const createNewActivity = (
  title: string = "New Activity",
  type: ActivityType = "other",
  time?: string
): Activity => {
  return {
    id: generateId(),
    title,
    type,
    time,
  };
};

// Move an item within an array
export const reorder = <T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Save trip to localStorage
export const saveTrip = (trip: Trip): void => {
  localStorage.setItem(`trip-${trip.id}`, JSON.stringify(trip));
  
  // Save to trips index
  const tripsIndex = getTripIds();
  if (!tripsIndex.includes(trip.id)) {
    tripsIndex.push(trip.id);
    localStorage.setItem('trip-ids', JSON.stringify(tripsIndex));
  }
};

// Load trip from localStorage
export const loadTrip = (tripId: string): Trip | null => {
  const tripJson = localStorage.getItem(`trip-${tripId}`);
  if (!tripJson) return null;
  return JSON.parse(tripJson);
};

// Get all trip IDs
export const getTripIds = (): string[] => {
  const tripsJson = localStorage.getItem('trip-ids');
  if (!tripsJson) return [];
  return JSON.parse(tripsJson);
};

// Get all trips
export const getAllTrips = (): Trip[] => {
  const tripIds = getTripIds();
  return tripIds.map(id => loadTrip(id)).filter(Boolean) as Trip[];
};

// Remove a trip
export const removeTrip = (tripId: string): void => {
  localStorage.removeItem(`trip-${tripId}`);
  
  const tripIds = getTripIds();
  const updatedIds = tripIds.filter(id => id !== tripId);
  localStorage.setItem('trip-ids', JSON.stringify(updatedIds));
};

// Sample trip data
export const SAMPLE_TRIP: Trip = {
  id: "sample-trip",
  title: "Paris 2025",
  startDate: "2025-05-20",
  endDate: "2025-05-25",
  destination: "Paris, France",
  description: "A lovely spring trip to the City of Light",
  coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  days: [
    {
      id: "day-1",
      title: "Day 1: Arrival & Eiffel Tower",
      date: "2025-05-20",
      activities: [
        {
          id: "act-1-1",
          title: "Check-in at Hotel du Louvre",
          type: "hotel",
          time: "14:00",
          location: "Place André Malraux, 75001 Paris"
        },
        {
          id: "act-1-2",
          title: "Eiffel Tower Visit",
          type: "landmark",
          time: "18:00",
          description: "Sunset visit to the Eiffel Tower",
          location: "Champ de Mars, 5 Av. Anatole France, 75007 Paris"
        },
        {
          id: "act-1-3",
          title: "Dinner at Le Jules Verne",
          type: "food",
          time: "20:30",
          description: "Elegant dinner with a view",
          location: "Eiffel Tower, 2nd floor"
        }
      ]
    },
    {
      id: "day-2",
      title: "Day 2: Museums & Notre-Dame",
      date: "2025-05-21",
      activities: [
        {
          id: "act-2-1",
          title: "Louvre Museum",
          type: "museum",
          time: "10:00",
          description: "Visit the world's largest art museum",
          location: "Rue de Rivoli, 75001 Paris"
        },
        {
          id: "act-2-2",
          title: "Lunch at Café Marly",
          type: "food",
          time: "13:30",
          location: "93 Rue de Rivoli, 75001 Paris"
        },
        {
          id: "act-2-3",
          title: "Notre-Dame Cathedral (Exterior View)",
          type: "landmark",
          time: "15:30",
          description: "See the famous cathedral (under reconstruction)",
          location: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris"
        }
      ]
    },
    {
      id: "day-3",
      title: "Day 3: Montmartre & Shopping",
      date: "2025-05-22",
      activities: [
        {
          id: "act-3-1",
          title: "Sacré-Cœur Basilica",
          type: "landmark",
          time: "10:00",
          location: "35 Rue du Chevalier de la Barre, 75018 Paris"
        },
        {
          id: "act-3-2",
          title: "Shopping at Galeries Lafayette",
          type: "shopping",
          time: "14:00",
          location: "40 Boulevard Haussmann, 75009 Paris"
        }
      ]
    }
  ]
};

export const initializeWithSampleData = () => {
  const existingTrips = getTripIds();
  if (existingTrips.length === 0) {
    saveTrip(SAMPLE_TRIP);
  }
};
