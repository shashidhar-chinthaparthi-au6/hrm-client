import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchTaxSettings, 
  updateTaxSettings, 
  addTaxSlab,
  deleteTaxSlab,
  updateTaxSlab,
  generateTaxDocument
} from '../actions/taxActions';

const initialState = {
  taxSettings: null,
  loading: false,
  error: null,
  documents: [],
  documentsLoading: false
};

const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    clearTaxErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tax settings
      .addCase(fetchTaxSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.taxSettings = action.payload;
      })
      .addCase(fetchTaxSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update tax settings
      .addCase(updateTaxSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaxSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.taxSettings = {
          ...state.taxSettings,
          organizationSettings: action.payload
        };
      })
      .addCase(updateTaxSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add tax slab
      .addCase(addTaxSlab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaxSlab.fulfilled, (state, action) => {
        state.loading = false;
        state.taxSettings = {
          ...state.taxSettings,
          taxSlabs: [...(state.taxSettings?.taxSlabs || []), action.payload]
        };
      })
      .addCase(addTaxSlab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete tax slab
      .addCase(deleteTaxSlab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaxSlab.fulfilled, (state, action) => {
        state.loading = false;
        state.taxSettings = {
          ...state.taxSettings,
          taxSlabs: state.taxSettings.taxSlabs.filter(slab => slab.id !== action.payload.id)
        };
      })
      .addCase(deleteTaxSlab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update tax slab
      .addCase(updateTaxSlab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaxSlab.fulfilled, (state, action) => {
        state.loading = false;
        state.taxSettings = {
          ...state.taxSettings,
          taxSlabs: state.taxSettings.taxSlabs.map(slab => 
            slab.id === action.payload.id ? action.payload : slab
          )
        };
      })
      .addCase(updateTaxSlab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Generate tax document
      .addCase(generateTaxDocument.pending, (state) => {
        state.documentsLoading = true;
        state.error = null;
      })
      .addCase(generateTaxDocument.fulfilled, (state, action) => {
        state.documentsLoading = false;
        state.documents = [...state.documents, action.payload];
      })
      .addCase(generateTaxDocument.rejected, (state, action) => {
        state.documentsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTaxErrors } = taxSlice.actions;
export default taxSlice.reducer; 