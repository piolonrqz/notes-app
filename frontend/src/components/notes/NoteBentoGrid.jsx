import React from 'react';
import { PenSquareIcon, Trash2Icon, Clock, Calendar } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import StatusBadge from '../common/StatusBadge';

/**
 * Bento Grid Layout for Notes - Uniform 3-column grid with fixed-height cards
 */
const NoteBentoGrid = ({ notes = [], onDelete, onEdit, onNoteClick }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mb-4 text-6xl">📝</div>
          <h3 className="mb-2 text-2xl font-bold text-base-content/80">No notes yet</h3>
          <p className="text-base-content/60">Create your first note to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          .bento-grid-lg {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 bento-grid-lg break-words [overflow-wrap:anywhere]">
      {notes.map((note, index) => {
        
        return (
          <div
            key={note._id}
            onClick={() => onNoteClick?.(note)}
            className="
              group relative overflow-hidden min-w-0 h-[280px] rounded-2xl transition-all duration-300 cursor-pointer
              hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-light/20
              border border-brand-light/20 border-l-4 border-l-brand-light/40
            "
            style={{
              background: index % 4 === 0 ? 'linear-gradient(135deg, rgba(110, 140, 251, 0.15) 0%, rgba(99, 108, 203, 0.25) 100%)' :
                         index % 4 === 1 ? 'linear-gradient(135deg, rgba(99, 108, 203, 0.15) 0%, rgba(80, 88, 156, 0.25) 100%)' :
                         index % 4 === 2 ? 'linear-gradient(135deg, rgba(80, 88, 156, 0.15) 0%, rgba(60, 70, 123, 0.25) 100%)' :
                         'linear-gradient(135deg, rgba(60, 70, 123, 0.15) 0%, rgba(110, 140, 251, 0.25) 100%)',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lighter rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-light rounded-full translate-y-12 -translate-x-12 blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative flex flex-col min-w-0 h-full pl-8 pr-6 py-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white line-clamp-2 break-words [overflow-wrap:anywhere] group-hover:text-brand-lighter transition-colors">
                    {note.title}
                  </h3>
                </div>
                
                {/* Action Buttons */}
                <div 
                  className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onEdit) onEdit(note._id);
                    }}
                    className="p-1.5 rounded-lg bg-brand-light/20 hover:bg-brand-light/30 shadow-sm transition-all hover:shadow-md"
                    title="Edit note"
                  >
                    <PenSquareIcon className="w-4 h-4 text-brand-lighter" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onDelete) onDelete(note._id);
                    }}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 shadow-sm transition-all"
                    title="Delete note"
                  >
                    <Trash2Icon className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Content Preview */}
              <p className="text-gray-300 text-sm flex-1 break-words [overflow-wrap:anywhere] line-clamp-4">
                {note.content}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(new Date(note.createdAt))}</span>
                  </div>
                  {note.updatedAt !== note.createdAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Updated</span>
                    </div>
                  )}
                </div>
                {/* Status Badge */}
                {note.status && (
                  <div>
                    <StatusBadge status={note.status} size="sm" />
                  </div>
                )}
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-lighter/10 to-transparent rounded-bl-full"></div>
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
};

export default NoteBentoGrid;

