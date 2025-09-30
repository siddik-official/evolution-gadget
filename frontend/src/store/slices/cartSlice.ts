import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ICartState, ICartItem, IGadget } from '../../types';

// Initial state
const initialState: ICartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
};

// Async thunks would go here for API calls

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ gadget: IGadget; quantity: number }>) => {
      const { gadget, quantity } = action.payload;
      const existingItem = state.items.find(item => item.gadgetId === gadget._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          gadgetId: gadget._id,
          gadget,
          quantity,
          price: gadget.price
        });
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.gadgetId !== action.payload);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    updateQuantity: (state, action: PayloadAction<{ gadgetId: string; quantity: number }>) => {
      const { gadgetId, quantity } = action.payload;
      const item = state.items.find(item => item.gadgetId === gadgetId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.gadgetId !== gadgetId);
        } else {
          item.quantity = quantity;
        }
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
