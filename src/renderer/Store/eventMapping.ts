import { createSlice } from '@reduxjs/toolkit';
import EventInterface from 'renderer/Interfaces/EventInterface';

export interface EMap {
	value?: EventInterface<string>;
}

const initialState: EMap = {
	value: undefined,
};

export const eventMapping = createSlice({
	name: 'eventMapping',
	initialState,
	reducers: {
		setMapping: (state, action) => {
			state.value = action.payload;
		},
		setPlaylist: (state, action) => {
			if (state.value === undefined) return;
			const { event } = action.payload;
			state.value[event as keyof EventInterface<string>] =
				action.payload.playlistId;
		},
	},
});

export const { setMapping, setPlaylist } = eventMapping.actions;

export default eventMapping.reducer;
