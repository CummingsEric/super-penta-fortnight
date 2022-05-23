import { createSlice } from '@reduxjs/toolkit';
import SpotifyAccessToken from 'renderer/Interfaces/SpotifyAccessToken';
import SpotifyAccessCode from 'renderer/Interfaces/SpotifyAccessCode';

export interface AuthData {
	spotifyAccessCode?: SpotifyAccessCode;
	spotifyAccessToken?: SpotifyAccessToken;
	spotifyRefreshToken?: string;
}

const initialState: AuthData = {};

export const spotifyAuth = createSlice({
	name: 'spotifyAuth',
	initialState,
	reducers: {
		setSpotifyAuth: (state, action) => {
			state.spotifyAccessCode = action.payload.spotifyAccessCode;
			state.spotifyAccessToken = action.payload.spotifyAccessToken;
			state.spotifyRefreshToken = action.payload.spotifyRefreshToken;
		},
	},
});

export const { setSpotifyAuth } = spotifyAuth.actions;

export default spotifyAuth.reducer;
