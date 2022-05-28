import { configureStore } from '@reduxjs/toolkit';
import leagueDataReducer from './leagueData';
import playlistDataReducer from './library';
import spotifyAuthReducer from './spotifyAuth';
import eventDataReducer from './eventData';
import settingsReducer from './settings';
import currSongReducer from './currSong';

export default configureStore({
	reducer: {
		spotifyAuth: spotifyAuthReducer,
		leagueData: leagueDataReducer,
		eventData: eventDataReducer,
		library: playlistDataReducer,
		settings: settingsReducer,
		currSong: currSongReducer,
	},
});
