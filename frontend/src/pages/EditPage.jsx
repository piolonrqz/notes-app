import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`);
        setNote(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error('Failed to load note');
        navigate('/');
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/notes/${id}`, note);
      toast.success('Note updated successfully');
      navigate(`/notes/${id}`);
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <NavigationBar />
      <div className="max-w-4xl p-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Edit Note</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              className="w-full input input-bordered"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-6 form-control">
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              className="w-full h-64 textarea textarea-bordered"
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPage;