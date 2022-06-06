import axios from 'axios';
import SpotifyTracksData from 'renderer/Interfaces/SpotifyTracksData';
import { EventProps } from 'renderer/Interfaces/EventData';
import ConfigService from './configService';

export default class SpotifyService {
	cs: ConfigService;

	currSong?: string;

	currPlaylist?: string;

	currPriority: number = 0;

	switchByTime: number = 0;

	songEvent: string = '';

	songName: string = '';

	constructor(configService: ConfigService) {
		this.cs = configService;
	}

	resetGlobals = () => {
		this.currSong = undefined;
		this.currPlaylist = undefined;
		this.currPriority = 0;
		this.switchByTime = 0;
		this.songEvent = '';
		this.songName = '';
	};

	queueSongByEvent = async (event: EventProps, currTime: number) => {
		const { playlistId } = event;
		console.log(event);

		// No playlist to play off of...
		if (playlistId === undefined) return;

		// Is there less than 20 seconds left on current song? If so, need to switch
		const needToSwitch = this.switchByTime < currTime + 20;

		// Trying to queue song from same playlist & don't need to switch = quit
		if (this.currPlaylist === playlistId && !needToSwitch) {
			return;
		}
		console.log(this.currPlaylist);

		// Trying to queue off lower priority event & don't need to switch = quit
		if (event.priority < this.currPriority && !needToSwitch) {
			return;
		}

		// Get 1-5 random songs. First will be played, others will be added to context
		// so music is always playing even if app bugs out
		const songs = this.getRandomSongs(playlistId);
		console.log(songs);
		if (songs === null || songs.length === 0) return;

		// Was song queued successfully?
		const res = await this.queueSong(songs);
		if (res) {
			// First song is playing
			const song = songs[0];
			this.songEvent = event.friendlyName;
			this.currPlaylist = playlistId;
			this.currPriority = event.priority;
			this.currSong = song.id;
			this.switchByTime = song.duration_ms / 1000 + currTime;
			this.songName = song.name;
		}
	};

	getPlaylistSongs = (playlistId: string): SpotifyTracksData[] | null => {
		const { library } = this.cs.config;
		if (library === undefined) return null;
		const playlist = library.find((e) => e.id === playlistId);
		if (playlist === undefined) return null;
		const songs = Object.values(playlist.songs);
		if (songs.length === 0) return null;
		return songs;
	};

	getRandomSongs = (playlistId: string): SpotifyTracksData[] | null => {
		const playlistSongs = this.getPlaylistSongs(playlistId);
		if (playlistSongs === null) return null;

		const numSongs = Math.min(5, playlistSongs.length);

		// Shuffle songs and return at most 5
		const shuffled = playlistSongs.sort(() => 0.5 - Math.random());
		let selected = shuffled.slice(0, numSongs);

		// If the first song is the same as current song reshuffle the 5 songs
		const firstSong = selected[0];
		if (firstSong.id === this.currSong) {
			selected = selected.sort(() => 0.5 - Math.random());
		}

		return selected;
	};

	// Queue the first song in an array (have 4 additional as backups)
	queueSong = async (songs: SpotifyTracksData[]): Promise<boolean> => {
		// Not authenticated yet
		const { spotifyAuth } = this.cs.config;
		if (
			spotifyAuth === undefined ||
			spotifyAuth.spotifyAccessToken === undefined
		)
			return false;

		const firstSong = songs[0];
		const songUris = songs.map((e) => e.uri);
		const startTime =
			firstSong.start_time !== undefined ? firstSong.start_time : 0;
		const body = {
			uris: songUris,
			position_ms: startTime,
		};
		let tokenUrl = 'https://api.spotify.com/v1/me/player/play';
		const settings = this.cs.getSettings();
		if (
			settings.spotifyDevice !== undefined &&
			settings.spotifyDevice.id !== undefined
		) {
			tokenUrl = `${tokenUrl}?device_id=${settings.spotifyDevice.id}`;
		}
		try {
			const res = await axios({
				url: tokenUrl,
				method: 'put',
				headers: {
					Authorization: `Bearer ${spotifyAuth.spotifyAccessToken.authToken}`,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				data: body,
			});
			if (res.status === 200) return true;
		} catch (err) {
			return false;
		}
		return true;
	};
}
