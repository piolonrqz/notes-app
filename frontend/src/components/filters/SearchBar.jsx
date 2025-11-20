import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';

/**
 * SearchBar component - Search input for filtering notes
 * @param {Object} props - Component props
 * @param {String} props.value - Search query value
 * @param {Function} props.onChange - Change handler
 * @param {String} props.placeholder - Placeholder text
 * @param {Boolean} props.disabled - Disabled state
 * @returns {JSX.Element}
 */
const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search notes...',
  disabled = false
}) => {
  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <SearchIcon className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full py-2 pl-10 pr-10 transition-all border-0 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-light/50 focus:shadow-lg"
          style={{ backgroundColor: '#34426C' }}
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute transform -translate-y-1/2 right-3 top-1/2 btn btn-ghost btn-xs btn-circle"
            aria-label="Clear search"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {value && (
        <p className="mt-1 text-xs text-base-content/60">
          Searching for: <span className="font-semibold">"{value}"</span>
        </p>
      )}
    </div>
  );
};

export default SearchBar;

