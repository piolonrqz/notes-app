import React from 'react';
import NoteCard from './NoteCard';

/**
 * NoteGrid component - Display notes in grid layout
 * @param {Object} props - Component props
 * @param {Array} props.notes - Array of note objects
 * @param {Function} props.onDelete - Delete handler
 * @param {Number} props.columns - Number of columns (1-4)
 * @returns {JSX.Element}
 */
const NoteGrid = ({ notes = [], onDelete, columns = 3 }) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  if (!notes || notes.length === 0) {
    return (
      <div className="py-10 text-center text-base-content/70">
        <p>No notes to display</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${gridClasses[columns] || gridClasses[3]}`}>
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NoteGrid;

