import { createSlice } from '@reduxjs/toolkit';
import SpotifyAccessCode from 'renderer/Interfaces/SpotifyAccessCode';

export interface SAC {
	value?: SpotifyAccessCode;
}

const initialState: SAC = {
	value: undefined,
};

export const spotifyAccessCode = createSlice({
	name: 'SpotifyAccessCode',
	initialState,
	reducers: {
		setSpotifyAccessCode: (state, action) => {
			state.value = action.payload;
		},
		clearSpotifyAccessCode: (state) => {
			state.value = undefined;
		},
	},
});

export const { setSpotifyAccessCode, clearSpotifyAccessCode } =
	spotifyAccessCode.actions;

export default spotifyAccessCode.reducer;
