import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

/**
 * Sort Panel - Two-section sort interface
 * Section 1: What to sort by (Date, Title, etc.)
 * Section 2: Direction (Ascending/Descending)
 */
const SortPanel = ({ sortBy, setSortBy }) => {
  const getSortField = () => {
    if (sortBy === 'newest' || sortBy === 'oldest') return 'date';
    if (sortBy === 'title') return 'title';
    if (sortBy === 'updated') return 'updated';
    return 'date';
  };

  const getSortDirection = () => {
    if (sortBy === 'newest' || sortBy === 'title') return 'desc';
    if (sortBy === 'oldest') return 'asc';
    return 'desc';
  };

  const handleFieldChange = (field) => {
    const currentDirection = getSortDirection();
    
    if (field === 'date') {
      setSortBy(currentDirection === 'desc' ? 'newest' : 'oldest');
    } else if (field === 'title') {
      setSortBy('title');
    } else if (field === 'updated') {
      setSortBy('updated');
    }
  };

  const handleDirectionChange = (direction) => {
    const currentField = getSortField();
    
    if (currentField === 'date') {
      setSortBy(direction === 'desc' ? 'newest' : 'oldest');
    } else if (currentField === 'title') {
      setSortBy('title'); // Title sorting stays the same
    } else if (currentField === 'updated') {
      setSortBy('updated');
    }
  };

  const currentField = getSortField();
  const currentDirection = getSortDirection();

  return (
    <div className="p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
      {/* Sort By Section */}
      <div className="mb-4">
        <p className="mb-3 text-sm font-medium text-white/90">Sort by</p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700/30 transition-colors">
            <input
              type="radio"
              name="sortField"
              value="date"
              checked={currentField === 'date'}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="radio radio-sm radio-primary"
            />
            <span className="text-white/90">Date</span>
          </label>
          
          <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700/30 transition-colors">
            <input
              type="radio"
              name="sortField"
              value="title"
              checked={currentField === 'title'}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="radio radio-sm radio-primary"
            />
            <span className="text-white/90">Title</span>
          </label>

          <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700/30 transition-colors">
            <input
              type="radio"
              name="sortField"
              value="updated"
              checked={currentField === 'updated'}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="radio radio-sm radio-primary"
            />
            <span className="text-white/90">Last Updated</span>
          </label>
        </div>
      </div>

      {/* Direction Section */}
      <div className="pt-4 border-t border-gray-700/50">
        <div className="space-y-2">
          <button
            onClick={() => handleDirectionChange('asc')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              currentDirection === 'asc'
                ? 'bg-brand-light text-white shadow-lg'
                : 'bg-gray-700/30 text-white/70 hover:bg-gray-700/50'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
            <span className="font-medium">Ascending</span>
          </button>
          
          <button
            onClick={() => handleDirectionChange('desc')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              currentDirection === 'desc'
                ? 'bg-brand-light text-white shadow-lg'
                : 'bg-gray-700/30 text-white/70 hover:bg-gray-700/50'
            }`}
          >
            <ArrowDown className="w-4 h-4" />
            <span className="font-medium">Descending</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortPanel;

