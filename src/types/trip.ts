
export type ActivityType = 'food' | 'museum' | 'landmark' | 'shopping' | 'transport' | 'hotel' | 'other';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  time?: string;
  description?: string;
  location?: string;
}

export interface Day {
  id: string;
  title: string;
  date?: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
  days: Day[];
  description?: string;
  coverImage?: string;
}
