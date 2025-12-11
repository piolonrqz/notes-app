import React, { useState } from 'react';
import { X, Edit2, Trash2, Archive, Calendar, Clock, Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import DeleteNote from './DeleteNote';
import EditNoteModal from './EditNoteModal';
import StatusBadge from '../common/StatusBadge';
import toast from 'react-hot-toast';
import BlockchainStatus from './BlockchainStatus';

const NoteDetailSlideOver = ({ note, isOpen, onClose, onDelete, onArchive, onUpdate }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [showFullHash, setShowFullHash] = useState(false); 
  const [copied, setCopied] = useState(false); 

  if (!isOpen || !note) return null;

  const isDemo = note.isDemo || note._id?.startsWith('demo-');
  
  // Get the hash
  const txHash = note.transactionHistory?.[note.transactionHistory.length - 1]?.txHash || note.txHash;

  const handleDelete = () => { if (isDemo) return; setShowDeleteModal(true); };
  const handleEdit = () => { if (isDemo) return; setShowEditModal(true); };
  const handleArchive = () => { if (isDemo) return; onArchive?.(note._id); };
  
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
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update note');
    }
  };

  // Copy Function
  const handleCopyHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopied(true);
      toast.success('Hash copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 z-50 h-full w-full md:w-[600px] bg-gray-800 border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gray-800/95 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white">Note Details</h2>
            <div className="flex items-center gap-2">
              <button onClick={handleEdit} className="p-2 text-white/70 rounded-lg hover:text-brand-lighter hover:bg-white/10"><Edit2 className="w-5 h-5" /></button>
              <button onClick={handleArchive} className="p-2 text-white/70 rounded-lg hover:text-blue-400 hover:bg-white/10"><Archive className="w-5 h-5" /></button>
              <button onClick={handleDelete} className="p-2 text-white/70 rounded-lg hover:text-red-400 hover:bg-white/10"><Trash2 className="w-5 h-5" /></button>
              <div className="w-px h-6 mx-2 bg-white/10" />
              <button onClick={onClose} className="p-2 text-white/70 rounded-lg hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isDemo && (
              <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-200">
                <div className="flex items-center gap-2 text-sm"><span>🎭</span><span>Demo Note</span></div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-white">{note.title}</h1>
                {/* Status Badge */}
                {note.status && <StatusBadge status={note.status} size="md" />}
              </div>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>Created {formatDate(new Date(note.createdAt))}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>Updated {formatDate(new Date(note.updatedAt))}</span></div>
              </div>
            </div>

            <div className="border-t border-white/10" />

            <div className="prose prose-invert max-w-none">
              <div className="text-white/90 whitespace-pre-wrap leading-relaxed">{note.content}</div>
            </div>

            {/* Blockchain Status Section */}
            <div className="mt-auto pt-6 pb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Blockchain Status</h3>
              
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-gray-900/50 border border-white/10">
                
                {/* Top Row: Badge + Explorer Link */}
                <div className="flex items-center justify-between">
                   <div>
                     <p className="text-xs text-gray-500 mb-1">Transaction Status</p>
                     <BlockchainStatus status={note.status} txHash={txHash} />
                   </div>
                </div>
                
                {/* Bottom Row: Hash with Controls */}
                {txHash && (
                   <div className="mt-2 pt-3 border-t border-white/5">
                     <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500">Transaction Hash</p>
                        
                        {/* Control Buttons */}
                        <div className="flex items-center gap-1">
                           <button 
                             onClick={handleCopyHash}
                             className="p-1.5 rounded-md hover:bg-white/10 text-brand-lighter transition-all"
                             title="Copy Hash"
                           >
                             {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                           </button>
                           <button 
                             onClick={() => setShowFullHash(!showFullHash)}
                             className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-all"
                             title={showFullHash ? "Collapse" : "Expand"}
                           >
                             {showFullHash ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                           </button>
                        </div>
                     </div>
                     
                     {/* Hash Display */}
                     <code className={`block w-full text-xs font-mono text-white/70 transition-all ${showFullHash ? 'break-all bg-black/20 p-2 rounded border border-white/5' : 'truncate'}`}>
                        {txHash}
                     </code>
                   </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <DeleteNote isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} note={note} loading={deleting} />
      <EditNoteModal isOpen={showEditModal} note={note} onClose={() => setShowEditModal(false)} onUpdate={handleUpdateNote} />
    </>
  );
};

export default NoteDetailSlideOver;