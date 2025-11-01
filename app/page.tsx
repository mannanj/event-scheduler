"use client";

import { useEvents } from '@/hooks/useEvents';
import { useEventFilters } from '@/hooks/useEventFilters';
import EventList from '@/components/EventList';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import SortControls from '@/components/SortControls';

export default function Home() {
  const { events, loading, error } = useEvents();
  const {
    filters,
    updateFilter,
    resetFilters,
    filteredAndSortedEvents,
    availableCities,
    availableCategories,
    hasActiveFilters,
  } = useEventFilters(events);

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

        <main className="space-y-6">
          <SearchBar
            value={filters.searchQuery}
            onChange={(value) => updateFilter('searchQuery', value)}
            placeholder="Search events by title, description, tags, or organizer..."
          />

          <FilterBar
            locationType={filters.locationType}
            onLocationTypeChange={(type) => updateFilter('locationType', type)}
            city={filters.city}
            onCityChange={(city) => updateFilter('city', city)}
            availableCities={availableCities}
            category={filters.category}
            onCategoryChange={(category) => updateFilter('category', category)}
            availableCategories={availableCategories}
            isFreeOnly={filters.isFreeOnly}
            onFreeOnlyChange={(isFree) => updateFilter('isFreeOnly', isFree)}
            dateRange={filters.dateRange}
            onDateRangeChange={(range) => updateFilter('dateRange', range)}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <SortControls
            sortBy={filters.sortBy}
            onSortChange={(sort) => updateFilter('sortBy', sort)}
            resultCount={filteredAndSortedEvents.length}
          />

          <EventList events={filteredAndSortedEvents} loading={loading} error={error} />
        </main>
      </div>
    </div>
  );
}
