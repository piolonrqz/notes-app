import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBigLeft, PenSquareIcon, Trash2Icon, ArchiveIcon } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import Button from '../common/Button';
import Loading from '../common/Loading';

/**
 * NoteDetail component - Display full note details
 * @param {Object} props - Component props
 * @param {Object} props.note - Note object
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onArchive - Archive handler (optional)
 * @param {Boolean} props.loading - Loading state
 * @returns {JSX.Element}
 */
const NoteDetail = ({ note, onDelete, onArchive, loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return <Loading text="Loading note..." fullScreen />;
  }

  if (!note) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block p-8 rounded-lg shadow-lg alert alert-error">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 w-6 h-6 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Note not found</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl p-4 mx-auto">
      <div className="p-6 rounded-lg shadow-lg bg-base-100">
        {/* Header Actions */}
        <div className="flex items-start justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            <ArrowBigLeft className="mr-2" />
            Back to Homepage
          </Button>

          <div className="flex gap-2">
            {onArchive && (
              <Button
                variant="ghost"
                onClick={() => onArchive(note._id)}
                disabled={loading}
              >
                <ArchiveIcon className="w-4 h-4 mr-2" />
                Archive
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={() => navigate(`/notes/${note._id}/edit`)}
              disabled={loading}
            >
              <PenSquareIcon className="w-4 h-4 mr-2" />
              Edit
            </Button>

            <Button
              variant="error"
              onClick={() => onDelete(note._id)}
              disabled={loading}
            >
              <Trash2Icon className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Note Content */}
        <h1 className="mb-4 text-4xl font-bold">{note.title}</h1>
        
        <p className="mb-6 text-sm text-base-content/60">
          Created {formatDate(new Date(note.createdAt))}
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <> • Updated {formatDate(new Date(note.updatedAt))}</>
          )}
        </p>

        {note.txHash && (
          <div className="mb-6">
            <div className="p-3 rounded-lg bg-base-200">
              <p className="text-xs text-base-content/60">Blockchain Transaction:</p>
              <p className="text-xs font-mono break-all text-base-content/80">
                {note.txHash}
              </p>
            </div>
          </div>
        )}

        <div className="prose max-w-none">
          <p className="whitespace-pre-line text-base-content">{note.content}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;

