"use client";

import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';

export function useEvent(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${id}`);

      if (response.status === 404) {
        setError('Event not found');
        setEvent(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      const data = await response.json();
      setEvent(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  return { event, loading, error, refetch: fetchEvent };
}
