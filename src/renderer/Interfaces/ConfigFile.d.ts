import EventData from './EventData';
import Playlist from './Playlist';
import SpotifyAuth from './SpotifyAuth';
import Settings from './Settings';

export default interface ConfigFile {
	spotifyAuth: SpotifyAuth;
	settings: Settings;
	eventData: EventData;
	library: Playlist[];
}
