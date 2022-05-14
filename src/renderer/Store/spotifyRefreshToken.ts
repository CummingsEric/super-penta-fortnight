import { createSlice } from '@reduxjs/toolkit';

export const spotifyRefreshToken = createSlice({
	name: 'spotifyRefreshToken',
	initialState: {
		value: null,
	},
	reducers: {
		setSpotifyRefreshToken: (state, action) => {
			state.value = action.payload;
		},
		clearSpotifyRefreshToken: (state) => {
			state.value = null;
		},
	},
});

export const { setSpotifyRefreshToken, clearSpotifyRefreshToken } =
	spotifyRefreshToken.actions;

export default spotifyRefreshToken.reducer;
