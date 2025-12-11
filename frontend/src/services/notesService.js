import api from '../lib/axios';

/**
 * Notes Service - Centralized API calls for notes operations
 */
const notesService = {
  /**
   * Get all notes
   * @param {String} walletAddress - Optional wallet address filter
   * @returns {Promise<Array>} Array of notes
   */
  getAllNotes: async (walletAddress = null) => {
    try {
      const config = walletAddress ? {
        headers: { 'x-wallet-address': walletAddress }
      } : {};
      
      const response = await api.get('/notes', config);
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  /**
   * Get single note by ID
   * @param {String} id - Note ID
   * @returns {Promise<Object>} Note object
   */
  getNoteById: async (id) => {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching note:', error);
      throw error;
    }
  },

  /**
   * Create new note
   * @param {Object} noteData - Note data (title, content, txHash)
   * @param {String} walletAddress - Wallet address
   * @returns {Promise<Object>} Created note
   */
  createNote: async (noteData, walletAddress) => {
    try {
      const response = await api.post('/notes', noteData, {
        headers: { 'x-wallet-address': walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  /**
   * Update existing note
   * @param {String} id - Note ID
   * @param {Object} noteData - Updated note data (title, content, txHash)
   * @param {String} walletAddress - Wallet address
   * @returns {Promise<Object>} Updated note
   */
  updateNote: async (id, noteData, walletAddress) => {
    try {
      const response = await api.put(`/notes/${id}`, noteData, {
        headers: { 'x-wallet-address': walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  /**
   * Delete note
   * @param {String} id - Note ID
   * @param {String} txHash - Transaction hash
   * @param {String} walletAddress - Wallet address
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteNote: async (id, txHash, walletAddress) => {
    try {
      const response = await api.delete(`/notes/${id}`, {
        headers: { 'x-wallet-address': walletAddress },
        data: { txHash }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  /**
   * Search notes (local operation, no blockchain)
   * @param {String} query - Search query
   * @param {String} walletAddress - Wallet address
   * @returns {Promise<Array>} Matching notes
   */
  searchNotes: async (query, walletAddress) => {
    try {
      const response = await api.get(`/notes/search?query=${encodeURIComponent(query)}`, {
        headers: { 'x-wallet-address': walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching notes:', error);
      throw error;
    }
  },

  /**
   * Get archived notes
   * @param {String} walletAddress - Wallet address
   * @returns {Promise<Array>} Archived notes
   */
  getArchivedNotes: async (walletAddress) => {
    try {
      const response = await api.get('/notes/archived', {
        headers: { 'x-wallet-address': walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching archived notes:', error);
      throw error;
    }
  },

  /**
   * Archive a note (local operation)
   * @param {String} id - Note ID
   * @param {String} walletAddress - Wallet address
   * @returns {Promise<Object>} Archived note
   */
  archiveNote: async (id, walletAddress) => {
    try {
      const response = await api.patch(`/notes/${id}/archive`, {}, {
        headers: { 'x-wallet-address': walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error archiving note:', error);
      throw error;
    }
  },

  /**
   * Unarchive a note (local operation)
   * @param {String} id - Note ID
   * @param {String} walletAddress - Wallet address
   * @returns {Promise<Object>} Unarchived note
   */
  unarchiveNote: async (id, walletAddress) => {
    try {
      const response = await api.patch(`/notes/${id}/unarchive`, {}, {
        headers: { 'x-wallet-address': walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error unarchiving note:', error);
      throw error;
    }
  },

  /**
   * Update transaction status
   * @param {String} txHash - Transaction hash
   * @param {String} status - Status: 'pending', 'confirmed', or 'failed'
   * @param {Number} blockHeight - Optional block height
   * @param {String} blockTime - Optional block time
   * @returns {Promise<Object>} Updated note
   */
  updateTransactionStatus: async (txHash, status, blockHeight = null, blockTime = null) => {
    try {
      const payload = { txHash, status };
      if (blockHeight !== null) payload.blockHeight = blockHeight;
      if (blockTime !== null) payload.blockTime = blockTime;

      const response = await api.post('/status/update', payload);
      return response.data;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }
};

export default notesService;

