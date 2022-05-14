import { configureStore } from '@reduxjs/toolkit';
import accessCodeReducer from './spotifyAccessCode';
import spotifyAccessCodeReducer from './spotifyAccessToken';
import spotifyRefreshTokenReducer from './spotifyRefreshToken';
import leagueDataReducer from './leagueData';

export default configureStore({
	reducer: {
		spotifyAccessCode: accessCodeReducer,
		spotifyAccessToken: spotifyAccessCodeReducer,
		spotifyRefreshToken: spotifyRefreshTokenReducer,
		leagueData: leagueDataReducer,
	},
});
