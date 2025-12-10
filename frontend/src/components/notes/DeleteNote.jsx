import React from 'react';
import { ConfirmModal } from '../common/Modal';

/**
 * DeleteNote component - Confirmation modal for deleting notes
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
      onClose();
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete Note"
      message={
        <>
          Are you sure you want to delete{' '}
          <strong>"{note?.title || 'this note'}"</strong>?
          <br />
          <br />
          This action will create a blockchain transaction and cannot be undone.
        </>
      }
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="error"
      loading={loading}
    />
  );
};

export default DeleteNote;

