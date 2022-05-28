import { createSlice } from '@reduxjs/toolkit';
import Settings from 'renderer/Interfaces/Settings';

export interface SettingsInit {
	value: Settings;
}

const initialState: SettingsInit = {
	value: { spotifyDevice: undefined },
};

export const settings = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setSettings: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setSettings } = settings.actions;

export default settings.reducer;
