import React, { useState } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import SortPanel from './SortPanel';

/**
 * Modern filter bar with Bento aesthetic
 */
const BentoFilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  filterBy,
  onFilterChange,
  resultsCount 
}) => {
  const [showSortPanel, setShowSortPanel] = useState(false);

  return (
    <div className="mb-8">
      {/* Search & Actions Row */}
      <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-3 pl-12 pr-4 transition-all border-0 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-light/50 focus:shadow-lg"
            style={{ backgroundColor: '#34426C' }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute p-1 transform -translate-y-1/2 right-3 top-1/2 hover:bg-base-300 rounded-lg transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => setShowSortPanel(!showSortPanel)}
            className="px-4 py-3 border-0 rounded-2xl text-white hover:opacity-90 focus:ring-2 focus:ring-brand-light/50 min-w-[180px] focus:shadow-lg transition-all flex items-center justify-between"
            style={{ backgroundColor: '#34426C' }}
          >
            <span>Sort & Filter</span>
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Sort Panel Dropdown */}
          {showSortPanel && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowSortPanel(false)}
              ></div>
              <div className="absolute right-0 z-20 mt-2 w-64">
                <SortPanel sortBy={sortBy} setSortBy={onSortChange} />
              </div>
            </>
          )}
        </div>

        {/* Results Count Badge */}
        {resultsCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand-lighter/20 border border-brand-light/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-brand-lighter" />
            <span className="font-medium text-white">
              {resultsCount} {resultsCount === 1 ? 'note' : 'notes'}
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            filterBy === 'all'
              ? 'bg-gradient-to-r from-brand-medium to-brand-light text-white shadow-lg shadow-brand-light/30'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 backdrop-blur-sm'
          }`}
        >
          All Notes
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            filterBy === 'active'
              ? 'bg-gradient-to-r from-brand-medium to-brand-light text-white shadow-lg shadow-brand-light/30'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 backdrop-blur-sm'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => onFilterChange('archived')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            filterBy === 'archived'
              ? 'bg-gradient-to-r from-brand-medium to-brand-light text-white shadow-lg shadow-brand-light/30'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 backdrop-blur-sm'
          }`}
        >
          Archived
        </button>
        <button
          onClick={() => onFilterChange('pending')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            filterBy === 'pending'
              ? 'bg-gradient-to-r from-brand-medium to-brand-light text-white shadow-lg shadow-brand-light/30'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 backdrop-blur-sm'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => onFilterChange('confirmed')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            filterBy === 'confirmed'
              ? 'bg-gradient-to-r from-brand-medium to-brand-light text-white shadow-lg shadow-brand-light/30'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 backdrop-blur-sm'
          }`}
        >
          Confirmed
        </button>
      </div>
    </div>
  );
};

export default BentoFilterBar;

