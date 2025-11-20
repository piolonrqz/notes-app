import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input, { Textarea } from '../common/Input';
import Button from '../common/Button';
import Loading from '../common/Loading';
import toast from 'react-hot-toast';

/**
 * EditNote component - Form for editing existing notes with blockchain
 * @param {Object} props - Component props
 * @param {Object} props.note - Note object to edit
 * @param {Function} props.onSubmit - Submit handler (should handle blockchain transaction)
 * @param {Boolean} props.loading - Loading state
 * @param {Boolean} props.walletConnected - Wallet connection status
 * @returns {JSX.Element}
 */
const EditNote = ({ note, onSubmit, loading = false, walletConnected = false }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    }
  }, [note]);

  const validate = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!walletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(note._id, title.trim(), content.trim());
      navigate(`/notes/${note._id}`);
    } catch (error) {
      console.error('Edit note error:', error);
    }
  };

  if (!note) {
    return <Loading text="Loading note..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!walletConnected && (
        <div className="alert alert-warning">
          <span>⚠️ Please connect your wallet to edit notes</span>
        </div>
      )}

      <Input
        label="Title"
        type="text"
        placeholder="Enter note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        required
        disabled={loading || !walletConnected}
      />

      <Textarea
        label="Content"
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={errors.content}
        required
        rows={12}
        disabled={loading || !walletConnected}
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!walletConnected}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EditNote;

