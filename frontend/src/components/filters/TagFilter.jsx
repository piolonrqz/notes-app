import React from 'react';
import { TagIcon, XIcon } from 'lucide-react';

/**
 * TagFilter component - Filter notes by tags
 * @param {Object} props - Component props
 * @param {Array} props.tags - Array of available tags
 * @param {String} props.selectedTag - Currently selected tag
 * @param {Function} props.onSelectTag - Tag select handler
 * @param {Function} props.onClearTag - Clear tag handler
 * @returns {JSX.Element}
 */
const TagFilter = ({
  tags = [],
  selectedTag = null,
  onSelectTag,
  onClearTag
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="p-4 mb-6 rounded-lg bg-base-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TagIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Filter by Tags</h3>
        </div>
        
        {selectedTag && (
          <button
            onClick={onClearTag}
            className="btn btn-ghost btn-xs"
          >
            <XIcon className="w-4 h-4 mr-1" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`badge badge-lg hover:badge-primary transition-colors ${
              selectedTag === tag ? 'badge-primary' : 'badge-ghost'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {selectedTag && (
        <p className="mt-2 text-xs text-base-content/60">
          Filtering by: <span className="font-semibold">#{selectedTag}</span>
        </p>
      )}
    </div>
  );
};

/**
 * Extract unique tags from notes array
 * @param {Array} notes - Array of note objects
 * @returns {Array} Array of unique tag strings
 */
export const extractTags = (notes) => {
  if (!notes || notes.length === 0) return [];

  const tagsSet = new Set();
  
  notes.forEach((note) => {
    if (note.tags && Array.isArray(note.tags)) {
      note.tags.forEach((tag) => {
        if (tag && typeof tag === 'string') {
          tagsSet.add(tag.trim().toLowerCase());
        }
      });
    }
  });

  return Array.from(tagsSet).sort();
};

export default TagFilter;

