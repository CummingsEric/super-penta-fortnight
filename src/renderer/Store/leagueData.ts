import { createSlice } from '@reduxjs/toolkit';
import processData from 'renderer/Components/league/LeagueHelpers';
import CurrentEvents from 'renderer/Interfaces/CurrentEvents';
import LeagueResData from 'renderer/Interfaces/LeagueResData';

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
			const leagueRes = action.payload as LeagueResData;
			const time = state.value === undefined ? 0 : state.value.lastUpdate;
			const newEvents = processData(leagueRes, time);
			if (newEvents === null || newEvents === undefined) return;
			state.value = newEvents;
		},
	},
});

export const { setLeagueData } = leagueData.actions;

export default leagueData.reducer;
