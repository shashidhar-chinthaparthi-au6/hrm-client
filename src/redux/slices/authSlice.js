// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: { id: 'dev-user', name: 'Development User', role: 'admin' },
  token: 'dev-token',
  isAuthenticated: true,
  loading: false,
  error: null,
  permissions: ['all'],
  role: 'admin',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
  }
});

export const { clearErrors, setUser, clearUser, setPermissions } = authSlice.actions;
export default authSlice.reducer;