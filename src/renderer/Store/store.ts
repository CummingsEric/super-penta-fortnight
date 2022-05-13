import { configureStore } from '@reduxjs/toolkit';
import spotifyCodeReducer from './spotifyCode';
import tokenReducer from './spotifyToken';

export default configureStore({
	reducer: {
		spotifyCode: spotifyCodeReducer,
		spotifyToken: tokenReducer,
	},
});
