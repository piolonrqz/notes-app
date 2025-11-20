import React from 'react';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import { FilterIcon, XIcon } from 'lucide-react';

/**
 * FilterPanel component - Complete filter controls panel
 * @param {Object} props - Component props
 * @param {String} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Search change handler
 * @param {String} props.sortBy - Current sort option
 * @param {Function} props.onSortChange - Sort change handler
 * @param {String} props.filterBy - Current filter option
 * @param {Function} props.onFilterChange - Filter change handler
 * @param {Function} props.onClearFilters - Clear all filters handler
 * @param {Number} props.resultsCount - Number of filtered results
 * @returns {JSX.Element}
 */
const FilterPanel = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  onClearFilters,
  resultsCount = 0
}) => {
  const hasActiveFilters = searchQuery || sortBy !== 'newest' || filterBy !== 'all';

  return (
    <div className="p-4 mb-6 rounded-lg shadow-sm bg-base-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Filters</h3>
          {resultsCount > 0 && (
            <span className="badge badge-primary">{resultsCount}</span>
          )}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="btn btn-ghost btn-sm"
          >
            <XIcon className="w-4 h-4 mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="md:col-span-2">
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or content..."
          />
        </div>

        {/* Sort */}
        <div>
          <SortDropdown
            value={sortBy}
            onChange={onSortChange}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-4">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${filterBy === 'all' ? 'tab-active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All Notes
          </button>
          <button
            className={`tab ${filterBy === 'active' ? 'tab-active' : ''}`}
            onClick={() => onFilterChange('active')}
          >
            Active
          </button>
          <button
            className={`tab ${filterBy === 'archived' ? 'tab-active' : ''}`}
            onClick={() => onFilterChange('archived')}
          >
            Archived
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

