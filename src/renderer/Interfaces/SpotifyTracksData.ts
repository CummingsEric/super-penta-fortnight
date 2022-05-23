import SpotifyAlbumData from './SpotifyAlbumData';
import SpotifyArtistData from './SpotifyArtistData';

export default interface SpotifyTracksData {
	album: SpotifyAlbumData;
	artists: Array<SpotifyArtistData>;
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: { isrc: string };
	external_urls: { spotify: string };
	href: string;
	id: string;
	is_local: boolean;
	is_playable: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
	start_time?: number;
	end_by?: number;
}
