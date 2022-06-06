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

		// No playlist to play off of...
		if (playlistId === undefined) return;

		// Is there less than 20 seconds left on current song? If so, need to switch
		const needToSwitch = this.switchByTime < currTime + 20;

		// Trying to queue song from same playlist & don't need to switch = quit
		if (this.currPlaylist === playlistId && !needToSwitch) {
			return;
		}

		// Trying to queue off lower priority event & don't need to switch = quit
		if (event.priority < this.currPriority && !needToSwitch) {
			return;
		}

		// Get a random song from the playlist that isnt the same as currently playing song
		const song = this.getRandPlaylistSong(playlistId);
		if (song === null) return;
		let allSongs = [song];

		// Get 5 songs from the default playlist to add to context, don't let the music stop ;)
		const backups = this.getDefaultSongs();
		if (backups !== null) {
			allSongs = allSongs.concat(backups);
		}

		// Was song queued successfully?
		const res = await this.queueSong(allSongs);
		if (res) {
			// First song is playing
			this.songEvent = event.friendlyName;
			this.currPlaylist = playlistId;
			this.currPriority = event.priority;
			this.currSong = song.id;
			this.switchByTime = song.duration_ms / 1000 + currTime;
			this.songName = song.name;
		}
	};

	// Get all the songs on a playlist
	getPlaylistSongs = (playlistId: string): SpotifyTracksData[] | null => {
		const { library } = this.cs.config;
		if (library === undefined) return null;
		const playlist = library.find((e) => e.id === playlistId);
		if (playlist === undefined) return null;
		const songs = Object.values(playlist.songs);
		if (songs.length === 0) return null;
		return songs;
	};

	// Get a single song from a playlist that isn't the currently playing song
	getRandPlaylistSong = (playlistId: string): SpotifyTracksData | null => {
		const songs = this.getPlaylistSongs(playlistId);
		if (songs === null) return null;
		let song = songs[Math.floor(Math.random() * songs.length)];
		// Chose same song as current song, reroll
		if (song.id === this.currSong) {
			song = songs[Math.floor(Math.random() * songs.length)];
		}
		return song;
	};

	// Get 5 random songs from the default playlist
	getDefaultSongs = (): SpotifyTracksData[] | null => {
		const { eventData } = this.cs.config;
		if (!('defaultEvent' in eventData)) return null;
		const defaultPlaylist = eventData.defaultEvent?.playlistId;
		if (defaultPlaylist === undefined) return null;
		const songs = this.getPlaylistSongs(defaultPlaylist);
		if (songs === null || songs.length === 0) return null;
		const numSongs = Math.min(5, songs.length);
		const shuffled = songs.sort(() => 0.5 - Math.random());
		const selected = shuffled.slice(0, numSongs);
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
			offset: {
				position: 0,
			},
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
