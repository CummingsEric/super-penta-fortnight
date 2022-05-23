import axios from 'axios';
import SpotifyAuth from 'renderer/Interfaces/SpotifyAuth';
import EventInterface from 'renderer/Interfaces/EventInterface';
import SpotifyTracksData from 'renderer/Interfaces/SpotifyTracksData';
import ConfigService from './configService';

export default class SpotifyService {
	cs: ConfigService;

	currSong?: string;

	currPlaylist?: string;

	currPriority: number = 0;

	switchByTime: number = 0;

	constructor(configService: ConfigService) {
		this.cs = configService;
	}

	getSpotifyAuth = (): SpotifyAuth => {
		return this.cs.getSpotifyAuth();
	};

	queueSongByEvent = (
		eventId: string,
		priority: number,
		currTime: number
	) => {
		const mapping = this.cs.getEventMapping();
		const playlistId = mapping[eventId as keyof EventInterface<string>];

		// No playlist to play off of...
		if (playlistId === undefined) return;

		// Is there less than 20 seconds left on current song? If so, need to switch
		const needToSwitch = this.switchByTime < currTime + 20;

		// Trying to queue song from same playlist & don't need to switch = quit
		if (this.currPlaylist === playlistId && !needToSwitch) {
			return;
		}

		// Trying to queue off lower priority event & don't need to switch = quit
		if (priority < this.currPriority && !needToSwitch) {
			return;
		}

		const res = this.queueSongFromPlaylist(playlistId, currTime);
		if (res) {
			this.currPlaylist = playlistId;
			this.currPriority = priority;
		}
	};

	getSongFromPlaylist = (playlistId: string): SpotifyTracksData | null => {
		const library = this.cs.getLibrary();
		const playlist = library.find((e) => e.id === playlistId);
		if (playlist === undefined) return null;

		// Pick a random song
		const playlistSongs = Object.values(playlist.songs);

		let song =
			playlistSongs[Math.floor(Math.random() * playlistSongs.length)];

		for (let i = 0; i < 2; i += 1) {
			// Randomly selected the same song... attempt to reroll twice
			if (song.id === this.currSong) {
				const randInd = Math.floor(
					Math.random() * playlistSongs.length
				);
				song = playlistSongs[randInd];
			} else {
				break;
			}
		}

		return song;
	};

	queueSongFromPlaylist = (playlistId: string, currTime: number): boolean => {
		// Not authenticated yet
		const spotifyAuth = this.cs.getSpotifyAuth();
		if (spotifyAuth.spotifyAccessToken === undefined) return false;

		// No matching playlist / songs on the playlist
		const song = this.getSongFromPlaylist(playlistId);
		if (song === null) return false;

		// Assume http success... TODO: fix
		const body = {
			uris: [song.uri],
			position_ms: 0,
		};
		const tokenUrl = 'https://api.spotify.com/v1/me/player/play';
		axios({
			url: tokenUrl,
			method: 'put',
			headers: {
				Authorization: `Bearer ${spotifyAuth.spotifyAccessToken.authToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: body,
		});
		this.currSong = song.id;
		this.switchByTime = song.duration_ms / 1000 + currTime;
		return true;
	};
}
