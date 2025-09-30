import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IOrderState, IOrder } from '../../types';

// Initial state
const initialState: IOrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks (placeholders for now)
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    // TODO: Implement API call
    return [];
  }
);

// Orders slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<IOrder | null>) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  },
});

export const { setCurrentOrder, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
