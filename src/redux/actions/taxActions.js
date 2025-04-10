import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch tax settings
export const fetchTaxSettings = createAsyncThunk(
  'tax/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tax/settings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tax settings');
    }
  }
);

// Update tax settings
export const updateTaxSettings = createAsyncThunk(
  'tax/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await api.put('/tax/settings', settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update tax settings');
    }
  }
);

// Add tax slab
export const addTaxSlab = createAsyncThunk(
  'tax/addSlab',
  async (slabData, { rejectWithValue }) => {
    try {
      const response = await api.post('/tax/slabs', slabData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add tax slab');
    }
  }
);

// Delete tax slab
export const deleteTaxSlab = createAsyncThunk(
  'tax/deleteSlab',
  async (slabId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/tax/slabs/${slabId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete tax slab');
    }
  }
);

// Update tax slab
export const updateTaxSlab = createAsyncThunk(
  'tax/updateSlab',
  async ({ slabId, slabData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/tax/slabs/${slabId}`, slabData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update tax slab');
    }
  }
);

// Generate tax document
export const generateTaxDocument = createAsyncThunk(
  'tax/generateDocument',
  async ({ documentType, employeeId, year }, { rejectWithValue }) => {
    try {
      const response = await api.post('/tax/documents/generate', { documentType, employeeId, year });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to generate tax document');
    }
  }
); 