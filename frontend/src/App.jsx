import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './context/walletContext';

import Home from './pages/Home';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';
import NoteDetailPage from './pages/NoteDetailPage';
import Archived from './pages/Archived';

import './App.css';

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-base-300 text-base-content">
        <Router>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/notes/:id" element={<NoteDetailPage />} />
            <Route path="/notes/:id/edit" element={<EditPage />} />
            <Route path="/archived" element={<Archived />} />
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold">404</h1>
                    <p className="mt-2">Page not found</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </div>
    </WalletProvider>
  );
}

export default App;