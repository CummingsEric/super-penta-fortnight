import { createSlice } from '@reduxjs/toolkit';

export const spotifyAccessCode = createSlice({
	name: 'SpotifyAccessCode',
	initialState: {
		value: null,
	},
	reducers: {
		setSpotifyAccessCode: (state, action) => {
			state.value = action.payload;
		},
		clearSpotifyAccessCode: (state) => {
			state.value = null;
		},
	},
});

export const { setSpotifyAccessCode, clearSpotifyAccessCode } =
	spotifyAccessCode.actions;

export default spotifyAccessCode.reducer;
