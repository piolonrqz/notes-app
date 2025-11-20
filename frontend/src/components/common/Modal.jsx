import React from 'react';

/**
 * Reusable Modal component with DaisyUI styling
 * @param {Object} props - Component props
 * @param {Boolean} props.isOpen - Control modal visibility
 * @param {Function} props.onClose - Close handler
 * @param {String} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.actions - Modal action buttons
 * @param {String} props.size - Modal size (sm, md, lg, full)
 * @param {Boolean} props.closeOnOutsideClick - Close modal when clicking outside
 * @returns {JSX.Element}
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  closeOnOutsideClick = true
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalBoxClasses = [
    'modal-box',
    size === 'sm' && 'max-w-sm',
    size === 'md' && 'max-w-2xl',
    size === 'lg' && 'max-w-4xl',
    size === 'full' && 'max-w-full w-11/12'
  ].filter(Boolean).join(' ');

  return (
    <div 
      className="modal modal-open" 
      onClick={handleBackdropClick}
    >
      <div className={modalBoxClasses}>
        {/* Modal Header */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{title}</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="py-4">
          {children}
        </div>

        {/* Modal Actions */}
        {actions && (
          <div className="modal-action">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Confirmation Modal variant
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      closeOnOutsideClick={!loading}
      actions={
        <>
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className={`btn btn-${confirmVariant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Loading...
              </>
            ) : (
              confirmText
            )}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
};

export default Modal;

