import { ArrowLeftIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import api from '../lib/axios';
const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!title.trim() || !content.trim()){
      toast.error("All fields are required");
      return;
    }

    setLoading(true)

    try {
      await api.post("/notes", {
        title,
        content,
      });
      toast.success("Note created successfully");
      navigate("/")
    } catch (error) {
        console.log("Error in note creation", error);
        if(error.response.status === 429){
          toast.error("You're creating notes too fast",{ 
            duration: 4000,
            icon: "🤬"
        }); 
        } else {
          toast.error("Failed to create a note");
        }
    } finally {
      setLoading(false);
    }

  }
  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container px-4 py-8 mx-auto'>
        <div className='max-w-2xl mx-auto'>
          <Link to={"/"} className='mb-6 btn btn-ghost'>
          <ArrowLeftIcon className='size-5'/>
          Back to Notes
          </Link>

          <div className='card bg-base-100'>
            <div className='card-body'>
              <h2 className='mb-4 ml-2 text-2xl card-title'> Create New Note </h2>
              <form onSubmit={handleSubmit}>
                <div className='mb-4 form-control'>
                  <label className='label'>
                    <span className='ml-2 label-text'>Title</span>
                  </label>
                  <input type='text' 
                  placeholder='Note title'  
                  className='input input-bordered'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}/>
                </div>

                <div className='mb-4 form-control'>
                  <label className='label'>
                      <span className='ml-2 label-text'>
                        Content
                      </span>
                  </label>

                  <textarea 
                    placeholder='Write your note here'
                    className='h-32 mb-4 textarea textarea-bordered'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    />
                <div className='justify-end card-actions '>
                  <button type="submit" className='btn btn-primary' disabled={loading}>
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
                </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage