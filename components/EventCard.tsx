"use client";

import { Event } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getLocationDisplay = () => {
    if (event.location.type === 'virtual') {
      return 'Virtual Event';
    }
    if (event.location.type === 'hybrid') {
      return `${event.location.city}, ${event.location.state} + Virtual`;
    }
    return `${event.location.city}, ${event.location.state}`;
  };

  const getPlatformColor = () => {
    const colors = {
      meetup: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      facebook: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      website: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    };
    return colors[event.platform] || colors.other;
  };

  return (
    <Link href={`/events/${event.id}`}>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        {event.imageUrl && (
          <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getPlatformColor()}`}>
              {event.platform}
            </span>
            {event.price.isFree && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                Free
              </span>
            )}
          </div>

          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {event.title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {event.description}
          </p>

          <div className="mt-auto space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(event.dates.start)} at {formatTime(event.dates.start)}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{getLocationDisplay()}</span>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {event.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  +{event.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
