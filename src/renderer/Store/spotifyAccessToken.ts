import { createSlice } from '@reduxjs/toolkit';

export const spotifyAccessToken = createSlice({
	name: 'spotifyAccessToken',
	initialState: {
		value: null,
	},
	reducers: {
		setSpotifyAccessToken: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setSpotifyAccessToken } = spotifyAccessToken.actions;

export default spotifyAccessToken.reducer;
