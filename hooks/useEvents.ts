"use client";

import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const sortEventsByDate = (events: Event[], ascending = true) => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.dates.start).getTime();
      const dateB = new Date(b.dates.start).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  };

  const filterEventsByDate = (startDate?: Date, endDate?: Date) => {
    if (!startDate && !endDate) return events;

    return events.filter(event => {
      const eventDate = new Date(event.dates.start);
      if (startDate && eventDate < startDate) return false;
      if (endDate && eventDate > endDate) return false;
      return true;
    });
  };

  const filterEventsByLocation = (city?: string, locationType?: string) => {
    return events.filter(event => {
      if (city && event.location.city !== city) return false;
      if (locationType && event.location.type !== locationType) return false;
      return true;
    });
  };

  const searchEvents = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return events.filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      event.categories?.some(cat => cat.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    sortEventsByDate,
    filterEventsByDate,
    filterEventsByLocation,
    searchEvents,
  };
}
