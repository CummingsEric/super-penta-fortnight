import SpotifyArtistData from './SpotifyArtistData';

export default interface SpotifyAlbumData {
	album_type: string;
	artists: Array<SpotifyArtistData>;
	external_urls: { spotify: string };
	href: string;
	id: string;
	images: Array<{ height: number; url: string; width: number }>;
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
}
