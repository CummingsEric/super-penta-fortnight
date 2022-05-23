import { configureStore } from '@reduxjs/toolkit';
import leagueDataReducer from './leagueData';
import playlistDataReducer from './library';
import eventMappingReducer from './eventMapping';
import eventPriorityReducer from './eventPriority';
import spotifyAuthReducer from './spotifyAuth';

export default configureStore({
	reducer: {
		leagueData: leagueDataReducer,
		library: playlistDataReducer,
		eventPlaylistMappings: eventMappingReducer,
		priorities: eventPriorityReducer,
		spotifyAuth: spotifyAuthReducer,
	},
});
