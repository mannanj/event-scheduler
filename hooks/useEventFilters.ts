"use client";

import { useState, useMemo } from 'react';
import { Event, LocationType } from '@/lib/types';

export type SortOption = 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc';

export interface FilterState {
  searchQuery: string;
  dateRange: { start?: Date; end?: Date };
  locationType?: LocationType;
  city?: string;
  category?: string;
  isFreeOnly: boolean;
  sortBy: SortOption;
}

export function useEventFilters(events: Event[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    dateRange: {},
    isFreeOnly: false,
    sortBy: 'date-asc',
  });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      dateRange: {},
      isFreeOnly: false,
      sortBy: 'date-asc',
    });
  };

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        event.categories?.some(cat => cat.toLowerCase().includes(query)) ||
        event.organizer.name.toLowerCase().includes(query)
      );
    }

    if (filters.dateRange.start) {
      result = result.filter(event =>
        new Date(event.dates.start) >= filters.dateRange.start!
      );
    }

    if (filters.dateRange.end) {
      result = result.filter(event =>
        new Date(event.dates.start) <= filters.dateRange.end!
      );
    }

    if (filters.locationType) {
      result = result.filter(event =>
        event.location.type === filters.locationType
      );
    }

    if (filters.city) {
      result = result.filter(event =>
        event.location.city?.toLowerCase() === filters.city!.toLowerCase()
      );
    }

    if (filters.category) {
      result = result.filter(event =>
        event.categories?.some(cat => cat.toLowerCase() === filters.category!.toLowerCase())
      );
    }

    if (filters.isFreeOnly) {
      result = result.filter(event => event.price.isFree);
    }

    switch (filters.sortBy) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.dates.start).getTime() - new Date(b.dates.start).getTime());
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.dates.start).getTime() - new Date(a.dates.start).getTime());
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [events, filters]);

  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    events.forEach(event => {
      if (event.location.city) {
        cities.add(event.location.city);
      }
    });
    return Array.from(cities).sort();
  }, [events]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    events.forEach(event => {
      event.categories?.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [events]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredAndSortedEvents,
    availableCities,
    availableCategories,
    hasActiveFilters: filters.searchQuery !== '' ||
                      filters.dateRange.start !== undefined ||
                      filters.dateRange.end !== undefined ||
                      filters.locationType !== undefined ||
                      filters.city !== undefined ||
                      filters.category !== undefined ||
                      filters.isFreeOnly,
  };
}
