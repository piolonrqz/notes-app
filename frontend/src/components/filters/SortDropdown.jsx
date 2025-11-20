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
    { value: 'newest', label: 'Date - Newest First' },
    { value: 'oldest', label: 'Date - Oldest First' },
    { value: 'title', label: 'Title - Ascending' },
    { value: 'updated', label: 'Recently Updated' }
  ];

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">
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

