import { createSlice } from '@reduxjs/toolkit';

export interface CurrSong {
	songName?: string;
	songEvent?: string;
}

const initialState: CurrSong = {};

export const currSong = createSlice({
	name: 'eventData',
	initialState,
	reducers: {
		setSong: (state, action) => {
			const { songName, songEvent } = action.payload;
			if (songName !== state.songName && songName !== undefined)
				state.songName = songName;
			if (songEvent !== state.songEvent && songEvent !== undefined)
				state.songEvent = songEvent;
		},
	},
});

export const { setSong } = currSong.actions;

export default currSong.reducer;
