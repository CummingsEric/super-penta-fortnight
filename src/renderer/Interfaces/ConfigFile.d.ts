import EventData from './EventData';
import Playlist from './Playlist';
import SpotifyAuth from './SpotifyAuth';

export default interface ConfigFile {
	spotifyAuth: SpotifyAuth;
	eventData: EventData;
	library: Playlist[];
}
