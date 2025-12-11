import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { useNotes } from '../../hooks/useNotes';
import TransactionProgress from '../common/TransactionProgress';
import toast from 'react-hot-toast';

const CreateNoteModal = ({ isOpen, onClose, onSuccess }) => {
  const { wallet, address, connected } = useWallet();
  const { createNote, loading, transactionStage, txHash } = useNotes(wallet, address);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      await createNote(title, content);
      // Note: Success toast is handled by useNotes hook
      // Reset form
      setTitle('');
      setContent('');
      onClose();
      // Call the success callback to refresh notes
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating note:', error);
      // Error toast is already handled by useNotes hook
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-800 border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-gray-800/95 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-white">Create New Note</h2>
            <button
              onClick={handleClose}
              className="p-2 text-white/70 transition-colors rounded-lg hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Wallet Warning */}
            {!connected && (
              <div className="mb-4 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-200">
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0 w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-sm">Connect your Lace wallet to create notes</span>
                </div>
              </div>
            )}

            {/* Title Input */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-white">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full px-4 py-3 text-white placeholder-white/40 bg-gray-700/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all"
                disabled={loading}
                maxLength={200}
                required
              />
              <p className="mt-1 text-xs text-white/50">{title.length}/200 characters</p>
            </div>

            {/* Content Textarea */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-white">
                Content <span className="text-red-400">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note content here..."
                rows={10}
                className="w-full px-4 py-3 text-white placeholder-white/40 bg-gray-700/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all resize-none"
                disabled={loading}
                required
              />
            </div>

            {/* Transaction Progress */}
            {transactionStage && (
              <div className="mb-6">
                <TransactionProgress 
                  stage={transactionStage} 
                  txHash={txHash}
                />
              </div>
            )}

            {/* Blockchain Info */}
            {connected && !transactionStage && (
              <div className="mb-6 p-4 rounded-xl bg-brand-light/20 border border-brand-light/30">
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0 w-5 h-5 text-brand-lighter mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-white/80">
                    Creating a note will record a transaction on the Cardano blockchain.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !connected || transactionStage}
                className="px-6 py-2.5 font-medium text-white bg-gradient-to-br from-brand-light to-brand-lighter rounded-xl hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {loading || transactionStage ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {transactionStage === 'confirmed' ? 'Created!' : 
                     transactionStage === 'failed' ? 'Failed' :
                     transactionStage === 'confirming' ? 'Confirming...' :
                     transactionStage === 'submitting' ? 'Submitting...' :
                     transactionStage === 'signing' ? 'Signing...' :
                     'Creating...'}
                  </>
                ) : (
                  'Create Note'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateNoteModal;

