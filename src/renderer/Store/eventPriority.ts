import { createSlice } from '@reduxjs/toolkit';
import EventInterface from 'renderer/Interfaces/EventInterface';

export interface EPrio {
	value?: EventInterface<string>;
}

const initialState: EPrio = {
	value: undefined,
};

export const eventPriority = createSlice({
	name: 'eventMapping',
	initialState,
	reducers: {
		setPriority: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setPriority } = eventPriority.actions;

export default eventPriority.reducer;
