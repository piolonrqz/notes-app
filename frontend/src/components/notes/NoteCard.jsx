import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import { formatDate } from '../../lib/utils';

/**
 * NoteCard component - Display individual note in card format
 * @param {Object} props - Component props
 * @param {Object} props.note - Note object
 * @param {Function} props.onDelete - Delete handler (optional)
 * @returns {JSX.Element}
 */
const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/notes/${note._id}/edit`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(note._id);
    }
  };

  return (
    <Link
      to={`/notes/${note._id}`}
      className="transition-all duration-200 border-t-4 border-solid border-primary card bg-base-100 hover:shadow-lg"
    >
      <div className="rounded bg-primary card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        
        <div className="items-center justify-between mt-4 card-actions">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          
          <div className="flex items-center gap-1">
            <button
              className="btn btn-primary btn-xs p-1"
              onClick={handleEdit}
              aria-label="Edit note"
            >
              <PenSquareIcon className="w-4 h-4" />
            </button>
            
            <button
              className="btn btn-primary btn-xs p-1"
              onClick={handleDelete}
              aria-label="Delete note"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;

