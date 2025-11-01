"use client";

import { Event } from '@/lib/types';
import EventCard from './EventCard';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  error?: string | null;
}

export default function EventList({ events, loading, error }: EventListProps) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zinc-900 border-r-transparent dark:border-zinc-50 dark:border-r-transparent"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Failed to load events
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">📅</div>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            No events found
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Check back later for upcoming events
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
