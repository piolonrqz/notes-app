import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for search and filter functionality
 * @param {Array} notes - Array of notes to search/filter
 * @returns {Object} Search state and methods
 */
export const useSearch = (notes = []) => {
  // Accept either an array or an object that contains an array (defensive).
  const safeNotes = Array.isArray(notes)
    ? notes
    : (notes && Array.isArray(notes.notes) ? notes.notes : []);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title
  const [filterBy, setFilterBy] = useState('all'); // all, archived, active, pending, confirmed

  /**
   * Filter and search notes based on query
   */
  const filteredNotes = useMemo(() => {
    if (!safeNotes || safeNotes.length === 0) return [];

    let result = [...safeNotes];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(note => 
        note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)
      );
    }

    // Apply filter
    if (filterBy === 'archived') {
      result = result.filter(note => note.archived === true);
    } else if (filterBy === 'active') {
      result = result.filter(note => !note.archived);
    } else if (filterBy === 'pending') {
      result = result.filter(note => note.status?.toLowerCase() === 'pending');
    } else if (filterBy === 'confirmed') {
      result = result.filter(note => note.status?.toLowerCase() === 'confirmed');
    } else if (filterBy === 'failed') {
      result = result.filter(note => note.status?.toLowerCase() === 'failed');
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        default:
          return 0;
      }
    });

    return result;
  }, [safeNotes, searchQuery, sortBy, filterBy]);

  /**
   * Update search query
   */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  /**
   * Update sort option
   */
  const handleSort = useCallback((option) => {
    setSortBy(option);
  }, []);

  /**
   * Update filter option
   */
  const handleFilter = useCallback((option) => {
    setFilterBy(option);
  }, []);

  /**
   * Clear all filters and search
   */
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSortBy('newest');
    setFilterBy('all');
  }, []);

  /**
   * Search by tags (if notes have tags)
   */
  const searchByTag = useCallback((tag) => {
    // This will be used by TagFilter component
    setSearchQuery(tag);
  }, []);

  return {
    searchQuery,
    sortBy,
    filterBy,
    filteredNotes,
    handleSearch,
    handleSort,
    handleFilter,
    clearFilters,
    searchByTag,
    setSearchQuery,
    setSortBy,
    setFilterBy
  };
};

