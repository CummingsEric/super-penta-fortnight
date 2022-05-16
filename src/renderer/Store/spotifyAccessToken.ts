import { createSlice } from '@reduxjs/toolkit';
import SpotifyAccessToken from 'renderer/Interfaces/SpotifyAccessToken';

export interface SAT {
	value?: SpotifyAccessToken;
}

const initialState: SAT = {
	value: undefined,
};

export const spotifyAccessToken = createSlice({
	name: 'spotifyAccessToken',
	initialState,
	reducers: {
		setSpotifyAccessToken: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setSpotifyAccessToken } = spotifyAccessToken.actions;

export default spotifyAccessToken.reducer;
