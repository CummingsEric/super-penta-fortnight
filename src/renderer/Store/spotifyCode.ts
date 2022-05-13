import { createSlice } from '@reduxjs/toolkit';

export const codeSlice = createSlice({
	name: 'code',
	initialState: {
		value: null,
	},
	reducers: {
		setSpotifyCode: (state, action) => {
			state.value = action.payload;
		},
		clearSpotifyCode: (state) => {
			state.value = null;
		},
	},
});

export const { setSpotifyCode, clearSpotifyCode } = codeSlice.actions;

export default codeSlice.reducer;
