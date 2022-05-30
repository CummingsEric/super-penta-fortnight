import { createSlice } from '@reduxjs/toolkit';
import ErrorMessage from 'renderer/Interfaces/ErrorMessage';

export interface ErrorMessageInit {
	value: ErrorMessage[];
}

const initialState: ErrorMessageInit = {
	value: [
		{ errorType: 'device', priority: 1, text: 'error text 1' },
		{ errorType: 'device', priority: 1, text: 'error text 2' },
	],
};

export const errorMessages = createSlice({
	name: 'errorMessages',
	initialState,
	reducers: {
		setErrorMessages: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setErrorMessages } = errorMessages.actions;

export default errorMessages.reducer;
