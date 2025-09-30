import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IUser } from '../../types';

interface IUserState {
  users: IUser[];
  loading: boolean;
  error: string | null;
  pagination: any | null;
}

const initialState: IUserState = {
  users: [],
  loading: false,
  error: null,
  pagination: null,
};

export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async () => {
    // TODO: Implement API call
    return [];
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export default userSlice.reducer;
