import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IGadgetsState, IGadget, IGadgetFilters } from '../../types';
import { gadgetAPI, adminGadgetAPI } from '../../services/api';

// Initial state
const initialState: IGadgetsState = {
  gadgets: [],
  currentGadget: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  filters: {
    category: '',
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    searchTerm: ''
  }
};

// Async thunks
export const fetchGadgets = createAsyncThunk(
  'gadgets/fetchGadgets',
  async (params?: { page?: number; limit?: number; filters?: Partial<IGadgetFilters> }) => {
    const response = await gadgetAPI.getAllGadgets(params);
    return response.data.data;
  }
);

export const fetchGadgetById = createAsyncThunk(
  'gadgets/fetchGadgetById',
  async (id: string) => {
    const response = await gadgetAPI.getGadgetById(id);
    return response.data.data;
  }
);

export const createGadget = createAsyncThunk(
  'gadgets/createGadget',
  async (gadgetData: Partial<IGadget>) => {
    const response = await adminGadgetAPI.createGadget(gadgetData);
    return response.data.data;
  }
);

export const updateGadget = createAsyncThunk(
  'gadgets/updateGadget',
  async ({ id, gadgetData }: { id: string; gadgetData: Partial<IGadget> }) => {
    const response = await adminGadgetAPI.updateGadget(id, gadgetData);
    return response.data.data;
  }
);

export const deleteGadget = createAsyncThunk(
  'gadgets/deleteGadget',
  async (id: string) => {
    await adminGadgetAPI.deleteGadget(id);
    return id;
  }
);

// Gadgets slice
const gadgetsSlice = createSlice({
  name: 'gadgets',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<IGadgetFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: { min: 0, max: 10000 },
        rating: 0,
        searchTerm: ''
      };
    },
    
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    clearCurrentGadget: (state) => {
      state.currentGadget = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch gadgets
      .addCase(fetchGadgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGadgets.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && Array.isArray(action.payload)) {
          state.gadgets = action.payload;
          state.totalPages = Math.ceil(action.payload.length / 10); // Default pagination
          state.currentPage = 1;
        }
      })
      .addCase(fetchGadgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch gadgets';
      })
      
      // Fetch gadget by ID
      .addCase(fetchGadgetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGadgetById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentGadget = action.payload;
        }
      })
      .addCase(fetchGadgetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch gadget';
      })
      
      // Create gadget
      .addCase(createGadget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGadget.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.gadgets.unshift(action.payload);
        }
      })
      .addCase(createGadget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create gadget';
      })
      
      // Update gadget
      .addCase(updateGadget.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.gadgets.findIndex((gadget: IGadget) => gadget._id === action.payload!._id);
          if (index !== -1) {
            state.gadgets[index] = action.payload;
          }
          if (state.currentGadget?._id === action.payload._id) {
            state.currentGadget = action.payload;
          }
        }
      })
      
      // Delete gadget
      .addCase(deleteGadget.fulfilled, (state, action) => {
        state.gadgets = state.gadgets.filter((gadget: IGadget) => gadget._id !== action.payload);
        if (state.currentGadget?._id === action.payload) {
          state.currentGadget = null;
        }
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearCurrentGadget } = gadgetsSlice.actions;
export default gadgetsSlice.reducer;
