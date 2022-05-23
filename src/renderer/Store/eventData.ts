import { createSlice } from '@reduxjs/toolkit';
import EventData, { EventProps } from 'renderer/Interfaces/EventData';

export interface EData {
	value?: EventData;
}

const initialState: EData = {
	value: undefined,
};

export const eventData = createSlice({
	name: 'eventData',
	initialState,
	reducers: {
		setAllEvents: (state, action) => {
			const events: EventData = action.payload;
			window.electron.ipcRenderer.sendMessage('save-events', [events]);
			state.value = events;
		},
		setEvent: (state, action) => {
			if (state.value === undefined) return;
			const { eventId } = action.payload;
			const event: EventProps = action.payload.data;
			state.value[eventId as keyof EventData] = event;
		},
	},
});

export const { setAllEvents, setEvent } = eventData.actions;

export default eventData.reducer;
