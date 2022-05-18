import SpotifyTracksData from './SpotifyTracksData';

export interface PlaylistSongs {
	[x: string]: SpotifyTracksData;
}

export default interface Playlist {
	name: string;
	id: string;
	songs: PlaylistSongs;
}
