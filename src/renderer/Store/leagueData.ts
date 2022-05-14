import { createSlice } from '@reduxjs/toolkit';
import LeagueResData from 'renderer/Interfaces/LeagueResData';

export interface LData {
	value?: LeagueResData;
}

const initialState: LData = {
	value: undefined,
};

export const leagueData = createSlice({
	name: 'leagueData',
	initialState,
	reducers: {
		setLeagueData: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setLeagueData } = leagueData.actions;

export default leagueData.reducer;
