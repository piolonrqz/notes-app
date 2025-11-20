import React from 'react';
import { ArrowUpDown } from 'lucide-react';

/**
 * SortDropdown component - Dropdown for sorting notes
 * @param {Object} props - Component props
 * @param {String} props.value - Current sort value
 * @param {Function} props.onChange - Change handler
 * @param {Boolean} props.disabled - Disabled state
 * @returns {JSX.Element}
 */
const SortDropdown = ({ value = 'newest', onChange, disabled = false }) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'updated', label: 'Recently Updated' }
  ];

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text flex items-center gap-1">
          <ArrowUpDown className="w-4 h-4" />
          Sort By
        </span>
      </label>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="select select-bordered w-full"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;

