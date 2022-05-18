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

const findPlaylistInd = (playlistId: string, playlists: Playlist[]): number => {
	if (playlists === null || playlists === undefined) return -1;
	const ind = playlists.findIndex((e) => e.id === playlistId);
	if (ind === undefined) return -1;
	return ind;
};

export const libraryData = createSlice({
	name: 'playlistData',
	initialState,
	reducers: {
		setLibrary: (state, action) => {
			state.value = action.payload;
		},
		newPlaylist: (state, action) => {
			if (state === undefined || state.value === undefined) return;
			const playListName: string = action.payload.name;
			const playlists: Playlist[] = state.value;
			const playlist: Playlist = {
				name: playListName,
				id: (playlists.length + 1).toString(),
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
	},
});

export const { setLibrary, newPlaylist, addSong, removeSong } =
	libraryData.actions;

export default libraryData.reducer;
