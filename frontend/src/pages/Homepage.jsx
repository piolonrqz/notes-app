import React from 'react'
import NavigationBar from '../components/NavigationBar'
import { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import RateLimitedUI from '../components/RateLimitedUI';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import api from '../lib/axios';

const HomePage = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get("/notes");
                console.log(res.data);
                setNotes(res.data);
                setIsRateLimited(false);
            } catch (error) {
                console.log("Error fetching notes", error);
                if(error.response?.status === 429){
                    setIsRateLimited(true);
                }else{
                    toast.error("Failed to load notes");
                }
            }finally{
                setLoading(false); 
            }
        };
        fetchNotes();
    }, [])
  return (
    <div>
      <NavigationBar />

      {isRateLimited && <RateLimitedUI />}

      <div className='p-4 mx-auto mt-10 max-w-7xl'>
        {loading && <div className='py-10 font-sans text-center text-primary'>Loading Notes...</div>}

        {notes.length > 0 && !isRateLimited && (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {notes.map(note => (
                    <div key={note._id}>
                        <NoteCard key={note._id} note={note} setNotes={setNotes}/>
                    </div>
                ))} 
            </div>
        )}
      </div>
      
    </div>
  )
}

export default HomePage
