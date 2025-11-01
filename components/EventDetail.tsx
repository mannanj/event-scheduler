"use client";

import { Event } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface EventDetailProps {
  event: Event;
}

export default function EventDetail({ event }: EventDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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
    const { location } = event;
    if (location.type === 'virtual') {
      return (
        <div>
          <p className="font-medium">Virtual Event</p>
          {location.url && (
            <a
              href={location.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Join online
            </a>
          )}
        </div>
      );
    }

    return (
      <div>
        <p className="font-medium">
          {location.type === 'hybrid' && 'In-person + Virtual'}
          {location.type === 'physical' && 'In-person Event'}
        </p>
        {location.venue && <p>{location.venue}</p>}
        {location.address && <p className="text-sm">{location.address}</p>}
        <p className="text-sm">
          {location.city}, {location.state} {location.country}
        </p>
        {location.type === 'hybrid' && location.url && (
          <a
            href={location.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Or join online
          </a>
        )}
      </div>
    );
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
    <div className="mx-auto max-w-4xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to events
      </Link>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {event.imageUrl && (
          <div className="relative h-96 w-full bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${getPlatformColor()}`}>
              {event.platform}
            </span>
            {event.price.isFree ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                Free
              </span>
            ) : (
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {event.price.currency} {event.price.amount}
              </span>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
            {event.title}
          </h1>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <svg className="h-6 w-6 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Date & Time</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {formatDate(event.dates.start)}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formatTime(event.dates.start)}
                  {event.dates.end && ` - ${formatTime(event.dates.end)}`}
                  {event.dates.timezone && ` (${event.dates.timezone})`}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <svg className="h-6 w-6 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Location</p>
                <div className="text-zinc-900 dark:text-zinc-50">
                  {getLocationDisplay()}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              About this event
            </h2>
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {event.description}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Organizer
            </h2>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-xl dark:bg-zinc-800">
                👤
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {event.organizer.name}
                </p>
                {event.organizer.email && (
                  <a
                    href={`mailto:${event.organizer.email}`}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {event.organizer.email}
                  </a>
                )}
                {event.organizer.url && (
                  <a
                    href={event.organizer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>
          </div>

          {event.categories && event.categories.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.tags && event.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-zinc-900 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              View on {event.platform}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
