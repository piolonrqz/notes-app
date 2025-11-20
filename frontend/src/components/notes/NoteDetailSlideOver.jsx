import React, { useState } from 'react';
import { X, Edit2, Trash2, Archive, Calendar, Clock } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import DeleteNote from './DeleteNote';
import EditNoteModal from './EditNoteModal';
import toast from 'react-hot-toast';

const NoteDetailSlideOver = ({ note, isOpen, onClose, onDelete, onArchive, onUpdate }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !note) return null;

  const isDemo = note.isDemo || note._id?.startsWith('demo-');

  const handleDelete = () => {
    if (isDemo) {
      toast.error('This is a demo note! 🎭 Connect your wallet to manage real notes.', {
        duration: 3000
      });
      return;
    }
    setShowDeleteModal(true);
  };

  const handleEdit = () => {
    if (isDemo) {
      toast.error('This is a demo note! 🎭 Connect your wallet to manage real notes.', {
        duration: 3000
      });
      return;
    }
    setShowEditModal(true);
  };

  const handleArchive = () => {
    if (isDemo) {
      toast.error('This is a demo note! 🎭 Connect your wallet to manage real notes.', {
        duration: 3000
      });
      return;
    }
    onArchive?.(note._id);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await onDelete?.(note._id);
      setShowDeleteModal(false);
      onClose();
      toast.success('Note deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateNote = async (noteId, title, content) => {
    try {
      await onUpdate?.(noteId, title, content);
      setShowEditModal(false);
      toast.success('Note updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-full md:w-[600px] bg-gray-800 border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gray-800/95 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white">Note Details</h2>
            <div className="flex items-center gap-2">
              {/* Action Buttons */}
              <button
                onClick={handleEdit}
                className="p-2 text-white/70 transition-all rounded-lg hover:text-brand-lighter hover:bg-white/10"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleArchive}
                className="p-2 text-white/70 transition-all rounded-lg hover:text-blue-400 hover:bg-white/10"
                title="Archive"
              >
                <Archive className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-white/70 transition-all rounded-lg hover:text-red-400 hover:bg-white/10"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="w-px h-6 mx-2 bg-white/10" />
              <button
                onClick={onClose}
                className="p-2 text-white/70 transition-all rounded-lg hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Demo Badge */}
            {isDemo && (
              <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-200">
                <div className="flex items-center gap-2 text-sm">
                  <span>🎭</span>
                  <span>Demo Note - Connect wallet to create real notes</span>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{note.title}</h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(new Date(note.createdAt))}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatDate(new Date(note.updatedAt))}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </div>
            </div>

            {/* Transaction Info */}
            {note.txHash && (
              <div className="p-4 rounded-xl bg-brand-light/10 border border-brand-light/20">
                <p className="text-sm text-white/70 mb-2">Blockchain Transaction</p>
                <code className="text-xs text-brand-lighter break-all">
                  {note.txHash}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteNote
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        note={note}
        loading={deleting}
      />

      {/* Edit Modal */}
      <EditNoteModal
        isOpen={showEditModal}
        note={note}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateNote}
      />
    </>
  );
};

export default NoteDetailSlideOver;

