"use client";

import { useEvents } from '@/hooks/useEvents';
import EventList from '@/components/EventList';

export default function Home() {
  const { events, loading, error } = useEvents();
  const sortedEvents = events.sort((a, b) =>
    new Date(a.dates.start).getTime() - new Date(b.dates.start).getTime()
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="mb-3 text-4xl font-bold text-zinc-900 dark:text-zinc-50 md:text-5xl">
            Event Scheduler
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            All your events, everywhere, in one beautiful place
          </p>
        </header>

        <main>
          <EventList events={sortedEvents} loading={loading} error={error} />
        </main>
      </div>
    </div>
  );
}
