import { createSlice, current } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import Playlist from 'renderer/Interfaces/Playlist';

export interface PData {
	value: Playlist[];
}

const initialState: PData = {
	value: [],
};

// Random id generator
const characters =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charLen = characters.length;
const randId = (): string => {
	let result = '';
	for (let i = 0; i < 10; i += 1) {
		result += characters.charAt(Math.floor(Math.random() * charLen));
	}
	return result;
};

const findPlaylistInd = (playlistId: string, playlists: Playlist[]): number => {
	if (playlists === null || playlists === undefined) return -1;
	const ind = playlists.findIndex((e) => e.id === playlistId);
	if (ind === undefined) return -1;
	return ind;
};

const updateConf = (state: WritableDraft<PData>) => {
	const newLibrary = current(state.value);
	window.electron.ipcRenderer.sendMessage('save-library', newLibrary);
};

export const library = createSlice({
	name: 'library',
	initialState,
	reducers: {
		setLibrary: (state, action) => {
			state.value = action.payload;
		},
		newPlaylist: (state, action) => {
			if (state === undefined || state.value === undefined) return;

			// Prevent duplicate playlists
			const playlists: Playlist[] = state.value;
			const playListName: string = action.payload.name;

			const ind = playlists.findIndex((e) => e.name === playListName);
			if (ind !== -1) return;

			const playlist: Playlist = {
				name: playListName,
				id: randId(),
				songs: {},
			};

			state.value.push(playlist);
			updateConf(state);
		},
		addSong: (state, action) => {
			if (state === undefined || state.value === undefined) return;
			const { playlistId } = action.payload;
			const playlists: Playlist[] = state.value;
			const { song } = action.payload;
			const songId: string = song.id;

			// Can't add a song to a playlist that doesn't exist
			const ind = findPlaylistInd(playlistId, playlists);
			if (ind === -1) return;

			state.value[ind].songs[songId] = song;
			updateConf(state);
		},
		removeSong: (state, action) => {
			if (state === undefined || state.value === undefined) return;
			const { playlistId } = action.payload;
			const playlists: Playlist[] = state.value;
			const { songId } = action.payload;

			// Playlist doesn't exist or duplicate songs
			const ind = findPlaylistInd(playlistId, playlists);
			if (ind === -1 || !(songId in playlists[ind].songs)) return;

			delete state.value[ind].songs[songId];
			updateConf(state);
		},
		removePlaylist: (state, action) => {
			if (state === undefined || state.value === undefined) return;
			const { playlistId } = action.payload;
			const playlists: Playlist[] = state.value;

			// Can't remove a playlist that doesn't exist
			const ind = findPlaylistInd(playlistId, playlists);
			if (ind === -1) return;

			state.value.splice(ind, 1);
			updateConf(state);
		},
	},
});

export const { setLibrary, newPlaylist, addSong, removeSong, removePlaylist } =
	library.actions;

export default library.reducer;
