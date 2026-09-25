import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// CRITICAL: Ensure this import path correctly points to your types file
import { AuthUser } from '../types';

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // FIX: Using method shorthand syntax `setCredentials(...) {` 
        // instead of arrow function `setCredentials: (...) => {`
        setCredentials(state, action: PayloadAction<AuthUser>) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;