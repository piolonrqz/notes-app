import React from 'react';
import NoteCard from './NoteCard';
import Loading from '../common/Loading';

/**
 * NoteList component - Display notes in list/grid format
 * @param {Object} props - Component props
 * @param {Array} props.notes - Array of note objects
 * @param {Boolean} props.loading - Loading state
 * @param {Function} props.onDelete - Delete handler
 * @param {String} props.emptyMessage - Message to show when no notes
 * @returns {JSX.Element}
 */
const NoteList = ({
  notes = [],
  loading = false,
  onDelete,
  emptyMessage = 'No notes found'
}) => {
  if (loading) {
    return (
      <div className="py-10">
        <Loading text="Loading notes..." />
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block p-8 rounded-lg bg-base-200">
          <p className="text-lg text-base-content/70">{emptyMessage}</p>
          <p className="mt-2 text-sm text-base-content/50">
            Create your first note to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NoteList;

