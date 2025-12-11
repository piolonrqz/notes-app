import React from 'react';
import { X, Trash2, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { formatDate } from '../../lib/utils';

/**
 * DeleteNote component - Enhanced confirmation modal for deleting notes
 * @param {Object} props - Component props
 * @param {Boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close modal handler
 * @param {Function} props.onConfirm - Confirm delete handler (with blockchain)
 * @param {Object} props.note - Note object to delete
 * @param {Boolean} props.loading - Loading state
 * @returns {JSX.Element}
 */
const DeleteNote = ({ isOpen, onClose, onConfirm, note, loading = false }) => {
  const handleConfirm = async () => {
    if (note && note._id) {
      await onConfirm(note._id);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md rounded-2xl bg-gray-800 border border-red-500/30 shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-red-500/20 bg-gradient-to-r from-red-500/10 to-red-600/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Delete Note</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 text-white/70 transition-colors rounded-lg hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Warning Message */}
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-300 mb-1">
                    This action cannot be undone
                  </p>
                  <p className="text-xs text-red-200/80">
                    Deleting this note will create a blockchain transaction and permanently remove it from your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Note Preview */}
            {note && (
              <div className="mb-6 p-4 rounded-xl bg-gray-700/50 border border-white/10">
                <div className="flex items-start gap-3 mb-3">
                  <FileText className="w-4 h-4 text-brand-lighter flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white mb-1 line-clamp-2">
                      {note.title || 'Untitled Note'}
                    </h3>
                    {note.content && (
                      <p className="text-sm text-gray-300 line-clamp-3 mb-2">
                        {note.content}
                      </p>
                    )}
                    {note.createdAt && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>Created {formatDate(new Date(note.createdAt))}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Question */}
            <div className="mb-6">
              <p className="text-sm text-white/90">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-white">"{note?.title || 'this note'}"</span>?
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 p-6 border-t border-white/10 bg-gray-800/50">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-6 py-2.5 font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Note
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteNote;

