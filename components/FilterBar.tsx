"use client";

import { LocationType } from '@/lib/types';

interface FilterBarProps {
  locationType?: LocationType;
  onLocationTypeChange: (type?: LocationType) => void;
  city?: string;
  onCityChange: (city?: string) => void;
  availableCities: string[];
  category?: string;
  onCategoryChange: (category?: string) => void;
  availableCategories: string[];
  isFreeOnly: boolean;
  onFreeOnlyChange: (isFree: boolean) => void;
  dateRange: { start?: Date; end?: Date };
  onDateRangeChange: (range: { start?: Date; end?: Date }) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function FilterBar({
  locationType,
  onLocationTypeChange,
  city,
  onCityChange,
  availableCities,
  category,
  onCategoryChange,
  availableCategories,
  isFreeOnly,
  onFreeOnlyChange,
  dateRange,
  onDateRangeChange,
  onReset,
  hasActiveFilters,
}: FilterBarProps) {
  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const parseDateFromInput = (value: string) => {
    if (!value) return undefined;
    return new Date(value);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Location Type
          </label>
          <select
            value={locationType || ''}
            onChange={(e) => onLocationTypeChange(e.target.value as LocationType || undefined)}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            <option value="">All types</option>
            <option value="physical">Physical</option>
            <option value="virtual">Virtual</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            City
          </label>
          <select
            value={city || ''}
            onChange={(e) => onCityChange(e.target.value || undefined)}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            <option value="">All cities</option>
            {availableCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Category
          </label>
          <select
            value={category || ''}
            onChange={(e) => onCategoryChange(e.target.value || undefined)}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            <option value="">All categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Start Date
          </label>
          <input
            type="date"
            value={formatDateForInput(dateRange.start)}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: parseDateFromInput(e.target.value) })}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            End Date
          </label>
          <input
            type="date"
            value={formatDateForInput(dateRange.end)}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: parseDateFromInput(e.target.value) })}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
            <input
              type="checkbox"
              checked={isFreeOnly}
              onChange={(e) => onFreeOnlyChange(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Free events only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
