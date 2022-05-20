import { configureStore } from '@reduxjs/toolkit';
import accessCodeReducer from './spotifyAccessCode';
import spotifyAccessCodeReducer from './spotifyAccessToken';
import spotifyRefreshTokenReducer from './spotifyRefreshToken';
import leagueDataReducer from './leagueData';
import playlistDataReducer from './playlistData';
import eventMappingReducer from './eventMapping';

export default configureStore({
	reducer: {
		spotifyAccessCode: accessCodeReducer,
		spotifyAccessToken: spotifyAccessCodeReducer,
		spotifyRefreshToken: spotifyRefreshTokenReducer,
		leagueData: leagueDataReducer,
		library: playlistDataReducer,
		eventPlaylistMappings: eventMappingReducer,
	},
});
