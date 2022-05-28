import { createSlice } from '@reduxjs/toolkit';
import Settings from 'renderer/Interfaces/Settings';
import SpotifyDevice from 'renderer/Interfaces/SpotifyDevice';

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
			console.log(action.payload);
			state.value = action.payload;
		},
	},
});

export const { setSettings } = settings.actions;

export default settings.reducer;
