import { createSlice } from '@reduxjs/toolkit';
import CurrentEvents from 'renderer/Interfaces/CurrentEvents';

export interface LData {
	value?: CurrentEvents;
}

const initialState: LData = {
	value: undefined,
};

export const leagueData = createSlice({
	name: 'leagueData',
	initialState,
	reducers: {
		setLeagueData: (state, action) => {
			if (action.payload === undefined || action.payload === null) return;
			const leagueEvents = action.payload as CurrentEvents;
			state.value = leagueEvents;
		},
	},
});

export const { setLeagueData } = leagueData.actions;

export default leagueData.reducer;
