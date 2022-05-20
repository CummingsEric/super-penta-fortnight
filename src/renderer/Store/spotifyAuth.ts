import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';
import SpotifyAccessToken from 'renderer/Interfaces/SpotifyAccessToken';
import SpotifyAccessCode from 'renderer/Interfaces/SpotifyAccessCode';
import { stringify } from 'qs';
import { useDispatch } from 'react-redux';

export interface AuthData {
	spotifyAccessCode?: SpotifyAccessCode;
	spotifyAccessToken?: SpotifyAccessToken;
	spotifyRefreshToken?: string;
}

const initialState: AuthData = {
	spotifyAccessToken: undefined,
	spotifyAccessCode: undefined,
	spotifyRefreshToken: undefined,
};

export const spotifyAuth = createSlice({
	name: 'leagueData',
	initialState,
	reducers: {
		setAuth: (state, action) => {
			state.spotifyAccessCode = action.payload.spotifyAccessCode;
			state.spotifyAccessToken = action.payload.spotifyAccessToken;
			state.spotifyRefreshToken = action.payload.spotifyRefreshToken;
		},
	},
});

export const { setAuth } = spotifyAuth.actions;

export default spotifyAuth.reducer;
