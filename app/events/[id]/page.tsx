"use client";

import { useParams } from 'next/navigation';
import { useEvent } from '@/hooks/useEvent';
import EventDetail from '@/components/EventDetail';

export default function EventPage() {
  const params = useParams();
  const id = params?.id as string;
  const { event, loading, error } = useEvent(id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-zinc-900 border-r-transparent dark:border-zinc-50 dark:border-r-transparent"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="mb-4 text-6xl">😕</div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Event not found
          </h1>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            {error || "The event you're looking for doesn't exist."}
          </p>
          <a
            href="/"
            className="inline-block rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Back to events
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black">
      <EventDetail event={event} />
    </div>
  );
}
