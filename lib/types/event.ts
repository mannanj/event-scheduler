export type EventPlatform = 'meetup' | 'facebook' | 'website' | 'other';

export type LocationType = 'physical' | 'virtual' | 'hybrid';

export interface Location {
  type: LocationType;
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  url?: string;
}

export interface Organizer {
  name: string;
  email?: string;
  phone?: string;
  url?: string;
}

export interface EventDates {
  start: string;
  end?: string;
  timezone?: string;
}

export interface Price {
  isFree: boolean;
  amount?: number;
  currency?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  dates: EventDates;
  location: Location;
  organizer: Organizer;
  price: Price;
  tags?: string[];
  categories?: string[];
  platform: EventPlatform;
  sourceUrl: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
