import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import axios from 'axios';
import RateLimitedUI from '../components/RateLimitedUI';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import api from '../lib/axios';
import { useWallet } from '../hooks/useWallet';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { connected } = useWallet();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!connected) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/notes");
        console.log(res.data);
        // Handle both response formats
        setNotes(res.data.notes || res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else if (error.response?.status === 401) {
          toast.error("Please connect your wallet");
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [connected]);

  return (
    <div>
      <NavigationBar />

      {isRateLimited && <RateLimitedUI />}

      <div className='p-4 mx-auto mt-10 max-w-7xl'>
        {!connected && (
          <div className='py-10 text-center'>
            <h2 className='mb-4 text-2xl font-bold'>Welcome to Jakwelin Notes</h2>
            <p className='mb-6 text-base-content/70'>
              Connect your wallet to start creating and managing notes on the blockchain
            </p>
          </div>
        )}

        {loading && connected && (
          <div className='py-10 font-sans text-center text-primary'>
            Loading Notes...
          </div>
        )}

        {!loading && connected && notes.length === 0 && (
          <div className='py-10 text-center'>
            <p className='mb-4 text-base-content/70'>No notes yet</p>
            <p className='text-sm text-base-content/50'>
              Click "New Note" to create your first note
            </p>
          </div>
        )}

        {notes.length > 0 && !isRateLimited && (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {notes.map(note => (
              <NoteCard key={note._id} note={note} setNotes={setNotes}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;