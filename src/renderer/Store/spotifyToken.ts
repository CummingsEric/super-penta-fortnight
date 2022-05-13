import { createSlice } from '@reduxjs/toolkit';

export const tokenSlice = createSlice({
	name: 'token',
	initialState: {
		value: null,
	},
	reducers: {
		setSpotifyToken: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setSpotifyToken } = tokenSlice.actions;

export default tokenSlice.reducer;
