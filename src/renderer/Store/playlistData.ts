import { createSlice } from '@reduxjs/toolkit';
import Playlist from 'renderer/Interfaces/Playlist';
import SpotifyTracksData from 'renderer/Interfaces/SpotifyTracksData';

import test from './test.json';

const tempSong: SpotifyTracksData = test;

export interface PData {
	value: Playlist[];
}

const initialState: PData = {
	value: [],
};

// TODO: change this
const randId = (): string => {
	let result = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < 10; i += 1) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
};

const findPlaylistInd = (playlistId: string, playlists: Playlist[]): number => {
	if (playlists === null || playlists === undefined) return -1;
	const ind = playlists.findIndex((e) => e.id === playlistId);
	if (ind === undefined) return -1;
	return ind;
};

export const library = createSlice({
	name: 'library',
	initialState,
	reducers: {
		setLibrary: (state, action) => {
			state.value = action.payload;
		},
		// TODO: validate new playlist IDs and names
		newPlaylist: (state, action) => {
			if (state === undefined || state.value === undefined) return;
			const playListName: string = action.payload.name;
			const playlist: Playlist = {
				name: playListName,
				id: randId(),
				songs: { '6naxalmIoLFWR0siv8dnQQ': tempSong },
			};
			state.value.push(playlist);
		},
		addSong: (state, action) => {
			if (state === undefined || state.value === undefined) return;
			const playlistId: string = action.payload.id;
			const playlists: Playlist[] = state.value;
			const songId: string = action.payload.id;
			const { song } = action.payload;
			const ind = findPlaylistInd(playlistId, playlists);
			if (ind === -1) return;
			state.value[ind].songs[songId] = song;
		},
		removeSong: (state, action) => {
			if (state === undefined || state.value === undefined) return;
			const { playlistId } = action.payload;
			const playlists: Playlist[] = state.value;
			const { songId } = action.payload;
			const ind = findPlaylistInd(playlistId, playlists);
			if (ind === -1) return;
			if (songId in playlists[ind].songs) {
				delete state.value[ind].songs[songId];
			}
		},
		removePlaylist: (state, action) => {
			if (state === undefined || state.value === undefined) return;
			const { playlistId } = action.payload;
			const playlists: Playlist[] = state.value;
			const ind = findPlaylistInd(playlistId, playlists);
			if (ind === -1) return;
			state.value.splice(ind, 1);
		},
	},
});

export const { setLibrary, newPlaylist, addSong, removeSong, removePlaylist } =
	library.actions;

export default library.reducer;
