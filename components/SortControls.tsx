"use client";

import { SortOption } from '@/hooks/useEventFilters';

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

export default function SortControls({ sortBy, onSortChange, resultCount }: SortControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {resultCount} {resultCount === 1 ? 'event' : 'events'} found
      </p>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
        >
          <option value="date-asc">Date (earliest first)</option>
          <option value="date-desc">Date (latest first)</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
        </select>
      </div>
    </div>
  );
}
